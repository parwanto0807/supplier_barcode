import LoginForm from "@/components/auth/LoginForm"
import { ShieldCheck, BarChart3, Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 bg-[#0f172a] overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Branding & Features (Desktop Only) */}
        <div className="hidden lg:flex flex-col space-y-8 text-white">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trusted by 50+ Suppliers
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-[1.1]">
              Smart Barcode <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                Ecosystem.
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Manajemen pelabelan industri yang cerdas, cepat, dan terintegrasi secara real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <Zap className="w-6 h-6 text-indigo-400 mb-3" />
              <h3 className="font-bold text-sm">Instant Sync</h3>
              <p className="text-slate-400 text-xs mt-0.5">Terhubung langsung dengan database pusat MySQL.</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <BarChart3 className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="font-bold text-sm">Real-time History</h3>
              <p className="text-slate-400 text-xs mt-0.5">Pantau riwayat cetak dan produksi kapan saja.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-bold tracking-widest uppercase opacity-50 flex items-center gap-3">
        <div className="w-8 h-[1px] bg-slate-800" />
        Supplier Portal v2.0
        <div className="w-8 h-[1px] bg-slate-800" />
      </div>
    </main>
  )
}
