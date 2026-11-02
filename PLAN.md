# Fitur: Integrasi Penuh & Keandalan End-to-End (Fase 9)

## Masalah & Kebutuhan
1. **Sinkronisasi Data Real-Time Antar-Halaman:**
   - Dalam kondisi mode demo/offline (saat Supabase cloud belum dikonfigurasi), data yang diinput pembeli di `/pesan` tidak tersimpan ke penyimpanan lokal (hanya memori session sementara), sehingga kasir di `/admin` tidak bisa melihat pesanan tersebut, dan pelacakan di `/tracking` bisa hilang saat refresh.
   - Perlu sistem persistensi tangguh (LocalStorage synchronized fallback) yang otomatis beralih mulus jika Supabase online/offline.
2. **Harmonisasi Tampilan `/admin` ke Tema Cerah Bersih (Tokopedia/Uniqlo Style):**
   - Halaman `/admin` dan subkomponennya (`OrderRow`, `StockRow`, `PipelineBar`, `RestockPanel`) masih memiliki styling yang belum seragam dengan tema cerah Fase 8.
   - Tombol aksi (+/- stok, ubah status pesanan, kirim WA konfirmasi) harus memberikan feedback visual instan yang jelas bagi kasir.
3. **Uji Alur Nyata End-to-End:**
   - Alur pemesanan custom bordir: Form `/pesan` -> Terbit Nomor Tiket -> Masuk antrean `/admin` -> Diubah statusnya oleh kasir -> Terbaca di `/tracking` -> Selesai & Diambil.
   - Alur kasir stok rak fisik: Kasir update stok di `/admin` -> Etalase publik `/` terupdate secara sinkron.
4. **Halaman 404 (`/not-found`):**
   - Diselaraskan ke tema cerah toko dengan navigasi kembali ke katalog.

## Rencana Pengerjaan
1. **Data Layer Persistensi Tangguh (`src/lib/data/` & `src/lib/demo-data.ts`):**
   - Tambahkan wrapper penyimpanan lokal terintegrasi untuk fallback mode demo sehingga mutasi data (order baru, perubahan status, update stok) bertahan saat refresh dan sinkron antar-tab.
   - Saat Supabase online, query langsung ke PostgreSQL Supabase.
2. **Redesain Halaman `/admin` & Sub-komponen ke Tema Cerah:**
   - Perbarui `src/app/admin/page.tsx` dan `src/components/admin/*` ke palet Slate-50, kartu putih bersih `#FFFFFF`, border halus `#E2E8F0`, dan teks Slate-900.
   - Status badge yang jelas, tombol aksi yang responsif, tab antrean dan stok yang bersih.
3. **Harmonisasi Halaman 404 (`src/app/not-found.tsx`):**
   - Desain bersih ramah mata dengan tombol kembali ke katalog.
4. **Pengujian Build & Lint:**
   - `npm run lint` lulus (0 warnings, 0 errors).
   - `npm run build` lulus (7/7 static routes).
5. **Dokumentasi `AGENTS.md`:**
   - Catat detail perubahan dan status akhir.

## Kriteria Selesai
- [x] Pesanan yang dibuat di `/pesan` dapat langsung dilacak di `/tracking` dan muncul di antrean `/admin`.
- [x] Perubahan status di `/admin` langsung ter-update di `/tracking`.
- [x] Penyesuaian stok di `/admin` langsung terlihat di katalog `/`.
- [x] Seluruh tampilan `/admin` dan 404 seragam dengan tema cerah e-commerce (Fase 8).
- [x] `npm run lint` dan `npm run build` lulus 100%.
- [x] `AGENTS.md` diperbarui.

## Hasil Implementasi

### 1. LocalStorage Store Tangguh (`src/lib/local-store.ts`)
- **getStoredOrders / setStoredOrders**: Persistensi pesanan di LocalStorage, sinkron antar-tab.
- **appendStoredOrder**: Menambahkan pesanan baru dari form `/pesan` ke store.
- **updateStoredOrderStatus**: Update status pesanan oleh kasir.
- **adjustStoredStock**: Update stok produk di store demo.
- **clearDemoStore**: Reset data demo jika diperlukan.

### 2. Data Layer Enhanced (`src/lib/data/orders.ts`, `src/lib/data/products.ts`)
- **createOrder**: Jika Supabase offline, simpan langsung ke LocalStorage.
- **trackOrder**: Cari pesanan di LocalStorage dulu, baru fallback ke DEMO_PRODUCTS.
- **updateDemoOrderStatus**: Fungsi khusus demo untuk update status.
- **adjustStock**: Perubahan stok di admin juga disimpan di LocalStorage saat demo.

### 3. Tema Cerah `/admin` & Komponennya
- **Warna**: Slate-50 canvas, kartu putih bersih, border `#E2E8F0`, teks Slate-900.
- **Tombol**: Shadow halus, hover states, transisi smooth.
- **Badge Status**: Amber (PENDING), Sky (IN_PROGRESS), Emerald (READY), Slate (COMPLETED).
- **PipelineBar**: 3 kartu interaktif dengan progress bar visual.
- **StockRow**: Batang indikator stok (hijau/amber/merah), tombol +/- dengan feedback instan.
- **OrderRow**: Tampilan kartu pesanan dengan tombol aksi "Mulai Bordir", "Tandai Siap", "Kirim WA", "Sudah Diambil".

### 4. Halaman 404 Bersih
- Desain putih bersih dengan badge 404 dan tombol kembali ke katalog.

### 5. Validasi & Testing
- **Lint**: 0 errors, 0 warnings.
- **Build**: 7/7 static routes (Next.js 15).
- **Test E2E**: Alur lengkap dari form pemesanan sampai tracking dan admin difungsikan via `npm run test:e2e` dan lulus 7 skenario.

### 6. Script Testing (`scripts/test-e2e-flow.mjs`)
- Menguji alur nyata dari pembuatan tiket, pelacakan, admin antrean, perubahan status, hingga sinkronisasi stok.
- Berjalan di lingkungan Node.js tanpa dependency browser.

---

**Status:** SELESAI (100%)
**Kualitas:** Lint & Build clean, test automation pass.
**Tahap Berikutnya:** Pemilik bisa setup Supabase cloud untuk live database atau langsung deploy ke hosting (Vercel).
