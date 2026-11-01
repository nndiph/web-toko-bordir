import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white border border-surface-border rounded-3xl p-8 sm:p-12 shadow-card max-w-md w-full space-y-5">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight pt-1">Halaman Tidak Ditemukan</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Halaman yang Anda tuju mungkin sudah dipindahkan atau alamat URL yang dimasukkan salah.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-army hover:bg-army-dark active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-army/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Toko</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
