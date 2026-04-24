export default function Loading() {
  return (
    <div className="flex flex-col xl:flex-row gap-4 items-start animate-pulse font-inter max-w-[1400px] mx-auto p-4 w-full">
      {/* Form Section Skeleton */}
      <div className="flex-1 space-y-4 w-full">
        {/* Step 1 Skeleton */}
        <section className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-2 w-20 bg-slate-100 dark:bg-slate-900 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
            <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
          </div>
        </section>

        {/* Step 2 Skeleton */}
        <section className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-2 w-24 bg-slate-100 dark:bg-slate-900 rounded"></div>
            </div>
          </div>
          <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
        </section>

        {/* Step 3 Skeleton */}
        <section className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-2 w-28 bg-slate-100 dark:bg-slate-900 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
            <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
          </div>
          <div className="mt-6 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </section>
      </div>

      {/* Preview Section Skeleton */}
      <div className="w-full xl:w-[380px] sticky top-4 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="p-6 flex flex-col items-center space-y-6">
            <div className="w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800"></div>
            <div className="w-full space-y-3">
              <div className="h-14 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="h-32 bg-slate-200 dark:bg-indigo-900/20 rounded-2xl"></div>
      </div>
    </div>
  )
}
