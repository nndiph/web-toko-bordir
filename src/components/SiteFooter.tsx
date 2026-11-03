import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { STORE, storeWaLink } from "@/lib/store-info";

export function SiteFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-border mt-16 text-sm text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 sm:grid-cols-3">
        <div className="space-y-1">
          <span className="font-extrabold text-slate-ink text-base tracking-tight block">
            {STORE.name.toUpperCase()}
          </span>
          <p className="text-xs text-slate-muted">
            Transaksi dan pengambilan barang langsung di toko fisik. Web ini untuk cek stok, pesan bordir, dan lacak
            tiket.
          </p>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
            <span>{STORE.address}</span>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{STORE.hours}</span>
          </li>
          <li>
            <a
              href={storeWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-brand hover:underline"
            >
              <Phone className="w-4 h-4" />
              <span>Chat WhatsApp Kasir</span>
            </a>
          </li>
        </ul>

        <div className="sm:text-right space-y-2 text-xs text-slate-muted">
          <p>© 2026 Toko Gaperta · Perlengkapan Dinas &amp; Bordir Komputer</p>
          <Link href="/admin" className="inline-block font-semibold text-slate-500 hover:text-brand underline">
            Masuk Kasir / Pemilik
          </Link>
        </div>
      </div>
    </footer>
  );
}
