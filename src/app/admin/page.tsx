"use client";

import { useCallback, useEffect, useState } from "react";
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
  LogOut,
} from "lucide-react";
import { AdminLogin } from "@/components/AdminLogin";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { getDemoOrders } from "@/lib/demo-data";
import {
  getAdminAccess,
  getAdminOrders,
  updateOrderStatus as saveOrderStatus,
} from "@/lib/data/orders";
import { adjustStock, getProducts } from "@/lib/data/products";
import { supabase } from "@/lib/supabase";
import { daysSince, formatOrderDate, formatRupiah } from "@/lib/utils";
import type { CustomOrder, OrderStatus, Product } from "@/types";

/** Batas hari sebelum pesanan belum selesai dianggap terlewat (Alert Kartu Merah). */
const OVERDUE_DAYS = 3;

type Gate = "checking" | "login" | "ready";

export default function AdminDashboardPage() {
  const [gate, setGate] = useState<Gate>("checking");
  const [loginNotice, setLoginNotice] = useState<string | undefined>();
  const [isDemo, setIsDemo] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [cashierSearch, setCashierSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<"ALL" | "OVERDUE" | "PENDING" | "IN_PROGRESS" | "READY" | "COMPLETED">("ALL");

  const loadDashboard = useCallback(async () => {
    setLoadError(null);
    setActionError(null);

    const access = await getAdminAccess();
    if (!access.live) {
      if (access.reason === "not-configured") {
        const products = await getProducts();
        setInventory(products.data);
        setOrders(getDemoOrders());
        setIsDemo(true);
        setGate("ready");
        return;
      }
      setLoginNotice(
        access.reason === "not-admin"
          ? "Akun ini bukan admin toko. Masuk dengan akun admin."
          : undefined
      );
      setGate("login");
      return;
    }

    try {
      const [products, adminOrders] = await Promise.all([getProducts(), getAdminOrders()]);
      setInventory(products.data);
      setOrders(adminOrders);
      setIsDemo(false);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
    }
    setGate("ready");
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setInventory([]);
    setOrders([]);
    setLoginNotice(undefined);
    setGate("login");
  };

  // ─── Kalkulasi KPI Stats ───
  const isOverdue = (o: CustomOrder) => o.status !== "COMPLETED" && daysSince(o.createdAt) >= OVERDUE_DAYS;
  const overdueOrders = orders.filter(isOverdue);
  const lowStockProducts = inventory.filter((p) => p.stock > 0 && p.stock < 5);
  const inProgressOrders = orders.filter((o) => o.status === "IN_PROGRESS");
  const readyOrders = orders.filter((o) => o.status === "READY");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  // ─── Fungsi Kasir Cepat Tambah/Kurang Stok ───
  const updateStock = async (productId: string, delta: number) => {
    setActionError(null);

    if (isDemo) {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id !== productId) return item;
          const newStock = Math.max(0, item.stock + delta);
          const syncsWithStock = item.status === "TERSEDIA" || item.status === "HABIS";
          return {
            ...item,
            stock: newStock,
            status: syncsWithStock ? (newStock === 0 ? "HABIS" : "TERSEDIA") : item.status,
          };
        })
      );
      return;
    }

    setBusyId(productId);
    try {
      // Stok & status dihitung atomik oleh database, UI memakai hasilnya.
      const updated = await adjustStock(productId, delta);
      setInventory((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, ...updated } : item))
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal mengubah stok.");
    } finally {
      setBusyId(null);
    }
  };

  // ─── Fungsi Ubah Status Pesanan ───
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const current = orders.find((o) => o.id === orderId);
    if (!current) return;

    setActionError(null);
    const estimatedDone =
      newStatus === "READY"
        ? "Sudah selesai — Siap diambil di toko"
        : newStatus === "IN_PROGRESS"
        ? "Sedang dibordir di mesin"
        : newStatus === "COMPLETED"
        ? "Sudah diambil pemesan"
        : current.estimatedDone;

    if (!isDemo) {
      setBusyId(orderId);
      try {
        await saveOrderStatus(orderId, newStatus, estimatedDone);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "Gagal mengubah status pesanan.");
        setBusyId(null);
        return;
      }
      setBusyId(null);
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus, estimatedDone } : order))
    );
  };

  // ─── Filter Pencarian Kasir ───
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(cashierSearch.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(cashierSearch.toLowerCase()) ||
    item.rackLocation.toLowerCase().includes(cashierSearch.toLowerCase())
  );

  // ─── Filter Pesanan ───
  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "OVERDUE") return isOverdue(order);
    if (orderFilter === "PENDING") return order.status === "PENDING";
    if (orderFilter === "IN_PROGRESS") return order.status === "IN_PROGRESS";
    if (orderFilter === "READY") return order.status === "READY";
    if (orderFilter === "COMPLETED") return order.status === "COMPLETED";
    // "Semua" = antrean aktif; pesanan yang sudah diambil dilihat lewat filter sendiri.
    return order.status !== "COMPLETED";
  });

  if (gate === "checking") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-sm text-gray-500 font-sans">
        Memeriksa akses...
      </div>
    );
  }

  if (gate === "login") {
    return <AdminLogin notice={loginNotice} onSuccess={loadDashboard} />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* ─── Header Admin ─── */}
      <header className="bg-army-dark text-white border-b border-army sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-army rounded-lg flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight">PANEL PEMILIK TOKO GAPERTA</h1>
                <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  KASIR AKTIF
                </span>
              </div>
              <p className="text-xs text-gray-300">Manajemen Antrean Bordir & Kontrol Stok Fisik</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isDemo && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors border border-white/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors border border-white/20"
            >
              <span>Katalog Publik</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {isDemo && <DemoBanner>Perubahan stok dan status di panel ini hanya contoh dan hilang saat halaman dimuat ulang.</DemoBanner>}
        {loadError && <ErrorBanner message={loadError} />}
        {actionError && <ErrorBanner message={actionError} />}

        {/* ─── 3 KPI Stats Cards ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Alert Kartu Merah (Masalah: Pesanan Terlewat > 3 Hari) */}
          <div
            className={`rounded-xl p-6 border shadow-xs flex flex-col justify-between transition-all ${
              overdueOrders.length > 0
                ? "bg-rose-50 border-rose-300"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 inline-flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  PERHATIAN SEGERA (KARTU MERAH)
                </span>
                <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {overdueOrders.length} Pesanan
                </span>
              </div>
              <h3 className="text-2xl font-bold text-rose-950">
                {overdueOrders.length > 0 ? "Pesanan Belum Selesai > 3 Hari!" : "Semua Pesanan Tepat Waktu"}
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed">
                {overdueOrders.length > 0
                  ? "Ada pesanan bordir yang terselip/terlewat. Segera dahulukan di mesin bordir agar customer tidak komplain!"
                  : "Bagus! Tidak ada pesanan bordir yang tertahan lebih dari 3 hari."}
              </p>
            </div>

            {overdueOrders.length > 0 && (
              <button
                type="button"
                onClick={() => setOrderFilter("OVERDUE")}
                className="mt-4 w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-xs"
              >
                Tampilkan Pesanan Terlewat
              </button>
            )}
          </div>

          {/* Card 2: Pesanan Bordir Aktif */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 inline-flex items-center gap-1">
                  <Clock className="w-4 h-4 text-army" />
                  STATUS ANTREAN MESIN
                </span>
                <span className="bg-army-light text-army text-xs font-bold px-2 py-0.5 rounded-full">
                  {orders.length} Total
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{inProgressOrders.length} Sedang Dibordir</h3>
              <p className="text-xs text-gray-500">
                {readyOrders.length} pesanan siap diambil di toko • {orders.filter((o) => o.status === "PENDING").length} menunggu bahan.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>Etalase Pick-up Toko:</span>
              <strong className="text-emerald-700 font-bold">{readyOrders.length} Barang Siap Serah</strong>
            </div>
          </div>

          {/* Card 3: Alert Stok Menipis (Masalah: Stok Habis saat Customer Datang) */}
          <div
            className={`rounded-xl p-6 border shadow-xs flex flex-col justify-between ${
              lowStockProducts.length > 0
                ? "bg-amber-50 border-amber-300"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 inline-flex items-center gap-1">
                  <Package className="w-4 h-4 text-amber-700" />
                  KONTROL INVENTARIS
                </span>
                <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {lowStockProducts.length} Menipis
                </span>
              </div>
              <h3 className="text-2xl font-bold text-amber-950">
                {lowStockProducts.length} Barang Stok &lt; 5 Pcs
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Stok barang ini hampir habis di toko fisik. Segera pesan kembali sebelum customer datang mencari.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-amber-900 font-medium truncate">
              {lowStockProducts.map((p) => p.name).join(", ")}
            </div>
          </div>
        </section>

        {/* ─── Fitur Kasir Quick-Check (Cari Stok & Lokasi Rak Kilat) ─── */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-army uppercase tracking-wider">
                <Search className="w-3.5 h-3.5" />
                Fitur Kasir Quick-Check
              </div>
              <h2 className="text-xl font-bold text-gray-900">Cari Sisa Stok & Letak Rak Barang</h2>
              <p className="text-xs text-gray-500">
                Saat pembeli datang menanyakan barang, ketik namanya di bawah untuk langsung tahu sisa stok dan posisi raknya di toko.
              </p>
            </div>

            {/* Kolom Pencarian Cepat */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Ketik nama barang (mis: Kopel, Baret)..."
                value={cashierSearch}
                onChange={(e) => setCashierSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Grid Hasil Kasir Quick-Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-white transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">{item.categoryName}</span>
                    {item.stock > 0 ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                        Sisa: {item.stock} pcs
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded">
                        HABIS
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mt-1 line-clamp-1">{item.name}</h4>
                  <p className="text-sm font-bold text-army">{formatRupiah(item.price)}</p>
                </div>

                {/* Lokasi Rak Fisik di Toko */}
                <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-800">
                    <MapPin className="w-4 h-4 text-army shrink-0" />
                    <span className="font-semibold">{item.rackLocation}</span>
                  </div>

                  {/* Tombol Cepat Tambah/Kurang Stok di Kasir */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, -1)}
                      disabled={busyId === item.id}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-rose-600 transition-colors disabled:opacity-40"
                      title="Kurang 1 stok (terjual)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs px-1 text-gray-900 tabular-nums">{item.stock}</span>
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, 1)}
                      disabled={busyId === item.id}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-40"
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
        <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-army uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Antrean Mesin Bordir Komputer
              </div>
              <h2 className="text-xl font-bold text-gray-900">Kelola Status Pesanan Masuk</h2>
              <p className="text-xs text-gray-500">
                Ubah status pesanan agar otomatis terbarui di halaman tracking yang dipantau pelanggan/bawahan.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOrderFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === "ALL"
                    ? "bg-army text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("OVERDUE")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === "OVERDUE"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                🔴 Terlewat ({overdueOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("IN_PROGRESS")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === "IN_PROGRESS"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                🟡 Sedang Dibordir ({inProgressOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("READY")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === "READY"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                🟢 Siap Diambil ({readyOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("COMPLETED")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  orderFilter === "COMPLETED"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                ✔ Sudah Diambil ({completedOrders.length})
              </button>
            </div>
          </div>

          {/* Tabel Pesanan */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="py-3 px-4 font-bold">Tiket & Waktu Masuk</th>
                  <th className="py-3 px-4 font-bold">Pemesan & WhatsApp</th>
                  <th className="py-3 px-4 font-bold">Jenis & Jumlah</th>
                  <th className="py-3 px-4 font-bold">Catatan Bahan/Benang</th>
                  <th className="py-3 px-4 font-bold">Status Saat Ini</th>
                  <th className="py-3 px-4 font-bold text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const overdue = isOverdue(order);
                  const daysLate = daysSince(order.createdAt);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        overdue ? "bg-rose-50/50" : "bg-white"
                      }`}
                    >
                      {/* Kolom Tiket */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-army block">{order.orderNumber}</span>
                        <span className="text-[11px] text-gray-500">{formatOrderDate(order.createdAt)}</span>
                        {overdue && (
                          <span className="inline-block mt-1 bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                            TERLEWAT {daysLate} HARI!
                          </span>
                        )}
                      </td>

                      {/* Kolom Pemesan */}
                      <td className="py-3 px-4">
                        <strong className="text-gray-900 block">
                          {order.customerName} {order.customerRank && `(${order.customerRank})`}
                        </strong>
                        <a
                          href={`https://wa.me/62${order.whatsappNumber.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-army hover:underline mt-0.5"
                        >
                          <Send className="w-3 h-3" />
                          <span>{order.whatsappNumber}</span>
                        </a>
                      </td>

                      {/* Kolom Jenis & Qty */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">{order.orderType}</span>
                        <span className="text-gray-500">{order.quantity} Pcs/Pasang</span>
                      </td>

                      {/* Kolom Catatan */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-gray-700 text-xs line-clamp-2">{order.notes}</p>
                      </td>

                      {/* Kolom Status Badge */}
                      <td className="py-3 px-4">
                        {order.status === "PENDING" && (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Antre Bahan
                          </span>
                        )}
                        {order.status === "IN_PROGRESS" && (
                          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Sedang Dibordir
                          </span>
                        )}
                        {order.status === "READY" && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Siap Diambil
                          </span>
                        )}
                        {order.status === "COMPLETED" && (
                          <span className="bg-gray-100 text-gray-700 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Sudah Diambil
                          </span>
                        )}
                      </td>

                      {/* Kolom Tombol Aksi Cepat */}
                      <td className="py-3 px-4 text-right">
                        {order.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "IN_PROGRESS")}
                            disabled={busyId === order.id}
                            className="bg-army hover:bg-army-dark disabled:opacity-60 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                          >
                            Mulai Bordir
                          </button>
                        )}
                        {order.status === "IN_PROGRESS" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "READY")}
                            disabled={busyId === order.id}
                            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                          >
                            Tandai Siap Diambil
                          </button>
                        )}
                        {order.status === "READY" && (
                          <div className="inline-flex items-center gap-2">
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
                            className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim WA Selesai</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Tandai pesanan ${order.orderNumber} sudah diambil pemesan?`)) {
                                updateOrderStatus(order.id, "COMPLETED");
                              }
                            }}
                            disabled={busyId === order.id}
                            className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-900 border border-gray-300 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                          >
                            <Package className="w-3 h-3" />
                            <span>Sudah Diambil</span>
                          </button>
                          </div>
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
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>© 2026 Toko Gaperta — Panel Kontrol Pemilik & Inventaris Toko Fisik.</p>
      </footer>
    </div>
  );
}
