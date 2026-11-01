# Fitur: Desain UI Prototipe Web Toko Bordir (Figma via FigCraft)

## Tujuan
- Merancang antarmuka (UI) web toko perlengkapan dinas & bordir custom di Figma dengan tema militer/TNI yang rapi, bersih, kontras tinggi, dan ramah pengguna (mudah dipahami orang awam/gaptek).

## Kriteria Selesai
- [ ] Section Design Tokens & Palet Warna (Hijau Army TNI `#2D5A27`, Aksen Emas Pangkat `#C5A059`, Netral Gelap `#1A201A`, Netral Terang `#F8FAF6`)
- [ ] Frame 1: Beranda & Katalog Ketersediaan Stok (Navbar, Filter Cepat, Status Stok Jelas: TERSEDIA / HABIS)
- [ ] Frame 2: Formulir Pesanan Custom Bordir (Input Nama, No. WA, Jenis Bordir, Panduan Langkah Pesan)
- [ ] Frame 3: Cek Status / Tracking Pesanan (Input No. WA / ID Pesanan, Timeline: Diterima → Dikerjakan → Siap Diambil)
- [ ] Frame 4: Dashboard Manajemen Pemilik Toko (Alert pesanan belum selesai > 3 hari, Tabel Update Status, Quick Search Stok & Lokasi Rak)

## Batasan
- Jangan ubah file konfigurasi dan kode server figcraft (`figcraft/`)
- Desain dibuat langsung pada dokumen Figma yang sedang terhubung melalui FigCraft
- Tidak menggunakan elemen UI yang rumit/membingungkan pengguna awam

## Langkah
1. Buat branch baru `feature/design-ui-figma` dari `main`
2. Generate Design Tokens & Style Guide di Figma
3. Generate Frame Halaman Utama (Katalog & Ketersediaan Stok)
4. Generate Frame Formulir Pesanan Custom Bordir
5. Generate Frame Tracking Status Pesanan
6. Generate Frame Dashboard Admin Pemilik Toko
7. Verifikasi dan review tampilan langsung di Figma Desktop
