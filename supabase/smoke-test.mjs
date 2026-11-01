// Uji RLS & RPC terhadap Supabase LOKAL (kunci diambil dari `supabase status`).
// Jalankan: npm run db:test  (butuh Docker + `npx supabase start`).
// PERINGATAN: menghapus semua baris orders di database lokal. Jalankan `npm run db:reset` sesudahnya.
import { createClient } from "@supabase/supabase-js";
import { execSync } from "node:child_process";

const env = Object.fromEntries(
  execSync("npx --yes supabase status -o env", { encoding: "utf8" })
    .split("\n")
    .map((l) => l.match(/^([A-Z_]+)="?(.*?)"?$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]])
);
const url = env.API_URL;
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => {
  (ok ? pass++ : fail++);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  -> " + extra : ""}`);
};

const anon = createClient(url, env.ANON_KEY);
const service = createClient(url, env.SERVICE_ROLE_KEY);

// ── Publik: katalog ──
let r = await anon.from("products").select("name, stock, status, categories(name, slug)").order("name");
check("anon bisa baca 8 produk + kategori", !r.error && r.data.length === 8, r.error?.message ?? `${r.data?.length} baris`);
check("seragam stok 0 berstatus HABIS", r.data?.find((p) => p.name.includes("Malvinas"))?.status === "HABIS");

// ── Publik: tabel orders tertutup ──
r = await anon.from("orders").select("*");
check("anon TIDAK melihat orders", !r.error && r.data.length === 0, r.error?.message ?? "0 baris");
r = await anon.from("orders").insert({ order_number: "HACK-1", customer_name: "x", whatsapp: "08123456789", order_type: "PANGKAT", quantity: 1, notes: "x" });
check("anon TIDAK bisa insert langsung ke orders", !!r.error, r.error?.message);
r = await anon.from("order_counters").select("*");
check("anon TIDAK melihat order_counters", !r.error && r.data.length === 0);
r = await anon.from("products").update({ stock: 999 }).eq("slug", "kopel-rim-hitam-tni").select();
check("anon TIDAK bisa ubah produk", !r.error && r.data.length === 0, r.error?.message ?? "0 baris terubah");
r = await anon.rpc("adjust_stock", { p_product_id: "00000000-0000-0000-0000-000000000000", p_delta: 1 });
check("anon TIDAK boleh adjust_stock", !!r.error, r.error?.message);
r = await anon.rpc("create_order", { p_customer_name: "x", p_customer_rank: null, p_whatsapp: "08123456789", p_order_type: "PANGKAT", p_quantity: 1, p_notes: "x" });
check("anon MASIH boleh create_order", !r.error, r.error?.message);
await service.from("orders").delete().neq("order_number", "");
await service.from("order_counters").delete().neq("last_number", -1);

// ── Publik: buat & lacak pesanan ──
const make = () => anon.rpc("create_order", {
  p_customer_name: "  Serka Uji  ", p_customer_rank: "  ", p_whatsapp: "0812-3456-7890",
  p_order_type: "PANGKAT", p_quantity: 3, p_notes: "Benang hitam",
});
const o1 = await make();
const o2 = await make();
const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date()).replace(/-/g, "");
check("create_order mengembalikan tiket GPT-YYYYMMDD-001", o1.data === `GPT-${day}-001`, String(o1.data ?? o1.error?.message));
check("tiket kedua berurutan 002", o2.data === `GPT-${day}-002`, String(o2.data ?? o2.error?.message));

r = await anon.rpc("create_order", { p_customer_name: "x", p_customer_rank: null, p_whatsapp: "123", p_order_type: "PANGKAT", p_quantity: 1, p_notes: "x" });
check("create_order menolak WA terlalu pendek", !!r.error, r.error?.message);
r = await anon.rpc("create_order", { p_customer_name: "x", p_customer_rank: null, p_whatsapp: "08123456789", p_order_type: "PANGKAT", p_quantity: 0, p_notes: "x" });
check("create_order menolak jumlah 0", !!r.error, r.error?.message);

