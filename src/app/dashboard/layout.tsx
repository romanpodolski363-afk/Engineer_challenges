import { getUserId } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import type { User } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getUserId();
  if (!userId) redirect('/');

  const users = await query<User>('SELECT id, name, email FROM users WHERE id = $1', [userId]);
  const user = users[0];
  if (!user) redirect('/');

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="mx-auto max-w-5xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
