export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse font-inter p-4">
      {/* Header Section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="h-10 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-900 rounded-md"></div>
        </div>
        <div className="h-16 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-7 rounded-[32px] border border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6"></div>
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
            <div className="h-10 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50/30">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="p-8 space-y-7">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded ml-auto"></div>
                  <div className="h-3 w-20 bg-slate-50 dark:bg-slate-900 rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-[32px]"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-900 dark:bg-slate-800 rounded-[40px]"></div>
        </div>
      </div>
    </div>
  )
}
