export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse font-inter p-4">
      {/* Title Section Skeleton */}
      <div className="flex flex-col gap-1">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-900 rounded-md mt-2"></div>
      </div>

      {/* Filter Section Skeleton */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="h-10 w-72 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-8 py-5">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                      <div className="h-8 w-28 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
