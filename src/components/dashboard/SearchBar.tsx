"use client"

import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (value: string) => {
    setQuery(value)
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }
      router.push(`/dashboard/history?${params.toString()}`)
    })
  }

  return (
    <div className="relative group max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Cari part, number, customer, lot..."
        className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
      />
      {query && (
        <button
          onClick={() => handleSearch("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {isPending && (
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-100 overflow-hidden rounded-full">
          <div className="w-full h-full bg-indigo-500 animate-progress duration-1000 ease-in-out" />
        </div>
      )}
    </div>
  )
}
