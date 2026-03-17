import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// PGlite singleton — uses dynamic import + globalThis to avoid two issues:
//   1. Next.js bundler transforms the WASM asset path at compile time
//   2. Hot-reload creates duplicate instances without globalThis caching
// ---------------------------------------------------------------------------

type PGliteInstance = {
  query: <T>(sql: string, params?: unknown[]) => Promise<{ rows: T[] }>;
  exec: (sql: string) => Promise<unknown>;
  close: () => Promise<void>;
};

const globalStore = globalThis as unknown as { pglite: PGliteInstance | undefined }; // globalThis has no PGlite type — standard Next.js singleton pattern

async function getDb(): Promise<PGliteInstance> {
  if (globalStore.pglite) return globalStore.pglite;

  const dataDir = path.join(process.cwd(), 'data', 'challenge-db');
  fs.mkdirSync(dataDir, { recursive: true });

  // Dynamic import keeps the WASM loader out of the module-level scope,
  // which prevents Next.js bundler path-rewriting issues.
  const { PGlite } = await import('@electric-sql/pglite');
  const instance = new PGlite(dataDir);

  globalStore.pglite = instance;

  return instance;
}

// ---------------------------------------------------------------------------
// query<T>() — thin wrapper that returns typed rows.
//
// Usage:
//   const users = await query<User>('SELECT * FROM users WHERE id = $1', [id]);
//
// Always use parameterised placeholders ($1, $2, …) — NEVER interpolate values
// into the SQL string.
// ---------------------------------------------------------------------------
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const db = await getDb();
  const result = await db.query<T>(sql, params);
  return result.rows;
}

// ---------------------------------------------------------------------------
// initDatabase() — idempotent seeder called from instrumentation.ts on server
// startup. Reads db/seed.sql and executes it only when the `users` table does
// not yet exist.
// ---------------------------------------------------------------------------
export async function initDatabase(): Promise<void> {
  const db = await getDb();

  const check = await db.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'users'
     ) AS exists`,
  );

  if (check.rows[0]?.exists) return; // already seeded

  const seedPath = path.join(process.cwd(), 'db', 'seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');
  await db.exec(seedSql);
}
