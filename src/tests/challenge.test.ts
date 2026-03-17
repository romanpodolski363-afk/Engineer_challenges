import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Fresh in-memory PGlite seeded from the candidate's seed.sql
// ---------------------------------------------------------------------------
let db: PGlite;

beforeAll(async () => {
  db = new PGlite(); // in-memory
  const seedPath = path.join(process.cwd(), 'db', 'seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');
  await db.exec(seedSql);
});

afterAll(async () => {
  await db.close();
});

const ALICE = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const ANTHROPIC = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

// ===========================================================================
// Task 1 — Schema Design
// ===========================================================================
describe('Task 1: Schema Design', () => {
  test('deployments table exists', async () => {
    const { rows } = await db.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'deployments'
       ) AS exists`,
    );
    expect(rows[0].exists).toBe(true);
  });

  test('deployments has correct columns', async () => {
    const { rows } = await db.query<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'deployments' ORDER BY ordinal_position`,
    );
    const columns = rows.map((r) => r.column_name);
    expect(columns).toContain('id');
    expect(columns).toContain('model_id');
    expect(columns).toContain('environment');
    expect(columns).toContain('deployed_by');
    expect(columns).toContain('deployed_at');
    expect(columns).toContain('status');
    expect(columns).toContain('notes');
    expect(columns).toContain('created_at');
  });

  test('deployments.model_id has FK to models with ON DELETE CASCADE', async () => {
    const { rows } = await db.query<{ delete_rule: string }>(
      `SELECT rc.delete_rule
       FROM information_schema.referential_constraints rc
       JOIN information_schema.key_column_usage kcu
         ON rc.constraint_name = kcu.constraint_name
       WHERE kcu.table_name = 'deployments' AND kcu.column_name = 'model_id'`,
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].delete_rule).toBe('CASCADE');
  });

  test('deployments has unique constraint on (model_id, environment)', async () => {
    const { rows } = await db.query<{ count: string }>(
      `SELECT COUNT(*) AS count
       FROM information_schema.table_constraints tc
       JOIN information_schema.constraint_column_usage ccu
         ON tc.constraint_name = ccu.constraint_name
       WHERE tc.table_name = 'deployments'
         AND tc.constraint_type = 'UNIQUE'`,
    );
    expect(Number(rows[0].count)).toBeGreaterThan(0);
  });

  test('deployments has index on model_id', async () => {
    const { rows } = await db.query<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes
       WHERE tablename = 'deployments' AND indexdef LIKE '%model_id%'`,
    );
    expect(rows.length).toBeGreaterThan(0);
  });

  test('deployments has created_at with default', async () => {
    const { rows } = await db.query<{ column_default: string | null }>(
      `SELECT column_default FROM information_schema.columns
       WHERE table_name = 'deployments' AND column_name = 'created_at'`,
    );
    expect(rows[0].column_default).toBeTruthy();
  });

  test('models table has at least 3 rows (candidate-added models)', async () => {
    const { rows } = await db.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM models',
    );
    expect(Number(rows[0].count)).toBeGreaterThanOrEqual(3);
  });
});

// ===========================================================================
// Task 2 — Data Query
// ===========================================================================
describe('Task 2: Data Query', () => {
  beforeAll(async () => {
    // Insert a test model so the dashboard query has data to return
    await db.query(
      `INSERT INTO models (id, name, model_id, provider_id, context_window, status, added_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [
        '11111111-1111-1111-1111-111111111111',
        'Test Model',
        'test-model-v1',
        ANTHROPIC,
        200000,
        'evaluating',
        ALICE,
      ],
    );
  });

  test('dashboard page source uses parameterised query', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'dashboard', 'page.tsx'),
      'utf-8',
    );

    // Must contain $1 placeholder
    expect(source).toMatch(/\$1/);

    // Must NOT contain string interpolation in a SQL query context
    const sqlInterpolation = /query[^)]*`[^`]*\$\{/;
    expect(source).not.toMatch(sqlInterpolation);
  });

  test('dashboard page source uses JOIN', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'dashboard', 'page.tsx'),
      'utf-8',
    );
    expect(source.toUpperCase()).toMatch(/JOIN\s+providers/i);
  });

  test('dashboard page source selects provider_name alias', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'dashboard', 'page.tsx'),
      'utf-8',
    );
    expect(source).toMatch(/provider_name/);
  });

  test('dashboard page replaces empty array with query call', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'dashboard', 'page.tsx'),
      'utf-8',
    );
    // The TODO placeholder should be gone
    expect(source).not.toMatch(/const models:\s*ModelWithProvider\[\]\s*=\s*\[\]/);
  });
});

// ===========================================================================
// Task 3 — Server Action
// ===========================================================================
describe('Task 3: Server Action', () => {
  test('action source uses safeParse (not parse)', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'actions', 'models.ts'),
      'utf-8',
    );
    expect(source).toMatch(/safeParse/);
    // Should not use bare .parse() for validation (would throw instead of return)
    const bareParsePattern = /addModelSchema\.parse\(/;
    expect(source).not.toMatch(bareParsePattern);
  });

  test('action source uses parameterised INSERT with RETURNING', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'actions', 'models.ts'),
      'utf-8',
    );
    expect(source.toUpperCase()).toMatch(/INSERT\s+INTO\s+MODELS/);
    expect(source).toMatch(/\$1/);
    expect(source.toUpperCase()).toMatch(/RETURNING/);
  });

  test('action source calls revalidatePath (not just imports it)', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'actions', 'models.ts'),
      'utf-8',
    );
    // Must actually invoke revalidatePath(), not just import it
    expect(source).toMatch(/revalidatePath\s*\(/);
    // Should be called with the dashboard path
    expect(source).toMatch(/revalidatePath\s*\(\s*['"`]/);
  });

  test('action source returns error objects for at least 2 failure cases', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'actions', 'models.ts'),
      'utf-8',
    );
    // Strip comments and the "Not implemented" stub — only count real return statements
    const codeOnly = source
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('//'))
      .join('\n')
      .replace(/return \{ error: ['"]Not implemented['"] \}/, '');
    const errorReturns = codeOnly.match(/return\s*\{\s*error/g);
    expect(errorReturns?.length).toBeGreaterThanOrEqual(2);
  });

  test('action source is implemented (not just returning "Not implemented")', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'actions', 'models.ts'),
      'utf-8',
    );
    expect(source).not.toMatch(/return \{ error: 'Not implemented' \}/);
  });
});

// ===========================================================================
// Task 4 — Security Bug Fix
// ===========================================================================
describe('Task 4: Security Fix', () => {
  test('no string interpolation in SQL queries', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'api', 'models', '[id]', 'route.ts'),
      'utf-8',
    );
    // Must not have ${...} inside a query template literal
    const templateInterpolation = /query\s*\(\s*`[^`]*\$\{/;
    expect(source).not.toMatch(templateInterpolation);
    // Must not use string concatenation in SQL
    const stringConcat = /query\s*\([^)]*\+/;
    expect(source).not.toMatch(stringConcat);
  });

  test('uses parameterised query with $1, $2', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'api', 'models', '[id]', 'route.ts'),
      'utf-8',
    );
    expect(source).toMatch(/\$1/);
    expect(source).toMatch(/\$2/);
  });

  test('DELETE query includes RETURNING clause', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'api', 'models', '[id]', 'route.ts'),
      'utf-8',
    );
    expect(source.toUpperCase()).toMatch(/DELETE[\s\S]*RETURNING/);
  });
});
