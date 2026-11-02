import { supabase, isSupabaseConfigured, isNetworkError } from "@/lib/supabase";
import { getDemoOrders } from "@/lib/demo-data";
import {
  appendStoredOrder,
  getStoredOrders,
  updateStoredOrderStatus,
} from "@/lib/local-store";
import type { CustomOrder, NewOrderInput, OrderStatus, OrderType, TrackedOrder } from "@/types";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Ticket generator yang konsisten. */
function generateDemoTicket(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(100 + Math.random() * 900);
  return `GPT-${dateStr}-${suffix}`;
}

// ─── Publik: buat pesanan ────────────────────────────────────────────────────

/**
 * Mengembalikan nomor tiket.
 * - Supabase online → RPC create_order, tersimpan di PostgreSQL.
 * - Mode demo / offline → tiket dibuat lokal & disimpan ke LocalStorage
 *   agar dapat dilacak di /tracking dan terlihat di /admin.
 */
export async function createOrder(
  input: NewOrderInput
): Promise<{ ticket: string; demo: boolean }> {
  if (!isSupabaseConfigured) {
    return saveOrderToLocalStore(input);
  }

  try {
    const { data, error } = await supabase.rpc("create_order", {
      p_customer_name: input.customerName,
      p_customer_rank: input.customerRank ?? null,
      p_whatsapp: input.whatsappNumber,
      p_order_type: input.orderType,
      p_quantity: input.quantity,
      p_notes: input.notes,
    });
    if (error || typeof data !== "string") {
      if (isNetworkError(error)) {
        console.warn("Koneksi Supabase offline saat membuat pesanan. Menyimpan ke LocalStorage.");
        return saveOrderToLocalStore(input);
      }
      throw new Error(`Gagal menyimpan pesanan: ${error?.message ?? "respons tidak valid"}`);
    }
    return { ticket: data, demo: false };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn("Koneksi Supabase offline (catch). Menyimpan ke LocalStorage.");
      return saveOrderToLocalStore(input);
    }
    throw err;
  }
}

function saveOrderToLocalStore(
  input: NewOrderInput
): { ticket: string; demo: boolean } {
  const ticket = generateDemoTicket();
  const newOrder: CustomOrder = {
    id: `demo-${Date.now()}`,
    orderNumber: ticket,
    customerName: input.customerName,
    customerRank: input.customerRank ?? undefined,
    whatsappNumber: input.whatsappNumber,
    orderType: input.orderType,
    quantity: input.quantity,
    notes: input.notes,
    status: "PENDING",
    estimatedDone: undefined,
    createdAt: new Date().toISOString(),
  };
  appendStoredOrder(newOrder);
  return { ticket, demo: true };
}

// ─── Publik: lacak pesanan ───────────────────────────────────────────────────

interface TrackedOrderRow {
  order_number: string;
  customer_name: string;
  customer_rank: string | null;
  order_type: OrderType;
  quantity: number;
  notes: string;
  status: OrderStatus;
  estimated_done: string | null;
  created_at: string;
}

/**
 * Lacak pesanan berdasarkan nomor tiket + 4 digit terakhir WA.
 * Demo mode: cek LocalStorage dulu, baru fallback ke data contoh bawaan.
 */
