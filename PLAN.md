# Fitur: Form Pemesanan Custom Bordir & Tracking Status Pesanan

## Tujuan
- Membangun halaman form pemesanan bordir custom online (`/pesan`) dan halaman tracking status pesanan (`/tracking`) yang mudah digunakan, menghasilkan nomor tiket pesanan, dan memiliki visual timeline progres pengerjaan sesuai prototipe Figma.

## Kriteria Selesai
- [ ] Komponen Navbar reusable di `src/components/Navbar.tsx` dengan link navigasi aktif ke semua halaman (`/`, `/pesan`, `/tracking`)
- [ ] Halaman Form Pemesanan Custom Bordir di `src/app/pesan/page.tsx`:
  - Input Nama & Pangkat Pemesan
  - Input No. WhatsApp (Validasi format)
  - Pilihan Jenis Bordir (Nama Dada, Badge Pangkat, Lokasi Satuan, Emblem)
  - Jumlah & Catatan warna benang / kain
  - Generate otomatis Nomor Tiket Pesanan (format: `GPT-YYYYMMDD-XXX`)
  - Konfirmasi pemesanan sukses dengan tombol simpan & salin tiket
- [ ] Halaman Tracking Status Pesanan di `src/app/tracking/page.tsx`:
  - Form pencarian berdasarkan No. Tiket atau No. WhatsApp
  - Visual timeline 3 langkah (Pesanan Diterima → Sedang Dibordir → Siap Diambil)
  - Rincian pesanan dan estimasi waktu selesai
- [ ] Build check (`npm run build`) dan lint check (`npm run lint`) lulus 100%

## Batasan
- Jangan sentuh folder `figcraft/`
- Jangan buat transaksi online/payment gateway (pengambilan & transaksi langsung di toko)
- Jangan commit secret / credential database

## Langkah
1. Buat branch baru `feature/order-and-tracking` dari `main`
2. Buat komponen reusable `Navbar.tsx`
3. Kembangkan halaman form bordir `src/app/pesan/page.tsx`
4. Kembangkan halaman tracking pesanan `src/app/tracking/page.tsx`
5. Hubungkan navigasi di `src/app/page.tsx` ke halaman `/pesan` dan `/tracking`
6. Jalankan pengujian lokal `npm run build` dan `npm run lint`
7. Commit bertahap, push branch, dan buka PR ke `main`
8. Perbarui `AGENTS.md`
