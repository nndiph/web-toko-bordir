"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Phone } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Katalog Stok" },
    { href: "/pesan", label: "Pesan Custom Bordir" },
    { href: "/tracking", label: "Cek Status Pesanan" },
  ];

  return (
    <header className="bg-white border-b border-army-border/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-army" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-army">
              TOKO GAPERTA
            </span>
          </div>
          <span className="text-xs text-ink-muted">Atribut Dinas & Bordir Komputer TNI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? "text-army font-bold underline decoration-2 underline-offset-4"
                    : "text-ink-muted hover:text-army"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-army text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-army-dark transition-colors shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Hubungi WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

