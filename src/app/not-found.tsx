import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white border border-slate-border rounded-3xl p-8 sm:p-10 max-w-md w-full space-y-5 shadow-xs">
        <div className="w-16 h-16 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-accent-gold uppercase tracking-wider block">
            Error 404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-ink tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
            Halaman yang Anda tuju mungkin sudah dipindahkan atau URL yang dimasukkan salah.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-brand hover:bg-brand-hover active:scale-[0.98] text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Toko</span>
          </Link>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-6">
        Toko Gaperta Medan · Perlengkapan Dinas &amp; Bordir Komputer Resmi
      </p>
    </div>
  );
}
