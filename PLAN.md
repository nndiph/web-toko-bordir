# Fitur: Dashboard Manajemen Pemilik Toko (Alert Pesanan & Kasir Quick-Check)

## Tujuan
- Membangun dashboard manajemen toko di `/admin` untuk membantu pemilik toko mengatasi masalah pesanan bordir yang terlewat (> 3 hari), mempermudah kasir mengecek sisa stok & lokasi rak saat pembeli datang, serta mengelola antrean mesin bordir komputer secara real-time.

## Kriteria Selesai
- [x] Halaman Dashboard Admin di `src/app/admin/page.tsx`
- [x] Ringkasan KPI:
  - Jumlah Pesanan Aktif
  - **Alert Kartu Merah**: Pesanan yang sudah > 3 hari belum selesai
  - **Alert Stok Menipis**: Produk dengan sisa stok < 5 pcs
- [x] **Fitur Kasir Quick-Check**:
  - Kolom pencarian instan nama barang
  - Menampilkan sisa stok dan letak rak fisik barang di toko
  - Tombol cepat tambah/kurang stok (+ / -) langsung di tempat
- [x] **Tabel Antrean Pesanan Bordir**:
  - Filter kategori status (Semua, Terlewat, Sedang Dibordir, Siap Diambil)
  - Highlight visual untuk pesanan prioritas / terlewat
  - Tombol 1-klik ubah status pengerjaan (Mulai Bordir, Siap Diambil, Selesai)
- [x] Tautan navigasi dashboard di Navbar & Header
- [x] Halaman kustom `not-found.tsx` untuk 404
- [x] Build check (`npm run build`) dan lint check (`npm run lint`) lulus 100%

## Batasan
- Jangan sentuh folder `figcraft/`
- Jangan buat transaksi online/payment gateway
- Jangan commit secret / credential database

## Langkah
1. [x] Buat branch baru `feature/admin-dashboard` dari `main`
2. [x] Kembangkan halaman Dashboard Admin di `src/app/admin/page.tsx`
3. [x] Tambahkan tautan akses admin di `Navbar.tsx`
4. [x] Buat halaman 404 `src/app/not-found.tsx`
5. [x] Jalankan pengujian lokal `npm run build` dan `npm run lint`
6. [ ] Commit bertahap, push branch, dan buka PR ke `main`
7. [ ] Perbarui `AGENTS.md`
