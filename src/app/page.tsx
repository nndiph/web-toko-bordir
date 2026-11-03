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

const TASKS = [
  {
    href: "#katalog",
    title: "Cek Stok Barang",
    desc: "Lihat sisa stok & nomor rak",
    Icon: PackageSearch,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    href: "/pesan",
    title: "Pesan Bordir",
    desc: "Nama dada, pangkat, emblem",
    Icon: Scissors,
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    href: "/tracking",
    title: "Lacak Tiket",
    desc: "Sudah jadi atau belum?",
    Icon: Ticket,
    tone: "bg-sky-50 text-sky-700 border-sky-200",
  },
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
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* ─── HERO: langsung ke tugas utama pembeli ─── */}
        <section className="bg-white border border-slate-border rounded-3xl p-5 sm:p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
                Cek stok dulu, <span className="text-brand">baru datang ke toko.</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Perlengkapan dinas TNI &amp; bordir komputer. Lihat sisa stok dan nomor raknya, atau pesan bordir nama
                dada dan pangkat — selesai 1–2 hari kerja.
              </p>

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
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="hero-search"
                    type="search"
                    enterKeyHint="search"
                    placeholder="Cari: pangkat, kopel, baret, PDL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 bg-slate-50 border-2 border-slate-border focus:border-brand focus:bg-white pl-12 pr-4 rounded-2xl text-base text-slate-ink placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-5 sm:px-7 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl text-base transition-colors"
                >
                  Cari
                </button>
              </form>

              {!isLoading && !loadError && products.length > 0 && (
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <strong className="text-slate-ink">{availableCount}</strong> barang tersedia di rak
                  </span>
                  {emptyCount > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <strong className="text-slate-ink">{emptyCount}</strong> sedang habis
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Tiga tugas utama pembeli */}
            <nav className="lg:col-span-5 grid gap-3" aria-label="Pilih keperluan">
              <span className="text-sm font-bold text-slate-500">Mau apa hari ini?</span>
              {TASKS.map(({ href, title, desc, Icon, tone }) => {
                const content = (
                  <>
                    <span className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${tone}`}>
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-base text-slate-ink">{title}</span>
                      <span className="block text-sm text-slate-muted">{desc}</span>
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand transition-colors" />
                  </>
                );
                const className =
                  "group flex items-center gap-4 rounded-2xl border border-slate-border bg-white hover:border-brand hover:bg-brand-light/40 p-4 transition-colors";
                return href.startsWith("#") ? (
                  <a key={href} href={href} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link key={href} href={href} className={className}>
                    {content}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        {/* ─── Keunggulan ringkas ─── */}
        <ul className="grid gap-3 sm:grid-cols-3 text-sm">
          {[
            { Icon: Clock, title: "Bordir 1–2 hari kerja", desc: "Antrean mesin tercatat, tidak terselip." },
            { Icon: Award, title: "Sesuai standar dinas", desc: "Warna, benang, dan ukuran mengikuti ketentuan." },
            { Icon: MapPin, title: "Nomor rak tertera", desc: "Kasir langsung tahu letak barangnya." },
          ].map(({ Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3 bg-white border border-slate-border rounded-2xl p-4">
              <Icon className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-ink">{title}</p>
                <p className="text-slate-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ─── KATALOG ─── */}
        <section id="katalog" className="space-y-5 scroll-mt-32">
          {isDemo && <DemoBanner />}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Katalog Stok Toko</h2>
              <p className="text-sm text-slate-muted mt-1">
                {query ? (
                  <>
                    {filteredProducts.length} hasil untuk &quot;<strong className="text-slate-ink">{query}</strong>&quot;
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
                className="w-full h-11 bg-white border border-slate-border focus:border-brand pl-10 pr-10 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Satu baris filter kategori */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter kategori">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-10 px-4 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
                    isSelected
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-slate-700 border-slate-border hover:border-slate-400"
                  }`}
                >
                  {cat.label}
                  {!isLoading && (
                    <span className={`ml-1.5 tabular-nums ${isSelected ? "text-emerald-200" : "text-slate-400"}`}>
                      {categoryCounts[cat.id] ?? 0}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-border rounded-2xl overflow-hidden animate-pulse">
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
            <div className="bg-white border border-slate-border rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Barang tidak ditemukan</h3>
              <p className="text-sm text-slate-muted max-w-sm mx-auto">
                Mungkin belum dimasukkan ke katalog. Tanyakan langsung ke kasir lewat WhatsApp.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-11 px-5 rounded-xl border border-slate-border bg-white text-sm font-bold hover:bg-slate-50"
                >
                  Tampilkan semua barang
                </button>
                <a
                  href={storeWaLink(`Halo Toko Gaperta, apakah ada barang: ${query || "..."}?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 px-5 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-bold inline-flex items-center gap-2"
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

        {/* ─── Ajakan pesan bordir ─── */}
        <section className="bg-brand text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Pesan bordir untuk satu regu sekaligus?</h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl">
              Isi formulir online, dapatkan nomor tiket, lalu pantau sampai siap diambil. Tidak perlu chat berkali-kali.
            </p>
          </div>
          <Link
            href="/pesan"
            className="shrink-0 h-12 bg-white hover:bg-slate-100 text-brand font-bold text-base px-6 rounded-xl inline-flex items-center justify-center gap-2"
          >
            Isi Formulir Bordir
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function StockLine({ product }: { product: Product }) {
  switch (product.status) {
    case "TERSEDIA":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
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
        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
          <Clock className="w-4 h-4" />
          Pre-order
        </span>
      );
    case "CUSTOM":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
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
      className={`bg-white border border-slate-border rounded-2xl overflow-hidden flex flex-col hover:shadow-md hover:border-slate-300 transition-all ${
        isEmpty ? "opacity-90" : ""
      }`}
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover ${isEmpty ? "grayscale" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">Foto belum ada</div>
        )}
        {isEmpty && (
          <span className="absolute inset-x-0 bottom-0 bg-red-600/90 text-white text-xs font-bold text-center py-1">
            HABIS
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
        <span className="hidden sm:block text-xs font-semibold text-slate-muted">{product.categoryName}</span>
        <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-base sm:text-lg font-extrabold tabular-nums">{formatRupiah(product.price)}</p>
        <StockLine product={product} />
        <p className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-accent-gold shrink-0" />
          <span className="line-clamp-1">{product.rackLocation}</span>
        </p>

        <div className="mt-auto pt-2">
          {product.status === "CUSTOM" ? (
            <Link href="/pesan" className={`${btn} bg-amber-600 hover:bg-amber-700 text-white`}>
              <Scissors className="w-4 h-4" />
              Pesan
            </Link>
          ) : isEmpty || product.status === "PRE_ORDER" ? (
            <a
              href={storeWaLink(`Halo Toko Gaperta, kapan ${product.name} tersedia lagi?`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-slate-300 bg-white hover:bg-slate-50 text-slate-700`}
            >
              <MessageCircle className="w-4 h-4" />
              Tanya Restock
            </a>
          ) : (
            <a
              href={storeWaLink(`Halo Toko Gaperta, saya mau ambil ${product.name}. Masih ada?`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} bg-brand hover:bg-brand-hover text-white`}
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
