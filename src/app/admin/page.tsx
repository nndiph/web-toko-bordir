"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  LogOut,
  Package,
  RefreshCw,
  Search,
  Shield,
} from "lucide-react";
import { AdminLogin } from "@/components/AdminLogin";
import { OrderRow } from "@/components/admin/OrderRow";
import { PipelineBar, type PipelineStage } from "@/components/admin/PipelineBar";
import { RestockPanel } from "@/components/admin/RestockPanel";
import { StockRow } from "@/components/admin/StockRow";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { getDemoOrders } from "@/lib/demo-data";
import {
  getAdminAccess,
  getAdminOrders,
  updateOrderStatus as saveOrderStatus,
} from "@/lib/data/orders";
import { adjustStock, getProducts } from "@/lib/data/products";
import { supabase } from "@/lib/supabase";
import { daysSince } from "@/lib/utils";
import type { CustomOrder, OrderStatus, Product } from "@/types";

/** Batas hari sebelum pesanan belum selesai dianggap terlewat (Alert Kartu Merah). */
const OVERDUE_DAYS = 3;
/** Stok di bawah angka ini dianggap menipis. */
const LOW_STOCK = 5;

type Gate = "checking" | "login" | "ready";
type Tab = "antrean" | "stok";
type OrderFilter = "ALL" | "OVERDUE" | PipelineStage | "COMPLETED";

