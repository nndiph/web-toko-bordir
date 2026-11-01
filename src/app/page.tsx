"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Phone,
  Award,
  Shirt,
  ShieldCheck,
  Tag,
  Scissors,
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
    imageUrl: "https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "5",
    name: "Baret Hijau Kostrad + Emblem Logam",
    slug: "baret-hijau-kostrad",
    category: "topi",
    price: 110000,
    stock: 8,
    status: "TERSEDIA",
    rackLocation: "Rak C-03 (Topi & Baret)",
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "6",
    name: "Sabuk Kopral Kepala Gesper Kuningan",
    slug: "sabuk-kopral-gesper-kuningan",
    category: "sabuk",
    price: 45000,
    stock: 12,
    status: "TERSEDIA",
    rackLocation: "Rak B-02 (Sisi Depan)",
    imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "7",
    name: "Pangkat Bordir TNI AD - Kapten (Timbul Emas)",
    slug: "pangkat-kapten-tni-ad",
    category: "pangkat",
    price: 45000,
    stock: 18,
    status: "TERSEDIA",
    rackLocation: "Rak A-03 (Pangkat Perwira)",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "8",
    name: "Badge Lokasi KODAM I / Bukit Barisan",
    slug: "badge-lokasi-kodam-bb",
    category: "bordir",
    price: 12500,
    stock: 45,
    status: "TERSEDIA",
    rackLocation: "Rak A-01 (Badge Lokasi)",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
  },
];

const FEATURED_CATEGORIES = [
  {
    id: "pangkat",
    name: "Badge & Pangkat",
    desc: "Bordir timbul rapi & presisi",
    count: "24+ Model",
    icon: Award,
    imageUrl: "https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "seragam",
    name: "Seragam PDL/PDH",
    desc: "Kain loreng standar TNI",
    count: "Standar Mabes",
    icon: Shirt,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sabuk",
    name: "Sabuk & Kopel Rim",
    desc: "Kopel dinas & kepala kuningan",
    count: "Kuat & Tahan Dinas",
    icon: ShieldCheck,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "topi",
    name: "Topi & Baret",
    desc: "Kostrad, Kopassus & emblem",
    count: "Lengkap Kesatuan",
    icon: Tag,
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bordir",
    name: "Pesanan Custom",
    desc: "Nama dada & lokasi 1-2 hari",
    count: "Antrean Terjadwal",
    icon: Scissors,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  },
];

