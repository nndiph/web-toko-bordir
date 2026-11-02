"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  LayoutList,
  LayoutGrid,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { getProducts } from "@/lib/data/products";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

const FILTER_TABS = [
  { id: "all", label: "SEMUA ITEM" },
  { id: "pangkat", label: "PANGKAT DINAS" },
  { id: "seragam", label: "SERAGAM PDL/PDH" },
  { id: "sabuk", label: "SABUK & KOPEL" },
  { id: "topi", label: "TOPI & BARET" },
  { id: "bordir", label: "BADGE & BORDIR" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
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
    <div className="min-h-screen bg-console-ground text-console-textPrimary flex flex-col font-body">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ─── CONTINUOUS HERO STAGE (Technical Console Archetype) ─── */}
        <section className="w-full border border-console-rule bg-console-surface p-6 sm:p-10 lg:p-12 space-y-8">
          <div className="space-y-4">
            <div className="font-mono text-xs text-console-gold tracking-widest uppercase">
              STANDAR DINAS MABES // REKAYASA BORDIR TIMBUL DIGITAL
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-console-textPrimary tracking-tight uppercase leading-[1.05]">
              PRESISI BORDIR KOMPUTER &amp; LOGISTIK DINAS LAPANGAN.
            </h1>

            <p className="font-body text-sm sm:text-base text-console-textSecondary max-w-3xl leading-relaxed">
              Sistem verifikasi ketersediaan fisik seragam, sabuk kopel rim, baret dinas, dan antrean mesin bordir nama
              dada serta pangkat timbul. Transparan, terukur, dan siap diambil langsung di toko fisik Gaperta Medan.
            </p>
          </div>

          {/* Action Ledger Strip (Opposing Key / Value Composition) */}
          <div className="w-full border border-console-rule bg-console-ground p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/pesan"
                className="bg-console-gold hover:bg-console-goldDark text-black font-heading font-bold text-sm tracking-wider uppercase px-6 py-3 transition-colors inline-flex items-center gap-2"
              >
                <span>DAFTARKAN PESANAN BORDIR</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#katalog"
                className="border border-console-rule hover:border-console-textSecondary bg-console-surface text-console-textPrimary font-heading font-semibold text-sm tracking-wider uppercase px-5 py-3 transition-colors"
              >
                LIHAT DATA STOK RAK
              </a>
            </div>

            {/* Readout Metrics */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t lg:border-t-0 lg:border-l border-console-rule pt-4 lg:pt-0 lg:pl-8">
              <div>
                <div className="font-heading font-bold text-xl sm:text-2xl text-console-textPrimary">24-48 JAM</div>
                <div className="font-mono text-[10px] text-console-textMuted uppercase tracking-wider">
                  LEAD TIME BORDIR
                </div>
              </div>
              <div>
                <div className="font-heading font-bold text-xl sm:text-2xl text-console-gold">100%</div>
                <div className="font-mono text-[10px] text-console-textMuted uppercase tracking-wider">
                  AKURASI BENANG
                </div>
              </div>
              <div>
                <div className="font-heading font-bold text-xl sm:text-2xl text-console-green">RAK A-G</div>
                <div className="font-mono text-[10px] text-console-textMuted uppercase tracking-wider">
                  LOKASI RAK FISIK
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATUS KETERSEDIAAN RAK TOKO (OPERATIONAL LEDGER) ─── */}
        <section id="katalog" className="space-y-6 pt-4">
          {isDemo && <DemoBanner />}

          {/* Section Header */}
          <div className="border-b border-console-rule pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-console-gold tracking-widest uppercase">
                LEDGER // 01 // FISIK ETALASE
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-console-textPrimary tracking-tight uppercase mt-0.5">
                STATUS KETERSEDIAAN RAK TOKO
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-console-textMuted hidden sm:inline">
                TOTAL {filteredProducts.length} ITEM // TERVERIFIKASI RAK FISIK
              </span>

              {/* View Switcher */}
              <div className="flex border border-console-rule bg-console-surface p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 transition-colors ${
                    viewMode === "table" ? "bg-console-elevated text-console-gold" : "text-console-textMuted hover:text-white"
                  }`}
                  title="Tampilan Tabel Ledger"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${
                    viewMode === "grid" ? "bg-console-elevated text-console-gold" : "text-console-textMuted hover:text-white"
                  }`}
                  title="Tampilan Pelat Spesimen"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar & Search Strip */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_TABS.map((tab) => {
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`font-mono text-xs px-3.5 py-2 whitespace-nowrap transition-colors uppercase border ${
                      isSelected
                        ? "bg-console-surface border-console-gold text-console-gold font-bold"
                        : "border-console-rule text-console-textSecondary hover:text-white hover:border-console-textSecondary"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Technical Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-console-textMuted" />
              <input
                type="text"
                placeholder="CARI NAMA ATAU KODE RAK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-console-surface border border-console-rule focus:border-console-gold pl-9 pr-3 py-2 text-xs font-mono text-console-textPrimary placeholder:text-console-textMuted focus:outline-none tracking-wider uppercase"
              />
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="border border-console-rule bg-console-surface p-12 text-center font-mono text-xs text-console-textSecondary">
              MEMUAT DATA INVENTARIS TOKO...
            </div>
          ) : loadError ? (
            <ErrorBanner message={loadError} />
          ) : filteredProducts.length === 0 ? (
            <div className="border border-console-rule bg-console-surface p-12 text-center space-y-2 font-mono text-xs">
              <div className="text-console-gold font-bold uppercase">TIDAK ADA DATA DITEMUKAN</div>
              <div className="text-console-textMuted">
                Kata kunci &quot;{searchQuery}&quot; tidak cocok dengan daftar stok fisik.
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-2 text-console-gold hover:underline font-bold"
              >
                RESET PENCARIAN
              </button>
            </div>
          ) : viewMode === "table" ? (
            /* ─── DRAFTING LEDGER TABLE (Mode 1: Presisi & Terstruktur) ─── */
            <div className="border border-console-rule bg-console-surface overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-console-rule bg-console-elevated font-mono text-[11px] text-console-textSecondary uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">KODE &amp; NAMA BARANG</th>
                    <th className="py-3 px-4 font-semibold">KATEGORI DINAS</th>
                    <th className="py-3 px-4 font-semibold">LOKASI RAK FISIK</th>
                    <th className="py-3 px-4 font-semibold">HARGA SATUAN</th>
                    <th className="py-3 px-4 font-semibold">STATUS / KETERSEDIAAN</th>
                    <th className="py-3 px-4 font-semibold text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-console-rule font-mono text-xs">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-console-elevated/60 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-heading font-semibold text-sm sm:text-base text-console-textPrimary group-hover:text-console-gold transition-colors">
                        {product.name}
                      </td>
                      <td className="py-3.5 px-4 text-console-textSecondary uppercase text-[11px]">
                        {product.category}
                      </td>
                      <td className="py-3.5 px-4 text-console-gold font-medium">
                        {product.rackLocation}
                      </td>
                      <td className="py-3.5 px-4 font-heading font-bold text-base text-console-textPrimary">
                        {formatRupiah(product.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        {product.status === "TERSEDIA" && (
                          <span className="inline-flex items-center gap-1.5 text-console-green font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-console-green" />
                            TERSEDIA ({product.stock} PCS)
                          </span>
                        )}
                        {product.status === "HABIS" && (
                          <span className="inline-flex items-center gap-1.5 text-console-red font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-console-red" />
                            KOSONG DI RAK
                          </span>
                        )}
                        {product.status === "CUSTOM" && (
                          <span className="inline-flex items-center gap-1.5 text-console-gold font-medium">
                            <Clock className="w-3.5 h-3.5 text-console-gold" />
                            CUSTOM (1-2 HARI)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {product.status === "TERSEDIA" ? (
                          <a
                            href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20cek%20stok%20${encodeURIComponent(
                              product.name
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 border border-console-rule hover:border-console-gold text-console-textPrimary px-2.5 py-1 text-[11px] transition-colors"
                          >
                            <span>CEK WA</span>
                            <ArrowUpRight className="w-3 h-3 text-console-gold" />
                          </a>
                        ) : product.status === "CUSTOM" ? (
                          <Link
                            href="/pesan"
                            className="inline-flex items-center gap-1 bg-console-gold hover:bg-console-goldDark text-black font-heading font-bold px-3 py-1 text-xs uppercase tracking-wider transition-colors"
                          >
                            <span>PESAN</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-console-textMuted text-[11px]">PRE-ORDER</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* ─── SPECIMEN PLATE GRID (Mode 2: Foto Dokumen Fisik Teratur) ─── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-console-rule bg-console-surface flex flex-col justify-between hover:border-console-textSecondary transition-colors"
                >
                  <div>
                    {/* Specimen Photo Frame */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-console-ground border-b border-console-rule">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300 opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-console-textMuted uppercase">
                          NO SPECIMEN IMAGE
                        </div>
                      )}
                      <div className="absolute top-2 left-2 font-mono text-[10px] bg-console-ground/90 border border-console-rule text-console-gold px-2 py-0.5 uppercase tracking-wider">
                        {product.category}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-4 space-y-3 font-mono">
                      <h3 className="font-heading font-bold text-base text-console-textPrimary leading-snug">
                        {product.name}
                      </h3>

                      <div className="text-xs text-console-textSecondary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-console-gold shrink-0" />
                        <span>{product.rackLocation}</span>
                      </div>

                      <div className="pt-2 border-t border-console-rule flex items-baseline justify-between">
                        <span className="font-heading font-bold text-lg text-console-textPrimary">
                          {formatRupiah(product.price)}
                        </span>
                        <span className="text-[11px] text-console-green">
                          {product.status === "TERSEDIA" ? `STOK: ${product.stock}` : product.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0">
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20apakah%20${encodeURIComponent(
                        product.name
                      )}%20masih%20tersedia?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-console-rule hover:border-console-gold text-console-textPrimary py-2 text-xs font-mono tracking-wider uppercase text-center block transition-colors"
                    >
                      VERIFIKASI RAK VIA WA
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── DRAFTING TITLE BLOCK (Spesifikasi Operasional Mesin) ─── */}
        <section className="border border-console-rule bg-console-surface p-6 sm:p-10 space-y-6">
          <div className="border-b border-console-rule pb-3 flex items-center justify-between font-mono text-xs">
            <span className="text-console-gold uppercase">SPEC // BORDIR KOMPUTER TIMBUL</span>
            <span className="text-console-textMuted">TOLERANSI PRESISI ±0.5 MM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="space-y-2">
              <div className="font-heading font-bold text-base text-console-textPrimary uppercase">
                01. DENSITAS BENANG TINGGI
              </div>
              <p className="text-console-textSecondary leading-relaxed">
                Menggunakan benang bordir poliester grade militer tahan cuaca panas dan pencucian berulang, tidak mudah
                pudar dan tidak berserabut.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-heading font-bold text-base text-console-textPrimary uppercase">
                02. TIMBUL &amp; TEGAP PRESISI
              </div>
              <p className="text-console-textSecondary leading-relaxed">
                Lapisan spon khusus di bawah bordir timbul untuk memastikan pangkat perwira/bintara dan nama dada tetap
                tegap sesuai regulasi mabes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-heading font-bold text-base text-console-textPrimary uppercase">
                03. PENGAMBILAN LANGSUNG
              </div>
              <p className="text-console-textSecondary leading-relaxed">
                Setelah tiket berstatus SIAP DIAMBIL, bawa nomor tiket Anda langsung ke kasir toko Jl. Gaperta Medan
                tanpa menunggu antrean panjang.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER (Drafting Sheet Title Block) ─── */}
      <footer className="w-full border-t border-console-rule bg-console-ground mt-16 font-mono text-xs text-console-textSecondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-console-rule pb-6">
            <div>
              <div className="font-heading font-bold text-lg text-console-textPrimary uppercase tracking-wider">
                TOKO GAPERTA MEDAN
              </div>
              <div className="text-[11px] text-console-textMuted mt-0.5">
                JL. GAPERTA NO. 12, KEC. MEDAN HELVETIA, KOTA MEDAN — SUMATERA UTARA
              </div>
            </div>

            <div className="text-[11px] text-console-textMuted">
              JAM BUKA TOKO: SENIN – SABTU // 08:00 – 20:00 WIB
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-console-textMuted">
            <div>© 2026 TOKO GAPERTA. SISTEM INFORMASI ATRIBUT DINAS &amp; BORDIR.</div>
            <div>DOKUMEN OPERASIONAL TEKNIS // VERSI 2.0</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