export default function AdminDashboardPage() {
  const [gate, setGate] = useState<Gate>("checking");
  const [loginNotice, setLoginNotice] = useState<string | undefined>();
  const [isDemo, setIsDemo] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>("antrean");
  const [cashierSearch, setCashierSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("ALL");

  const loadDashboard = useCallback(async () => {
    setLoadError(null);
    setActionError(null);

    const access = await getAdminAccess();
    if (!access.live) {
      if (access.reason === "not-configured" || access.reason === "offline") {
        const products = await getProducts();
        setInventory(products.data);
        setOrders(getDemoOrders());
        setIsDemo(true);
        setGate("ready");
        if (access.reason === "offline") {
          setLoadError("Database lokal/cloud tidak dapat dijangkau (offline). Beralih ke data contoh (Demo Mode).");
        }
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
      // Jika terjadi error saat memuat live orders
      const products = await getProducts();
      setInventory(products.data);
      setOrders(getDemoOrders());
      setIsDemo(true);
      setLoadError(
        err instanceof Error
          ? `${err.message} — Menggunakan data contoh sementara.`
          : "Gagal memuat data dashboard. Menggunakan data contoh sementara."
      );
    }
    setGate("ready");
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setInventory([]);
    setOrders([]);
    setLoginNotice(undefined);
    setGate("login");
  };

  // ─── Ringkasan angka ───
  const isOverdue = (o: CustomOrder) => o.status !== "COMPLETED" && daysSince(o.createdAt) >= OVERDUE_DAYS;
  const overdueOrders = orders.filter(isOverdue);
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const activeOrders = orders.filter((o) => o.status !== "COMPLETED");
  const stageCounts: Record<PipelineStage, number> = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    IN_PROGRESS: orders.filter((o) => o.status === "IN_PROGRESS").length,
    READY: orders.filter((o) => o.status === "READY").length,
  };
  // Produk CUSTOM dibuat sesuai pesanan, jadi stoknya tidak relevan untuk restock.
  const restockItems = inventory
    .filter((p) => p.status !== "CUSTOM" && p.stock < LOW_STOCK)
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));

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

  // ─── Filter & urutan ───
  const filteredInventory = inventory.filter((item) => {
    const q = cashierSearch.trim().toLowerCase();
    return (
      q === "" ||
      item.name.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q) ||
      item.rackLocation.toLowerCase().includes(q)
    );
  });

  const filteredOrders = orders
    .filter((order) => {
      if (orderFilter === "OVERDUE") return isOverdue(order);
      if (orderFilter === "PENDING" || orderFilter === "IN_PROGRESS" || orderFilter === "READY") {
        return order.status === orderFilter;
      }
      if (orderFilter === "COMPLETED") return order.status === "COMPLETED";
      // "Semua aktif" = antrean yang belum diambil.
      return order.status !== "COMPLETED";
    })
    .sort((a, b) => {
      // Terlewat dulu, lalu yang masih perlu mesin, lalu yang tinggal diserahkan. Paling lama di atas.
      const rank = (o: CustomOrder) =>
        o.status === "COMPLETED" ? 3 : isOverdue(o) ? 0 : o.status === "READY" ? 2 : 1;
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      const byAge = Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return orderFilter === "COMPLETED" ? -byAge : byAge;
    });

  const selectStage = (stage: PipelineStage) => setOrderFilter((f) => (f === stage ? "ALL" : stage));

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

  const tabClass = (active: boolean) =>
    `relative inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
      active ? "border-army text-army" : "border-transparent text-gray-500 hover:text-gray-900"
    }`;

  const chipClass = (active: boolean, tone: "neutral" | "danger") =>
    `rounded-full px-3 py-1 text-xs font-bold border transition-colors ${
      active
        ? tone === "danger"
          ? "bg-rose-600 border-rose-600 text-white"
          : "bg-army border-army text-white"
        : tone === "danger"
        ? "bg-white border-rose-200 text-rose-700 hover:bg-rose-50"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* ─── Header ─── */}
      <header className="bg-army-dark text-white border-b border-army sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-army rounded-lg flex items-center justify-center border border-white/20 shrink-0">
              <Shield className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight truncate">Panel Pemilik · Toko Gaperta</h1>
              <p className="hidden sm:block text-xs text-gray-300">Antrean bordir dan stok toko</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isDemo && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-60 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-white/20"
                title="Muat ulang data (pesanan baru dari pelanggan)"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Muat ulang</span>
              </button>
            )}
            {!isDemo && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-white/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-white/20"
            >
              <span className="hidden sm:inline">Katalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ─── Tab ─── */}
        <div className="bg-white border-b border-gray-200 text-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "antrean"}
              onClick={() => setTab("antrean")}
              className={tabClass(tab === "antrean")}
            >
              <ClipboardList className="w-4 h-4" />
              Antrean Bordir
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-700 tabular-nums">
                {activeOrders.length}
              </span>
              {overdueOrders.length > 0 && (
                <span
                  className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white tabular-nums"
                  title={`${overdueOrders.length} pesanan terlewat`}
                >
                  {overdueOrders.length} terlewat
                </span>
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "stok"}
              onClick={() => setTab("stok")}
              className={tabClass(tab === "stok")}
            >
              <Package className="w-4 h-4" />
              Stok &amp; Kasir
              {restockItems.length > 0 && (
                <span
                  className="rounded-full bg-amber-600 px-2 py-0.5 text-[11px] font-bold text-white tabular-nums"
                  title={`${restockItems.length} barang perlu restock`}
                >
                  {restockItems.length} restock
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5 w-full">
        {isDemo && (
          <DemoBanner>
            Perubahan stok dan status di panel ini hanya contoh dan hilang saat halaman dimuat ulang.
          </DemoBanner>
        )}
        {loadError && <ErrorBanner message={loadError} />}
        {actionError && <ErrorBanner message={actionError} />}

        {tab === "antrean" ? (
          <>
            {/* 1. Yang paling mendesak */}
            {overdueOrders.length > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-rose-600" />
                  <div>
                    <p className="text-sm font-bold text-rose-950">
                      {overdueOrders.length} pesanan sudah lewat {OVERDUE_DAYS} hari
                    </p>
                    <p className="text-xs text-rose-800">Dahulukan di mesin agar pelanggan tidak menunggu lebih lama.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderFilter((f) => (f === "OVERDUE" ? "ALL" : "OVERDUE"))}
                  className="shrink-0 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  {orderFilter === "OVERDUE" ? "Tampilkan semua antrean" : "Tampilkan yang terlewat"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tidak ada pesanan yang tertahan lebih dari {OVERDUE_DAYS} hari.
              </div>
            )}

            {/* 2. Gambaran alur */}
            <PipelineBar counts={stageCounts} selected={orderFilter} onSelect={selectStage} />

            {/* 3. Daftar */}
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setOrderFilter("ALL")} className={chipClass(orderFilter === "ALL", "neutral")}>
                    Semua aktif ({activeOrders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter("OVERDUE")}
                    className={chipClass(orderFilter === "OVERDUE", "danger")}
                  >
                    Terlewat ({overdueOrders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter("COMPLETED")}
                    className={chipClass(orderFilter === "COMPLETED", "neutral")}
                  >
                    Sudah diambil ({completedOrders.length})
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {orderFilter === "COMPLETED" ? "Terbaru di atas" : "Terlewat dan paling lama di atas"}
                </p>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                  {orders.length === 0
                    ? "Belum ada pesanan masuk."
                    : "Tidak ada pesanan pada filter ini."}
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {filteredOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      overdue={isOverdue(order)}
                      days={daysSince(order.createdAt)}
                      overdueDays={OVERDUE_DAYS}
                      busy={busyId === order.id}
                      onAdvance={(status) => updateOrderStatus(order.id, status)}
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
            {/* Kasir Quick-Check */}
            <section className="space-y-3 min-w-0 lg:order-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  autoFocus
                  aria-label="Cari barang, kategori, atau rak"
                  placeholder="Cari barang, kategori, atau rak (mis: Kopel, Baret, A-02)..."
                  value={cashierSearch}
                  onChange={(e) => setCashierSearch(e.target.value)}
                  className="w-full bg-white border border-gray-300 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
                />
              </div>

              <p className="text-xs text-gray-500">
                {filteredInventory.length} dari {inventory.length} barang
                {cashierSearch.trim() && " cocok dengan pencarian"}
              </p>

              {filteredInventory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                  Tidak ada barang yang cocok dengan &quot;{cashierSearch}&quot;.
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredInventory.map((item) => (
                    <StockRow
                      key={item.id}
                      item={item}
                      busy={busyId === item.id}
                      onAdjust={(delta) => updateStock(item.id, delta)}
                    />
                  ))}
                </ul>
              )}
            </section>

            <div className="lg:order-2">
              <RestockPanel items={restockItems} onPick={setCashierSearch} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-5 text-center text-xs text-gray-500">
        <p>© 2026 Toko Gaperta — Panel Kontrol Pemilik & Inventaris Toko Fisik.</p>
      </footer>
    </div>
  );
}
