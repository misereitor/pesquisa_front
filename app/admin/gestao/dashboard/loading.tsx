export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 md:p-6 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Dashboard Summary - Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-700"
            ></div>
          ))}
        </div>

        {/* Mid Row - Chart Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col"
            >
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance & Timeline Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="h-[400px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>
            <div className="flex-1 flex items-end gap-2 px-4">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="h-[400px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Geo Distribution Skeleton */}
        <div className="h-[400px] w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col mb-6">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>
          <div className="flex-1 flex items-end gap-2 px-4">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse"
                style={{ height: `${Math.random() * 90 + 10}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-[300px] bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col items-center justify-center"
            >
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
              <div className="w-40 h-40 rounded-full border-8 border-gray-200 dark:border-gray-700 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
