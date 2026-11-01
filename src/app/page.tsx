"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Pangkat Bordir TNI AD - Serda (Timbul)",
    slug: "pangkat-serda-tni-ad",
    category: "pangkat",
    price: 35000,
    stock: 24,
    status: "TERSEDIA",
    rackLocation: "Rak A-02 (Etalase Depan)",
  },
  {
    id: "2",
    name: "Kopel Rim Hitam Standard TNI",
    slug: "kopel-rim-hitam-tni",
    category: "sabuk",
    price: 75000,
    stock: 15,
    status: "TERSEDIA",
    rackLocation: "Rak B-01 (Aksesoris)",
  },
  {
    id: "3",
    name: "Seragam PDL Loreng Malvinas Size L",
    slug: "seragam-pdl-malvinas-l",
    category: "seragam",
    price: 250000,
    stock: 0,
    status: "HABIS",
    rackLocation: "Gudang Belakang",
  },
  {
    id: "4",
    name: "Badge Nama Dada Bordir Komputer",
    slug: "badge-nama-dada-bordir",
    category: "bordir",
    price: 15000,
    stock: 100,
    status: "CUSTOM",
    rackLocation: "Mesin Bordir Toko",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua Produk" },
  { id: "bordir", label: "Badge & Pangkat" },
  { id: "seragam", label: "Seragam PDL/PDH" },
  { id: "sabuk", label: "Sabuk & Kopel" },
  { id: "topi", label: "Topi & Baret" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ─── Navbar ─── */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* ─── Hero Banner ─── */}
        <section className="bg-army text-white rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-army-dark/80 text-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Layanan Resmi & Terpercaya
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Cek Ketersediaan Stok & Pesan Bordir Dinas Tanpa Antre
            </h2>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              Khusus anggota dinas, komando satuan, dan calon prajurit. Pantau sisa stok barang sebelum
              berangkat ke toko atau ajukan pesanan custom bordir nama & pangkat secara online.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/pesan"
                className="bg-gold hover:bg-gold-dark text-ink font-bold px-6 py-3 rounded-lg text-sm transition-colors shadow"
              >
                Pesan Custom Bordir
              </Link>
              <a
                href="#katalog"
                className="border border-white/80 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
              >
                Lihat Stok Barang
              </a>
            </div>
          </div>
        </section>

        {/* ─── Katalog Section ─── */}
        <section id="katalog" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink">Katalog Ketersediaan Barang</h3>
              <p className="text-sm text-ink-muted">Data stok sinkron langsung dengan inventaris toko fisik</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-soft" />
              <input
                type="text"
                placeholder="Cari barang (misal: Pangkat Serda, Kopel)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-army-border pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army text-ink placeholder:text-ink-soft shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-army text-white shadow-sm"
                    : "bg-white text-ink border border-army-border hover:bg-surface-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-army-border/80 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Status Badge */}
                  <div>
                    {product.status === "TERSEDIA" && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        TERSEDIA ({product.stock} pcs)
                      </span>
                    )}
                    {product.status === "HABIS" && (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        STOK HABIS
                      </span>
                    )}
                    {product.status === "CUSTOM" && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        CUSTOM ORDER (1-2 Hari)
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-ink text-base line-clamp-2">{product.name}</h4>
                  <p className="text-lg font-extrabold text-army">{formatRupiah(product.price)}</p>

                  <div className="flex items-center gap-1.5 text-xs text-ink-muted bg-surface p-2 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-army" />
                    <span>{product.rackLocation}</span>
                  </div>
                </div>

                <div className="pt-4">
                  {product.status === "TERSEDIA" ? (
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20apakah%20${encodeURIComponent(product.name)}%20masih%20tersedia?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-army hover:bg-army-dark text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                    >
                      Beli / Pesan via WA
                    </a>
                  ) : product.status === "CUSTOM" ? (
                    <Link
                      href="/pesan"
                      className="block w-full text-center bg-gold hover:bg-gold-dark text-ink text-xs font-bold py-2.5 rounded-lg transition-colors"
                    >
                      Isi Form Bordir Custom
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full text-center bg-gray-100 text-gray-400 text-xs font-bold py-2.5 rounded-lg cursor-not-allowed"
                    >
                      Bisa Pre-Order di Toko
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-white border-t border-army-border/60 py-6 text-center text-xs text-ink-muted">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
