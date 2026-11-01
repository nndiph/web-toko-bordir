# Fitur: Peningkatan UI/UX Profesional (Color Harmony, Modern Typography, & E-Commerce Polish)

## Tujuan
- Memperbaiki desain visual web app Toko Gaperta agar memiliki tampilan e-commerce modern, profesional, bersih, dan nyaman di mata.
- Menerapkan prinsip desain dari skill UI/UX fundamentals (`ui-ux-fundamentals`): distribusi warna 60-30-10, perbaikan palet warna militer yang lebih menyatu dan elegan, integrasi font profesional (Plus Jakarta Sans), peningkatan hierarki teks, serta peremajaan komponen kartu produk, hero section, form pemesanan, dan dashboard admin.

## Rincian Perbaikan Berdasarkan Skill UI/UX
1. **Tipografi E-Commerce Profesional (Tegas & Clean):**
   - Integrasikan font modern **Plus Jakarta Sans** via `@import` di `src/app/globals.css` dan tailwind font family.
   - Gunakan `tracking-tight` (-0.025em) pada judul utama untuk kesan tegas dan modern.
   - Atur hierarki teks kontras tinggi: Headings (`text-slate-900 font-bold`), Body (`text-slate-600`), Keterangan/Metadata (`text-slate-500 font-medium`).
   - Gunakan `tabular-nums` dan `font-semibold` untuk harga, kuantitas stok, dan nomor tiket pesanan.

2. **Harmonisasi Palet Warna (Aturan 60-30-10):**
   - **60% Surface Netral Bersih:** Latar belakang canvas `slate-50` (`#F8FAFC`), kartu putih bersih `#FFFFFF`, border halus presisi `slate-200` (`#E2E8F0`).
   - **30% Struktur & Teks:** Teks pekat kontras tinggi `slate-900` (`#0F172A`) dan surface panel `slate-100/80` yang tenang dan tidak melelahkan mata.
   - **10% Brand Accent:**
     - **Military Forest Green (`#165028` / `#1B431D`):** Hijau dinas yang lebih kaya dan berwibawa untuk tombol aksi utama, badge resmi, dan aksen aktif.
     - **Refined Brass Gold (`#C59B27` / `#B45309`):** Aksen emas hangat untuk lencana/badge khusus tanpa mencolok berlebihan.
     - **Semantic Statuses:** Emerald lembut untuk stok tersedia, Rose lembut untuk stok habis, Amber lembut untuk custom order.

3. **Penyempurnaan Komponen UI:**
   - **Navbar:** Sticky dengan glassmorphism (`backdrop-blur-md bg-white/95`), border bawah tipis, logo Gaperta yang lebih berwibawa, indikator navigasi aktif, dan menu mobile responsif.
   - **Hero Section:** Banner dengan gradien deep forest slate berkelas, teks putih tegas, badge akreditasi layanan resmi, dan trust-bar (Pengerjaan Cepat, Bordir Presisi Komputer, Stok Real-Time).
   - **Kartu Produk (Katalog):** Tambahkan placeholder visual/ikon kategori di bagian atas kartu produk agar menyerupai katalog belanja profesional, tata letak badge stok, harga yang menonjol, lokasi rak beraksen etalase, dan tombol CTA dengan transisi mikro.
   - **Form Pemesanan (`/pesan`) & Tracking (`/tracking`):** Form field dengan ring focus modern (`ring-2 ring-army/20`), layout 2 kolom yang seimbang, kartu preview ringkasan tiket pesanan voucher yang elegan.
   - **Dashboard Pemilik (`/admin`):** Kartu KPI modern dengan aksen warna fungsional, tabel antrean bordir yang lega dan mudah dibaca, serta filter interaktif.

## Kriteria Selesai
- [x] Font Plus Jakarta Sans terkonfigurasi dan aktif di seluruh aplikasi via `globals.css` dan `tailwind.config.ts`.
- [x] Palet warna Tailwind diselaraskan (surface slate bersih, deep military green, refined brass gold).
- [x] Halaman Beranda & Katalog (`src/app/page.tsx`) diperbarui dengan visual e-commerce profesional.
- [x] Komponen Navbar (`src/components/Navbar.tsx`) diperbarui dengan gaya modern glassmorphism & mobile dropdown.
- [x] Halaman Form Pesan Bordir (`src/app/pesan/page.tsx`) diperbarui.
- [x] Halaman Cek Status Pesanan (`src/app/tracking/page.tsx`) diperbarui.
- [x] Halaman Dashboard Pemilik (`src/app/admin/page.tsx`) disesuaikan agar selaras dengan tema baru.
- [x] Halaman 404 (`src/app/not-found.tsx`) diperbarui.
- [x] Pengujian build (`npm run build`) dan linting (`npm run lint`) lulus 100% tanpa error.

## Batasan
- Jangan ubah logika fungsional bisnis (Nomor Tiket, Kasir Quick-Check, Alert Kartu Merah > 3 hari tetap bekerja seperti semula).
- Jangan sentuh folder `figcraft/`.
- Jangan commit secret / credential.
