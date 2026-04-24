export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse font-inter p-4">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-72 bg-slate-100 dark:bg-slate-900 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-8 py-5">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <tr key={row}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                      <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-6 w-20 bg-slate-50 dark:bg-slate-800 rounded-lg"></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                      <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
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
