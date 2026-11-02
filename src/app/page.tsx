"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Phone,
  MapPin,
  Sparkles,
  Award,
  Shirt,
  ShieldCheck,
  Tag,
  Scissors,
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
    desc: "Bordir timbul standar dinas",
    icon: Award,
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "seragam",
    name: "Seragam PDL / PDH",
    desc: "Kain loreng resmi Mabes TNI",
    icon: Shirt,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "sabuk",
    name: "Sabuk & Kopel",
    desc: "Kopel rim kuningan tebal",
    icon: ShieldCheck,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "topi",
    name: "Topi & Baret",
    desc: "Semua korps + emblem dinas",
    icon: Tag,
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: "bordir",
    name: "Custom Bordir",
    desc: "Nama dada timbul 1-2 hari",
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ─── HERO SECTION CERAH (Inspirasi Tokopedia & Uniqlo) ─── */}
        <section className="bg-white border border-slate-border rounded-3xl p-6 sm:p-12 lg:p-14 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Copywriting */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pusat Perlengkapan Dinas TNI &amp; Bordir Komputer Resmi</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-ink leading-[1.1]">
                Perlengkapan Dinas Lengkap. <br />
                <span className="text-brand">Bordir Komputer Rapi &amp; Presisi.</span>
              </h1>

              <p className="text-slate-muted text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Cek langsung ketersediaan stok fisik di rak toko sebelum datang. Pesan custom nama dada dan pangkat
                timbul standar Mabes selesai dalam 1–2 hari kerja.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-2.5 bg-brand hover:bg-brand-hover active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-sm"
                >
                  <span>Pesan Custom Bordir Online</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-ink font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors border border-slate-border"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>Jelajahi Stok Rak Toko</span>
                </a>
              </div>
            </div>

            {/* Featured Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 border border-slate-border rounded-2xl overflow-hidden shadow-sm group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=80"
                    alt="Pangkat Bordir TNI AD Serda"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    ★ Paling Dicari
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    Tersedia (24 pcs)
                  </div>
                </div>

                <div className="p-5 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-brand block">Pangkat Dinas Timbul</span>
                      <h3 className="font-bold text-slate-ink text-base leading-snug">
                        Pangkat Bordir TNI AD - Serda (Timbul Benang Emas)
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-muted block font-medium">Harga</span>
                      <span className="text-xl font-extrabold text-slate-ink">Rp 35.000</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-border text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <MapPin className="w-4 h-4 text-accent-gold" />
                      <span>Rak A-02 (Etalase Depan Toko)</span>
                    </div>
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20cek%20Pangkat%20Serda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-brand hover:text-brand-hover font-bold"
                    >
                      <span>Cek via WA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3 PILAR KEUNGGULAN (VALUE PROPOSITION) ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-border rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-accent-gold flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-gold">
                Cepat &amp; Presisi
              </span>
              <h3 className="font-bold text-slate-ink text-lg mt-0.5">1–2 Hari Selesai</h3>
              <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                Mesin bordir komputer digital otomatis dengan antrean tercatat rapi tanpa takut terselip.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-border rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand flex items-center justify-center shrink-0 border border-emerald-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                Standar Mabes
              </span>
              <h3 className="font-bold text-slate-ink text-lg mt-0.5">100% Sesuai Regulasi</h3>
              <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                Warna kain loreng, densitas benang, dan spon timbul mematuhi ketentuan resmi kedinasan.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-border rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Transparan &amp; Nyata
              </span>
              <h3 className="font-bold text-slate-ink text-lg mt-0.5">Stok Rak Fisik Tertera</h3>
              <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                Menampilkan nomor rak penyimpanan fisik di toko Medan agar Anda tidak bolak-balik saat datang.
              </p>
            </div>
          </div>
        </section>

        {/* ─── DEPARTEMEN PRODUK (Uniqlo Style Cards) ─── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-ink tracking-tight">Departemen Perlengkapan</h2>
              <p className="text-xs sm:text-sm text-slate-muted">Pilih kategori untuk memfilter etalase toko</p>
            </div>
            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-brand hover:underline"
              >
                Reset Filter (Semua Barang)
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
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`text-left rounded-2xl border p-4 transition-all duration-200 bg-white shadow-xs group ${
                    isSelected
                      ? "border-brand ring-2 ring-brand/20 bg-brand-light/30"
                      : "border-slate-border hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-ink text-sm leading-snug group-hover:text-brand transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-muted mt-0.5 line-clamp-1">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── KATALOG PRODUK CERAH (Tokopedia / Uniqlo Grid) ─── */}
        <section id="katalog" className="space-y-6 pt-4">
          {isDemo && <DemoBanner />}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-border pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-ink tracking-tight">
                  Katalog Stok Rak Toko
                </h2>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                  {filteredProducts.length} Produk
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-muted mt-1">
                Ketersediaan barang sinkron langsung dengan fisik rak toko Gaperta Medan
              </p>
            </div>

            {/* Large Search Bar ala Tokopedia */}
            <div className="relative w-full md:w-88">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari barang (Pangkat, Kopel, PDL, Topi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-border focus:border-brand pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/10 shadow-2xs"
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
                  className={`text-xs sm:text-sm px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-brand text-white border-brand shadow-xs"
                      : "bg-white text-slate-600 border-slate-border hover:bg-slate-50 hover:text-slate-ink"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Grid Produk Terang */}
          {isLoading ? (
            <div className="bg-white border border-slate-border rounded-2xl p-16 text-center text-sm text-slate-muted">
              Memuat katalog stok barang...
            </div>
          ) : loadError ? (
            <ErrorBanner message={loadError} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-border rounded-2xl p-14 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-ink">Barang Tidak Ditemukan</h3>
              <p className="text-xs text-slate-muted max-w-sm mx-auto">
                Tidak ada produk dengan kata kunci &quot;{searchQuery}&quot;. Hubungi toko langsung untuk konfirmasi
                stok khusus.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="inline-block mt-2 text-xs font-bold text-brand hover:underline"
              >
                Tampilkan Semua Barang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-border hover:border-slate-300 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
                >
                  <div>
                    {/* Foto Produk */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-border">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                          Foto Produk
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        {product.status === "TERSEDIA" && (
                          <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Stok: {product.stock} pcs
                          </span>
                        )}
                        {product.status === "HABIS" && (
                          <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            <AlertTriangle className="w-3 h-3" />
                            Stok Habis
                          </span>
                        )}
                        {product.status === "CUSTOM" && (
                          <span className="inline-flex items-center gap-1 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            <Clock className="w-3 h-3" />
                            Custom Order
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Rincian Produk */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-slate-ink text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-brand transition-colors">
                        {product.name}
                      </h3>

                      <div>
                        <span className="text-[11px] text-slate-muted block font-medium">Harga</span>
                        <p className="text-xl font-extrabold text-slate-ink tabular-nums">
                          {formatRupiah(product.price)}
                        </p>
                      </div>

                      {/* Lokasi Rak Fisik */}
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-accent-gold shrink-0" />
                        <span className="truncate font-medium">{product.rackLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="p-4 pt-0">
                    {product.status === "TERSEDIA" ? (
                      <a
                        href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20apakah%20${encodeURIComponent(
                          product.name
                        )}%20masih%20tersedia?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full text-center bg-brand hover:bg-brand-hover active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cek / Ambil di Toko</span>
                      </a>
                    ) : product.status === "CUSTOM" ? (
                      <Link
                        href="/pesan"
                        className="flex items-center justify-center gap-2 w-full text-center bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-2xs"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Pesan Custom Bordir</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full text-center bg-slate-100 text-slate-400 border border-slate-200 text-xs sm:text-sm font-bold py-2.5 rounded-xl cursor-not-allowed"
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
        <section className="bg-brand text-white rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-brand-dark px-3 py-1 rounded-full">
              Layanan Pesanan Satuan &amp; Kompi
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Pesan Bordir Nama, Korps, Atau Lambang Kesatuan
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Melayani pesanan bordir timbul perorangan hingga ratusan set untuk satu batalyon/kompi.
              Daftar online sekarang untuk mendapatkan Nomor Tiket resmi antrean mesin digital.
            </p>
          </div>
          <Link
            href="/pesan"
            className="shrink-0 bg-white hover:bg-slate-100 text-brand font-bold text-sm px-7 py-3.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span>Daftar Pesanan Online</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* ─── FOOTER TERANG & BERSIH ─── */}
      <footer className="w-full bg-white border-t border-slate-border mt-20 text-xs text-slate-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-border pb-6 text-center sm:text-left">
            <div>
              <span className="font-extrabold text-slate-ink text-base tracking-tight block">
                TOKO GAPERTA MEDAN
              </span>
              <span className="text-slate-muted text-xs mt-0.5 block">
                Jl. Gaperta No. 12, Kec. Medan Helvetia, Kota Medan — Sumatera Utara
              </span>
            </div>
            <div className="text-slate-600 font-medium">
              Buka Setiap Hari: Senin – Sabtu // 08:00 – 20:00 WIB
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500 text-center sm:text-left">
            <p>© 2026 Toko Gaperta. Transaksi dan serah terima barang langsung di toko fisik Medan.</p>
            <p>Standar Perlengkapan Dinas TNI &amp; Kedinasan Resmi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
