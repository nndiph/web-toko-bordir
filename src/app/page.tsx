"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  MapPin,
  Award,
  Scissors,
  PackageSearch,
  Ticket,
  MessageCircle,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { getProducts } from "@/lib/data/products";
import { storeWaLink } from "@/lib/store-info";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

const CATEGORIES = [
  { id: "all", label: "Semua Koleksi" },
  { id: "pangkat", label: "Badge & Pangkat" },
  { id: "seragam", label: "Seragam PDL/PDH" },
  { id: "sabuk", label: "Sabuk & Kopel" },
  { id: "topi", label: "Topi & Baret" },
  { id: "bordir", label: "Bordir Custom" },
];

function matches(product: Product, query: string) {
  if (!query) return true;
  const haystack = `${product.name} ${product.categoryName} ${product.rackLocation}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
        setLoadError(err instanceof Error ? err.message : "Gagal memuat katalog barang.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const query = searchQuery.trim();
  const filteredProducts = products.filter(
    (p) => matches(p, query) && (selectedCategory === "all" || p.category === selectedCategory)
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [products]);

  const availableCount = products.filter((p) => p.status === "TERSEDIA").length;
  const emptyCount = products.filter((p) => p.status === "HABIS").length;

  const scrollToCatalog = () => document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth" });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* ══════════════════════════════════════
          HERO — Clean Retail (Uniqlo/Tokopedia Layout)
      ══════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid lg:grid-cols-12 gap-8 lg:items-center">
          
          {/* Sisi Kiri: Value & Search Box (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Toko Fisik & Bordir Komputer Resmi Medan
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Perlengkapan Dinas TNI <br />
              <span className="text-emerald-800">& Bordir Komputer Presisi.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Cek sisa stok di rak toko secara nyata sebelum datang, pesan custom bordir dinas online, dan pantau progres antrean tanpa takut terselip.
            </p>

            {/* Kotak Cari Cepat */}
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                scrollToCatalog();
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-xl"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  enterKeyHint="search"
                  placeholder="Cari atribut: nama dada, pangkat, kopel, baret..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-slate-50 border border-slate-300 focus:bg-white focus:border-emerald-700 pl-11 pr-4 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Cari Stok
              </button>
            </form>

            {/* Sisa Stok Live Summary */}
            {!isLoading && !loadError && products.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600 pt-1">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  {availableCount} jenis barang siap di rak toko
                </span>
                {emptyCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    {emptyCount} barang menunggu restock
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sisi Kanan: 3 Kartu Aksi Cepat / Task Cards (5 Kolom) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Layanan Utama Toko
            </span>
            
            {[
              {
                href: "#katalog",
                icon: PackageSearch,
                title: "Cek Stok & Nomor Rak Toko",
                desc: "Lihat sisa fisik & etalase sebelum berangkat ke toko",
                tag: "Real-time",
                theme: "hover:border-emerald-600 group-hover:text-emerald-800",
              },
              {
                href: "/pesan",
                icon: Scissors,
                title: "Pesan Bordir Komputer Custom",
                desc: "Nama dada timbul, pangkat, emblem satuan (1–2 hari kerja)",
                tag: "Form Online",
                theme: "hover:border-emerald-600 group-hover:text-emerald-800",
              },
              {
                href: "/tracking",
                icon: Ticket,
                title: "Lacak Status Tiket Pesanan",
                desc: "Cek apakah pesanan masih dibordir atau sudah siap diambil",
                tag: "Nomor Tiket",
                theme: "hover:border-emerald-600 group-hover:text-emerald-800",
              },
            ].map(({ href, icon: Icon, title, desc, tag, theme }) => {
              const cls = `group flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm transition-all cursor-pointer ${theme}`;
              const content = (
                <>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-900 transition-colors">
                        {title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        {tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 shrink-0 mt-2 transition-colors" />
                </>
              );

              return href.startsWith("#") ? (
                <a key={title} href={href} className={cls}>
                  {content}
                </a>
              ) : (
                <Link key={title} href={href} className={cls}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VALUE PROPOSITION (3 PILAR OTENTIK)
      ══════════════════════════════════════ */}
      <section className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid sm:grid-cols-3 gap-4">
          {[
            {
              Icon: Zap,
              title: "Bordir 1–2 Hari Kerja",
              desc: "Mesin bordir komputer otomatis antrean tercatat rapi.",
            },
            {
              Icon: ShieldCheck,
              title: "100% Standar Mabes TNI",
              desc: "Presisi benang emas/warna dinas sesuai ketentuan resmi.",
            },
            {
              Icon: Award,
              title: "Stok Rak Fisik Sinkron",
              desc: "Datang langsung ke toko fisik Medan tanpa risiko barang kosong.",
            },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 py-1">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-tight">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          KATALOG E-COMMERCE RETAIL (Uniqlo/Tokopedia Grid)
      ══════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section id="katalog" className="space-y-6 scroll-mt-28">
          {isDemo && <DemoBanner />}

          {/* Heading & Pencarian Lokal */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Katalog Etalase Toko
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {products.length} Item
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {query ? (
                  <>
                    Menampilkan hasil pencarian &quot;<strong className="text-slate-900">{query}</strong>&quot; ({filteredProducts.length} barang)
                  </>
                ) : (
                  "Data ketersediaan fisik di rak toko Jl. Gaperta Medan. Transaksi langsung di lokasi."
                )}
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Saring nama atribut / rak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-white border border-slate-300 focus:border-emerald-700 pl-10 pr-9 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus filter"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills Kategori */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter kategori">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-10 px-4 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                  {!isLoading && (
                    <span className={`ml-1.5 text-xs tabular-nums ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                      ({categoryCounts[cat.id] ?? 0})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid Produk */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-slate-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-5 bg-slate-100 rounded" />
                    <div className="h-5 w-1/2 bg-slate-100 rounded" />
                    <div className="h-10 bg-slate-100 rounded-lg mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <ErrorBanner message={loadError} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Barang tidak ditemukan di katalog</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Barang mungkin belum dimasukkan ke sistem atau memiliki sebutan lain. Silakan tanyakan langsung ke kasir toko.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm font-bold hover:bg-slate-50 text-slate-700"
                >
                  Tampilkan Semua Barang
                </button>
                <a
                  href={storeWaLink(`Halo Toko Gaperta, apakah tersedia barang: ${query || "..."}?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Tanya Kasir via WA
                </a>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          )}
        </section>

        {/* ══════════════════════════════════════
            INFO SECTION — Pemesanan Regu & Satuan (Clean Editorial)
        ══════════════════════════════════════ */}
        <section className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
              Pemesanan Massal & Regu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Bordir untuk Satu Batalyon atau Regu?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Dinas atau bawahan yang disuruh komandan dapat langsung menginput daftar nama dan spesifikasi melalui formulir online untuk langsung masuk antrean mesin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/pesan"
              className="h-12 px-6 bg-white hover:bg-slate-100 text-emerald-950 font-bold text-sm rounded-xl inline-flex items-center gap-2 shadow-sm transition-colors"
            >
              <Scissors className="w-4 h-4" />
              Isi Form Pemesanan
            </Link>
            <Link
              href="/tracking"
              className="h-12 px-6 bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 text-white font-bold text-sm rounded-xl inline-flex items-center gap-2 transition-colors"
            >
              <Ticket className="w-4 h-4" />
              Lacak Nomor Tiket
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════
            DEPARTEMEN KOLEKSI (Clean Visual Showcase)
        ══════════════════════════════════════ */}
        <div className="grid sm:grid-cols-2 gap-5 pt-2">
          {[
            {
              title: "Atribut & Pangkat Resmi TNI",
              desc: "Pangkat dinas bordir timbul benang emas, tanda jabatan, brevet logam & bordir.",
              img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=75",
              filter: "pangkat",
              badge: "Koleksi Lengkap",
            },
            {
              title: "Bordir Komputer Satuan & Nama",
              desc: "Nama dada dinas, lokasi satuan, emblem regu, logo instansi bordir presisi digital.",
              img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=75",
              filter: "bordir",
              badge: "1–2 Hari Selesai",
            },
          ].map(({ title, desc, img, filter, badge }) => (
            <div
              key={title}
              className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 group border border-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <span className="self-start inline-flex items-center bg-white/95 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {badge}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white">{title}</h3>
                  <p className="text-sm text-slate-200 leading-relaxed max-w-md">{desc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(filter);
                      scrollToCatalog();
                    }}
                    className="inline-flex items-center gap-2 h-10 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors mt-1"
                  >
                    Buka Kategori Ini
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ═══════════════════════════════
   KOMPONEN KARTU RETAIL PRODUK
═══════════════════════════════ */

function StockLine({ product }: { product: Product }) {
  switch (product.status) {
    case "TERSEDIA":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Stok {product.stock} pcs
        </span>
      );
    case "HABIS":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
          <AlertTriangle className="w-3.5 h-3.5" />
          Stok Habis
        </span>
      );
    case "PRE_ORDER":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
          <Clock className="w-3.5 h-3.5" />
          Pre-Order
        </span>
      );
    case "CUSTOM":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
          <Scissors className="w-3.5 h-3.5" />
          Custom Bordir
        </span>
      );
  }
}

function ProductCard({ product }: { product: Product }) {
  const isEmpty = product.status === "HABIS";
  const btn =
    "flex items-center justify-center gap-1.5 w-full h-10 rounded-lg text-xs font-bold transition-colors";

  return (
    <li
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all duration-200 ${
        isEmpty ? "opacity-75" : ""
      }`}
    >
      {/* Gambar Sampul 4:3 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              isEmpty ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            Foto Produk Belum Ada
          </div>
        )}

        {/* Badge Status */}
        <span
          className={`absolute top-2 right-2 text-[11px] font-bold px-2 py-0.5 rounded shadow-sm ${
            product.status === "TERSEDIA"
              ? "bg-emerald-700 text-white"
              : product.status === "HABIS"
              ? "bg-red-600 text-white"
              : "bg-amber-600 text-white"
          }`}
        >
          {product.status === "TERSEDIA"
            ? "Tersedia"
            : product.status === "HABIS"
            ? "Habis"
            : product.status === "CUSTOM"
            ? "Custom"
            : "Pre-Order"}
        </span>
      </div>

      {/* Informasi Produk */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
          {product.categoryName}
        </span>
        <h3 className="font-bold text-sm leading-snug line-clamp-2 text-slate-900">
          {product.name}
        </h3>
        <p className="text-base font-extrabold tabular-nums text-slate-900 mt-0.5">
          {formatRupiah(product.price)}
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 mt-1">
          <StockLine product={product} />
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[110px]" title={product.rackLocation}>
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{product.rackLocation}</span>
          </span>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-auto pt-3">
          {product.status === "CUSTOM" ? (
            <Link href="/pesan" className={`${btn} bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm`}>
              <Scissors className="w-3.5 h-3.5" />
              Pesan Bordir
            </Link>
          ) : isEmpty || product.status === "PRE_ORDER" ? (
            <a
              href={storeWaLink(`Halo Toko Gaperta, kapan produk ${product.name} ready kembali?`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-slate-300 bg-white hover:bg-slate-50 text-slate-700`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Tanya Restock
            </a>
          ) : (
            <a
              href={storeWaLink(`Halo Toko Gaperta, saya ingin ambil ${product.name} (${product.rackLocation}). Apakah masih ada?`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Tanya via WA
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
