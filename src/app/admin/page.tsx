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
import { getStoredOrders, setStoredOrders } from "@/lib/local-store";
import {
  getAdminAccess,
  getAdminOrders,
  updateOrderStatus as saveOrderStatus,
  updateDemoOrderStatus,
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

        // Ambil dari LocalStorage (termasuk pesanan yang dibuat pelanggan lewat /pesan)
        let loadedOrders = getStoredOrders();
        if (!loadedOrders || loadedOrders.length === 0) {
          loadedOrders = getDemoOrders();
          setStoredOrders(loadedOrders);
        }
        setOrders(loadedOrders);
        setIsDemo(true);
        setGate("ready");
        if (access.reason === "offline") {
          setLoadError(
            "Database Supabase offline. Beroperasi dalam Mode Demo tersimpan (LocalStorage aktif)."
          );
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
      const products = await getProducts();
      setInventory(products.data);
      const fallbackOrders = getStoredOrders() ?? getDemoOrders();
      setOrders(fallbackOrders);
      setIsDemo(true);
      setLoadError(
        err instanceof Error
          ? `${err.message} — Menggunakan data lokal tersimpan.`
          : "Gagal memuat data dashboard. Menggunakan data lokal tersimpan."
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
  const isOverdue = (o: CustomOrder) =>
    o.status !== "COMPLETED" && daysSince(o.createdAt) >= OVERDUE_DAYS;
  const overdueOrders = orders.filter(isOverdue);
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const activeOrders = orders.filter((o) => o.status !== "COMPLETED");
  const stageCounts: Record<PipelineStage, number> = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    IN_PROGRESS: orders.filter((o) => o.status === "IN_PROGRESS").length,
    READY: orders.filter((o) => o.status === "READY").length,
  };
  const restockItems = inventory
    .filter((p) => p.status !== "CUSTOM" && p.stock < LOW_STOCK)
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));

  // ─── Kasir Quick-Check: Tambah/Kurang Stok ───
  const updateStock = async (productId: string, delta: number) => {
    setActionError(null);
    setBusyId(productId);

    try {
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

  // ─── Ubah Status Pesanan ───
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

    setBusyId(orderId);
    try {
      if (isDemo) {
        updateDemoOrderStatus(orderId, newStatus, estimatedDone);
      } else {
        await saveOrderStatus(orderId, newStatus, estimatedDone);
      }
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, estimatedDone } : order
        )
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal mengubah status pesanan.");
    } finally {
      setBusyId(null);
    }
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
      return order.status !== "COMPLETED";
    })
    .sort((a, b) => {
      const rank = (o: CustomOrder) =>
        o.status === "COMPLETED" ? 3 : isOverdue(o) ? 0 : o.status === "READY" ? 2 : 1;
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      const byAge = Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return orderFilter === "COMPLETED" ? -byAge : byAge;
    });

  const selectStage = (stage: PipelineStage) =>
    setOrderFilter((f) => (f === stage ? "ALL" : stage));

  if (gate === "checking") {
    return (
      <div className="min-h-screen bg-slate-canvas flex items-center justify-center text-sm text-slate-muted font-sans">
        Memeriksa hak akses admin...
      </div>
    );
  }

  if (gate === "login") {
    return <AdminLogin notice={loginNotice} onSuccess={loadDashboard} />;
  }

  const tabClass = (active: boolean) =>
    `relative inline-flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
      active
        ? "border-brand text-brand"
        : "border-transparent text-slate-500 hover:text-slate-ink hover:border-slate-300"
    }`;

  const chipClass = (active: boolean, tone: "neutral" | "danger") =>
    `rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-colors ${
      active
        ? tone === "danger"
          ? "bg-red-600 border-red-600 text-white shadow-2xs"
          : "bg-brand border-brand text-white shadow-2xs"
        : tone === "danger"
        ? "bg-white border-red-200 text-red-700 hover:bg-red-50"
        : "bg-white border-slate-border text-slate-600 hover:bg-slate-50 hover:text-slate-ink"
    }`;

  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      {/* ─── Header Panel Pemilik Cerah ─── */}
      <header className="bg-white border-b border-slate-border sticky top-0 z-40 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-5 h-5 text-accent-gold" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-ink tracking-tight truncate">
                  Panel Pemilik · Toko Gaperta
                </h1>
                <span className="hidden sm:inline-block bg-amber-100 text-accent-gold text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                  ADMIN KASIR
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-muted">
                Antrean mesin bordir &amp; ketersediaan stok fisik rak Medan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors border border-slate-border"
              title="Muat ulang antrean pesanan & stok"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{refreshing ? "Memuat..." : "Sinkron Data"}</span>
            </button>

            {!isDemo && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-slate-border"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs"
            >
              <span className="hidden sm:inline">Lihat Etalase</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ─── Tab Navigasi Admin ─── */}
        <div className="bg-slate-50/50 border-t border-slate-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "antrean"}
              onClick={() => setTab("antrean")}
              className={tabClass(tab === "antrean")}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Antrean Mesin Bordir</span>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700 tabular-nums">
                {activeOrders.length}
              </span>
              {overdueOrders.length > 0 && (
                <span
                  className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white tabular-nums animate-pulse"
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
              <span>Kasir &amp; Stok Rak Fisik</span>
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

      {/* ─── Konten Utama ─── */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {isDemo && (
          <DemoBanner>
            Data beroperasi dalam <strong>Mode Demo Tersimpan</strong>. Pesanan baru dari pelanggan
            dan pembaruan stok otomatis tersimpan di LocalStorage peramban ini.
          </DemoBanner>
        )}
        {loadError && <ErrorBanner message={loadError} />}
        {actionError && <ErrorBanner message={actionError} />}

        {tab === "antrean" ? (
          <>
            {/* 1. Alert Kartu Merah (> 3 Hari) */}
            {overdueOrders.length > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-300 bg-red-50 p-5 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-950">
                      Alert Kartu Merah: {overdueOrders.length} Pesanan Tertahan &gt; {OVERDUE_DAYS} Hari
                    </h3>
                    <p className="text-xs text-red-800 mt-0.5">
                      Dahulukan pengerjaan bordir di mesin digital agar anggota tidak komplain saat mengambil.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderFilter((f) => (f === "OVERDUE" ? "ALL" : "OVERDUE"))}
                  className="shrink-0 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-2xs"
                >
                  {orderFilter === "OVERDUE" ? "Tampilkan Semua Antrean" : "Filter Yang Terlewat"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-xs sm:text-sm font-semibold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Semua pesanan tertangani tepat waktu. Tidak ada antrean yang tertahan lebih dari {OVERDUE_DAYS} hari.</span>
              </div>
            )}

            {/* 2. Visual Pipeline Antrean */}
            <PipelineBar counts={stageCounts} selected={orderFilter} onSelect={selectStage} />

            {/* 3. Daftar Pesanan */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderFilter("ALL")}
                    className={chipClass(orderFilter === "ALL", "neutral")}
                  >
                    Semua Aktif ({activeOrders.length})
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
                    Sudah Diambil ({completedOrders.length})
                  </button>
                </div>
                <p className="text-xs text-slate-muted">
                  {orderFilter === "COMPLETED" ? "Diurutkan terbaru di atas" : "Prioritas terlewat & paling lama di atas"}
                </p>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-slate-border bg-white p-12 text-center text-sm text-slate-muted">
                  {orders.length === 0
                    ? "Belum ada pesanan masuk. Pesanan dari form /pesan akan muncul di sini."
                    : "Tidak ada pesanan pada filter ini."}
                </div>
              ) : (
                <ul className="space-y-3">
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
          <div className="grid gap-6 lg:grid-cols-[1fr_21rem]">
            {/* Kasir Quick-Check Pencarian Stok */}
            <section className="space-y-4 min-w-0 lg:order-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  autoFocus
                  aria-label="Cari barang, kategori, atau rak fisik"
                  placeholder="Cari barang atau nomor rak (contoh: Kopel, Baret, Rak A-02)..."
                  value={cashierSearch}
                  onChange={(e) => setCashierSearch(e.target.value)}
                  className="w-full bg-white border border-slate-border pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand text-slate-ink placeholder:text-slate-400 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-muted">
                <span>
                  {filteredInventory.length} dari {inventory.length} barang etalase
                  {cashierSearch.trim() && " cocok dengan pencarian"}
                </span>
                <span className="text-[11px] font-medium text-brand">
                  Klik + / - untuk update stok instan
                </span>
              </div>

              {filteredInventory.length === 0 ? (
                <div className="rounded-2xl border border-slate-border bg-white p-12 text-center text-sm text-slate-muted">
                  Tidak ada barang yang cocok dengan &quot;{cashierSearch}&quot;.
                </div>
              ) : (
                <ul className="space-y-2.5">
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

            {/* Panel Restock Kritis */}
            <div className="lg:order-2">
              <RestockPanel items={restockItems} onPick={setCashierSearch} />
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer Admin Cerah ─── */}
      <footer className="bg-white border-t border-slate-border py-6 text-center text-xs text-slate-muted mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Toko Gaperta — Panel Kontrol Pemilik &amp; Kasir Fisik Toko Medan.</p>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sistem Kasir Sinkron</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
