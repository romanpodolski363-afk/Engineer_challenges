'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { User } from '@/lib/types';

export function UserPicker({ users }: { users: User[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!selected) return;
    setIsLoading(true);

    // Set the user cookie via a lightweight API route
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selected }),
    });

    router.push('/dashboard');
  }

  return (
    <div className="space-y-4">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <option value="">Choose a user…</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <button
        onClick={handleLogin}
        disabled={!selected || isLoading}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Signing in…' : 'Continue'}
      </button>
    </div>
  );
}
