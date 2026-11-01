# 🧠 AGENTS.md — Memori & Konteks Proyek Toko Gaperta

> **PENTING UNTUK SEMUA AI AGENT:**  
> File ini adalah **sumber kebenaran tunggal (single source of truth)** mengenai konteks, arsitektur, progres, dan aturan kerja proyek ini.  
> **ATURAN WAJIB:** Setiap kali Anda menyelesaikan suatu tugas/tahap, Anda **WAJIB memperbarui file ini** (terutama bagian **Status Terkini** dan **Riwayat Pekerjaan Selesai**) sebelum menyelesaikan giliran Anda.

---

## 1. Profil & Konteks Bisnis

- **Nama Proyek:** Web Toko Bordir & Perlengkapan Dinas "Gaperta" (sementara).
- **Pemilik Proyek:** Mahasiswa D3 Teknik Komputer (fokus networking & IoT/embedded).
- **Karakteristik Bisnis:**
  - Menjual seragam dinas TNI/instansi, sabuk/kopel, kaos kaki, topi/baret, seragam olahraga, dll.
  - **Fokus Utama:** Pesanan custom bordir komputer (nama dada, badge pangkat, lokasi, emblem satuan) yang selalu ramai.
  - **Target Pengguna:** Anggota/bawahan TNI yang disuruh komandan mengambil pesanan, pendaftar angkatan, dan dinas umum.

### 3 Masalah Nyata yang Harus Diselesaikan Web Ini:
1. **Chat Bertumpuk di 3 HP:** Pemilik kewalahan menerima pesanan via WhatsApp tanpa rekapan terpusat.  
   👉 *Solusi:* Form pemesanan custom bordir online yang rapi & otomatis generate Nomor Tiket Pesanan (`/pesan`).
2. **Pesanan Bordir Sering Terlewat:** Ada bordiran yang sudah seminggu belum dikerjakan karena lupa/terselip.  
   👉 *Solusi:* Dashboard pemilik dengan fitur **Alert Kartu Merah** untuk pesanan yang sudah > 3 hari belum selesai (`/admin`).
3. **Kewalahan Cek Stok:** Saat pembeli datang langsung ke toko, pemilik bingung mencari barang dan ternyata stok kosong.  
   👉 *Solusi:* Katalog ketersediaan stok transparan (`TERSEDIA` / `KOSONG`) dan fitur **Kasir Quick-Check** (cari barang langsung keluar sisa stok & lokasi rak fisik).

> **Catatan Batasan:** Web ini **BUKAN** e-commerce antar barang / payment gateway online. Transaksi dan pengambilan barang tetap dilakukan langsung di toko fisik.

---

## 2. Tech Stack & Arsitektur

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, TypeScript) | SSR, cepat, SEO-friendly |
| **Styling** | Tailwind CSS | Clean, responsif, ramah orang gaptek |
| **Tema Warna** | Nuansa Militer TNI Bersih | Hijau Militer Solid (`#1E3E20`), Canvas Netral (`#F9FAFB`), Border Netral (`#E5E7EB`) |
| **Icons** | Lucide React | Konsisten dan minimalis |
| **Database & Auth** | Supabase (PostgreSQL) | Manajemen stok, tabel pesanan bordir, auth admin |
| **Bot Asisten** | Gemini API | Membantu customer mencari barang & cek status pesanan |
| **Desain UI** | Figma via FigCraft MCP | 5 Frame UI prototipe sudah dibuat di kanvas Figma |
| **Repository** | GitHub (`nndiph/web-toko-bordir`) | Remote: `https://github.com/nndiph/web-toko-bordir.git` |
| **CI/CD** | GitHub Actions | Lint, test, dan build check otomatis |

---

## 3. Aturan Kerja & Git Workflow (Wajib Dipatuhi)

Semua agen wajib mengikuti alur kerja pada [`WORKFLOW.md`](./WORKFLOW.md):
1. **Plan Dulu:** Perbarui [`PLAN.md`](./PLAN.md) sebelum coding, tunggu user setuju / ketik "lanjut".
2. **Branch Baru:** Jangan pernah kerja di `main`. Gunakan format `feature/<nama>`, `fix/<nama>`, `chore/<nama>`.
3. **Commit Kecil & Sering:** Satu perubahan logis per commit, cek `git diff`, gunakan format `<tipe>: <deskripsi>`.
4. **Push + Buka PR:** Buka PR ke `main` dengan template PR.
5. **CI Hijau:** Tunggu GitHub Actions CI lulus sebelum merge.
6. **Dilarang Keras:**
   - Jangan sentuh folder `figcraft/` (tools bridge lokal).
   - Jangan commit secret (`.env`, API key, token).
   - Jangan `git push --force`.
   - Jangan klaim berhasil tanpa menjalankan pengujian nyata.

---

## 4. Riwayat Pekerjaan Selesai (Progress Log)

