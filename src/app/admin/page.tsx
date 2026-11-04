"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, LogOut, Package, RefreshCw, Search, Shield, X } from "lucide-react";
import { AdminLogin } from "@/components/AdminLogin";
import { KpiStrip, type KpiKey } from "@/components/admin/KpiStrip";
import { OrderRow } from "@/components/admin/OrderRow";
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
type OrderFilter = "ALL" | "OVERDUE" | OrderStatus;
type StockFilter = "ALL" | "LOW";

const ORDER_CHIPS: Array<{ id: OrderFilter; label: string; danger?: boolean }> = [
  { id: "ALL", label: "Semua aktif" },
  { id: "OVERDUE", label: "Terlewat", danger: true },
  { id: "PENDING", label: "Antre" },
  { id: "IN_PROGRESS", label: "Dibordir" },
  { id: "READY", label: "Siap diambil" },
  { id: "COMPLETED", label: "Sudah diambil" },
];

/** Di HP, kasir paling sering butuh cek stok saat ada pembeli di depan meja. */
function initialTab(): Tab {
  if (typeof window === "undefined") return "antrean";
  return window.matchMedia("(max-width: 767px)").matches ? "stok" : "antrean";
}

function matchesOrder(order: CustomOrder, query: string) {
  const q = query.toLowerCase();
  const digits = query.replace(/\D/g, "");
  return (
    order.orderNumber.toLowerCase().includes(q) ||
    order.customerName.toLowerCase().includes(q) ||
    (order.customerRank ?? "").toLowerCase().includes(q) ||
    (digits.length >= 3 && order.whatsappNumber.replace(/\D/g, "").includes(digits))
  );
}

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
  const [tab, setTab] = useState<Tab>(initialTab);
  const [cashierSearch, setCashierSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("ALL");
  const searchRef = useRef<HTMLInputElement>(null);

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

  // Tombol "/" langsung ke kolom cari (seperti mesin kasir).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== "/" || target.closest("input, textarea, select")) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    o.status !== "COMPLETED" && o.status !== "READY" && daysSince(o.createdAt) >= OVERDUE_DAYS;
  const countBy = (f: OrderFilter) =>
    f === "ALL"
      ? orders.filter((o) => o.status !== "COMPLETED").length
      : f === "OVERDUE"
      ? orders.filter(isOverdue).length
      : orders.filter((o) => o.status === f).length;
  const restockItems = inventory
    .filter((p) => p.status !== "CUSTOM" && p.stock < LOW_STOCK)
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));

  const selectedKpi: KpiKey | null =
    tab === "stok"
      ? stockFilter === "LOW"
        ? "LOW_STOCK"
        : null
      : orderSearch
      ? null
      : orderFilter === "OVERDUE"
      ? "OVERDUE"
      : orderFilter === "READY"
      ? "READY"
      : orderFilter === "ALL"
      ? "ACTIVE"
      : null;

  const handleKpi = (key: KpiKey) => {
    if (key === "LOW_STOCK") {
      setTab("stok");
      setCashierSearch("");
      setStockFilter((f) => (f === "LOW" && tab === "stok" ? "ALL" : "LOW"));
      return;
    }
    setTab("antrean");
    setOrderSearch("");
    setOrderFilter(key === "OVERDUE" ? "OVERDUE" : key === "READY" ? "READY" : "ALL");
  };

  // ─── Kasir Quick-Check: ubah stok ───
  const updateStock = async (productId: string, delta: number) => {
    if (delta === 0) return;
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

  const setStockTo = (productId: string, target: number) => {
    const current = inventory.find((item) => item.id === productId);
    if (current) updateStock(productId, target - current.stock);
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
  const stockQuery = cashierSearch.trim().toLowerCase();
  const filteredInventory = inventory.filter((item) => {
    if (stockFilter === "LOW" && !(item.status !== "CUSTOM" && item.stock < LOW_STOCK)) return false;
    return (
      stockQuery === "" ||
      `${item.name} ${item.categoryName} ${item.rackLocation}`.toLowerCase().includes(stockQuery)
    );
  });

  // Saat mencari (mis. pembeli datang membawa tiket), cari di SEMUA pesanan termasuk yang sudah diambil.
  const orderQuery = orderSearch.trim();
  const filteredOrders = orders
    .filter((order) => {
      if (orderQuery) return matchesOrder(order, orderQuery);
      if (orderFilter === "OVERDUE") return isOverdue(order);
      if (orderFilter === "ALL") return order.status !== "COMPLETED";
      return order.status === orderFilter;
    })
    .sort((a, b) => {
      const rank = (o: CustomOrder) =>
        o.status === "COMPLETED" ? 3 : isOverdue(o) ? 0 : o.status === "READY" ? 2 : 1;
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      const byAge = Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return orderFilter === "COMPLETED" ? -byAge : byAge;
    });

  if (gate === "checking") {
    return (
      <div className="min-h-screen bg-slate-canvas flex items-center justify-center text-base text-slate-muted font-sans">
        Memeriksa hak akses admin...
      </div>
    );
  }

  if (gate === "login") {
    return <AdminLogin notice={loginNotice} onSuccess={loadDashboard} />;
  }

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 px-4 h-12 text-sm sm:text-base font-bold border-b-[3px] transition-colors whitespace-nowrap ${
      active ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-slate-ink"
    }`;

  const chipClass = (active: boolean, danger?: boolean) =>
    `h-10 rounded-full px-4 text-sm font-bold border whitespace-nowrap transition-colors ${
      active
        ? danger
          ? "bg-red-600 border-red-600 text-white"
          : "bg-brand border-brand text-white"
        : danger
        ? "bg-white border-red-300 text-red-700 hover:bg-red-50"
        : "bg-white border-slate-border text-slate-700 hover:border-slate-400"
    }`;

  const searchInputClass =
    "w-full h-12 bg-white border-2 border-slate-border focus:border-brand pl-11 pr-11 rounded-xl text-base text-slate-ink placeholder:text-slate-400 focus:outline-none";

  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      <header className="bg-white border-b border-slate-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight truncate">Panel Kasir Gaperta</h1>
              <p className="hidden sm:block text-sm text-slate-muted">Antrean bordir &amp; stok rak toko</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-1.5 h-11 min-w-11 px-3 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 text-sm font-semibold rounded-xl border border-slate-border"
              title="Muat ulang antrean pesanan & stok"
              aria-label="Muat ulang data"
            >
              <RefreshCw className={`w-4 h-4 text-brand ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{refreshing ? "Memuat..." : "Muat ulang"}</span>
            </button>

            {!isDemo && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-1.5 h-11 min-w-11 px-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-border"
                aria-label="Keluar"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 h-11 min-w-11 px-3 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl"
              aria-label="Lihat etalase toko"
            >
              <span className="hidden sm:inline">Etalase</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-border">
          <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 flex overflow-x-auto" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "antrean"}
              onClick={() => setTab("antrean")}
              className={tabClass(tab === "antrean")}
            >
              <ClipboardList className="w-5 h-5" />
              Antrean Bordir
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "stok"}
              onClick={() => setTab("stok")}
              className={tabClass(tab === "stok")}
            >
              <Package className="w-5 h-5" />
              Cek Stok &amp; Rak
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 w-full">
        {isDemo && (
          <DemoBanner>
            Data disimpan di peramban ini saja (LocalStorage). Pesanan dari form /pesan di peramban yang sama akan
            muncul di sini.
          </DemoBanner>
        )}
        {loadError && <ErrorBanner message={loadError} />}
        {actionError && <ErrorBanner message={actionError} />}

        <KpiStrip
          overdue={countBy("OVERDUE")}
          ready={countBy("READY")}
          active={countBy("ALL")}
          lowStock={restockItems.length}
          overdueDays={OVERDUE_DAYS}
          selected={selectedKpi}
          onSelect={handleKpi}
        />

        {tab === "antrean" ? (
          <section className="space-y-4" aria-label="Antrean bordir">
            <div className="relative">
              <label htmlFor="order-search" className="sr-only">
                Cari pesanan
              </label>
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="order-search"
                ref={searchRef}
                type="search"
                placeholder="Cari tiket, nama pemesan, atau nomor WA..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className={searchInputClass}
              />
              {orderSearch && (
                <button
                  type="button"
                  onClick={() => setOrderSearch("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {orderQuery ? (
              <p className="text-sm text-slate-600">
                {filteredOrders.length} pesanan cocok dengan &quot;<strong>{orderQuery}</strong>&quot; (termasuk yang
                sudah diambil).
              </p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter status">
                {ORDER_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={orderFilter === chip.id}
                    onClick={() => setOrderFilter(chip.id)}
                    className={chipClass(orderFilter === chip.id, chip.danger)}
                  >
                    {chip.label} <span className="tabular-nums opacity-80">{countBy(chip.id)}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-slate-border bg-white p-10 text-center text-base text-slate-muted">
                {orders.length === 0
                  ? "Belum ada pesanan masuk. Pesanan dari form /pesan akan muncul di sini."
                  : orderQuery
                  ? "Tidak ada pesanan yang cocok. Coba cari dengan 4 angka akhir WA pemesan."
                  : orderFilter === "OVERDUE"
                  ? `Bagus — tidak ada pesanan yang tertahan ≥ ${OVERDUE_DAYS} hari.`
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
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
            <section className="space-y-4 min-w-0" aria-label="Cek stok dan rak">
              <div className="relative">
                <label htmlFor="stock-search" className="sr-only">
                  Cari barang, kategori, atau rak
                </label>
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="stock-search"
                  ref={searchRef}
                  type="search"
                  placeholder="Cari barang atau rak (kopel, baret, A-02)..."
                  value={cashierSearch}
                  onChange={(e) => setCashierSearch(e.target.value)}
                  className={searchInputClass}
                />
                {cashierSearch && (
                  <button
                    type="button"
                    onClick={() => setCashierSearch("")}
                    aria-label="Hapus pencarian"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-ink"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-pressed={stockFilter === "ALL"}
                    onClick={() => setStockFilter("ALL")}
                    className={chipClass(stockFilter === "ALL")}
                  >
                    Semua <span className="tabular-nums opacity-80">{inventory.length}</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={stockFilter === "LOW"}
                    onClick={() => setStockFilter("LOW")}
                    className={chipClass(stockFilter === "LOW", true)}
                  >
                    Menipis <span className="tabular-nums opacity-80">{restockItems.length}</span>
                  </button>
                </div>
                <span>Klik angka stok untuk mengisi jumlah persis.</span>
              </div>

              {filteredInventory.length === 0 ? (
                <div className="rounded-2xl border border-slate-border bg-white p-10 text-center text-base text-slate-muted">
                  {cashierSearch
                    ? `Tidak ada barang yang cocok dengan "${cashierSearch}".`
                    : "Semua stok aman."}
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredInventory.map((item) => (
                    <StockRow
                      key={item.id}
                      item={item}
                      busy={busyId === item.id}
                      onAdjust={(delta) => updateStock(item.id, delta)}
                      onSet={(target) => setStockTo(item.id, target)}
                    />
                  ))}
                </ul>
              )}
            </section>

            <div className="hidden lg:block">
              <RestockPanel
                items={restockItems}
                onPick={(name) => {
                  setStockFilter("ALL");
                  setCashierSearch(name);
                }}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-border py-5 text-sm text-slate-muted mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Toko Gaperta — Panel Kasir</p>
          <p className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDemo ? "bg-amber-500" : "bg-emerald-500"}`} />
            {isDemo ? "Mode Demo — data di peramban ini" : "Terhubung ke database toko"}
          </p>
        </div>
      </footer>
    </div>
  );
}
