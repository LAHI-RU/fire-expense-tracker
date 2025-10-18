export default function Loading() {
  return (
    <div className="container p-responsive space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 w-48 bg-gray-200 rounded"></div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>

      {/* Search and Filters Skeleton */}
      <div className="flex gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
      </div>

      {/* Payment Records Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b"
              >
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-28"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
