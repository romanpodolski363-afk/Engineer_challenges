export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      <p className="text-sm font-medium text-foreground">
        No models added yet
      </p>
      <p className="mt-1 text-sm text-muted">
        Use the form above to register your first AI model.
      </p>
    </div>
  );
}
