/**
 * Smoke test logika alur data end-to-end (Frontend & Backend integration)
 */
import assert from "node:assert";

// Simulasi in-memory LocalStorage untuk pengujian headless Node.js
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.get(key) || null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

globalThis.window = { localStorage: new MockLocalStorage() };
globalThis.localStorage = globalThis.window.localStorage;

async function runTest() {
  console.log("🧪 Memulai Pengujian Alur Data End-to-End...");

  // Import modul yang baru dibuat
  const { createOrder, trackOrder } = await import("../src/lib/data/orders.ts");
  const { getProducts, adjustStock } = await import("../src/lib/data/products.ts");
  const { getStoredOrders, updateStoredOrderStatus } = await import("../src/lib/local-store.ts");

  // 1. Uji Pembuatan Pesanan di /pesan
  console.log("\n1. Menguji form /pesan...");
  const orderRes = await createOrder({
    customerName: "Mayor Inf. Rahman",
    customerRank: "Kodam I BB",
    whatsappNumber: "081234567890",
    orderType: "PANGKAT",
    quantity: 4,
    notes: "Pangkat Mayor Timbul Benang Emas Tebal",
  });

  assert.ok(orderRes.ticket, "Nomor tiket harus dibuat");
  assert.match(orderRes.ticket, /^GPT-\d{8}-\d{3}$/, "Format tiket harus GPT-YYYYMMDD-XXX");
  console.log("   ✅ Tiket terbit:", orderRes.ticket);

  // 2. Uji Pelacakan Tiket di /tracking
  console.log("\n2. Menguji pelacakan tiket di /tracking...");
  const trackRes = await trackOrder(orderRes.ticket, "7890");
  assert.ok(trackRes.order, "Pesanan harus ditemukan dengan 4 digit akhir WA");
  assert.strictEqual(trackRes.order.customerName, "Mayor Inf. Rahman");
  assert.strictEqual(trackRes.order.status, "PENDING");
  console.log("   ✅ Pesanan berhasil dilacak. Status awal: PENDING (Antre di mesin)");

  // 3. Uji Keterbacaan Pesanan di /admin
  console.log("\n3. Menguji antrean kasir di /admin...");
  const adminOrders = getStoredOrders() || [];
  const foundInAdmin = adminOrders.find((o) => o.orderNumber === orderRes.ticket);
  assert.ok(foundInAdmin, "Pesanan baru harus masuk ke daftar antrean admin");
  console.log("   ✅ Pesanan terbaca di antrean kasir admin!");

  // 4. Uji Kasir Mengubah Status Jadi READY (Siap Diambil)
  console.log("\n4. Menguji kasir update status pesanan di /admin...");
  updateStoredOrderStatus(foundInAdmin.id, "READY", "Sudah selesai — Siap diambil di toko");
  const updatedOrders = getStoredOrders() || [];
  const afterUpdate = updatedOrders.find((o) => o.id === foundInAdmin.id);
  assert.strictEqual(afterUpdate.status, "READY");
  console.log("   ✅ Kasir berhasil mengubah status menjadi READY");

  // 5. Uji Pelanggan Melihat Status Berubah di /tracking
  console.log("\n5. Menguji perubahan status terbaca di /tracking...");
  const trackAfter = await trackOrder(orderRes.ticket, "7890");
  assert.strictEqual(trackAfter.order.status, "READY");
  assert.strictEqual(trackAfter.order.estimatedDone, "Sudah selesai — Siap diambil di toko");
  console.log("   ✅ Pelanggan langsung melihat statusnya 'READY' (Siap Diambil di toko)!");

  // 6. Uji Kasir Menyesuaikan Stok Fisik di /admin
  console.log("\n6. Menguji kasir update stok barang di /admin...");
  const initialProducts = await getProducts();
  const targetProduct = initialProducts.data[0];
  const initialStock = targetProduct.stock;
  console.log(`   Stok awal "${targetProduct.name}": ${initialStock} pcs`);

  // Kasir mengurangi 2 pcs (terjual langsung di toko)
  const afterMinus = await adjustStock(targetProduct.id, -2);
  assert.strictEqual(afterMinus.stock, initialStock - 2);

  // 7. Uji Katalog Publik / Menampilkan Stok Baru
  console.log("\n7. Menguji katalog etalase publik / menampilkan stok sinkron...");
  const catalogAfter = await getProducts();
  const refreshedItem = catalogAfter.data.find((p) => p.id === targetProduct.id);
  assert.strictEqual(refreshedItem.stock, initialStock - 2);
  console.log(`   ✅ Stok di katalog toko berhasil sinkron: ${refreshedItem.stock} pcs!`);

  console.log("\n🎉 SEMUA 7 SKENARIO INTEGRASI END-TO-END LULUS 100%!");
}

runTest().catch((err) => {
  console.error("❌ Test gagal:", err);
  process.exit(1);
});
