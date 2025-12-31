export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <span className="animate-spin text-4xl text-blue-700 mb-4">⏳</span>
      <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">
        Loading reports...
      </h2>
    </div>
  );
}
