import { query } from '@/lib/db';
import { UserPicker } from '@/components/user-picker';
import type { User } from '@/lib/types';

export default async function HomePage() {
  const users = await query<User>('SELECT id, email, name FROM users ORDER BY name');

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            AI Model Registry
          </h1>
          <p className="text-sm text-muted">
            Select a user to continue
          </p>
        </div>
        <UserPicker users={users} />
      </div>
    </main>
  );
}