const FILTER_TABS = [
  { id: "all", label: "Semua Produk" },
  { id: "pangkat", label: "Pangkat Dinas" },
  { id: "seragam", label: "Seragam PDL/PDH" },
  { id: "sabuk", label: "Sabuk & Kopel" },
  { id: "topi", label: "Topi & Baret" },
  { id: "bordir", label: "Badge & Bordir" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const catalogElement = document.getElementById("katalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderFallbackCover = (category: string) => {
    switch (category) {
      case "pangkat":
        return (
          <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center text-white p-4">
            <Award className="w-12 h-12 text-amber-400 mb-2" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-200">Pangkat Dinas</span>
          </div>
        );
      case "seragam":
        return (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950 flex flex-col items-center justify-center text-white p-4">
            <Shirt className="w-12 h-12 text-stone-300 mb-2" />
            <span className="text-xs font-bold tracking-wider uppercase text-stone-300">Seragam PDL</span>
          </div>
        );
      case "sabuk":
        return (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex flex-col items-center justify-center text-white p-4">
            <ShieldCheck className="w-12 h-12 text-amber-500 mb-2" />
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-300">Kopel & Sabuk</span>
          </div>
        );
      case "topi":
        return (
          <div className="w-full h-full bg-gradient-to-br from-teal-900 to-slate-950 flex flex-col items-center justify-center text-white p-4">
            <Tag className="w-12 h-12 text-teal-300 mb-2" />
            <span className="text-xs font-bold tracking-wider uppercase text-teal-200">Topi & Baret</span>
          </div>
        );
      case "bordir":
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-900 to-stone-950 flex flex-col items-center justify-center text-white p-4">
            <Scissors className="w-12 h-12 text-amber-300 mb-2" />
            <span className="text-xs font-bold tracking-wider uppercase text-amber-200">Bordir Komputer</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* ─── Navbar ─── */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 w-full">
        {/* ─── Hero Banner dengan Showcase Produk Visual ─── */}
        <section className="bg-army text-white rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Kolom Kiri: Headline & Call To Action */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-black/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                Toko Atribut Resmi & Bordir Komputer
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Cek Ketersediaan Stok & Pesan Bordir Dinas Tanpa Antre
              </h1>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl">
                Khusus anggota dinas, komando satuan, dan calon prajurit. Pantau sisa stok nyata barang sebelum berangkat ke toko fisik atau ajukan pesanan custom bordir nama & pangkat secara online.
              </p>

              {/* Poin Kepercayaan Toko */}
              <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs font-semibold text-emerald-200 pt-1">
                <span>✓ Sisa Stok Nyata di Rak</span>
                <span>✓ Pengerjaan Cepat 1-2 Hari</span>
                <span>✓ Ambil Langsung di Toko Medan</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-army font-bold px-5 py-3 rounded-lg text-sm transition-colors shadow-sm"
                >
                  <span>Pesan Custom Bordir</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#katalog"
                  className="border border-white/70 hover:bg-white/10 text-white font-medium px-5 py-3 rounded-lg text-sm transition-colors"
                >
                  Lihat Katalog Barang
                </a>
              </div>
            </div>

            {/* Kolom Kanan: Showcase Produk Unggulan Toko */}
            <div className="lg:col-span-5">
              <div className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=600&q=80"
                    alt="Pangkat Bordir TNI AD - Serda (Timbul)"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                      ★ Produk Paling Dicari
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                      Tersedia 24 pcs
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        Pangkat Dinas TNI AD
                      </span>
                      <h3 className="font-bold text-gray-900 text-base leading-snug">
                        Pangkat Bordir TNI AD - Serda (Timbul)
                      </h3>
                    </div>
                    <p className="text-lg font-extrabold text-army tabular-nums shrink-0">
                      Rp 35.000
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-army" />
                      <span>Rak A-02 (Etalase Depan)</span>
                    </div>
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20cek%20Pangkat%20Serda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-army hover:bg-army-dark active:scale-[0.98] text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Beli via WA</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── KATEGORI PILIHAN BERGAMBAR (ala Tokopedia & Uniqlo) ─── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Jelajahi Departemen Produk
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Pilih kategori untuk langsung menjelajah etalase perlengkapan toko
              </p>
            </div>
            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-semibold text-army hover:underline"
              >
                Reset ke Semua ({INITIAL_PRODUCTS.length})
              </button>
            )}
          </div>

          {/* Grid Kategori Bergambar Penuh */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURED_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`group text-left rounded-xl border overflow-hidden bg-white transition-all duration-200 flex flex-col justify-between shadow-xs ${
                    isSelected
                      ? "border-army ring-2 ring-army/20 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {/* Sampul Foto Kategori */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                      <span className="text-[10px] font-bold bg-white/95 text-gray-900 px-2 py-0.5 rounded shadow-xs">
                        {cat.count}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white opacity-80 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Keterangan Teks Kategori */}
                  <div className="p-3 space-y-0.5">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-army transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {cat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── Katalog Barang Section ─── */}
        <section id="katalog" className="space-y-6 pt-2">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Katalog Etalase Toko
                </h2>
                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-200">
                  {filteredProducts.length} Produk
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Ketersediaan stok sinkron langsung dengan fisik rak toko Gaperta
              </p>
            </div>

            {/* Search Input Bar */}
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

          {/* Filter Pills Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`text-xs sm:text-sm px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-army text-white shadow-sm font-semibold"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ─── Grid Kartu Produk Bergaya Tokopedia / Uniqlo (Dengan Sampul Gambar) ─── */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Tidak ada produk dengan kata kunci &quot;{searchQuery}&quot; pada kategori ini. Coba pilih kategori lain atau tanyakan langsung ke kasir toko via WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="inline-block mt-2 text-xs font-semibold text-army underline"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div>
                    {/* ─── Sampul Gambar Produk (Cover Frame E-Commerce) ─── */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border-b border-gray-100">
                      {imgErrors[product.id] || !product.imageUrl ? (
                        renderFallbackCover(product.category)
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          onError={() => handleImageError(product.id)}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Status Badge Mengambang di Atas Gambar */}
                      <div className="absolute top-2.5 left-2.5">
                        {product.status === "TERSEDIA" && (
                          <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                            <CheckCircle2 className="w-3 h-3" />
                            Tersedia ({product.stock} pcs)
                          </span>
                        )}
                        {product.status === "HABIS" && (
                          <span className="inline-flex items-center gap-1 bg-rose-700 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                            <AlertTriangle className="w-3 h-3" />
                            Stok Habis
                          </span>
                        )}
                        {product.status === "CUSTOM" && (
                          <span className="inline-flex items-center gap-1 bg-amber-700 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                            <Clock className="w-3 h-3" />
                            Custom Order
                          </span>
                        )}
                      </div>

                      {/* Tag Kategori Mengambang */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Informasi Produk */}
                    <div className="p-4 space-y-2.5">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-army transition-colors">
                        {product.name}
                      </h3>

                      <div>
                        <span className="text-[11px] text-gray-500 block">Harga</span>
                        <p className="text-lg sm:text-xl font-extrabold text-gray-900 tabular-nums">
                          {formatRupiah(product.price)}
                        </p>
                      </div>

                      {/* Lokasi Rak Fisik di Toko */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200/80 px-2.5 py-1.5 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-army shrink-0" />
                        <span className="truncate">{product.rackLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Pembelian */}
                  <div className="p-4 pt-0">
                    {product.status === "TERSEDIA" ? (
                      <a
                        href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20apakah%20${encodeURIComponent(
                          product.name
                        )}%20masih%20tersedia?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full text-center bg-army hover:bg-army-dark active:scale-[0.98] text-white text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Beli / Cek via WA</span>
                      </a>
                    ) : product.status === "CUSTOM" ? (
                      <Link
                        href="/pesan"
                        className="flex items-center justify-center gap-2 w-full text-center bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-xs"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Isi Form Bordir Custom</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full text-center bg-gray-100 text-gray-400 text-xs sm:text-sm font-semibold py-2.5 rounded-lg cursor-not-allowed"
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

        {/* ─── Callout Bordir Khusus ─── */}
        <section className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 bg-stone-200/70 px-2.5 py-0.5 rounded">
              Layanan Pesanan Khusus
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Punya Desain Bordir Nama, Lokasi, atau Lambang Satuan Sendiri?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Kami melayani bordir komputer custom untuk perorangan maupun satu kompi satuan. Isi formulir pemesanan online untuk mendapatkan Nomor Tiket resmi toko.
            </p>
          </div>
          <Link
            href="/pesan"
            className="shrink-0 bg-army hover:bg-army-dark active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>Daftar Pesanan Bordir</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-gray-700">TOKO GAPERTA — Perlengkapan Dinas TNI & Bordir Komputer</p>
          <p>© 2026 Toko Gaperta. Transaksi dan pengambilan barang dilakukan di toko fisik Medan.</p>
        </div>
      </footer>
    </div>
  );
}
