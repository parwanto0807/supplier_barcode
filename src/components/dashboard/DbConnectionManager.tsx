"use client"

import { useState, useEffect } from "react"
import { Database, Power, PowerOff, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { testMySqlConnection } from "@/lib/actions/db-test"

export default function DbConnectionManager({ config }: { config: any }) {
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleConnect = async () => {
    setStatus("connecting")
    const res = await testMySqlConnection()
    if (res.success) {
      setStatus("connected")
      setMessage(res.message)
    } else {
      setStatus("error")
      setMessage(res.message)
    }
  }

  const handleDisconnect = () => {
    setStatus("idle")
    setMessage("Connection closed manually.")
  }

  // Auto test on mount if config exists
  useEffect(() => {
    if (config.host && config.user) {
      handleConnect()
    }
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-white transition-all ${
            status === "connected" ? "bg-emerald-500" : 
            status === "error" ? "bg-red-500" : "bg-indigo-600"
          }`}>
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">External Database MySQL</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                status === "connected" ? "bg-emerald-500" : 
                status === "error" ? "bg-red-500" : "bg-slate-300"
              }`} />
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                {status}
              </p>
            </div>
          </div>
        </div>
        <div>
          {status === "connected" ? (
            <button onClick={handleDisconnect} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-all text-xs border border-red-100">
              <PowerOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Disconnect</span>
            </button>
          ) : (
            <button onClick={handleConnect} disabled={status === "connecting"} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all text-xs disabled:opacity-50">
              {status === "connecting" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Connect</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Host / IP</label>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-700 font-mono text-xs border border-slate-100 truncate">{config.host || "Not Configured"}</div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Database</label>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-700 font-mono text-xs border border-slate-100 truncate">{config.db || "Not Configured"}</div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Username</label>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-700 font-mono text-xs border border-slate-100 truncate">{config.user || "Not Configured"}</div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-700 font-mono text-xs border border-slate-100">{config.hasPassword ? "••••••••" : "Missing"}</div>
          </div>
        </div>

        <div className={`rounded-xl p-4 flex flex-col justify-between border transition-all ${
          status === "connected" ? "bg-emerald-50 border-emerald-100" :
          status === "error" ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {status === "connected" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {status === "error" && <XCircle className="w-4 h-4 text-red-600" />}
              {status === "idle" && <AlertCircle className="w-4 h-4 text-slate-400" />}
              <h3 className={`font-bold text-sm ${
                status === "connected" ? "text-emerald-900" :
                status === "error" ? "text-red-900" : "text-slate-900"
              }`}>
                {status === "connected" ? "System Ready" : status === "error" ? "Connection Failed" : "Standby"}
              </h3>
            </div>
            <p className={`text-xs leading-relaxed ${
              status === "connected" ? "text-emerald-700" :
              status === "error" ? "text-red-700" : "text-slate-500"
            }`}>
              {message || "Klik 'Connect' untuk memverifikasi koneksi ke database."}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between">
            <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Logs</span>
            <span className="text-[9px] font-mono opacity-60">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
