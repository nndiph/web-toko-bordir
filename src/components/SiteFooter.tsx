import Link from "next/link";
import { Clock, MapPin, Phone, Shield } from "lucide-react";
import { STORE, storeWaLink } from "@/lib/store-info";

export function SiteFooter() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300 text-sm">
      {/* ── Konsultasi Pesanan Regu ── */}
      <div className="bg-slate-800/80 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-base">Ada pesanan khusus regu, peleton, atau satuan?</p>
            <p className="text-slate-400 text-sm mt-0.5">
              Hubungi kasir langsung via WhatsApp — kami bantu hitung estimasi harga dan jadwal mesin bordir.
            </p>
          </div>
          <a
            href={storeWaLink("Halo Toko Gaperta, saya ingin konsultasi pesanan bordir custom untuk regu/satuan.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm shrink-0 whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            Chat WhatsApp Kasir
          </a>
        </div>
      </div>

      {/* ── Footer Columns ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-3">
        {/* Brand info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              {STORE.name.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pusat perlengkapan dinas militer TNI, seragam PDL/PDH, atribut logam, dan bordir komputer digital presisi Medan. Transaksi & pengambilan langsung di toko fisik.
          </p>
        </div>

        {/* Alamat & Jam Toko */}
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{STORE.address}</span>
          </li>
          <li className="flex items-start gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{STORE.hours}</span>
          </li>
          <li>
            <a
              href={storeWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Kasir: 0812-3456-7890</span>
            </a>
          </li>
        </ul>

        {/* Akses Kasir & Copyright */}
        <div className="sm:text-right space-y-2 text-xs text-slate-400">
          <p>© 2026 Toko Gaperta · Perlengkapan Dinas & Bordir Komputer</p>
          <p className="text-slate-500">Standar Mabes TNI · Antrean Digital</p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-block font-semibold text-slate-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Portal Kasir / Pemilik Toko →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
