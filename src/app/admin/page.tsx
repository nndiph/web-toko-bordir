"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  Package,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  ArrowUpRight,
  MapPin,
  Send,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Product, CustomOrder } from "@/types";

// ─── Data Awal Inventaris Toko ───
const INITIAL_INVENTORY: Product[] = [
  {
    id: "1",
    name: "Pangkat Bordir TNI AD - Serda (Timbul)",
    slug: "pangkat-serda-tni-ad",
    category: "Badge & Pangkat",
    price: 35000,
    stock: 24,
    status: "TERSEDIA",
    rackLocation: "Rak A-02 (Etalase Depan)",
  },
  {
    id: "2",
    name: "Kopel Rim Hitam Standard TNI",
    slug: "kopel-rim-hitam-tni",
    category: "Sabuk & Kopel",
    price: 75000,
    stock: 15,
    status: "TERSEDIA",
    rackLocation: "Rak B-01 (Aksesoris)",
  },
  {
    id: "3",
    name: "Seragam PDL Loreng Malvinas Size L",
    slug: "seragam-pdl-malvinas-l",
    category: "Seragam",
    price: 250000,
    stock: 0,
    status: "HABIS",
    rackLocation: "Gudang Belakang Toko",
  },
  {
    id: "4",
    name: "Baret Hijau Kostrad + Emblem",
    slug: "baret-hijau-kostrad",
    category: "Topi & Baret",
    price: 110000,
    stock: 3, // < 5 (Stok Menipis)
    status: "TERSEDIA",
    rackLocation: "Rak C-03 (Topi/Baret)",
  },
  {
    id: "5",
    name: "Sabuk Kopral Kepala Gesper Kuningan",
    slug: "sabuk-kopral-gesper-kuningan",
    category: "Sabuk & Kopel",
    price: 45000,
    stock: 4, // < 5 (Stok Menipis)
    status: "TERSEDIA",
    rackLocation: "Rak B-02 (Sisi Depan)",
  },
];

// ─── Data Awal Pesanan Bordir Masuk ───
interface AdminOrder extends CustomOrder {
  daysAgo: number; // untuk menghitung alert kartu merah > 3 hari
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "1",
    orderNumber: "GPT-20261101-038",
    customerName: "Lettu Danang",
    customerRank: "Yonif 100",
    whatsappNumber: "081198765432",
    orderType: "PANGKAT",
    quantity: 6,
    notes: "Pangkat PDU & PDL timbul tebal, dasar hijau TNI benang emas.",
    status: "PENDING",
    daysAgo: 5, // ⚠️ Alert kartu merah! (> 3 hari)
    createdAt: "5 hari yang lalu",
  },
  {
    id: "2",
    orderNumber: "GPT-20261101-040",
    customerName: "Kapten Suryo",
    customerRank: "Kodam I/BB",
    whatsappNumber: "081288990011",
    orderType: "LOKASI",
    quantity: 10,
    notes: "Bordir lokasi dinas timbul dasar loreng Malvinas.",
    status: "PENDING",
    daysAgo: 4, // ⚠️ Alert kartu merah! (> 3 hari)
    createdAt: "4 hari yang lalu",
  },
  {
    id: "3",
    orderNumber: "GPT-20261101-042",
    customerName: "Serka Bambang",
    customerRank: "Kopassus",
    whatsappNumber: "081234567890",
    orderType: "PANGKAT",
    quantity: 4,
    notes: "Benang hitam timbul tebal, dasar kain loreng Malvinas.",
    status: "IN_PROGRESS",
    daysAgo: 1,
    createdAt: "Kemarin, 14:20 WIB",
    estimatedDone: "Hari ini pukul 16:30 WIB",
  },
  {
    id: "4",
    orderNumber: "GPT-20261101-045",
    customerName: "Kopda Hendra",
    customerRank: "Kodam I/BB",
    whatsappNumber: "081311223344",
    orderType: "NAMA_DADA",
    quantity: 2,
    notes: "Tulisan 'HENDRA S.', kain hijau standar dinas.",
    status: "READY",
    daysAgo: 0,
    createdAt: "Hari ini, 09:00 WIB",
    estimatedDone: "Sudah selesai — Siap diambil di toko",
  },
];

