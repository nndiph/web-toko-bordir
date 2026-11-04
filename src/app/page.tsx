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
  Star,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { getProducts } from "@/lib/data/products";
import { storeWaLink } from "@/lib/store-info";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

/** Slug harus sama dengan kolom `category` produk (lihat supabase/seed.sql). */
const CATEGORIES = [
  { id: "all", label: "Semua" },
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
          HERO — Dark TechNest Style
      ══════════════════════════════════════ */}
      <section className="relative bg-dark-bg overflow-hidden">
        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Vibrant glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-vibrant/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 bg-vibrant/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:items-center">
          {/* Left: headline + search */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-vibrant/10 border border-vibrant/30 text-vibrant text-xs font-bold px-3 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5" />
              Toko Perlengkapan Dinas & Bordir Komputer #1 Medan
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Perlengkapan{" "}
              <span className="text-vibrant">Dinas TNI</span>
              <br />& Bordir Presisi.
            </h1>

            <p className="text-dark-muted text-base sm:text-lg leading-relaxed max-w-lg">
              Cek stok rak fisik secara real-time, pesan bordir komputer, dan lacak progres pesanan
              — tanpa perlu chat berkali-kali.
            </p>

            {/* Search bar */}
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                scrollToCatalog();
              }}
              className="flex gap-2"
            >
              <label htmlFor="hero-search" className="sr-only">
                Cari barang
              </label>
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" />
                <input
                  id="hero-search"
                  type="search"
                  enterKeyHint="search"
                  placeholder="Cari: pangkat, kopel, baret, PDL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 bg-dark-surface border border-dark-border focus:border-vibrant/50 focus:bg-dark-card pl-12 pr-4 rounded-2xl text-base text-white placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-vibrant/20"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-6 bg-vibrant hover:bg-vibrant-hover text-white font-bold rounded-2xl text-base transition-colors shadow-lg shadow-vibrant/25"
              >
                Cari
              </button>
            </form>

            {/* Stock summary */}
            {!isLoading && !loadError && products.length > 0 && (
              <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-dark-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-vibrant" />
                  <strong className="text-white">{availableCount}</strong>&nbsp;barang tersedia di rak
                </span>
                {emptyCount > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <strong className="text-white">{emptyCount}</strong>&nbsp;sedang habis
                  </span>
                )}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pesan"
                className="inline-flex items-center gap-2 h-12 px-6 bg-vibrant hover:bg-vibrant-hover text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-vibrant/25"
              >
                <Scissors className="w-4 h-4" />
                Pesan Bordir Online
              </Link>
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2 h-12 px-6 bg-dark-surface hover:bg-dark-card border border-dark-border hover:border-vibrant/40 text-white font-bold rounded-xl text-sm transition-colors"
              >
                <PackageSearch className="w-4 h-4 text-vibrant" />
                Cek Stok Rak
              </button>
            </div>
          </div>

          {/* Right: Quick Task Cards */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-dark-muted uppercase tracking-widest">
              Mau ngapain hari ini?
            </span>
            {[
              {
                href: "#katalog",
                icon: PackageSearch,
                title: "Cek Stok Barang",
                desc: "Lihat sisa stok & nomor rak fisik",
                accent: "text-vibrant bg-vibrant/10 border-vibrant/20",
              },
              {
                href: "/pesan",
                icon: Scissors,
                title: "Pesan Bordir Custom",
                desc: "Nama dada, pangkat, emblem satuan",
                accent: "text-amber-400 bg-amber-400/10 border-amber-400/20",
              },
              {
                href: "/tracking",
                icon: Ticket,
                title: "Lacak Tiket Pesanan",
                desc: "Sudah jadi atau masih dibordir?",
                accent: "text-sky-400 bg-sky-400/10 border-sky-400/20",
              },
            ].map(({ href, icon: Icon, title, desc, accent }) => {
              const cls =
                "group flex items-center gap-4 p-4 rounded-2xl border border-dark-border bg-dark-surface hover:bg-dark-card hover:border-vibrant/30 transition-all cursor-pointer";
              const inner = (
                <>
                  <span className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${accent}`}>
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-base text-white">{title}</span>
                    <span className="block text-sm text-dark-muted">{desc}</span>
                  </span>
                  <ArrowRight className="w-5 h-5 text-dark-muted group-hover:text-vibrant transition-colors" />
                </>
              );
              return href.startsWith("#") ? (
                <a key={title} href={href} className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={title} href={href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VALUE PROPOSITION BAR
      ══════════════════════════════════════ */}
      <section className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid sm:grid-cols-3 gap-4">
          {[
            { Icon: Zap, title: "Bordir Selesai 1–2 Hari", desc: "Antrean mesin tercatat rapi, tidak terselip." },
            { Icon: ShieldCheck, title: "Standar Resmi Mabes TNI", desc: "Warna benang & ukuran sesuai ketentuan dinas." },
            { Icon: Award, title: "Stok Rak Fisik Nyata", desc: "Kasir langsung tahu lokasi & sisa stok barang." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-vibrant/10 border border-vibrant/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-vibrant" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{title}</p>
                <p className="text-xs text-dark-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          KATALOG — Clean White Grid
      ══════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section id="katalog" className="space-y-6 scroll-mt-32">
          {isDemo && <DemoBanner />}

          {/* Katalog header + search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Katalog Stok Toko
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {query ? (
                  <>
                    {filteredProducts.length} hasil untuk &quot;<strong className="text-slate-900">{query}</strong>&quot;
                  </>
                ) : (
                  "Stok mengikuti isi rak toko. Datang langsung untuk membeli."
                )}
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <label htmlFor="catalog-search" className="sr-only">
                Cari di katalog
              </label>
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="catalog-search"
                type="search"
                placeholder="Cari nama barang atau rak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-white border border-slate-200 focus:border-vibrant pl-10 pr-10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-vibrant/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter kategori">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-10 px-4 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-vibrant text-white border-vibrant shadow-md shadow-vibrant/25"
                      : "bg-white text-slate-600 border-slate-200 hover:border-vibrant/50 hover:text-vibrant"
                  }`}
                >
                  {cat.label}
                  {!isLoading && (
                    <span className={`ml-1.5 tabular-nums ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                      {categoryCounts[cat.id] ?? 0}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-slate-100" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <div className="h-4 bg-slate-100 rounded" />
                    <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    <div className="h-10 bg-slate-100 rounded-xl mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <ErrorBanner message={loadError} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Barang tidak ditemukan</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Mungkin belum dimasukkan ke katalog. Tanyakan langsung ke kasir lewat WhatsApp.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-sm font-bold hover:bg-slate-50 text-slate-700"
                >
                  Tampilkan semua barang
                </button>
                <a
                  href={storeWaLink(`Halo Toko Gaperta, apakah ada barang: ${query || "..."}?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 px-5 rounded-xl bg-vibrant hover:bg-vibrant-hover text-white text-sm font-bold inline-flex items-center gap-2 shadow-md shadow-vibrant/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Tanya via WA
                </a>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          )}
        </section>

        {/* ══════════════════════════════════════
            MID-PROMO BANNER — Dark
        ══════════════════════════════════════ */}
        <section className="relative bg-dark-bg rounded-3xl overflow-hidden px-6 sm:px-10 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-vibrant/10 rounded-full blur-3xl" />
          <div className="relative space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-vibrant">
              <Zap className="w-3.5 h-3.5" /> Pesan Satuan atau Satu Regu
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Bordir untuk satu regu sekaligus?
            </h2>
            <p className="text-sm sm:text-base text-dark-muted max-w-lg">
              Isi formulir online, dapatkan nomor tiket, lalu pantau sampai siap diambil. Tidak
              perlu chat berkali-kali.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Link
              href="/pesan"
              className="shrink-0 h-12 bg-vibrant hover:bg-vibrant-hover text-white font-bold text-sm px-6 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-vibrant/25 transition-colors"
            >
              Isi Formulir Bordir
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tracking"
              className="shrink-0 h-12 bg-dark-surface hover:bg-dark-card border border-dark-border hover:border-vibrant/30 text-white font-bold text-sm px-6 rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Ticket className="w-4 h-4 text-vibrant" />
              Lacak Tiket
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════
            DUAL CATEGORY SHOWCASE
        ══════════════════════════════════════ */}
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              title: "Atribut & Pangkat Resmi",
              desc: "Badge, pangkat bordir timbul, emblem satuan sesuai regulasi dinas TNI.",
              img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=75",
              filter: "pangkat",
              badge: "Stok Tersedia",
            },
            {
              title: "Bordir Komputer Custom",
              desc: "Nama dada, lokasi satuan, logo instansi — selesai presisi 1–2 hari kerja.",
              img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=75",
              filter: "bordir",
              badge: "Pesan Online",
            },
          ].map(({ title, desc, img, filter, badge }) => (
            <div
              key={title}
              className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-dark-bg group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <span className="self-start inline-flex items-center gap-1.5 bg-vibrant/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {badge}
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">{title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(filter);
                      scrollToCatalog();
                    }}
                    className="inline-flex items-center gap-2 h-10 px-5 bg-vibrant hover:bg-vibrant-hover text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-vibrant/25"
                  >
                    Lihat Koleksi
                    <ArrowRight className="w-4 h-4" />
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
   HELPER COMPONENTS
═══════════════════════════════ */

function StockLine({ product }: { product: Product }) {
  switch (product.status) {
    case "TERSEDIA":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-vibrant-dark">
          <CheckCircle2 className="w-4 h-4" />
          Stok {product.stock} pcs
        </span>
      );
    case "HABIS":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600">
          <AlertTriangle className="w-4 h-4" />
          Stok habis
        </span>
      );
    case "PRE_ORDER":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
          <Clock className="w-4 h-4" />
          Pre-order
        </span>
      );
    case "CUSTOM":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
          <Scissors className="w-4 h-4" />
          Dibuat sesuai pesanan
        </span>
      );
  }
}

