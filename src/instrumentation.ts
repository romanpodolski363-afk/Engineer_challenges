export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initDatabase } = await import('@/lib/db');
    try {
      await initDatabase();
    } catch (err) {
      console.error( // intentional: surface seed errors clearly
        'Failed to initialise database. If you modified seed.sql, run: npm run seed:reset\n',
        err,
      );
    }
  }
}
