# Fitur: Setup & Inisialisasi Web App Next.js 15 + Tailwind CSS

## Tujuan
- Melakukan inisialisasi arsitektur proyek web Toko Bordir Gaperta menggunakan Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, dan library helper yang siap terhubung ke database.

## Kriteria Selesai
- [ ] Inisialisasi `package.json` dengan dependencies (Next.js, React, Tailwind CSS, Lucide React, Supabase)
- [ ] Konfigurasi `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, dan `next.config.ts`
- [ ] Konfigurasi Tailwind dengan palet tema warna TNI:
  - `army-primary`: `#2D5A27`
  - `army-dark`: `#1E3D1A`
  - `army-gold`: `#C5A059`
  - `surface-light`: `#F7F9F6`
- [ ] Struktur folder `src/app`, `src/components`, `src/lib`, `src/types`
- [ ] Halaman `src/app/layout.tsx` dan `src/app/page.tsx` dasar yang berjalan lancar
- [ ] Perintah build lokal `npm run build` dan lint `npm run lint` lulus tanpa error

## Batasan
- Jangan sentuh folder `figcraft/`
- Jangan buat transaksi online/payment gateway (fokus katalog ketersediaan stok & pesanan custom)
- Jangan commit secret / credential database

## Langkah
1. Buat branch baru `feature/init-web-app` dari `main`
2. Konfigurasi `package.json`, scripts build/lint, dan install dependencies
3. Konfigurasi TypeScript dan Tailwind CSS (termasuk custom warna militer TNI)
4. Buat layout utama dan halaman beranda preview
5. Verifikasi build lokal `npm run build`
6. Commit bertahap sesuai konvensi commit
