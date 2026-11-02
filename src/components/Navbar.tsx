"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Shield, MapPin, Clock } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Katalog Stok" },
    { href: "/pesan", label: "Pesan Custom Bordir" },
    { href: "/tracking", label: "Lacak Pesanan" },
    { href: "/admin", label: "Dashboard Pemilik" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT BAR (Identitas Militer Solid) */}
      <div className="w-full bg-brand text-white px-4 sm:px-6 lg:px-8 py-2 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent-gold" />
            <span>Toko Fisik: Jl. Gaperta No. 12, Medan Helvetia</span>
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Buka: Senin – Sabtu 08:00 – 20:00 WIB</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-emerald-300 font-semibold text-[11px] sm:text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>STOK RAK FISIK SINKRON</span>
        </div>
      </div>

      {/* 2. MAIN HEADER (Clean White ala Tokopedia / Uniqlo) */}
      <div className="w-full bg-white border-b border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-brand-hover transition-colors">
              <Shield className="w-5 h-5 text-accent-gold" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-slate-ink leading-none">
                  GAPERTA
                </span>
                <span className="bg-amber-100 text-accent-gold text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                  TNI &amp; Dinas
                </span>
              </div>
              <span className="text-[11px] text-slate-muted font-medium mt-0.5">
                Perlengkapan Dinas &amp; Bordir Komputer Medan
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 transition-colors relative ${
                    isActive
                      ? "text-brand font-bold"
                      : link.href === "/admin"
                      ? "text-amber-800 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
                      : "text-slate-600 hover:text-slate-ink"
                  }`}
                >
                  {link.label}
                  {isActive && link.href !== "/admin" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* WhatsApp CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Hubungi WhatsApp</span>
              <span className="sm:hidden">WA Kasir</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-ink border border-slate-border rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-border px-4 py-4 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-100 text-brand font-bold"
                    : link.href === "/admin"
                    ? "text-amber-900 bg-amber-50 border border-amber-200"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