export async function trackOrder(
  ticket: string,
  whatsappLast4: string
): Promise<{ order: TrackedOrder | null; demo: boolean }> {
  const normalizedTicket = ticket.trim().toUpperCase();
  const suffix = digitsOnly(whatsappLast4);

  const searchInDemoData = (): TrackedOrder | null => {
    // 1. Cek LocalStorage (pesanan yang dibuat pengguna di sesi ini)
    const stored = getStoredOrders() ?? [];
    const fromStore = stored.find(
      (o) =>
        o.orderNumber === normalizedTicket &&
        digitsOnly(o.whatsappNumber).endsWith(suffix) &&
        suffix.length === 4
    );
    if (fromStore) {
      return {
        orderNumber: fromStore.orderNumber,
        customerName: fromStore.customerName,
        customerRank: fromStore.customerRank,
        orderType: fromStore.orderType,
        quantity: fromStore.quantity,
        notes: fromStore.notes,
        status: fromStore.status,
        estimatedDone: fromStore.estimatedDone,
        createdAt: fromStore.createdAt,
      };
    }

    // 2. Fallback ke data contoh bawaan (demo-data.ts)
    const found = getDemoOrders().find(
      (o) =>
        o.orderNumber === normalizedTicket &&
        digitsOnly(o.whatsappNumber).endsWith(suffix) &&
        suffix.length === 4
    );
    return found
      ? {
          orderNumber: found.orderNumber,
          customerName: found.customerName,
          customerRank: found.customerRank,
          orderType: found.orderType,
          quantity: found.quantity,
          notes: found.notes,
          status: found.status,
          estimatedDone: found.estimatedDone,
          createdAt: found.createdAt,
        }
      : null;
  };

  if (!isSupabaseConfigured) {
    return { order: searchInDemoData(), demo: true };
  }

  try {
    const { data, error } = await supabase.rpc("track_order", {
      p_ticket: normalizedTicket,
      p_wa_suffix: suffix,
    });
    if (error) {
      if (isNetworkError(error)) {
        console.warn("Koneksi Supabase offline saat melacak pesanan. Beralih ke LocalStorage.");
        return { order: searchInDemoData(), demo: true };
      }
      throw new Error(`Gagal melacak pesanan: ${error.message}`);
    }

    const row = (data as TrackedOrderRow[] | null)?.[0];
    if (!row) {
      // Coba LocalStorage juga (jika user baru pesan tapi koneksi fluktuatif)
      const localResult = searchInDemoData();
      if (localResult) return { order: localResult, demo: true };
      return { order: null, demo: false };
    }
    return {
      order: {
        orderNumber: row.order_number,
        customerName: row.customer_name,
        customerRank: row.customer_rank ?? undefined,
        orderType: row.order_type,
        quantity: row.quantity,
        notes: row.notes,
        status: row.status,
        estimatedDone: row.estimated_done ?? undefined,
        createdAt: row.created_at,
      },
      demo: false,
    };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn("Koneksi Supabase offline (catch). Beralih ke LocalStorage.");
      return { order: searchInDemoData(), demo: true };
    }
    throw err;
  }
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export type AdminAccess =
  | { live: true }
  | { live: false; reason: "not-configured" | "no-session" | "not-admin" | "offline" };

/** Admin = user Supabase Auth dengan app_metadata.role = "admin". */
export async function getAdminAccess(): Promise<AdminAccess> {
  if (!isSupabaseConfigured) {
    return { live: false, reason: "not-configured" };
  }
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      if (isNetworkError(error)) {
        return { live: false, reason: "offline" };
      }
      return { live: false, reason: "no-session" };
    }
    const user = data.session?.user;
    if (!user) {
      return { live: false, reason: "no-session" };
    }
    if (user.app_metadata?.role !== "admin") {
      return { live: false, reason: "not-admin" };
    }
    return { live: true };
  } catch (err) {
    if (isNetworkError(err)) {
      return { live: false, reason: "offline" };
    }
    return { live: false, reason: "no-session" };
  }
}

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_rank: string | null;
  whatsapp: string;
  order_type: OrderType;
  quantity: number;
  notes: string;
  status: OrderStatus;
  estimated_done: string | null;
  created_at: string;
}

export async function getAdminOrders(): Promise<CustomOrder[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, customer_rank, whatsapp, order_type, quantity, notes, status, estimated_done, created_at"
      )
      .order("created_at", { ascending: true });
    if (error) {
      if (isNetworkError(error)) {
        throw new Error("Gagal terhubung ke server database. Pastikan koneksi atau server Supabase aktif.");
      }
      throw new Error(`Gagal memuat pesanan: ${error.message}`);
    }

    return (data as unknown as OrderRow[]).map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      customerName: row.customer_name,
      customerRank: row.customer_rank ?? undefined,
      whatsappNumber: row.whatsapp,
      orderType: row.order_type,
      quantity: row.quantity,
      notes: row.notes,
      status: row.status,
      estimatedDone: row.estimated_done ?? undefined,
      createdAt: row.created_at,
    }));
  } catch (err) {
    if (isNetworkError(err)) {
      throw new Error("Gagal terhubung ke server database. Pastikan koneksi atau server Supabase aktif.");
    }
    throw err;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  estimatedDone: string | undefined
): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, estimated_done: estimatedDone ?? null })
      .eq("id", orderId)
      .select("id");
    if (error) {
      if (isNetworkError(error)) {
        throw new Error("Gagal terhubung ke database. Pastikan koneksi atau server database aktif.");
      }
      throw new Error(`Gagal mengubah status pesanan: ${error.message}`);
    }
    if (!data || data.length === 0) {
      throw new Error("Gagal mengubah status pesanan: pesanan tidak ditemukan atau akun tidak punya izin admin.");
    }
  } catch (err) {
    if (isNetworkError(err)) {
      throw new Error("Gagal terhubung ke database. Pastikan koneksi atau server database aktif.");
    }
    throw err;
  }
}

/**
 * Khusus demo mode: perbarui status pesanan di LocalStorage
 * agar perubahan admin terlihat di /tracking tanpa Supabase.
 */
export function updateDemoOrderStatus(
  orderId: string,
  status: OrderStatus,
  estimatedDone?: string
): void {
  updateStoredOrderStatus(orderId, status, estimatedDone);
}
