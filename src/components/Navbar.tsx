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
      {/* ── Announcement Bar ── */}
      <div className="w-full bg-dark-bg text-dark-muted px-4 sm:px-6 lg:px-8 py-2 text-xs font-medium flex items-center gap-4 border-b border-dark-border">
        <span className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-vibrant shrink-0" />
          <span className="truncate">{STORE.address}</span>
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-dark-muted" />
          <span>Buka {STORE.hours}</span>
        </span>
        <span className="ml-auto hidden sm:inline text-vibrant font-semibold">
          ✦ Bordir selesai 1–2 hari kerja
        </span>
      </div>

      {/* ── Main Navbar ── */}
      <div className="w-full bg-dark-bg border-b border-dark-border shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-w-0 group">
            <div className="w-10 h-10 rounded-xl bg-vibrant/10 border border-vibrant/30 flex items-center justify-center shrink-0 group-hover:bg-vibrant/20 transition-colors">
              <Shield className="w-5 h-5 text-vibrant" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-none block">
                GAPERTA
              </span>
              <span className="hidden sm:block text-xs text-dark-muted font-medium mt-0.5 truncate">
                Perlengkapan Dinas & Bordir Komputer Medan
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
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
                      ? "bg-vibrant/15 text-vibrant border border-vibrant/30"
                      : "text-dark-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <a
              href={storeWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-vibrant hover:bg-vibrant-hover text-white font-bold text-sm px-4 h-11 rounded-xl transition-colors shadow-lg shadow-vibrant/20"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Kasir</span>
              <span className="sm:hidden">WA</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center text-dark-muted border border-dark-border rounded-xl hover:bg-white/5 transition-colors"
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
          className="md:hidden bg-dark-surface border-b border-dark-border px-4 py-3 space-y-1"
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
                    ? "bg-vibrant/15 text-vibrant"
                    : "text-dark-muted hover:text-white hover:bg-white/5"
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
