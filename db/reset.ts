/**
 * Reset the database: drop all tables and re-run seed.sql.
 *
 * Usage:
 *   npx tsx db/reset.ts
 *
 * Run this after modifying db/seed.sql to apply your changes.
 */
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data', 'challenge-db');

async function reset() {
  // Remove existing data directory so PGlite starts fresh
  fs.rmSync(DATA_DIR, { recursive: true, force: true });

  const db = new PGlite(DATA_DIR);
  const seedPath = path.join(process.cwd(), 'db', 'seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');

  await db.exec(seedSql);
  await db.close();

  console.log('Database reset and re-seeded successfully.'); // intentional: CLI script output
  process.exit(0);
}

reset().catch((err) => {
  console.error('Failed to reset database:', err);
  process.exit(1);
});
