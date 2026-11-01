"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Phone, LayoutDashboard, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Katalog Stok" },
    { href: "/pesan", label: "Pesan Custom Bordir", badge: "Custom" },
    { href: "/tracking", label: "Cek Status Pesanan" },
    { href: "/admin", label: "Dashboard Pemilik", icon: LayoutDashboard },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-surface-border sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-army/10 border border-army/20 flex items-center justify-center text-army group-hover:bg-army group-hover:text-white transition-all duration-200">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-ink group-hover:text-army transition-colors">
                TOKO GAPERTA
              </span>
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold-accent px-2 py-0.5 rounded">
                TNI & Dinas
              </span>
            </div>
            <span className="text-xs text-ink-muted font-medium">
              Atribut Dinas & Bordir Komputer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "text-army bg-army-light/80 font-bold shadow-xs"
                    : link.href === "/admin"
                    ? "text-amber-800 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/60"
                    : "text-ink-body hover:text-ink hover:bg-surface-muted"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-amber-700" />}
                <span>{link.label}</span>
                {link.badge && !isActive && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-army/10 text-army px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-army hover:bg-army-dark active:scale-[0.98] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm shadow-army/20"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Hubungi WA Toko</span>
            <span className="sm:hidden">WA Toko</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink-body hover:text-ink hover:bg-surface-muted rounded-lg border border-surface-border"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-army text-white"
                    : link.href === "/admin"
                    ? "text-amber-800 bg-amber-50 border border-amber-200/80"
                    : "text-ink-body hover:bg-surface-muted"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-army/10 text-army"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
