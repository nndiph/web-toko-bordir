import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getDemoOrders } from "@/lib/demo-data";
import type { CustomOrder, NewOrderInput, OrderStatus, OrderType, TrackedOrder } from "@/types";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

// ─── Publik: buat pesanan ───────────────────────────────────────────────────

/** Mengembalikan nomor tiket. Di Mode Demo tiket hanya dibuat lokal dan TIDAK tersimpan. */
export async function createOrder(input: NewOrderInput): Promise<{ ticket: string; demo: boolean }> {
  if (!isSupabaseConfigured) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const suffix = Math.floor(100 + Math.random() * 900);
    return { ticket: `GPT-${dateStr}-${suffix}`, demo: true };
  }

  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: input.customerName,
    p_customer_rank: input.customerRank ?? null,
    p_whatsapp: input.whatsappNumber,
    p_order_type: input.orderType,
    p_quantity: input.quantity,
    p_notes: input.notes,
  });
  if (error || typeof data !== "string") {
    throw new Error(`Gagal menyimpan pesanan: ${error?.message ?? "respons tidak valid"}`);
  }
  return { ticket: data, demo: false };
}

// ─── Publik: lacak pesanan ──────────────────────────────────────────────────

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

/** Perlu nomor tiket + 4 digit terakhir WhatsApp. `null` = tidak ditemukan. */
export async function trackOrder(
  ticket: string,
  whatsappLast4: string
): Promise<{ order: TrackedOrder | null; demo: boolean }> {
  const normalizedTicket = ticket.trim().toUpperCase();
  const suffix = digitsOnly(whatsappLast4);

  if (!isSupabaseConfigured) {
    const found = getDemoOrders().find(
      (o) => o.orderNumber === normalizedTicket && digitsOnly(o.whatsappNumber).endsWith(suffix) && suffix.length === 4
    );
    return {
      order: found
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
        : null,
      demo: true,
    };
  }

  const { data, error } = await supabase.rpc("track_order", {
    p_ticket: normalizedTicket,
    p_wa_suffix: suffix,
  });
  if (error) {
    throw new Error(`Gagal melacak pesanan: ${error.message}`);
  }

  const row = (data as TrackedOrderRow[] | null)?.[0];
  if (!row) {
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
}

// ─── Admin ──────────────────────────────────────────────────────────────────

export type AdminAccess =
  | { live: true }
  | { live: false; reason: "not-configured" | "no-session" | "not-admin" };

/** Admin = user Supabase Auth dengan app_metadata.role = "admin". */
export async function getAdminAccess(): Promise<AdminAccess> {
  if (!isSupabaseConfigured) {
    return { live: false, reason: "not-configured" };
  }
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) {
    return { live: false, reason: "no-session" };
  }
  if (user.app_metadata?.role !== "admin") {
    return { live: false, reason: "not-admin" };
  }
  return { live: true };
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
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_rank, whatsapp, order_type, quantity, notes, status, estimated_done, created_at"
    )
    .order("created_at", { ascending: true });
  if (error) {
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
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  estimatedDone: string | undefined
): Promise<void> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, estimated_done: estimatedDone ?? null })
    .eq("id", orderId)
    .select("id");
  if (error) {
    throw new Error(`Gagal mengubah status pesanan: ${error.message}`);
  }
  if (!data || data.length === 0) {
    throw new Error("Gagal mengubah status pesanan: pesanan tidak ditemukan atau akun tidak punya izin admin.");
  }
}
