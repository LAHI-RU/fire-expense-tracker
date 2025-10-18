export default function LoadingReports() {
  return (
    <div className="container p-responsive space-y-4">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded" />
      <div className="h-96 bg-muted rounded" />
    </div>
  );
}
