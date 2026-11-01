import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-sm w-full space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-200 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Halaman Tidak Ditemukan</h1>
          <p className="text-xs text-gray-500 mt-1">
            Halaman yang Anda tuju mungkin sudah dipindahkan atau URL yang dimasukkan salah.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-army hover:bg-army-dark text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
