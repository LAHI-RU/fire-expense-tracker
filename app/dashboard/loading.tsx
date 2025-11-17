export default function Loading() {
  return (
    <div className="container p-responsive space-y-8 animate-pulse">
      {/* Welcome Section Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        {/* Text Section */}
        <div className="flex-1 w-full">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Avatar */}
        <div className="h-14 w-14 md:h-16 md:w-16 bg-gray-200 rounded-full self-start md:self-center"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Stats (3 Grid Cards) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 sm:p-6 h-full flex flex-col justify-between"
            >
              <div className="h-7 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Right Side Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 h-full">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 mb-4"></div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 sm:h-12 bg-gray-200 rounded w-full"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-40 mb-4"></div>
            <div className="h-48 sm:h-64 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
