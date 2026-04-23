"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Building2, UserCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react"

export default function LoginForm() {
  const [supplierCode, setSupplierCode] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [errors, setErrors] = useState<any>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setErrors({})

    // Basic Validation
    const newErrors: any = {}
    if (!email) newErrors.email = "Email tidak boleh kosong"
    if (!password) newErrors.password = "Password tidak boleh kosong"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        supplierCode,
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Kredensial tidak valid. Silakan periksa kembali data Anda.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Koneksi server gagal")
    } finally {
      setLoading(false)
    }
  }

  const [isSupportOpen, setIsSupportOpen] = useState(false)

  return (
    <div className="w-full max-w-md p-10 space-y-8 bg-white/10 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 rotate-3">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-white">Login Portal</h2>
        <p className="text-slate-400 font-medium">Masuk untuk mengelola label Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 text-sm font-bold text-red-100 bg-red-600/20 border border-red-600/30 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-2 group">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 ml-1 flex justify-between" htmlFor="supplierCode">
            Supplier Code
            <span className="text-[10px] lowercase font-normal opacity-60">(opsional untuk admin)</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <UserCircle2 className="w-5 h-5" />
            </div>
            <input
              id="supplierCode"
              type="text"
              value={supplierCode}
              onChange={(e) => setSupplierCode(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-white font-medium placeholder:text-slate-600"
              placeholder="Masukkan Kode Supplier"
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 ml-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-indigo-500/50'} rounded-2xl focus:outline-none focus:ring-2 transition-all text-white font-medium placeholder:text-slate-600`}
              placeholder="name@company.com"
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-400 font-bold ml-1 uppercase tracking-wider">{errors.email}</p>}
        </div>

        <div className="space-y-2 group">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 ml-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-indigo-500/50'} rounded-2xl focus:outline-none focus:ring-2 transition-all text-white font-medium placeholder:text-slate-600`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-[10px] text-red-400 font-bold ml-1 uppercase tracking-wider">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full group/btn relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] overflow-hidden"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Masuk Sekarang
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-slate-500 font-medium">
          Mengalami kendala? {" "}
          <button 
            onClick={() => setIsSupportOpen(true)}
            className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
          >
            Hubungi Support
          </button>
        </p>
      </div>

      {isSupportOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 w-full max-w-md rounded-[40px] border border-white/10 shadow-2xl p-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-indigo-500/20">
              <Building2 className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Butuh Bantuan?</h3>
            <div className="space-y-1 mb-8">
              <p className="text-slate-400 font-medium">Silakan hubungi tim kami di:</p>
              <p className="text-xl font-bold text-indigo-400">IT PT. Grafindo Mitrasemesta</p>
            </div>
            <button 
              onClick={() => setIsSupportOpen(false)}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
