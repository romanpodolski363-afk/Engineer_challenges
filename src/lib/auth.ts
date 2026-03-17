import { cookies } from 'next/headers';

/**
 * Read the current user's ID from the session cookie.
 * Returns `null` when no user is selected (not logged in).
 */
export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get('challenge-user-id')?.value ?? null;
}
