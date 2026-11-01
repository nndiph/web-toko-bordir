# Fitur: Peningkatan Visual E-Commerce (Hero Showcase & Departemen Visual ala Tokopedia/Uniqlo)

## Tujuan
- Meningkatkan visual etalase web Toko Gaperta agar tidak sekadar teks, melainkan memiliki visual showcase produk unggulan di Hero Banner dan sampul gambar produk yang membetahkan pengunjung (seperti Tokopedia & Uniqlo).
- Membangun sistem pengkategorian visual ("Jelajahi Departemen Produk") dengan 5 kartu departemen berfoto penuh (*full-photo cover*) yang memudahkan pelanggan langsung menyaring etalase.
- Memperluas katalog produk awal menjadi 8 item nyata dengan foto sampul beresolusi tinggi dan fallback grafis otomatis.
- Memanfaatkan Figcraft MCP untuk sinkronisasi layout visual ke canvas Figma Desktop.

## Kriteria Selesai
- [x] **Hero Banner 2-Kolom dengan Featured Product Showcase**: Mengisi ruang kanan banner yang sebelumnya kosong dengan kartu produk unggulan nyata (Pangkat Bordir TNI AD - Serda), dilengkapi foto beresolusi tinggi, floating badges (*★ Produk Paling Dicari*, *Tersedia 24 pcs*), harga kontras, lokasi rak fisik, dan tombol cepat WhatsApp.
- [x] **Jelajahi Departemen Produk Berfoto Penuh (*Full-Photo Cards*)**: 5 departemen (Badge & Pangkat, Seragam PDL/PDH, Sabuk & Kopel, Topi & Baret, Pesanan Custom) kini menampilkan foto sampul riil, overlay gradien halus, indikator jumlah item, serta interaksi 1-klik filter katalog toko.
- [x] **Sampul Gambar Produk (*Aspect 4:3 Image Cover*)**: Terintegrasi di setiap kartu katalog produk dengan efek hover zoom halus dan fallback grafis elegan jika offline.
- [x] **Badge Status Stok Mengambang**: Badge *Tersedia*, *Stok Habis*, dan *Custom Order* melayang di atas foto dengan kontras tajam.
- [x] **Etalase Produk 8 Item Dinas Nyata**: Pangkat, Kopel Rim, Seragam PDL Malvinas, Badge Nama Bordir, Baret Kostrad, Sabuk Kopral Gesper Kuningan, Pangkat Perwira Kapten, dan Badge KODAM I/BB.
- [x] **Sinkronisasi Figma via Figcraft**: Frame visual prototipe telah diperbarui di canvas Figma Desktop.
- [x] **Verifikasi Kualitas**: Pengujian build (`npm run build`) 7/7 halaman statis dan linting (`npm run lint`) lulus 100% tanpa error/warning.

## Batasan
- Jangan sentuh folder `figcraft/`.
- Jangan ubah alur transaksi fisik toko (tetap via WhatsApp & pengambilan di toko).
- Pertahankan palet warna militer bersih dan font Plus Jakarta Sans.
