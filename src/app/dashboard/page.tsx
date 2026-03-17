import { getUserId } from '@/lib/auth';
import { query } from '@/lib/db';
import { ModelTable } from '@/components/model-table';
import { ModelForm } from '@/components/model-form';
import { EmptyState } from '@/components/empty-state';
import type { ModelWithProvider, Provider } from '@/lib/types';

export default async function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in your query implementation
  const userId = await getUserId();

  // ============================================================
  // CHALLENGE TASK 2: Fetch models with their provider info
  // ============================================================
  //
  // Write a SQL query that:
  //   1. Gets all models added by the current user (parameterised query)
  //   2. Includes the provider name and website for each model
  //   3. Sorts by status (evaluating first, then approved, then deprecated),
  //      then by created_at (newest first)
  //
  // Use the query() helper from '@/lib/db' — read that file for the pattern.
  // Use the ModelWithProvider type from '@/lib/types' for the generic.
  //
  // DO NOT use AI tools. Your screen recording will be reviewed.
  // ============================================================

  const models: ModelWithProvider[] = []; // TODO: Replace with your query

  const providers = await query<Provider>(
    'SELECT id, name, website FROM providers ORDER BY name',
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Models</h2>
        <p className="text-sm text-muted">
          AI models your team is evaluating or has approved for use.
        </p>
      </div>

      <ModelForm providers={providers} />

      {models.length === 0 ? (
        <EmptyState />
      ) : (
        <ModelTable models={models} />
      )}
    </div>
  );
}
