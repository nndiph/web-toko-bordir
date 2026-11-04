"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Shield, MapPin, Clock } from "lucide-react";
import { STORE, storeWaLink } from "@/lib/store-info";

const NAV_LINKS = [
  { href: "/", label: "Katalog Stok" },
  { href: "/pesan", label: "Pesan Bordir" },
  { href: "/tracking", label: "Lacak Pesanan" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* ── Top Announcement Bar (Clean Retail) ── */}
      <div className="w-full bg-slate-900 text-slate-300 px-4 sm:px-6 lg:px-8 py-2 text-xs font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4 min-w-0">
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{STORE.address}</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Buka {STORE.hours}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-emerald-400 font-semibold">
            ✓ Stok Rak Sinkron
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium">
            Bordir 1–2 hari kerja
          </span>
        </div>
      </div>

      {/* ── Main Navbar (Clean White Retail ala Tokopedia / Uniqlo) ── */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 min-w-0 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-900 transition-colors">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 leading-none block">
                  GAPERTA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  TNI & DINAS
                </span>
              </div>
              <span className="hidden sm:block text-xs text-slate-500 font-medium mt-0.5 truncate">
                Perlengkapan Dinas & Bordir Komputer Resmi Medan
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold" aria-label="Menu utama">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* WhatsApp Kasir CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <a
              href={storeWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-4 h-11 rounded-xl transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Kasir</span>
              <span className="sm:hidden">Kasir</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-md"
          aria-label="Menu utama"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center px-4 h-12 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
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