- [x] **Fase 0 — Setup Git Workflow & Repository (Selesai)**
  - Audit repo, inisialisasi git, buat `.gitignore`, `PLAN.md`, `WORKFLOW.md`, `pull_request_template.md`, `ci.yml`.
  - Remote GitHub `nndiph/web-toko-bordir` terhubung, branch protection rules aktif.
  - Pull Request #1 (`chore/setup-workflow`) sukses dimerge ke `main`.
- [x] **Fase 1 — Desain UI Prototipe di Figma via FigCraft (Selesai)**
  - Setup & build FigCraft MCP server lokal.
  - Berhasil generate frame utama di Figma Desktop.
  - Pull Request #2 (`feature/design-ui-figma`) sukses dimerge ke `main`.
- [x] **Fase 1.5 — Dokumentasi Memori Agen (Selesai)**
  - Dibuat file `AGENTS.md` sebagai memori abadi antar-agen.
- [x] **Fase 2 — Inisialisasi Kode Web App Next.js 15 + Tailwind CSS (Selesai)**
  - Setup Next.js 15, TypeScript, Tailwind CSS dengan palet warna militer TNI.
  - Setup library pendukung (`lucide-react`, `clsx`, `tailwind-merge`, `@supabase/supabase-js`).
  - Implementasi halaman utama `src/app/page.tsx` sesuai desain Figma.
  - Pull Request #3 (`feature/init-web-app`) sukses dimerge ke `main`.
- [x] **Fase 3 — Form Pemesanan Custom Bordir & Tracking Status Pesanan (Selesai)**
  - Dibuat komponen reusable `src/components/Navbar.tsx` dengan link navigasi aktif.
  - Halaman form pemesanan custom bordir di `src/app/pesan/page.tsx`.
  - Halaman tracking status pesanan di `src/app/tracking/page.tsx`.
  - Pull Request #4 (`feature/order-and-tracking`) sukses dimerge ke `main`.
- [x] **Fase 4 — Dashboard Manajemen Pemilik Toko (Selesai)**
  - Halaman Dashboard Admin di `src/app/admin/page.tsx`.
  - Ringkasan KPI: Total Pesanan Aktif, **Alert Kartu Merah (> 3 Hari)**, dan **Alert Stok Menipis (< 5 pcs)**.
  - **Fitur Kasir Quick-Check**: Pencarian instan sisa stok nyata & lokasi rak fisik barang, dengan tombol cepat update stok (+/-).
  - **Manajemen Antrean Mesin Bordir**: Tabel interaktif dengan filter status dan tombol 1-klik ubah status pengerjaan serta kirim pesan WhatsApp konfirmasi selesai.
  - Halaman kustom 404 di `src/app/not-found.tsx` dan integrasi menu Navbar ke `/admin`.
  - Pengujian build `npm run build` (7/7 static routes) dan lint `npm run lint` terverifikasi lulus 100% (0 errors, 0 warnings).
- [x] **Fase 4.5 — Penyempurnaan Warna & Tipografi Tegas (Clean & Authentic) (Selesai)**
  - Mengeliminasi border keruh kehijauan dan menggantinya dengan border netral bersih (`#E5E7EB`).
  - Mengintegrasikan font **Plus Jakarta Sans** untuk tipografi tegas, tajam, dan berbobot tanpa ornamen/gimmick buatan.
  - Menyelaraskan warna brand dengan hijau militer solid (`#1E3E20`) dan teks berbobot kontras tinggi Gray-900 (`#111827`).
- [x] **Fase 4.6 — Visual E-Commerce: Sampul Gambar & Departemen ala Tokopedia/Uniqlo (Selesai)**
  - Mengubah **Hero Banner** menjadi layout 2-kolom dengan **Featured Product Showcase Card** di sisi kanan (foto produk nyata, rating badge, sisa stok, harga tegas, rak fisik, tombol WA langsung), menghilangkan area kosong hijau.
  - Memperbarui seksi **Jelajahi Departemen Produk** menjadi **Full-Photo Cards** (Badge & Pangkat, Seragam PDL, Sabuk Kopel, Topi Baret, Custom Bordir) dengan foto sampul riil, overlay gradien, jumlah item, dan filter katalog 1-klik.
  - Menambahkan **Sampul Gambar Produk (*Aspect 4:3 Image Showcase*)** di etalase dengan zoom hover halus dan fallback grafis otomatis.
  - Badge ketersediaan stok (*TERSEDIA*, *HABIS*, *CUSTOM*) dan kategori mengambang di atas foto sampul.
  - Katalog diperkaya menjadi 8 produk dinas TNI nyata.
  - Sinkronisasi frame visual di Figma Desktop via Figcraft (`12:284`).
  - Pengujian build `npm run build` (7/7 static routes) dan lint `npm run lint` terverifikasi lulus 100% (0 errors, 0 warnings).
- [x] **Fase 4.7 — Optimasi Performa, Font Asinkron & Anti-Lag Gambar (Selesai)**
  - Mengeliminasi render-blocking `@import` di `globals.css` yang memblokir parser browser.
  - Menambahkan `preconnect` ke Google Fonts & GStatic di `layout.tsx` serta font fallback sistem kilat.
  - Mengompresi beban gambar Unsplash (pengurangan ~60% bandwidth dengan `w=400&q=70&auto=format`).
  - Menambahkan `decoding="async"` dan `loading="lazy"` agar proses decode gambar tidak membebani main thread JavaScript saat browsing dan scrolling.
  - Pengujian build `npm run build` (7/7 static routes) dan lint `npm run lint` terverifikasi lulus 100% (0 errors, 0 warnings).

