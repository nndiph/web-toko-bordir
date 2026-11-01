# Fitur: Desain UI Prototipe Web Toko Bordir (Figma via FigCraft)

## Tujuan
- Merancang antarmuka (UI) web toko perlengkapan dinas & bordir custom di Figma dengan tema militer/TNI yang rapi, bersih, kontras tinggi, dan ramah pengguna (mudah dipahami orang awam/gaptek).

## Kriteria Selesai
- [x] Section Design Tokens & Palet Warna (Hijau Army TNI `#2D5A27`, Aksen Emas Pangkat `#C5A059`, Netral Gelap `#1A201A`, Netral Terang `#F8FAF6`)
- [x] Frame 1: Beranda & Katalog Ketersediaan Stok (Navbar, Filter Cepat, Status Stok Jelas: TERSEDIA / HABIS)
- [x] Frame 2: Formulir Pesanan Custom Bordir (Input Nama, No. WA, Jenis Bordir, Panduan Langkah Pesan)
- [x] Frame 3: Cek Status / Tracking Pesanan (Input No. WA / ID Pesanan, Timeline: Diterima → Dikerjakan → Siap Diambil)
- [x] Frame 4: Dashboard Manajemen Pemilik Toko (Alert pesanan belum selesai > 3 hari, Tabel Update Status, Quick Search Stok & Lokasi Rak)

## Batasan
- Jangan ubah file konfigurasi dan kode server figcraft (`figcraft/`)
- Desain dibuat langsung pada dokumen Figma yang sedang terhubung melalui FigCraft
- Tidak menggunakan elemen UI yang rumit/membingungkan pengguna awam

## Langkah
1. [x] Buat branch baru `feature/design-ui-figma` dari `main`
2. [x] Generate Frame 1: Beranda & Katalog Ketersediaan Stok
3. [x] Generate Frame 2: Formulir Pesanan Custom Bordir
4. [x] Generate Frame 3: Cek Status / Tracking Pesanan
5. [x] Generate Frame 4: Dashboard Manajemen Pemilik Toko (Fokus Alert Pesanan & Kasir Quick Search)
6. [x] Verifikasi dan audit kualitas desain (`verify_design` lulus dengan 0 error)
7. [ ] Push branch `feature/design-ui-figma` dan buka Pull Request ke `main`
