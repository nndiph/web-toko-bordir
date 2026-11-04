import Link from "next/link";
import { Clock, MapPin, Phone, Shield } from "lucide-react";
import { STORE, storeWaLink } from "@/lib/store-info";

export function SiteFooter() {
  return (
    <footer className="w-full bg-dark-bg border-t border-dark-border mt-0 text-sm">
      {/* ── Konsultasi Banner ── */}
      <div className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-base">Ada pesanan khusus regu atau satuan?</p>
            <p className="text-dark-muted text-sm mt-0.5">
              Hubungi kasir via WhatsApp — kami bantu kalkulasi harga & jadwal bordir.
            </p>
          </div>
          <a
            href={storeWaLink("Halo, saya ingin tanya pesanan bordir satuan/regu.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-vibrant hover:bg-vibrant-hover text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-vibrant/20 shrink-0 whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            Hubungi Kasir
          </a>
        </div>
      </div>

      {/* ── Footer Columns ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-3">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-vibrant/10 border border-vibrant/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-vibrant" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              {STORE.name.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-dark-muted leading-relaxed">
            Transaksi dan pengambilan barang langsung di toko fisik. Web ini untuk cek stok, pesan
            bordir, dan lacak tiket.
          </p>
        </div>

        {/* Info Toko */}
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2 text-dark-muted">
            <MapPin className="w-4 h-4 text-vibrant shrink-0 mt-0.5" />
            <span>{STORE.address}</span>
          </li>
          <li className="flex items-start gap-2 text-dark-muted">
            <Clock className="w-4 h-4 text-dark-muted shrink-0 mt-0.5" />
            <span>{STORE.hours}</span>
          </li>
          <li>
            <a
              href={storeWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-vibrant hover:text-vibrant-hover transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Chat WhatsApp Kasir</span>
            </a>
          </li>
        </ul>

        {/* Akses & Copyright */}
        <div className="sm:text-right space-y-2 text-xs text-dark-muted">
          <p>© 2026 Toko Gaperta · Perlengkapan Dinas & Bordir Komputer</p>
          <Link
            href="/admin"
            className="inline-block font-semibold text-dark-muted hover:text-vibrant transition-colors underline underline-offset-2"
          >
            Masuk Kasir / Pemilik
          </Link>
        </div>
      </div>
    </footer>
  );
}