- [x] **Fase 5 — Integrasi Database Supabase (Kode Selesai, Menunggu Setup Supabase oleh Pemilik)**
  - Skema + RLS + RPC di `supabase/migrations/0001_init.sql`, seed 5 kategori & 8 produk di `supabase/seed.sql`.
  - Akses publik hanya lewat RPC `create_order` (nomor tiket dibuat server) dan `track_order` (tiket + 4 digit akhir WA). Tabel `orders` tertutup untuk anon. Admin = user dengan `app_metadata.role = 'admin'`.
  - Data layer di `src/lib/data/` (`products.ts`, `orders.ts`); mapper snake_case → camelCase; tipe baru di `src/types/index.ts`.
  - **Mode Demo:** bila `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` kosong, UI memakai `src/lib/demo-data.ts` dengan banner kuning dan tidak menyimpan apa pun. Cek via `isSupabaseConfigured`.
  - `/admin` kini punya login (`src/components/AdminLogin.tsx`) dan tombol Keluar. Alert Kartu Merah dihitung dari `created_at` (>= 3 hari).
  - `npm run lint` dan `npm run build` (7/7 route) lulus. **SQL belum pernah dijalankan** (tidak ada Postgres/Docker lokal) dan alur live belum diuji end-to-end.
- [x] **Fase 5.1 — Aksi "Sudah Diambil" di `/admin` (Selesai)**
  - Pesanan `READY` punya tombol "Sudah Diambil" (dengan konfirmasi) yang mengubah status ke `COMPLETED`.
  - Filter "Semua" hanya menampilkan antrean aktif; pesanan selesai dilihat lewat filter baru "Sudah Diambil".
  - Tanpa perubahan SQL (RLS admin sudah mengizinkan update). `/tracking` sudah menangani `COMPLETED`.
  - `npm run lint` dan `npm run build` (7/7 route) lulus.
- [x] **Fase 5.2 — Supabase Lokal & Uji SQL/RLS (Selesai)**
  - Supabase CLI via `npx supabase` (butuh Docker Desktop). `supabase/config.toml` ditambahkan; migrasi & seed otomatis diterapkan oleh `supabase start` / `db reset`.
  - Skrip npm: `db:start`, `db:stop`, `db:reset`, `db:test`. `supabase/smoke-test.mjs` menguji 31 skenario RLS/RPC (anon vs admin vs user non-admin) — **31/31 lulus** di Postgres 17 lokal. **Skrip ini menghapus pesanan di DB lokal; jalankan `db:reset` sesudahnya.**
  - Bug ditemukan & diperbaiki lewat uji: anon masih bisa memanggil `adjust_stock` karena default privileges Supabase; `revoke` kini juga mencabut dari `anon, authenticated` sebelum `grant`.
  - Dev lokal: `.env.local` (di-gitignore) berisi URL `http://127.0.0.1:54321` + anon key lokal. Akun admin lokal: `admin@gaperta.local` / `gaperta-dev-123` (hanya untuk DB lokal; dibuat ulang manual setelah `db:reset`).
  - **Belum dilakukan:** setup project Supabase cloud (produksi) oleh pemilik; uji klik-klik UI di browser.

---

## 5. Status Terkini (Current State)

- **Branch Aktif:** `chore/supabase-local-setup` (dari `main`, belum dimerge). Fase 5 – 5.1 sudah di `main`.
- **Kondisi Working Directory:** Bersih setelah commit Fase 5.2.
- **Menunggu dari Pemilik (produksi):** buat project Supabase cloud, jalankan `0001_init.sql` lalu `seed.sql` di SQL Editor (atau `npx supabase link` + `db push` dengan access token), buat & tandai akun admin, isi env di hosting.
- **Tugas Selanjutnya:** Uji UI di browser dengan DB lokal (`npm run db:start`, `npm run dev`); deploy.

---

## 6. Instruksi untuk Agent Berikutnya (Cara Melanjutkan)

Jika Anda adalah agen baru yang baru saja membuka proyek ini, lakukan langkah berikut:
1. Baca file ini (`AGENTS.md`) dan [`PLAN.md`](./PLAN.md) untuk memahami status terakhir.
2. Pastikan berada di `main` terbaru (`git pull origin main`).
3. Buat branch baru dari `main` untuk pekerjaan berikutnya (`feature/<nama>`).
4. Jangan ubah skema yang sudah dijalankan pemilik langsung; tambahkan migrasi baru `supabase/migrations/000N_*.sql`.
5. Jalankan `npm run build` dan `npm run lint` sebelum commit.
6. Push branch dan berikan link PR kepada pengguna.
7. **Perbarui bagian "Riwayat Pekerjaan Selesai" dan "Status Terkini" di file `AGENTS.md` ini.**
