'use client';

import { useRef, useState } from 'react';
import { addModel } from '@/actions/models';
import type { Provider } from '@/lib/types';

export function ModelForm({ providers }: { providers: Provider[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setFeedback(null);

    const result = await addModel(formData);

    setIsSubmitting(false);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
    } else {
      setFeedback({ type: 'success', message: 'Model added successfully.' });
      formRef.current?.reset();
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        + Add model
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-4 rounded-lg border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Add a new model</h3>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setFeedback(null);
          }}
          className="text-sm text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Display name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Claude Sonnet 4.6"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="model_id" className="text-sm font-medium">
            API model ID
          </label>
          <input
            id="model_id"
            name="model_id"
            type="text"
            required
            placeholder="e.g. claude-sonnet-4-6"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="provider_id" className="text-sm font-medium">
            Provider
          </label>
          <select
            id="provider_id"
            name="provider_id"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select a provider</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="context_window" className="text-sm font-medium">
            Context window
          </label>
          <input
            id="context_window"
            name="context_window"
            type="number"
            placeholder="e.g. 200000"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm tabular-nums placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="evaluating">Evaluating</option>
            <option value="approved">Approved</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Any relevant notes about this model…"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {feedback && (
        <p
          className={`text-sm ${
            feedback.type === 'error' ? 'text-danger' : 'text-success'
          }`}
        >
          {feedback.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding…' : 'Add model'}
      </button>
    </form>
  );
}