function ProductCard({ product }: { product: Product }) {
  const isEmpty = product.status === "HABIS";
  const btn =
    "flex items-center justify-center gap-1.5 w-full h-11 rounded-xl text-sm font-bold transition-colors";

  return (
    <li
      className={`bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200 ${
        isEmpty ? "opacity-80" : ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isEmpty ? "grayscale" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
            Foto belum ada
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
            product.status === "TERSEDIA"
              ? "bg-vibrant text-white"
              : product.status === "HABIS"
              ? "bg-red-600 text-white"
              : "bg-amber-500 text-white"
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

      {/* Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
        <span className="hidden sm:block text-xs font-semibold text-slate-400">{product.categoryName}</span>
        <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-slate-900">
          {product.name}
        </h3>
        <p className="text-base sm:text-lg font-extrabold tabular-nums text-slate-900">
          {formatRupiah(product.price)}
        </p>
        <StockLine product={product} />
        <p className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-500">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="line-clamp-1">{product.rackLocation}</span>
        </p>

        {/* CTA */}
        <div className="mt-auto pt-2">
          {product.status === "CUSTOM" ? (
            <Link href="/pesan" className={`${btn} bg-amber-500 hover:bg-amber-600 text-white`}>
              <Scissors className="w-4 h-4" />
              Pesan
            </Link>
          ) : isEmpty || product.status === "PRE_ORDER" ? (
            <a
              href={storeWaLink(`Halo Toko Gaperta, kapan ${product.name} tersedia lagi?`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-slate-200 bg-white hover:bg-slate-50 text-slate-700`}
            >
              <MessageCircle className="w-4 h-4" />
              Tanya Restock
            </a>
          ) : (
            <a
              href={storeWaLink(`Halo Toko Gaperta, saya mau ambil ${product.name}. Masih ada?`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} bg-vibrant hover:bg-vibrant-hover text-white shadow-md shadow-vibrant/20`}
            >
              <MessageCircle className="w-4 h-4" />
              Tanya via WA
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
