# Rencana: Redesign Tampilan Berdasarkan Referensi "TechNest" (Fase 11)

Branch: `feature/redesign-dark-technest`

## 1. Analisis Referensi Desain "TechNest"
Referensi visual yang diberikan memiliki karakteristik:
1. **Header & Hero Dark Mode Modern**: Latar belakang hitam pekat (`#0B0F12` / `#0D1117`) elegan dipadukan dengan tipografi putih tebal dan foto showcase produk yang melayang (floating).
2. **Aksen Hijau Vibrant / Neon (`#22C55E` / `#16A34A`)**: Memberikan kontras tinggi yang eye-catching untuk tombol CTA ("Shop Now"), badge produk ("New"), dan icon fitur, sangat selaras dengan tema militer/taktis modern.
3. **Value Proposition Bar di Bawah Hero**: Bar hitam dengan 3 pilar jaminan ber-icon hijau neon.
4. **Featured Products di Kanvas Bersih**: Grid produk 4 kolom (2 kolom di mobile) berlatar belakang putih, dengan foto produk dalam kontainer abu-abu terang halus (`bg-slate-50`), badge status, nama produk tebal, harga, dan tombol CTA hijau solid penuh.
5. **Mid-Promo Banner Gelap ("Boost Your Productivity")**: Banner horizontal dark mode dengan headline tajam, CTA hijau, dan visual produk di samping kanan.
6. **Dual Category Showcase ("New Arrivals" & "Best Sellers")**: 2 kartu besar berdampingan dengan foto produk dan tombol CTA hijau di bawahnya.
7. **Footer Dark Mode Elegan**: Bar konsultasi cepat + kolom informasi navigasi & akses kasir.

## 2. Rencana Implementasi
1. **Tailwind Config & Styling**:
   - Tambahkan warna dark modern (`#0B0F12`, `#121820`, `#1E293B`) dan aksen hijau vibrant (`#22C55E`, `#16A34A`) ke `tailwind.config.ts`.
2. **Navbar Redesign**:
   - Dark mode modern (`bg-[#0B0F12]`), logo GAPERTA dengan icon perisai aksen hijau neon, menu navigasi jelas, dan tombol WhatsApp Kasir hijau vibrant.
3. **Hero Section Redesign**:
   - Dark aesthetic dengan headline tegas "Perlengkapan Dinas & Bordir Komputer Presisi".
   - Subheadline & tombol CTA ganda (Pesan Bordir & Cek Stok Rak).
   - Hero visual showcase atribut dinas & bordir di sisi kanan.
   - Search bar cepat yang terintegrasi.
4. **Value Proposition Bar**:
   - 3 pilar (Bordir Cepat 1-2 Hari, Standar Mabes TNI, Stok Rak Fisik Nyata) dengan icon kotak hijau modern.
5. **Featured Products Catalog**:
   - Filter kategori ala retail dengan pill responsif.
   - Grid produk 4 kolom desktop / 2 kolom mobile dengan foto bersih, badge New/Tersedia/Habis, nomor rak fisik, dan tombol aksi hijau solid.
6. **Mid-Promo Banner**:
   - "Pesan Bordir Satuan & Regu" dengan latar gelap dan tombol CTA hijau.
7. **Dual Category Showcase**:
   - Kartu "Atribut & Pangkat Resmi" dan "Bordir Komputer Custom".
8. **Dark Footer**:
   - Konsultasi pesanan khusus, info toko, jam operasional, dan link Kasir/Pemilik.
9. **Penyelarasan Halaman Lain (`/pesan`, `/tracking`, `/admin`)**:
   - Pastikan warna aksen konsisten dengan tema baru tanpa merusak fungsionalitas form dan tracking.
10. **Verifikasi & Pengujian**:
    - Build `npm run build` dan lint `npm run lint`.
    - Test e2e `npm run test:e2e`.

Kriteria Selesai:
- [ ] Tampilan halaman utama mengadopsi estetika TechNest (Dark Hero + Clean Grid + Vibrant Green).
- [ ] Fungsionalitas bisnis tetap utuh (cek stok, filter kategori, nomor rak, pesan bordir, lacak tiket).
- [ ] Build, lint, dan test e2e lulus 100%.
