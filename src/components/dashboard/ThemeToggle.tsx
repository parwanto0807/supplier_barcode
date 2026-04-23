"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Wait until mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105 active:scale-95 group"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <div className={`absolute inset-0 transition-transform duration-500 ${theme === 'dark' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <Sun className="w-5 h-5" />
        </div>
        <div className={`absolute inset-0 transition-transform duration-500 ${theme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <Moon className="w-5 h-5" />
        </div>
      </div>
    </button>
  )
}
