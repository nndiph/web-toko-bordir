# Fitur: Dashboard Manajemen Pemilik Toko (Alert Pesanan & Kasir Quick-Check)

## Tujuan
- Membangun dashboard manajemen toko di `/admin` untuk membantu pemilik toko mengatasi masalah pesanan bordir yang terlewat (> 3 hari), mempermudah kasir mengecek sisa stok & lokasi rak saat pembeli datang, serta mengelola antrean mesin bordir komputer secara real-time.

## Kriteria Selesai
- [ ] Halaman Dashboard Admin di `src/app/admin/page.tsx`
- [ ] Ringkasan KPI:
  - Jumlah Pesanan Aktif
  - **Alert Kartu Merah**: Pesanan yang sudah > 3 hari belum selesai
  - **Alert Stok Menipis**: Produk dengan sisa stok < 5 pcs
- [ ] **Fitur Kasir Quick-Check**:
  - Kolom pencarian instan nama barang
  - Menampilkan sisa stok dan letak rak fisik barang di toko
  - Tombol cepat tambah/kurang stok (+ / -) langsung di tempat
- [ ] **Tabel Antrean Pesanan Bordir**:
  - Filter kategori status (Semua, Terlewat, Sedang Dibordir, Siap Diambil)
  - Highlight visual untuk pesanan prioritas / terlewat
  - Tombol 1-klik ubah status pengerjaan (Mulai Bordir, Siap Diambil, Selesai)
- [ ] Tautan navigasi dashboard di Navbar / Footer
- [ ] Build check (`npm run build`) dan lint check (`npm run lint`) lulus 100%

## Batasan
- Jangan sentuh folder `figcraft/`
- Jangan buat transaksi online/payment gateway
- Jangan commit secret / credential database

## Langkah
1. Buat branch baru `feature/admin-dashboard` dari `main`
2. Kembangkan halaman Dashboard Admin di `src/app/admin/page.tsx`
3. Tambahkan tautan akses admin di Footer web
4. Jalankan pengujian lokal `npm run build` dan `npm run lint`
5. Commit bertahap, push branch, dan buka PR ke `main`
6. Perbarui `AGENTS.md`
