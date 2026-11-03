"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Shield, MapPin, Clock } from "lucide-react";
import { STORE, storeWaLink } from "@/lib/store-info";

/** Menu khusus pembeli. Akses kasir ada di footer agar tidak membingungkan pembeli. */
const NAV_LINKS = [
  { href: "/", label: "Katalog Stok" },
  { href: "/pesan", label: "Pesan Bordir" },
  { href: "/tracking", label: "Lacak Pesanan" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* Info toko fisik */}
      <div className="w-full bg-brand text-slate-200 px-4 sm:px-6 lg:px-8 py-2 text-xs font-medium flex items-center gap-4">
        <span className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">{STORE.address}</span>
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Buka {STORE.hours}</span>
        </span>
      </div>

      <div className="w-full bg-white border-b border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-ink leading-none block">
                GAPERTA
              </span>
              <span className="hidden sm:block text-xs text-slate-muted font-medium mt-0.5 truncate">
                Perlengkapan Dinas &amp; Bordir Komputer Medan
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold" aria-label="Menu utama">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-4 py-2.5 rounded-xl transition-colors ${
                    isActive ? "bg-brand-light text-brand font-bold" : "text-slate-600 hover:text-slate-ink hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={storeWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-bold text-sm px-4 h-11 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Kasir</span>
              <span className="sm:hidden">WA</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center text-slate-700 border border-slate-border rounded-xl"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-slate-border px-4 py-3 space-y-1 shadow-lg" aria-label="Menu utama">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center px-4 h-12 rounded-xl text-base font-semibold ${
                  isActive ? "bg-brand-light text-brand font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