r = await anon.rpc("track_order", { p_ticket: o1.data.toLowerCase(), p_wa_suffix: "7890" });
check("track_order: tiket + 4 digit benar -> ketemu", !r.error && r.data.length === 1 && r.data[0].customer_name === "Serka Uji", r.error?.message);
check("track_order: nama di-trim & rank kosong jadi null", r.data?.[0]?.customer_rank === null);
check("track_order TIDAK membocorkan nomor WA", r.data?.[0] && !("whatsapp" in r.data[0]));
r = await anon.rpc("track_order", { p_ticket: o1.data, p_wa_suffix: "0000" });
check("track_order: 4 digit salah -> kosong", !r.error && r.data.length === 0);
r = await anon.rpc("track_order", { p_ticket: o1.data, p_wa_suffix: "" });
check("track_order: tanpa digit -> kosong", !r.error && r.data.length === 0);
r = await anon.rpc("track_order", { p_ticket: o1.data, p_wa_suffix: "90" });
check("track_order: <4 digit -> kosong", !r.error && r.data.length === 0);

// ── Admin ──
const email = "admin-uji@gaperta.test", password = "uji-password-123";
await service.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role: "admin" } });
const nonAdminEmail = "bukan-admin@gaperta.test";
await service.auth.admin.createUser({ email: nonAdminEmail, password, email_confirm: true });

const admin = createClient(url, env.ANON_KEY);
const si = await admin.auth.signInWithPassword({ email, password });
check("admin bisa login", !si.error, si.error?.message);
check("JWT admin membawa app_metadata.role=admin", si.data.session?.user.app_metadata?.role === "admin");

r = await admin.from("orders").select("order_number, whatsapp, created_at").order("order_number");
check("admin melihat 2 pesanan lengkap dgn WA", !r.error && r.data.length === 2 && r.data[0].whatsapp === "0812-3456-7890", r.error?.message);

const up = await admin.from("orders").update({ status: "COMPLETED", estimated_done: "Sudah diambil pemesan" }).eq("order_number", o1.data).select("status");
check("admin bisa ubah status ke COMPLETED", !up.error && up.data[0]?.status === "COMPLETED", up.error?.message);
r = await anon.rpc("track_order", { p_ticket: o1.data, p_wa_suffix: "7890" });
check("tracking publik melihat COMPLETED", r.data?.[0]?.status === "COMPLETED");

const prod = (await admin.from("products").select("id, stock, status").eq("slug", "kopel-rim-hitam-tni").single()).data;
let s = await admin.rpc("adjust_stock", { p_product_id: prod.id, p_delta: -1 });
check("adjust_stock -1 -> stok 14", !s.error && s.data.stock === 14, s.error?.message ?? `stok ${s.data?.stock}`);
s = await admin.rpc("adjust_stock", { p_product_id: prod.id, p_delta: -100 });
check("adjust_stock tidak negatif -> 0 & HABIS", s.data?.stock === 0 && s.data?.status === "HABIS", `stok ${s.data?.stock} ${s.data?.status}`);
s = await admin.rpc("adjust_stock", { p_product_id: prod.id, p_delta: 5 });
check("restock dari 0 -> TERSEDIA", s.data?.stock === 5 && s.data?.status === "TERSEDIA", `stok ${s.data?.stock} ${s.data?.status}`);
const custom = (await admin.from("products").select("id").eq("slug", "badge-nama-dada-bordir").single()).data;
s = await admin.rpc("adjust_stock", { p_product_id: custom.id, p_delta: -1 });
check("produk CUSTOM tetap CUSTOM setelah ubah stok", s.data?.status === "CUSTOM", String(s.data?.status));
s = await admin.rpc("adjust_stock", { p_product_id: "00000000-0000-0000-0000-000000000000", p_delta: 1 });
check("adjust_stock id tak dikenal -> stok null (ditangani UI)", !s.error && s.data?.stock === null, JSON.stringify(s.data));

// ── Login non-admin ──
const user = createClient(url, env.ANON_KEY);
await user.auth.signInWithPassword({ email: nonAdminEmail, password });
r = await user.from("orders").select("*");
check("user login non-admin TIDAK melihat orders", !r.error && r.data.length === 0);
r = await user.from("orders").update({ status: "READY" }).eq("order_number", o2.data).select();
check("user non-admin TIDAK bisa ubah pesanan", !r.error && r.data.length === 0);
r = await user.rpc("adjust_stock", { p_product_id: prod.id, p_delta: 1 });
check("user non-admin TIDAK bisa adjust_stock", !r.error && r.data?.stock === null, JSON.stringify(r.data));

console.log(`\n${pass} lulus, ${fail} gagal`);
process.exit(fail ? 1 : 0);
