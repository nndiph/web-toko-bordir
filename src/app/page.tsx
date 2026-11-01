"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, CheckCircle2, AlertTriangle, MapPin, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* ─── Navbar ─── */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* ─── Hero Banner ─── */}
        <section className="bg-army text-white rounded-xl p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-black/25 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Layanan Resmi Toko Fisik & Bordir
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Cek Ketersediaan Stok & Pesan Bordir Dinas Tanpa Antre
            </h1>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
              Khusus anggota dinas, komando satuan, dan calon prajurit. Pantau sisa stok barang sebelum
              berangkat ke toko atau ajukan pesanan custom bordir nama & pangkat secara online.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/pesan"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-army font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
              >
                <span>Pesan Custom Bordir</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#katalog"
                className="border border-white/70 hover:bg-white/10 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Katalog Ketersediaan Barang
              </h2>
              <p className="text-sm text-gray-500">
                Data stok sinkron langsung dengan inventaris toko fisik Gaperta
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari barang (Pangkat, Kopel, PDL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs sm:text-sm px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-army text-white shadow-sm font-semibold"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="space-y-3">
                  {/* Status Badge */}
                  <div>
                    {product.status === "TERSEDIA" && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Tersedia ({product.stock} pcs)
                      </span>
                    )}
                    {product.status === "HABIS" && (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold px-2.5 py-1 rounded-md">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Stok Habis
                      </span>
                    )}
                    {product.status === "CUSTOM" && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Custom Order (1-2 Hari)
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 mt-0.5 leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-lg font-bold text-gray-900 tabular-nums">
                    {formatRupiah(product.price)}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 p-2 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-army shrink-0" />
                    <span>{product.rackLocation}</span>
                  </div>
                </div>

                <div className="pt-4">
                  {product.status === "TERSEDIA" ? (
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20apakah%20${encodeURIComponent(
                        product.name
                      )}%20masih%20tersedia?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-army hover:bg-army-dark text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      Beli / Pesan via WA
                    </a>
                  ) : product.status === "CUSTOM" ? (
                    <Link
                      href="/pesan"
                      className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      Isi Form Bordir Custom
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full text-center bg-gray-100 text-gray-400 text-xs font-semibold py-2.5 rounded-lg cursor-not-allowed"
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
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500 mt-12">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
