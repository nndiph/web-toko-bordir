"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  Shirt,
  ArrowRight,
  Phone,
  ChevronRight,
} from "lucide-react";
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
  { id: "bordir", label: "Badge & Bordir" },
  { id: "pangkat", label: "Pangkat Dinas" },
  { id: "seragam", label: "Seragam PDL/PDH" },
  { id: "sabuk", label: "Sabuk & Kopel" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProductIcon = (category: string) => {
    switch (category) {
      case "pangkat":
        return <Award className="w-8 h-8 text-army" />;
      case "seragam":
        return <Shirt className="w-8 h-8 text-army" />;
      case "sabuk":
        return <ShieldCheck className="w-8 h-8 text-army" />;
      case "bordir":
      default:
        return <Sparkles className="w-8 h-8 text-army" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* ─── Navbar ─── */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 w-full">
        {/* ─── Hero Section Modern ─── */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#103B1E] via-[#165028] to-[#0D2E17] text-white p-7 sm:p-12 lg:p-16 shadow-xl border border-army/30">
          {/* Subtle Decorative Elements */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute right-10 bottom-0 opacity-10 hidden lg:block pointer-events-none">
            <ShieldCheck className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-gold-light text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Penyedia Resmi Atribut Dinas & Bordir Komputer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
              Cek Ketersediaan Stok & Pesan Bordir Dinas Tanpa Antre
            </h1>

            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Khusus anggota dinas TNI, pembina satuan, dan calon prajurit. Pantau sisa stok nyata barang sebelum berangkat ke toko atau pesan custom bordir komputer langsung dari HP Anda.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/pesan"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 active:scale-[0.98] text-army font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md"
              >
                <span>Pesan Custom Bordir</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#katalog"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/25 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all backdrop-blur-sm"
              >
                <span>Lihat Stok Barang</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─── Trust Bar / Garansi Mutu ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-surface-border rounded-2xl p-5 flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-army/10 text-army flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">Bordir Komputer Presisi</h4>
              <p className="text-xs text-ink-muted">Timbul rapi, benang kuat, dan sesuai spesifikasi Mabes.</p>
            </div>
          </div>

          <div className="bg-white border border-surface-border rounded-2xl p-5 flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">Pengerjaan 1-2 Hari</h4>
              <p className="text-xs text-ink-muted">Antrean teratur, peringatan kartu merah anti-terlewat.</p>
            </div>
          </div>

          <div className="bg-white border border-surface-border rounded-2xl p-5 flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">Stok & Rak Real-Time</h4>
              <p className="text-xs text-ink-muted">Cek sisa stok toko & letak rak fisik sebelum datang.</p>
            </div>
          </div>
        </section>

        {/* ─── Katalog Section ─── */}
        <section id="katalog" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-surface-border">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                  Katalog Ketersediaan Barang
                </h2>
                <span className="text-xs font-bold bg-army/10 text-army px-2.5 py-1 rounded-full">
                  {filteredProducts.length} Produk
                </span>
              </div>
              <p className="text-sm text-ink-muted mt-1">
                Data ketersediaan stok fisik yang diperbarui langsung dari kasir toko.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-soft" />
              <input
                type="text"
                placeholder="Cari barang (Pangkat, Kopel, PDL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-surface-border pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
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
                  className={`text-xs sm:text-sm px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-army text-white shadow-sm shadow-army/20"
                      : "bg-white text-ink-body border border-surface-border hover:bg-surface-muted hover:border-slate-300"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-surface-border rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-ink-soft">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-ink">Barang Tidak Ditemukan</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Tidak ada produk yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain atau hubungi WhatsApp toko.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-surface-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-200 group"
                >
                  <div>
                    {/* Visual Thumbnail Frame */}
                    <div className="h-40 bg-gradient-to-b from-slate-50 to-slate-100/60 border-b border-surface-border/60 flex items-center justify-center relative p-4 group-hover:scale-[1.02] transition-transform duration-200">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-surface-border flex items-center justify-center">
                        {getProductIcon(product.category)}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        {product.status === "TERSEDIA" && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Tersedia ({product.stock})
                          </span>
                        )}
                        {product.status === "HABIS" && (
                          <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200/80 text-rose-700 text-[11px] font-bold px-2.5 py-1 rounded-md">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            Stok Habis
                          </span>
                        )}
                        {product.status === "CUSTOM" && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Custom Order
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-ink text-base line-clamp-2 leading-snug group-hover:text-army transition-colors">
                        {product.name}
                      </h3>

                      <div>
                        <span className="text-xs text-ink-muted">Harga Satuan</span>
                        <p className="text-xl font-extrabold text-ink tabular-nums">
                          {formatRupiah(product.price)}
                        </p>
                      </div>

                      {/* Rack Location Pill */}
                      <div className="flex items-center gap-1.5 text-xs text-ink-body bg-slate-50 border border-surface-border/80 px-2.5 py-2 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-army shrink-0" />
                        <span className="truncate">{product.rackLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-5 pt-0">
                    {product.status === "TERSEDIA" ? (
                      <a
                        href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20apakah%20${encodeURIComponent(
                          product.name
                        )}%20masih%20tersedia?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full text-center bg-army hover:bg-army-dark active:scale-[0.98] text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Beli / Konfirmasi WA</span>
                      </a>
                    ) : product.status === "CUSTOM" ? (
                      <Link
                        href="/pesan"
                        className="flex items-center justify-center gap-2 w-full text-center bg-gold-accent hover:bg-amber-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Isi Form Bordir Custom</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full text-center bg-slate-100 text-slate-400 text-xs sm:text-sm font-semibold py-2.5 rounded-xl cursor-not-allowed"
                      >
                        Bisa Pre-Order di Toko
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── Banner Custom Bordir Callout ─── */}
        <section className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-md">
              Pesanan Khusus TNI & Instansi
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-ink">
              Butuh Bordir Nama Dada, Pangkat, atau Emblem Satuan?
            </h3>
            <p className="text-xs sm:text-sm text-ink-body max-w-xl">
              Isi data pemesanan secara online. Kami buatkan nomor tiket agar pesanan Anda masuk antrean mesin bordir tanpa perlu bolak-balik ke toko.
            </p>
          </div>
          <Link
            href="/pesan"
            className="shrink-0 bg-ink hover:bg-black active:scale-[0.98] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Buka Form Pemesanan</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* ─── Footer Modern E-Commerce ─── */}
      <footer className="bg-white border-t border-surface-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-surface-border">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-army" />
                <span className="font-extrabold text-ink tracking-tight">TOKO GAPERTA</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Toko spesialis atribut dinas resmi TNI dan jasa bordir komputer custom nama dada, pangkat, emblem, serta kelengkapan seragam instansi terpercaya.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink">Layanan Pelanggan</h5>
              <ul className="text-xs text-ink-body space-y-1.5">
                <li>• Cek Status Pesanan Bordir via Nomor Tiket</li>
                <li>• Estimasi Pengerjaan: 1 - 2 Hari Kerja</li>
                <li>• Pengambilan Barang: Langsung di Toko Fisik</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink">Kontak Toko</h5>
              <p className="text-xs text-ink-muted">
                Jl. Kapten Muslim / Gaperta, Medan, Sumatera Utara
              </p>
              <p className="text-xs font-semibold text-army">
                WhatsApp: 0812-3456-7890
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-2">
            <p>© 2026 Toko Gaperta. Semua hak dilindungi.</p>
            <p className="text-slate-400">Dibangun untuk kelancaran administrasi prajurit & toko.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
