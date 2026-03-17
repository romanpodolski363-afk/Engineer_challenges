'use client';

import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

export function DashboardHeader({ user }: { user: User }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold tracking-tight">
            AI Model Registry
          </h1>
          <span className="text-xs text-muted">Internal Tool</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
