"use client";

import { useEffect, useState } from "react";
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
  Sparkles,
  Zap,
  Shield,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { getProducts } from "@/lib/data/products";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

const FEATURED_CATEGORIES = [
  {
    id: "pangkat",
    name: "Badge & Pangkat",
    desc: "Bordir timbul rapi & presisi standar mabes",
    count: "24+ Model",
    icon: Award,
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "seragam",
    name: "Seragam PDL / PDH",
    desc: "Kain loreng resmi TNI & dinas lapangan",
    count: "Standar Dinas",
    icon: Shirt,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "sabuk",
    name: "Sabuk & Kopel Rim",
    desc: "Kopel dinas kuningan & sabuk taktis kuat",
    count: "Bahan Tebal",
    icon: ShieldCheck,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "topi",
    name: "Topi & Baret",
    desc: "Baret semua korps & lencana kesatuan lengkap",
    count: "Semua Korps",
    icon: Tag,
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "bordir",
    name: "Custom Bordir Komputer",
    desc: "Nama dada timbul & lambang satuan 1-2 hari",
    count: "Mesin Digital",
    icon: Scissors,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=75",
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
  const [products, setProducts] = useState<Product[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((result) => {
        if (cancelled) return;
        setProducts(result.data);
        setIsDemo(result.demo);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Gagal memuat produk.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const filteredProducts = products.filter((product) => {
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
    return (
      <div className="w-full h-full bg-gradient-to-br from-tactical-800 to-tactical-950 flex flex-col items-center justify-center text-white p-4">
        <Shield className="w-10 h-10 text-gold mb-2 opacity-80" />
        <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
          {category}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-tactical-950 text-gray-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 w-full">
        {/* ─── HERO BANNER MILITER TAKTIS ─── */}
        <section className="relative rounded-3xl overflow-hidden border border-tactical-700 bg-gradient-to-b from-tactical-900 via-tactical-900 to-tactical-950 shadow-2xl p-6 sm:p-10 lg:p-14">
          {/* Subtle tactical ambient glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-army/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Headline Area */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-tactical-850 border border-tactical-600/80 text-gold-light text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-inner">
                <Shield className="w-3.5 h-3.5 text-gold" />
                <span>Pusat Perlengkapan Dinas TNI & Instansi</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase">
                Tegas. Presisi. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-300">
                  Siap Tugas.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-normal">
                Katalog ketersediaan fisik seragam, sabuk kopel, baret, dan antrean bordir komputer
                nama dada serta pangkat timbul. Pastikan stok tersedia di rak toko sebelum datang.
              </p>

              {/* Ticker / Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="bg-tactical-850/80 border border-tactical-700 p-3 rounded-xl">
                  <div className="text-xl font-black text-white">1-2 Hari</div>
                  <div className="text-[11px] font-medium text-gray-400">Bordir Selesai</div>
                </div>
                <div className="bg-tactical-850/80 border border-tactical-700 p-3 rounded-xl">
                  <div className="text-xl font-black text-gold">100%</div>
                  <div className="text-[11px] font-medium text-gray-400">Standar Mabes</div>
                </div>
                <div className="bg-tactical-850/80 border border-tactical-700 p-3 rounded-xl">
                  <div className="text-xl font-black text-emerald-400">Live</div>
                  <div className="text-[11px] font-medium text-gray-400">Stok Rak Fisik</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-dark via-gold to-amber-500 hover:brightness-110 active:scale-[0.98] text-white font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-950/40 uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pesan Custom Bordir</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2 bg-tactical-800 hover:bg-tactical-700 border border-tactical-600 text-gray-200 font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
                >
                  <Layers className="w-4 h-4 text-gray-400" />
                  <span>Jelajahi Stok Rak</span>
                </a>
              </div>
            </div>

            {/* Featured Hero Product Card */}
            <div className="lg:col-span-5">
              <div className="bg-tactical-850 border border-tactical-700 rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-tactical-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=650&q=80"
                    alt="Pangkat Bordir TNI AD - Serda"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tactical-850 via-transparent to-black/30" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-gold-dark text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-md border border-gold/40">
                      ★ Favorit Satuan
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[11px] font-bold px-2.5 py-1 rounded shadow-md">
                      ● Stok Tersedia (24 pcs)
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                        Pangkat Dinas Timbul
                      </span>
                      <h3 className="font-extrabold text-white text-lg leading-tight mt-0.5">
                        Pangkat Bordir TNI AD - Serda (Bordir Timbul)
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Harga</span>
                      <p className="text-xl font-black text-amber-400 tabular-nums">Rp 35.000</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-tactical-700 text-xs">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-gold shrink-0" />
                      <span className="font-medium">Rak A-02 (Etalase Depan)</span>
                    </div>
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20cek%20Pangkat%20Serda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-tactical-700 hover:bg-tactical-600 border border-tactical-600 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cek via WA</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── KATEGORI PILIHAN TAKTIS ─── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-tactical-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-black uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                <span>Navigasi Cepat</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Departemen Perlengkapan
              </h2>
            </div>
            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-gold hover:text-amber-300 transition-colors uppercase tracking-wider"
              >
                Reset ke Semua ({products.length} Item)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURED_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`group text-left rounded-2xl border overflow-hidden bg-tactical-900 transition-all duration-300 flex flex-col justify-between shadow-md relative ${
                    isSelected
                      ? "border-gold ring-2 ring-gold/40 shadow-gold/10"
                      : "border-tactical-800 hover:border-tactical-600 hover:bg-tactical-850"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-tactical-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tactical-900 via-tactical-900/40 to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <div className="w-7 h-7 rounded-lg bg-tactical-950/90 border border-tactical-700 flex items-center justify-center text-gold">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-tactical-950/90 text-gold-light border border-tactical-700 px-2 py-0.5 rounded">
                        {cat.count}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <h3 className="font-extrabold text-white text-sm leading-snug group-hover:text-gold transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-1 leading-normal">
                      {cat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── ETALASE KATALOG RAK FISIK ─── */}
        <section id="katalog" className="space-y-6 pt-4">
          {isDemo && <DemoBanner />}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-tactical-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  Etalase Rak Fisik Toko
                </h2>
                <span className="text-xs font-black bg-tactical-800 text-gold px-3 py-1 rounded-full border border-tactical-700">
                  {filteredProducts.length} Produk
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Ketersediaan stok sinkron langsung dengan fisik rak toko Gaperta Medan
              </p>
            </div>

            {/* Tactical Search Bar */}
            <div className="relative w-full md:w-88">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari barang (Pangkat, Kopel, PDL, Topi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-tactical-900 border border-tactical-700 focus:border-gold pl-11 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/20 shadow-inner"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`text-xs sm:text-sm px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                    isSelected
                      ? "bg-gold text-white shadow-lg shadow-amber-950/30"
                      : "bg-tactical-900 text-gray-300 border border-tactical-800 hover:border-tactical-600 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Grid Produk Taktis */}
          {isLoading ? (
            <div className="bg-tactical-900 border border-tactical-800 rounded-2xl p-16 text-center text-sm text-gray-400">
              Memuat katalog stok fisik...
            </div>
          ) : loadError ? (
            <ErrorBanner message={`${loadError} Silakan hubungi kasir via WhatsApp.`} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-tactical-900 border border-tactical-800 rounded-2xl p-14 text-center space-y-3">
              <div className="w-12 h-12 bg-tactical-800 border border-tactical-700 rounded-full flex items-center justify-center mx-auto text-gold">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">Barang Tidak Ditemukan</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Tidak ada produk dengan kata kunci &quot;{searchQuery}&quot;. Hubungi toko langsung untuk cek pesanan khusus.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="inline-block mt-2 text-xs font-bold text-gold uppercase tracking-wider hover:underline"
              >
                Tampilkan Semua Barang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-tactical-900 border border-tactical-800 hover:border-tactical-600 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-black/50"
                >
                  <div>
                    {/* Cover Image Showcase */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-tactical-950 border-b border-tactical-800">
                      {imgErrors[product.id] || !product.imageUrl ? (
                        renderFallbackCover(product.category)
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          onError={() => handleImageError(product.id)}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                        />
                      )}

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3">
                        {product.status === "TERSEDIA" && (
                          <span className="inline-flex items-center gap-1 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[10px] font-black px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Stok: {product.stock} pcs
                          </span>
                        )}
                        {product.status === "HABIS" && (
                          <span className="inline-flex items-center gap-1 bg-rose-950/90 text-rose-300 border border-rose-500/50 text-[10px] font-black px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            Stok Habis
                          </span>
                        )}
                        {product.status === "CUSTOM" && (
                          <span className="inline-flex items-center gap-1 bg-amber-950/90 text-amber-300 border border-amber-500/50 text-[10px] font-black px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Custom Order
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="bg-tactical-950/80 backdrop-blur-xs text-gray-300 border border-tactical-700 text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Information */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-extrabold text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                        {product.name}
                      </h3>

                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Harga</span>
                        <p className="text-xl font-black text-amber-400 tabular-nums">
                          {formatRupiah(product.price)}
                        </p>
                      </div>

                      {/* Rak Fisik */}
                      <div className="flex items-center gap-2 text-xs text-gray-300 bg-tactical-850 border border-tactical-800 px-3 py-2 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="truncate font-medium">{product.rackLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0">
                    {product.status === "TERSEDIA" ? (
                      <a
                        href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20apakah%20${encodeURIComponent(
                          product.name
                        )}%20masih%20tersedia?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full text-center bg-tactical-800 hover:bg-tactical-700 border border-tactical-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cek / Ambil di Toko</span>
                      </a>
                    ) : product.status === "CUSTOM" ? (
                      <Link
                        href="/pesan"
                        className="flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-gold-dark to-gold hover:brightness-110 active:scale-[0.98] text-white text-xs sm:text-sm font-black py-2.5 rounded-xl transition-all shadow-sm uppercase tracking-wider"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Form Bordir Custom</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full text-center bg-tactical-950 text-gray-600 border border-tactical-800 text-xs sm:text-sm font-bold py-2.5 rounded-xl cursor-not-allowed"
                      >
                        Habis — Pre-Order Toko
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── CALLOUT BORDIR CUSTOM RESMI ─── */}
        <section className="bg-gradient-to-r from-tactical-900 via-tactical-850 to-tactical-900 border border-tactical-700 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-gold bg-tactical-800 border border-gold-dark/40 px-3 py-1 rounded-full">
              Layanan Komando & Satuan
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
              Pesan Bordir Nama, Korps, Atau Lambang Satuan
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              Melayani pesanan bordir timbul perorangan hingga ratusan set untuk satu batalyon/kompi.
              Daftar online sekarang untuk mendapatkan Nomor Tiket resmi antrean mesin.
            </p>
          </div>
          <Link
            href="/pesan"
            className="shrink-0 bg-gradient-to-r from-gold-dark to-gold hover:brightness-110 text-white font-black text-sm px-7 py-4 rounded-xl transition-all shadow-xl shadow-amber-950/40 inline-flex items-center gap-2.5 uppercase tracking-wider"
          >
            <span>Daftar Pesanan Online</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* ─── FOOTER TAKTIS MILITER ─── */}
      <footer className="bg-tactical-950 border-t border-tactical-800 py-12 text-xs text-gray-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-tactical-850 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-tactical-850 border border-tactical-700 flex items-center justify-center text-gold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-white tracking-wider uppercase">
                TOKO GAPERTA MEDAN
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Jl. Gaperta No. 12, Helvetia, Medan — Sumatera Utara
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-gray-500">
            <p>© 2026 Toko Gaperta. Transaksi dan serah terima barang langsung di toko fisik.</p>
            <p>Standar Perlengkapan Dinas TNI & Kedinasan Resmi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}