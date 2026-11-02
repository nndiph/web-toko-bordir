/**
 * LocalStorage Store — Persistensi Data Demo Mode
 *
 * Digunakan HANYA saat Supabase belum dikonfigurasi (mode demo).
 * Menyimpan pesanan dan stok agar sinkron antar-halaman & antar-refresh
 * tanpa membutuhkan database.
 *
 * Saat Supabase online → diabaikan, semua mutasi langsung ke Supabase.
 */

import type { CustomOrder, Product } from "@/types";

const ORDERS_KEY = "gaperta_demo_orders";
const PRODUCTS_KEY = "gaperta_demo_products";

function isBrowser() {
  return typeof window !== "undefined";
}

// ─── Pesanan ────────────────────────────────────────────────────────────────

export function getStoredOrders(): CustomOrder[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomOrder[];
  } catch {
    return null;
  }
}

export function setStoredOrders(orders: CustomOrder[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // localStorage penuh / private mode — diabaikan
  }
}

/** Tambahkan satu pesanan baru ke store. */
export function appendStoredOrder(order: CustomOrder): void {
  const existing = getStoredOrders() ?? [];
  setStoredOrders([...existing, order]);
}

/** Perbarui status satu pesanan berdasarkan ID. */
export function updateStoredOrderStatus(
  orderId: string,
  status: CustomOrder["status"],
  estimatedDone?: string
): void {
  const orders = getStoredOrders() ?? [];
  const updated = orders.map((o) =>
    o.id === orderId ? { ...o, status, estimatedDone: estimatedDone ?? o.estimatedDone } : o
  );
  setStoredOrders(updated);
}

// ─── Produk / Stok ──────────────────────────────────────────────────────────

export function getStoredProducts(): Product[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Product[];
  } catch {
    return null;
  }
}

export function setStoredProducts(products: Product[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // Diabaikan
  }
}

/** Tambah/kurang stok satu produk di store. */
export function adjustStoredStock(
  productId: string,
  delta: number
): { stock: number; status: Product["status"] } | null {
  const products = getStoredProducts();
  if (!products) return null;

  let result: { stock: number; status: Product["status"] } | null = null;

  const updated = products.map((p) => {
    if (p.id !== productId) return p;
    const newStock = Math.max(0, p.stock + delta);
    const syncsWithStock = p.status === "TERSEDIA" || p.status === "HABIS";
    const newStatus: Product["status"] = syncsWithStock
      ? newStock === 0
        ? "HABIS"
        : "TERSEDIA"
      : p.status;
    result = { stock: newStock, status: newStatus };
    return { ...p, stock: newStock, status: newStatus };
  });

  setStoredProducts(updated);
  return result;
}

/** Hapus semua data demo (untuk keperluan reset). */
export function clearDemoStore(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(PRODUCTS_KEY);
}
