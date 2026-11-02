"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", code: "01", label: "KATALOG RAK" },
    { href: "/pesan", code: "02", label: "PESAN BORDIR" },
    { href: "/tracking", code: "03", label: "LACAK TIKET" },
    { href: "/admin", code: "04", label: "PANEL ADMIN" },
  ];

  return (
    <header className="w-full bg-console-ground border-b border-console-rule sticky top-0 z-50">
      {/* 1. TOP UTILITY BAR (Drafting Sheet Spec) */}
      <div className="w-full border-b border-console-rule px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-3 text-console-textMuted">
          <span>SYS-LOC // MEDAN-IDN</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="hidden sm:inline">03.5952° N, 98.6722° E</span>
          <span className="hidden md:inline opacity-40">|</span>
          <span className="hidden md:inline">JL. GAPERTA NO. 12</span>
        </div>
        <div className="flex items-center gap-2 text-console-green font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-console-green animate-pulse" />
          <span>LIVE // INVENTORY SYNCED</span>
        </div>
      </div>

      {/* 2. MAIN NAV BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Group */}
        <Link href="/" className="flex items-baseline gap-3.5 group">
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-console-textPrimary tracking-wider uppercase group-hover:text-console-gold transition-colors">
            GAPERTA
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-console-gold font-medium tracking-widest uppercase">
            ATRIBUT MILITER &amp; BORDIR KOMPUTER
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 py-1 transition-all ${
                  isActive
                    ? "text-console-textPrimary font-semibold border-b-2 border-console-gold pb-0.5"
                    : link.href === "/admin"
                    ? "text-console-gold hover:text-white"
                    : "text-console-textSecondary hover:text-console-textPrimary"
                }`}
              >
                <span className="text-[10px] text-console-textMuted font-mono">{link.code}</span>
                <span className="font-heading text-sm font-semibold tracking-wider uppercase">
                  {link.label}
                </span>
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
            className="inline-flex items-center gap-2 border border-console-rule hover:border-console-gold text-console-textPrimary bg-console-surface hover:bg-console-elevated font-mono text-xs px-3.5 py-2 transition-colors uppercase tracking-wider"
          >
            <Phone className="w-3.5 h-3.5 text-console-green" />
            <span className="hidden sm:inline">WA KASIR</span>
            <ArrowUpRight className="w-3 h-3 text-console-textMuted" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-console-textSecondary hover:text-white border border-console-rule bg-console-surface"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-console-rule bg-console-surface px-4 py-4 space-y-2 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 border ${
                  isActive
                    ? "border-console-gold bg-console-elevated text-console-textPrimary font-bold"
                    : "border-console-rule text-console-textSecondary hover:text-white"
                }`}
              >
                <span className="font-heading text-sm tracking-wider uppercase">{link.label}</span>
                <span className="text-console-textMuted text-[11px]">{link.code}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
