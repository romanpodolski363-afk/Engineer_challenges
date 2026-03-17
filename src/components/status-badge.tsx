const styles: Record<string, string> = {
  evaluating:
    'bg-warning/10 text-warning border-warning/20',
  approved:
    'bg-success/10 text-success border-success/20',
  deprecated:
    'bg-danger/10 text-danger border-danger/20',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}
    >
      {status}
    </span>
  );
}
