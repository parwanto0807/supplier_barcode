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
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl text-white shadow-lg transition-all ${
            status === "connected" ? "bg-emerald-500 shadow-emerald-200" : 
            status === "error" ? "bg-red-500 shadow-red-200" : "bg-indigo-600 shadow-indigo-200"
          }`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">External Database MySQL</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                status === "connected" ? "bg-emerald-500" : 
                status === "error" ? "bg-red-500" : "bg-slate-300"
              }`} />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Live Status: {status}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {status === "connected" ? (
            <button 
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all text-sm border border-red-100"
            >
              <PowerOff className="w-4 h-4" />
              Disconnect
            </button>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={status === "connecting"}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {status === "connecting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
              Connect Now
            </button>
          )}
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Host / IP</label>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-mono text-sm border border-slate-100">
                {config.host || "Not Configured"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Name</label>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-mono text-sm border border-slate-100">
                {config.db || "Not Configured"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-mono text-sm border border-slate-100">
                {config.user || "Not Configured"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-mono text-sm border border-slate-100">
                {config.hasPassword ? "••••••••••••" : "Missing"}
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
          status === "connected" ? "bg-emerald-50 border-emerald-100" :
          status === "error" ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              {status === "connected" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {status === "error" && <XCircle className="w-5 h-5 text-red-600" />}
              {status === "idle" && <AlertCircle className="w-5 h-5 text-slate-400" />}
              <h3 className={`font-bold ${
                status === "connected" ? "text-emerald-900" :
                status === "error" ? "text-red-900" : "text-slate-900"
              }`}>
                {status === "connected" ? "System Ready" : 
                 status === "error" ? "Connection Failed" : "Standby"}
              </h3>
            </div>
            <p className={`text-xs leading-relaxed ${
                status === "connected" ? "text-emerald-700" :
                status === "error" ? "text-red-700" : "text-slate-500"
              }`}>
              {message || "Silakan klik 'Connect Now' untuk memverifikasi koneksi ke database tabel_barang Anda."}
            </p>
          </div>
          
          <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between">
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Logs</span>
            <span className="text-[10px] font-mono opacity-60">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