export default function AdminDashboardPage() {
  const [inventory, setInventory] = useState<Product[]>(INITIAL_INVENTORY);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [cashierSearch, setCashierSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<"ALL" | "OVERDUE" | "PENDING" | "IN_PROGRESS" | "READY">("ALL");

  // ─── Kalkulasi KPI Stats ───
  const overdueOrders = orders.filter((o) => o.status !== "COMPLETED" && o.daysAgo >= 3);
  const lowStockProducts = inventory.filter((p) => p.stock > 0 && p.stock < 5);
  const inProgressOrders = orders.filter((o) => o.status === "IN_PROGRESS");
  const readyOrders = orders.filter((o) => o.status === "READY");

  // ─── Fungsi Kasir Cepat Tambah/Kurang Stok ───
  const updateStock = (productId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newStock = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: newStock,
            status: newStock === 0 ? "HABIS" : "TERSEDIA",
          };
        }
        return item;
      })
    );
  };

  // ─── Fungsi Ubah Status Pesanan ───
  const updateOrderStatus = (orderId: string, newStatus: AdminOrder["status"]) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            estimatedDone:
              newStatus === "READY"
                ? "Sudah selesai — Siap diambil di toko"
                : newStatus === "IN_PROGRESS"
                ? "Sedang dibordir di mesin"
                : order.estimatedDone,
          };
        }
        return order;
      })
    );
  };

  // ─── Filter Pencarian Kasir ───
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(cashierSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(cashierSearch.toLowerCase()) ||
    item.rackLocation.toLowerCase().includes(cashierSearch.toLowerCase())
  );

  // ─── Filter Pesanan ───
  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "OVERDUE") return order.status !== "COMPLETED" && order.daysAgo >= 3;
    if (orderFilter === "PENDING") return order.status === "PENDING";
    if (orderFilter === "IN_PROGRESS") return order.status === "IN_PROGRESS";
    if (orderFilter === "READY") return order.status === "READY";
    return true;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* ─── Header Admin Modern ─── */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-army rounded-xl flex items-center justify-center border border-white/10 shadow-xs">
              <Shield className="w-5 h-5 text-gold-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight">PANEL PEMILIK TOKO GAPERTA</h1>
                <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                  Sistem Kasir Aktif
                </span>
              </div>
              <p className="text-xs text-slate-400">Manajemen Antrean Mesin Bordir & Kontrol Stok Fisik</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-white/10"
            >
              <span>Katalog Publik</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* ─── 3 KPI Stats Cards ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Alert Kartu Merah (Masalah: Pesanan Terlewat > 3 Hari) */}
          <div
            className={`rounded-3xl p-6 border shadow-card flex flex-col justify-between transition-all ${
              overdueOrders.length > 0
                ? "bg-rose-50/70 border-rose-200 ring-2 ring-rose-500/20"
                : "bg-white border-surface-border"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 inline-flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                  PERHATIAN SEGERA (KARTU MERAH)
                </span>
                <span className="bg-rose-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  {overdueOrders.length} Pesanan
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-rose-950">
                {overdueOrders.length > 0 ? "Pesanan Belum Selesai > 3 Hari!" : "Semua Pesanan Tepat Waktu"}
              </h3>
              <p className="text-xs text-rose-800/90 leading-relaxed">
                {overdueOrders.length > 0
                  ? "Ada pesanan bordir yang terselip/terlewat. Segera dahulukan di mesin bordir agar customer tidak komplain!"
                  : "Bagus! Tidak ada pesanan bordir yang tertahan lebih dari 3 hari."}
              </p>
            </div>

            {overdueOrders.length > 0 && (
              <button
                type="button"
                onClick={() => setOrderFilter("OVERDUE")}
                className="mt-4 w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
              >
                Tampilkan Pesanan Terlewat
              </button>
            )}
          </div>

          {/* Card 2: Pesanan Bordir Aktif */}
          <div className="bg-white border border-surface-border rounded-3xl p-6 shadow-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-army" />
                  STATUS ANTREAN MESIN
                </span>
                <span className="bg-army/10 text-army text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {orders.length} Total
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-ink">{inProgressOrders.length} Sedang Dibordir</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {readyOrders.length} pesanan siap diambil di toko • {orders.filter((o) => o.status === "PENDING").length} menunggu bahan.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-ink-muted">
              <span>Etalase Pick-up Toko:</span>
              <strong className="text-emerald-700 font-bold">{readyOrders.length} Barang Siap Serah</strong>
            </div>
          </div>

          {/* Card 3: Alert Stok Menipis (Masalah: Stok Habis saat Customer Datang) */}
          <div
            className={`rounded-3xl p-6 border shadow-card flex flex-col justify-between ${
              lowStockProducts.length > 0
                ? "bg-amber-50/70 border-amber-200 ring-2 ring-amber-500/20"
                : "bg-white border-surface-border"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 inline-flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-700" />
                  KONTROL INVENTARIS
                </span>
                <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {lowStockProducts.length} Menipis
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-amber-950">
                {lowStockProducts.length} Barang Stok &lt; 5 Pcs
              </h3>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Stok barang ini hampir habis di toko fisik. Segera restock sebelum pembeli datang mencari.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 text-xs text-amber-900 font-medium truncate">
              {lowStockProducts.map((p) => p.name).join(", ")}
            </div>
          </div>
        </section>

        {/* ─── Fitur Kasir Quick-Check (Cari Stok & Lokasi Rak Kilat) ─── */}
        <section className="bg-white border border-surface-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-army uppercase tracking-wider">
                <Search className="w-3.5 h-3.5" />
                Fitur Kasir Quick-Check
              </div>
              <h2 className="text-xl font-extrabold text-ink tracking-tight mt-0.5">
                Cari Sisa Stok & Letak Rak Barang
              </h2>
              <p className="text-xs text-ink-muted">
                Saat pembeli datang menanyakan barang, ketik namanya di bawah untuk langsung tahu sisa stok dan letak rak fisiknya.
              </p>
            </div>

            {/* Kolom Pencarian Cepat */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-soft" />
              <input
                type="text"
                placeholder="Ketik nama barang (Kopel, Baret, Pangkat)..."
                value={cashierSearch}
                onChange={(e) => setCashierSearch(e.target.value)}
                className="w-full bg-slate-50 border border-surface-border pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
              />
            </div>
          </div>

          {/* Grid Hasil Kasir Quick-Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="border border-surface-border rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-ink-muted uppercase">{item.category}</span>
                    {item.stock > 0 ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                        Sisa: {item.stock} pcs
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                        HABIS
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-ink mt-1.5 line-clamp-1">{item.name}</h4>
                  <p className="text-base font-extrabold text-ink tabular-nums">{formatRupiah(item.price)}</p>
                </div>

                {/* Lokasi Rak Fisik di Toko */}
                <div className="bg-white border border-surface-border rounded-xl p-2.5 flex items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center gap-1.5 text-ink font-semibold">
                    <MapPin className="w-4 h-4 text-army shrink-0" />
                    <span>{item.rackLocation}</span>
                  </div>

                  {/* Tombol Cepat Tambah/Kurang Stok di Kasir */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-surface-border px-1.5 py-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, -1)}
                      className="p-1 hover:bg-white rounded text-ink-muted hover:text-rose-600 transition-colors"
                      title="Kurang 1 stok (terjual)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs px-1 text-ink tabular-nums">{item.stock}</span>
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, 1)}
                      className="p-1 hover:bg-white rounded text-ink-muted hover:text-emerald-700 transition-colors"
                      title="Tambah 1 stok (restock)"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Manajemen Antrean Pesanan Bordir ─── */}
        <section className="bg-white border border-surface-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-army uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Antrean Mesin Bordir Komputer
              </div>
              <h2 className="text-xl font-extrabold text-ink tracking-tight mt-0.5">
                Kelola Status Pesanan Masuk
              </h2>
              <p className="text-xs text-ink-muted">
                Ubah status pengerjaan pesanan agar langsung sinkron di halaman tracking pembeli.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOrderFilter("ALL")}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                  orderFilter === "ALL"
                    ? "bg-army text-white shadow-xs"
                    : "bg-white text-ink-body hover:bg-surface-muted border border-surface-border"
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("OVERDUE")}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                  orderFilter === "OVERDUE"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                🔴 Terlewat ({overdueOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("IN_PROGRESS")}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                  orderFilter === "IN_PROGRESS"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                🟡 Sedang Dibordir ({inProgressOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("READY")}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                  orderFilter === "READY"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                🟢 Siap Diambil ({readyOrders.length})
              </button>
            </div>
          </div>

          {/* Tabel Pesanan Modern */}
          <div className="overflow-x-auto rounded-2xl border border-surface-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-border text-ink-muted uppercase tracking-wider bg-slate-50/80">
                  <th className="py-3.5 px-4 font-bold">Tiket & Waktu Masuk</th>
                  <th className="py-3.5 px-4 font-bold">Pemesan & WhatsApp</th>
                  <th className="py-3.5 px-4 font-bold">Jenis & Jumlah</th>
                  <th className="py-3.5 px-4 font-bold">Catatan Bahan/Benang</th>
                  <th className="py-3.5 px-4 font-bold">Status Saat Ini</th>
                  <th className="py-3.5 px-4 font-bold text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredOrders.map((order) => {
                  const isOverdue = order.status !== "COMPLETED" && order.daysAgo >= 3;

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isOverdue ? "bg-rose-50/40" : "bg-white"
                      }`}
                    >
                      {/* Kolom Tiket */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-army block">{order.orderNumber}</span>
                        <span className="text-[11px] text-ink-muted">{order.createdAt}</span>
                        {isOverdue && (
                          <span className="inline-block mt-1 bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                            TERLEWAT {order.daysAgo} HARI!
                          </span>
                        )}
                      </td>

                      {/* Kolom Pemesan */}
                      <td className="py-3.5 px-4">
                        <strong className="text-ink block">
                          {order.customerName} {order.customerRank && `(${order.customerRank})`}
                        </strong>
                        <a
                          href={`https://wa.me/62${order.whatsappNumber.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-army hover:underline mt-0.5 font-medium"
                        >
                          <Send className="w-3 h-3" />
                          <span>{order.whatsappNumber}</span>
                        </a>
                      </td>

                      {/* Kolom Jenis & Qty */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-ink block">{order.orderType}</span>
                        <span className="text-ink-muted">{order.quantity} Pcs/Pasang</span>
                      </td>

                      {/* Kolom Catatan */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-ink-body text-xs line-clamp-2">{order.notes}</p>
                      </td>

                      {/* Kolom Status Badge */}
                      <td className="py-3.5 px-4">
                        {order.status === "PENDING" && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200/80 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Antre Bahan
                          </span>
                        )}
                        {order.status === "IN_PROGRESS" && (
                          <span className="bg-blue-50 text-blue-800 border border-blue-200/80 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                            Sedang Dibordir
                          </span>
                        )}
                        {order.status === "READY" && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Siap Diambil
                          </span>
                        )}
                      </td>

                      {/* Kolom Tombol Aksi Cepat */}
                      <td className="py-3.5 px-4 text-right">
                        {order.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "IN_PROGRESS")}
                            className="bg-army hover:bg-army-dark active:scale-[0.98] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs"
                          >
                            Mulai Bordir
                          </button>
                        )}
                        {order.status === "IN_PROGRESS" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "READY")}
                            className="bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs"
                          >
                            Tandai Siap Diambil
                          </button>
                        )}
                        {order.status === "READY" && (
                          <a
                            href={`https://wa.me/62${order.whatsappNumber.replace(
                              /^0/,
                              ""
                            )}?text=Halo%20Bpk/Ibu%20${encodeURIComponent(
                              order.customerName
                            )},%20pesanan%20custom%20bordir%20Anda%20dengan%20tiket%20${
                              order.orderNumber
                            }%20sudah%20selesai%20dan%20siap%20diambil%20di%20Toko%20Gaperta.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim WA Selesai</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-border py-6 text-center text-xs text-ink-muted">
        <p>© 2026 Toko Gaperta — Panel Kontrol Pemilik & Inventaris Toko Fisik.</p>
      </footer>
    </div>
  );
}
