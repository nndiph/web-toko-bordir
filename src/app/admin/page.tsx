"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  LogOut,
  Package,
  RefreshCw,
  Search,
  Shield,
  X,
  Plus,
  Minus,
  Pencil,
  Check,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import { AdminLogin } from "@/components/AdminLogin";
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
import { daysSince, formatRupiah, formatOrderDate } from "@/lib/utils";
import { storeWaLink } from "@/lib/store-info";
import type { CustomOrder, OrderStatus, Product } from "@/types";

const OVERDUE_DAYS = 3;
const LOW_STOCK = 5;

type Gate = "checking" | "login" | "ready";
type Tab = "stok" | "antrean";
type StockFilter = "ALL" | "LOW" | "CRITICAL";

const ORDER_TYPE_LABEL: Record<string, string> = {
  PANGKAT: "Badge Pangkat",
  NAMA_DADA: "Nama Dada",
  LOKASI: "Badge Lokasi",
  EMBLEM: "Emblem",
  LAINNYA: "Lainnya",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Antre",
  IN_PROGRESS: "Dibordir",
  READY: "Siap",
  COMPLETED: "Diambil",
};

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
  const [tab, setTab] = useState<Tab>("stok");
  const [stockSearch, setStockSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [orderSearch, setOrderSearch] = useState("");
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const loadDashboard = useCallback(async () => {
    setLoadError(null);
    setActionError(null);

    const access = await getAdminAccess();
    if (!access.live) {
      if (access.reason === "not-configured" || access.reason === "offline") {
        const products = await getProducts();
        setInventory(products.data);

        let loadedOrders = getStoredOrders();
        if (!loadedOrders || loadedOrders.length === 0) {
          loadedOrders = getDemoOrders();
          setStoredOrders(loadedOrders);
        }
        setOrders(loadedOrders);
        setIsDemo(true);
        setGate("ready");
        if (access.reason === "offline") {
          setLoadError("Database offline. Mode Demo aktif (LocalStorage).");
        }
        return;
      }
      setLoginNotice(
        access.reason === "not-admin" ? "Akun ini bukan admin. Masuk dengan akun admin." : undefined
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
        err instanceof Error ? `${err.message} — Data lokal digunakan.` : "Gagal memuat. Data lokal digunakan."
      );
    }
    setGate("ready");
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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

  const updateStock = async (productId: string, delta: number) => {
    if (delta === 0) return;
    setActionError(null);
    setBusyId(productId);

    try {
      const updated = await adjustStock(productId, delta);
      setInventory((prev) => prev.map((item) => (item.id === productId ? { ...item, ...updated } : item)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal mengubah stok.");
    } finally {
      setBusyId(null);
    }
  };

  const handleStockEdit = (product: Product) => {
    setEditingStockId(product.id);
    setEditingValue(product.stock.toString());
  };

  const handleStockSave = (productId: string) => {
    const target = parseInt(editingValue, 10);
    if (isNaN(target) || target < 0) {
      setEditingStockId(null);
      return;
    }
    const current = inventory.find((item) => item.id === productId);
    if (current) {
      updateStock(productId, target - current.stock);
    }
    setEditingStockId(null);
  };

  const handleStockCancel = () => {
    setEditingStockId(null);
    setEditingValue("");
  };

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
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus, estimatedDone } : order)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal mengubah status.");
    } finally {
      setBusyId(null);
    }
  };

  // Statistik
  const isOverdue = (o: CustomOrder) =>
    o.status !== "COMPLETED" && o.status !== "READY" && daysSince(o.createdAt) >= OVERDUE_DAYS;
  const overdueCount = orders.filter(isOverdue).length;
  const readyCount = orders.filter((o) => o.status === "READY").length;
  const lowStockItems = inventory.filter((p) => p.status !== "CUSTOM" && p.stock < LOW_STOCK && p.stock > 0);
  const criticalStockItems = inventory.filter((p) => p.status !== "CUSTOM" && p.stock === 0);

  // Filter stok
  const stockQuery = stockSearch.trim().toLowerCase();
  const filteredInventory = inventory.filter((item) => {
    if (stockFilter === "LOW" && !(item.status !== "CUSTOM" && item.stock < LOW_STOCK && item.stock > 0))
      return false;
    if (stockFilter === "CRITICAL" && item.stock !== 0) return false;
    return (
      stockQuery === "" ||
      `${item.name} ${item.categoryName} ${item.rackLocation}`.toLowerCase().includes(stockQuery)
    );
  });

  // Filter pesanan
  const orderQuery = orderSearch.trim();
  const filteredOrders = orders
    .filter((order) => (orderQuery ? matchesOrder(order, orderQuery) : order.status !== "COMPLETED"))
    .sort((a, b) => {
      const rank = (o: CustomOrder) =>
        o.status === "COMPLETED" ? 3 : isOverdue(o) ? 0 : o.status === "READY" ? 2 : 1;
      const diff = rank(a) - rank(b);
      return diff !== 0 ? diff : Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });

  if (gate === "checking") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-sans">
        Memeriksa hak akses admin...
      </div>
    );
  }

  if (gate === "login") {
    return <AdminLogin notice={loginNotice} onSuccess={loadDashboard} />;
  }

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 px-6 h-12 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
      active ? "border-emerald-700 text-emerald-900" : "border-transparent text-slate-500 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-emerald-800 text-white rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight truncate">Panel Admin Gaperta</h1>
              <p className="hidden sm:block text-xs text-slate-500">Manajemen stok & antrean bordir</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300"
              title="Muat ulang data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{refreshing ? "Memuat..." : "Refresh"}</span>
            </button>

            {!isDemo && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-lg"
            >
              <span className="hidden sm:inline">Etalase</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "stok"}
              onClick={() => setTab("stok")}
              className={tabClass(tab === "stok")}
            >
              <Package className="w-5 h-5" />
              Manajemen Stok Barang
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "antrean"}
              onClick={() => setTab("antrean")}
              className={tabClass(tab === "antrean")}
            >
              <ClipboardList className="w-5 h-5" />
              Antrean Pesanan Bordir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        {isDemo && (
          <DemoBanner>
            Mode Demo: Data disimpan di browser (LocalStorage). Pesanan dari /pesan akan muncul di sini.
          </DemoBanner>
        )}
        {loadError && <ErrorBanner message={loadError} />}
        {actionError && <ErrorBanner message={actionError} />}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stok Kritis</span>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-extrabold text-red-600 tabular-nums">{criticalStockItems.length}</div>
            <p className="text-xs text-slate-600 mt-1">Barang kosong total</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stok Menipis</span>
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600 tabular-nums">{lowStockItems.length}</div>
            <p className="text-xs text-slate-600 mt-1">Barang &lt; {LOW_STOCK} pcs</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pesanan Siap</span>
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 tabular-nums">{readyCount}</div>
            <p className="text-xs text-slate-600 mt-1">Siap diambil customer</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kartu Merah</span>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-extrabold text-red-600 tabular-nums">{overdueCount}</div>
            <p className="text-xs text-slate-600 mt-1">Terlewat &gt; {OVERDUE_DAYS} hari</p>
          </div>
        </div>

        {/* Tab Content */}
        {tab === "stok" ? (
          <section className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Cari nama barang, kategori, atau rak..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-full h-11 bg-white border-2 border-slate-300 focus:border-emerald-700 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
                {stockSearch && (
                  <button
                    type="button"
                    onClick={() => setStockSearch("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStockFilter("ALL")}
                  className={`h-11 px-4 rounded-lg text-sm font-bold border-2 transition-colors ${
                    stockFilter === "ALL"
                      ? "bg-emerald-700 border-emerald-700 text-white"
                      : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  Semua ({inventory.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStockFilter("LOW")}
                  className={`h-11 px-4 rounded-lg text-sm font-bold border-2 transition-colors ${
                    stockFilter === "LOW"
                      ? "bg-amber-600 border-amber-600 text-white"
                      : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  Menipis ({lowStockItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStockFilter("CRITICAL")}
                  className={`h-11 px-4 rounded-lg text-sm font-bold border-2 transition-colors ${
                    stockFilter === "CRITICAL"
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  Habis ({criticalStockItems.length})
                </button>
              </div>
            </div>

            {/* Stock Table */}
            <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Nama Barang
                      </th>
                      <th className="text-left px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Kategori
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Stok
                      </th>
                      <th className="text-left px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Lokasi Rak
                      </th>
                      <th className="text-right px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Harga
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Aksi Cepat
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map((product, idx) => {
                      const isBusy = busyId === product.id;
                      const isEditing = editingStockId === product.id;
                      const stockLevel =
                        product.status === "CUSTOM"
                          ? "custom"
                          : product.stock === 0
                          ? "critical"
                          : product.stock < LOW_STOCK
                          ? "low"
                          : "safe";

                      return (
                        <tr
                          key={product.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900">{product.name}</td>
                          <td className="px-4 py-3 text-slate-600">{product.categoryName}</td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  className="w-20 h-8 px-2 border-2 border-emerald-700 rounded text-center font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleStockSave(product.id);
                                    if (e.key === "Escape") handleStockCancel();
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleStockSave(product.id)}
                                  className="w-8 h-8 flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white rounded"
                                  title="Simpan"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleStockCancel}
                                  className="w-8 h-8 flex items-center justify-center bg-slate-300 hover:bg-slate-400 text-slate-700 rounded"
                                  title="Batal"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStockEdit(product)}
                                disabled={isBusy}
                                className={`mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${
                                  stockLevel === "critical"
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : stockLevel === "low"
                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                    : stockLevel === "custom"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                }`}
                                title="Klik untuk edit stok"
                              >
                                {product.status === "CUSTOM" ? "Custom" : `${product.stock} pcs`}
                                <Pencil className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded font-mono text-xs font-semibold">
                              {product.rackLocation}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                            {formatRupiah(product.price)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateStock(product.id, -1)}
                                disabled={isBusy || product.stock === 0 || isEditing}
                                className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded transition-colors"
                                title="Kurangi 1"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => updateStock(product.id, 1)}
                                disabled={isBusy || isEditing}
                                className="w-8 h-8 flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded transition-colors"
                                title="Tambah 1"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredInventory.length === 0 && (
                  <div className="py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">Tidak ada barang yang sesuai filter.</p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Menampilkan {filteredInventory.length} dari {inventory.length} barang. Klik angka stok untuk edit manual, atau gunakan tombol +/- untuk adjust cepat.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {/* Order Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Cari tiket, nama, atau nomor WA pemesan..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full h-11 bg-white border-2 border-slate-300 focus:border-emerald-700 pl-10 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
              {orderSearch && (
                <button
                  type="button"
                  onClick={() => setOrderSearch("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Orders Table */}
            <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Tiket
                      </th>
                      <th className="text-left px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Pemesan
                      </th>
                      <th className="text-left px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Jenis Bordir
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Jumlah
                      </th>
                      <th className="text-left px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Tanggal Pesan
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Status
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((order, idx) => {
                      const isBusy = busyId === order.id;
                      const overdue = isOverdue(order);

                      return (
                        <tr
                          key={order.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"
                          } ${overdue ? "bg-red-50/50" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-semibold text-slate-900">{order.customerName}</div>
                              {order.customerRank && (
                                <div className="text-xs text-slate-600">{order.customerRank}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {ORDER_TYPE_LABEL[order.orderType] || order.orderType}
                          </td>
                          <td className="px-4 py-3 text-center font-bold tabular-nums">{order.quantity}</td>
                          <td className="px-4 py-3 text-slate-600 text-xs">{formatOrderDate(order.createdAt)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                                order.status === "COMPLETED"
                                  ? "bg-slate-100 text-slate-700"
                                  : order.status === "READY"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : order.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-700"
                                  : overdue
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {STATUS_LABEL[order.status]}
                              {overdue && order.status !== "COMPLETED" && order.status !== "READY" && (
                                <AlertCircle className="w-3 h-3" />
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              {order.status === "PENDING" && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, "IN_PROGRESS")}
                                  disabled={isBusy}
                                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded transition-colors"
                                >
                                  Mulai Bordir
                                </button>
                              )}
                              {order.status === "IN_PROGRESS" && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, "READY")}
                                  disabled={isBusy}
                                  className="h-8 px-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-bold rounded transition-colors"
                                >
                                  Selesai
                                </button>
                              )}
                              {order.status === "READY" && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                                  disabled={isBusy}
                                  className="h-8 px-3 bg-slate-600 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold rounded transition-colors"
                                >
                                  Sudah Diambil
                                </button>
                              )}
                              {order.status === "COMPLETED" && (
                                <span className="text-xs text-slate-400 font-semibold">—</span>
                              )}
                              <a
                                href={storeWaLink(
                                  `Halo ${order.customerName}, pesanan bordir ${order.orderType} dengan tiket ${order.orderNumber} statusnya: ${order.estimatedDone}`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                title="Kirim pesan WA"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <div className="py-12 text-center text-slate-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">Tidak ada pesanan yang cocok.</p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Menampilkan {filteredOrders.length} pesanan. Pesanan terlewat &gt; {OVERDUE_DAYS} hari ditandai dengan latar merah.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
