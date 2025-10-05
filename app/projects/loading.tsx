export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-t-primary border-gray-200 animate-spin" />
        <div className="text-sm text-muted-foreground">Loading projects...</div>
      </div>
    </div>
  );
}
