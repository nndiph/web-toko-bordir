"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Phone, LayoutDashboard, Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Katalog Stok" },
    { href: "/pesan", label: "Pesan Custom Bordir" },
    { href: "/tracking", label: "Lacak Status Pesanan" },
    { href: "/admin", label: "Dashboard Pemilik", icon: LayoutDashboard },
  ];

  return (
    <header className="bg-tactical-950/95 backdrop-blur-md border-b border-tactical-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-army to-tactical-850 border border-tactical-600/60 text-gold-light flex items-center justify-center shrink-0 shadow-lg shadow-black/40 group-hover:border-gold/50 transition-all">
            <Shield className="w-6 h-6 text-gold drop-shadow" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white uppercase font-sans">
                GAP<span className="text-gold">ERTA</span>
              </span>
              <span className="bg-tactical-800 text-gold-light text-[9px] font-bold px-1.5 py-0.5 rounded border border-tactical-700 tracking-widest">
                TNI
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-gray-400">
              Atribut Dinas & Bordir Komputer Medan
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-tactical-800 text-white border border-tactical-600 shadow-sm"
                    : link.href === "/admin"
                    ? "text-gold-light/90 hover:text-white hover:bg-tactical-850 border border-gold-dark/40"
                    : "text-gray-300 hover:text-white hover:bg-tactical-900"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-gold" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/pesan"
            className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-amber-900/30 uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Bordir Cepat</span>
          </Link>

          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-tactical-800 hover:bg-tactical-700 active:scale-[0.98] text-white border border-tactical-600 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp Kasir</span>
            <span className="sm:hidden">WA</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-gray-400 hover:text-white hover:bg-tactical-900 rounded-lg border border-tactical-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-tactical-800 bg-tactical-950 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? "bg-tactical-800 text-white border border-tactical-600"
                    : link.href === "/admin"
                    ? "text-gold-light bg-tactical-900 border border-gold-dark/40"
                    : "text-gray-300 hover:bg-tactical-900 hover:text-white"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-gold" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/pesan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gold-dark to-gold text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Order Bordir Cepat Online</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
