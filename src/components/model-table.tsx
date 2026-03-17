'use client';

import type { ModelWithProvider } from '@/lib/types';
import { StatusBadge } from '@/components/status-badge';

export function ModelTable({ models }: { models: ModelWithProvider[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-card">
          <tr>
            <th className="px-4 py-3 font-medium text-muted">Name</th>
            <th className="px-4 py-3 font-medium text-muted">Model ID</th>
            <th className="px-4 py-3 font-medium text-muted">Provider</th>
            <th className="px-4 py-3 font-medium text-muted">Context</th>
            <th className="px-4 py-3 font-medium text-muted">Status</th>
            <th className="px-4 py-3 font-medium text-muted">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {models.map((model) => (
            <tr key={model.id} className="hover:bg-card/50">
              <td className="px-4 py-3 font-medium">{model.name}</td>
              <td className="px-4 py-3">
                <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">
                  {model.model_id}
                </code>
              </td>
              <td className="px-4 py-3">{model.provider_name}</td>
              <td className="px-4 py-3 tabular-nums">
                {model.context_window
                  ? `${(model.context_window / 1000).toLocaleString()}k`
                  : '—'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={model.status} />
              </td>
              <td className="max-w-[200px] truncate px-4 py-3 text-muted">
                {model.notes ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
