import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-ink">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-ink-muted max-w-sm mt-2 mb-6">
        Halaman yang Anda tuju mungkin sudah dipindahkan atau URL yang dimasukkan salah.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-army hover:bg-army-dark text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}

