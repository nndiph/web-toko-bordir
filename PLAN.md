# Fitur: Fase 5 — Integrasi Database Supabase & Skema Tabel

## Tujuan
- Mengganti data mock (`INITIAL_PRODUCTS`, `INITIAL_INVENTORY`, `INITIAL_ORDERS`) dengan data nyata dari Supabase (PostgreSQL).
- Menyelesaikan 3 masalah inti toko dengan data persisten:
  1. Form `/pesan` benar-benar menyimpan pesanan custom bordir dan menghasilkan Nomor Tiket unik.
  2. `/admin` membaca antrean pesanan nyata dan menghitung Alert Kartu Merah (> 3 hari belum selesai) dari `created_at`.
  3. Katalog & Kasir Quick-Check membaca stok + lokasi rak nyata, dan tombol +/- stok tersimpan ke database.
- `/tracking` mencari status pesanan berdasarkan Nomor Tiket dari database.

## Rencana Langkah (commit kecil per langkah)
1. **Skema & seed SQL** di folder `supabase/`:
   - `supabase/migrations/0001_init.sql`: tabel `categories`, `products`, `orders`; enum status; fungsi/sequence pembuat nomor tiket `GPT-YYYYMMDD-NNN`.
   - `supabase/seed.sql`: 5 kategori + 8 produk dinas (sama dengan mock saat ini).
   - **RLS**: publik hanya boleh `SELECT` produk/kategori, `INSERT` pesanan, dan lookup pesanan via fungsi RPC berdasarkan nomor tiket + 4 digit akhir WA. Update stok/status pesanan hanya untuk admin terautentikasi.
2. **Env & klien**: `.env.example` (tanpa secret), perbarui `src/lib/supabase.ts`, tambah mapper row (snake_case) ke tipe di `src/types/index.ts`.
3. **Data layer** `src/lib/data/` (`products.ts`, `orders.ts`) — fungsi terpisah dari komponen UI.
4. **Hubungkan UI**: `page.tsx` (katalog), `pesan/page.tsx` (insert), `tracking/page.tsx` (RPC), `admin/page.tsx` (baca + update stok/status).
5. **Fallback**: bila env Supabase belum diisi, UI tetap jalan dengan data demo dan menampilkan banner "Mode Demo", agar build/CI tidak pecah.
6. **Verifikasi**: `npm run lint` dan `npm run build` harus lulus; update `AGENTS.md`.

## Kriteria Selesai
- [x] Migrasi + seed SQL siap dijalankan di Supabase SQL Editor (**belum diuji di Postgres/Supabase nyata**).
- [x] RLS aktif di semua tabel dengan kebijakan seperti di atas.
- [x] Katalog, pesan, tracking, dan admin membaca/menulis ke Supabase (kode siap; belum diuji end-to-end tanpa project Supabase).
- [x] Mode demo berjalan bila env kosong.
- [x] `npm run lint` dan `npm run build` lulus 100%.
- [x] `AGENTS.md` diperbarui.

## Hal yang Dibutuhkan dari Pemilik Proyek
- Membuat project Supabase dan mengisi `.env.local` dengan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (tidak boleh di-commit).
- Menjalankan `0001_init.sql` lalu `seed.sql` di Supabase SQL Editor.
- Membuat 1 akun admin (Supabase Auth) dan menandainya admin lewat SQL (lihat komentar di `0001_init.sql`).

## Penyimpangan dari Rencana Awal
- Form login admin minimal ditambahkan di `/admin` (`src/components/AdminLogin.tsx`). Tanpa login, mode live tidak mungkin dipakai.
- Bila Supabase sudah dikonfigurasi tetapi belum login, `/admin` menampilkan form login (bukan data demo) agar data pelanggan tidak terbuka. Data demo hanya muncul bila env kosong.
- Tracking kini mewajibkan nomor tiket + 4 digit terakhir WhatsApp (pencarian hanya dengan nomor WA dihapus) agar data pelanggan tidak bisa ditebak.

## Batasan
- Jangan sentuh folder `figcraft/`.
- Jangan commit secret (`.env*` selain `.env.example`).
- Jangan ubah alur transaksi fisik toko (tetap via WhatsApp & pengambilan di toko).
- Pertahankan palet warna militer bersih dan font Plus Jakarta Sans.
- Branch ini dibuat dari `feature/ui-ux-enhancement` (belum dimerge ke `main`). PR sebaiknya dimerge setelah PR UI/UX itu dimerge.
