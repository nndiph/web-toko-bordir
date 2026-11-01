# Fitur: Setup & Inisialisasi Web App Next.js 15 + Tailwind CSS

## Tujuan
- Melakukan inisialisasi arsitektur proyek web Toko Bordir Gaperta menggunakan Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, dan library helper yang siap terhubung ke database.

## Kriteria Selesai
- [x] Inisialisasi `package.json` dengan dependencies (Next.js, React, Tailwind CSS, Lucide React, Supabase)
- [x] Konfigurasi `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, dan `next.config.ts`
- [x] Konfigurasi Tailwind dengan palet tema warna TNI:
  - `army-primary`: `#2D5A27`
  - `army-dark`: `#1E3D1A`
  - `army-gold`: `#C5A059`
  - `surface-light`: `#F7F9F6`
- [x] Struktur folder `src/app`, `src/components`, `src/lib`, `src/types`
- [x] Halaman `src/app/layout.tsx` dan `src/app/page.tsx` dasar yang berjalan lancar
- [x] Perintah build lokal `npm run build` dan lint `npm run lint` lulus tanpa error

## Batasan
- Jangan sentuh folder `figcraft/`
- Jangan buat transaksi online/payment gateway (fokus katalog ketersediaan stok & pesanan custom)
- Jangan commit secret / credential database

## Langkah
1. [x] Buat branch baru `feature/init-web-app` dari `main`
2. [x] Konfigurasi `package.json`, scripts build/lint, dan install dependencies
3. [x] Konfigurasi TypeScript dan Tailwind CSS (termasuk custom warna militer TNI)
4. [x] Buat layout utama dan halaman beranda preview
5. [x] Verifikasi build lokal `npm run build` dan `npm run lint`
6. [x] Commit bertahap sesuai konvensi commit
7. [ ] Push branch `feature/init-web-app` dan buka Pull Request ke `main`
