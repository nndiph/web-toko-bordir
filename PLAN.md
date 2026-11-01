# Fitur: Peningkatan Visual E-Commerce (Sampul Gambar Produk & Departemen Visual ala Tokopedia/Uniqlo)

## Tujuan
- Meningkatkan visual etalase web Toko Gaperta agar tidak sekadar teks, melainkan memiliki sampul gambar produk yang jelas dan mengundang selera belanja (seperti Tokopedia & Uniqlo).
- Membangun sistem pengkategorian visual ("Jelajahi Departemen Produk") dengan 5 kartu departemen interaktif yang memudahkan dan membetahkan pelanggan saat menjelajah barang dinas.
- Memperluas katalog produk awal menjadi 8 item nyata dengan foto sampul beresolusi tinggi dan fallback SVG elegan.
- Memanfaatkan Figcraft MCP untuk sinkronisasi layout visual ke canvas Figma Desktop.

## Kriteria Selesai
- [x] Sampul gambar produk (*Aspect 4:3 Image Cover*) terintegrasi di setiap kartu produk dengan efek hover zoom halus.
- [x] Badge status stok (*Tersedia*, *Stok Habis*, *Custom Order*) dan tag kategori mengambang di atas sampul gambar.
- [x] Fallback grafis otomatis jika foto belum termuat atau jaringan offline.
- [x] Seksi pengkategorian visual (*Featured Departments*) dengan 5 departemen (Badge & Pangkat, Seragam PDL/PDH, Sabuk & Kopel, Topi & Baret, Pesanan Custom).
- [x] Interaksi 1-klik: Mengklik kartu departemen langsung memfilter katalog dan melakukan scroll halus ke etalase.
- [x] Etalase produk diperluas menjadi 8 produk dinas TNI nyata.
- [x] Sinergi dengan FigCraft di Figma Desktop (`01 - Beranda & Katalog (Visual E-Commerce Showcase)`).
- [x] Pengujian build (`npm run build`) dan linting (`npm run lint`) lulus 100% tanpa error/warning.

## Batasan
- Jangan sentuh folder `figcraft/`.
- Jangan ubah alur transaksi fisik toko (tetap via WhatsApp & pengambilan di toko).
- Pertahankan palet warna militer bersih dan font Plus Jakarta Sans.
