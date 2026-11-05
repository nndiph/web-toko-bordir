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
  - Pull Request #8 (`feature/supabase-integration`) sukses dimerge ke `main`.
- [x] **Fase 5.1 — Aksi "Sudah Diambil" di `/admin` (Selesai)**
  - Pesanan `READY` punya tombol "Sudah Diambil" (dengan konfirmasi) yang mengubah status ke `COMPLETED`.
  - Filter "Semua" hanya menampilkan antrean aktif; pesanan selesai dilihat lewat filter baru "Sudah Diambil".
  - Pull Request #7 (`feature/order-completed-action`) sukses dimerge ke `main`.
- [x] **Fase 5.2 — Supabase Lokal & Uji SQL/RLS (Selesai)**
  - Supabase CLI via `npx supabase` (butuh Docker Desktop). `supabase/config.toml` ditambahkan; migrasi & seed otomatis diterapkan oleh `supabase start` / `db reset`.
  - Skrip npm: `db:start`, `db:stop`, `db:reset`, `db:test`. `supabase/smoke-test.mjs` menguji 31 skenario RLS/RPC (anon vs admin vs user non-admin) — **31/31 lulus** di Postgres 17 lokal.
  - Bug `adjust_stock` diperbaiki dengan pencabutan hak eksekusi anon sebelum grant.
  - Pull Request #10 (`chore/supabase-local-setup`) sukses dimerge ke `main`.
- [x] **Fase 6.1 — Penanganan Resilien Koneksi & Fallback Server Offline (Selesai)**
  - Mengidentifikasi akar masalah error yang sering muncul: `.env.local` menunjuk ke `http://127.0.0.1:54321` (Docker lokal) dalam kondisi mati/tidak aktif, memicu `ERR_CONNECTION_REFUSED` dan unhandled exception di frontend.
  - Menambahkan custom fetch dengan **AbortController Timeout (4 detik)** di `src/lib/supabase.ts` untuk mencegah request menggantung (*hang*) saat server offline.
  - Menambahkan utilitas deteksi error jaringan `isNetworkError()`.
  - Mengimplementasikan **auto-fallback ke Mode Demo yang mulus** di `getProducts()`, `createOrder()`, dan `trackOrder()` ketika server offline, sehingga halaman web **tidak pernah melempar layar merah / crash** bagi pengguna.
  - Menambahkan penanganan pesan error yang informatif di `AdminLogin` dan `AdminDashboard` jika backend offline.
  - Pengujian build `npm run build` (7/7 static routes) dan lint `npm run lint` terverifikasi lulus 100% (0 errors, 0 warnings).
- [x] **Fase 8 — Transformasi Tema Cerah E-Commerce Terkenal (Tokopedia & Uniqlo Style) (Selesai)**
  - Melakukan riset layout e-commerce terkemuka di **pen.dev Canvas** menggunakan referensi **Tokopedia** (marketplace retail Indonesia) dan **Uniqlo** (clean visual retail).
  - **Palet Warna Cerah & Ramah Mata:**
    - Canvas utama: Slate-50 hangat (`#F8FAFC`).
    - Kartu produk & panel: Putih bersih (`#FFFFFF`) dengan border halus `#E2E8F0`.
    - Warna brand: Hijau militer wibawa (`#14381B`) dipadu kuningan lencana (`#B45309`).
    - Tipografi: Kontras tinggi hitam pekat Slate-900 (`#0F172A`) dan Slate-600 (`#475569`) yang sangat mudah dibaca oleh semua umur.
  - **Top Announcement Bar:** Hijau militer solid dengan info lokasi toko Jl. Gaperta Medan & live status rak fisik sinkron.
  - **Header Bersih:** Brand logo GAPERTA dengan badge dinas, menu link aktif dengan underline brand, tombol WhatsApp kasir yang kontras.
  - **Hero Section Cerah:** Headline raksasa hitam pekat, foto atribut dinas TNI nyata yang jernih, tombol CTA ganda (Pesan Bordir Online & Cek Stok Rak).
  - **Value Proposition 3 Pilar:** 1-2 Hari Jadi, 100% Standar Mabes, Stok Rak Nyata.
  - **Departemen Kategori:** 5 kartu kategori bersih dengan ikon dan foto sampul jernih.
  - **Katalog E-Commerce Cerah:**
    - Search bar besar ala Tokopedia dengan filter pills responsif.
    - Kartu produk 4:3 berbingkai halus dengan status badge hijau/merah/kuning, harga tebal `Rp 35.000`, lokasi fisik rak (`Rak A-02`), dan tombol aksi WhatsApp/Pesan.
  - **Halaman `/pesan` & `/tracking`:** Form dan pelacakan tiket putih bersih, rapi, dan mudah diisi.
  - **Build & Lint:** 7/7 static routes lulus 100% (0 errors, 0 warnings).
- [x] **Fase 9 — Integrasi Penuh & Keandalan End-to-End (Frontend & Backend) (Selesai)**
  - **LocalStorage Store Tangguh:** Persistensi data demo di LocalStorage agar pesanan yang dibuat di `/pesan` langsung muncul di antrean `/admin` dan dapat dilacak di `/tracking` tanpa perlu database Supabase aktif.
  - **Alur Sinkronisasi Real-time Antar-Halaman:** Form `/pesan` → Tiket → `/admin` (kasir melihat antrean) → Ubah status → `/tracking` (customer melihat update) → Update stok → Katalog `/` terupdate secara langsung.
  - **Redesain Dashboard `/admin` ke Tema Cerah Bersih:**
    - KPI cards dengan visual yang lebih jelas (Alert Kartu Merah > 3 Hari).
    - Pipeline bar 3 tahap interaktif untuk filter cepat antrean mesin bordir.
    - Tab Antrean Bordir & Stok & Kasir yang responsif.
    - Tombol aksi kasir dengan feedback instan dan visual konsisten.
  - **Harmonisasi Halaman 404 (`/not-found.tsx`):** Tema cerah, tombol navigasi jelas ke katalog.
  - **Tailwind Config Penyesuaian:** Warna `army` & `surface` untuk backward compatibility komponen admin.
  - **Pengujian End-to-End Otomatis (`scripts/test-e2e-flow.mjs`):** 7 skenario alur nyata diuji dan lulus 100% tanpa error (create order → track → admin antrean → update status → track update → adjust stock → catalog sync).
  - **Build & Lint:** 7/7 static routes, 0 warnings, 0 errors.

- [x] **Fase 10 — Perbaikan UX Berbasis Kebutuhan Tiap Pengguna (Selesai, branch `feature/ux-per-user`)**
  - Audit per pengguna (pembeli/anggota TNI di HP vs kasir/pemilik di meja kasir), detail di `PLAN.md`.
  - **Pembeli:** hero search-first + 3 tombol tugas (Cek Stok, Pesan Bordir, Lacak Tiket); kartu produk palsu di hero dihapus, diganti ringkasan stok nyata; satu baris filter kategori dengan jumlah; pencarian mencocokkan nama + kategori + rak; katalog 2 kolom di HP; barang HABIS punya tombol "Tanya Restock".
  - Navbar hanya menu pembeli; akses kasir dipindah ke `SiteFooter` ("Masuk Kasir / Pemilik"). Info toko (WA, alamat, jam) terpusat di `src/lib/store-info.ts`.
  - `/pesan`: form 3 langkah, jenis bordir berupa pilihan radio, panduan + "Pakai contoh" per jenis, validasi WA 10–14 digit, stepper jumlah. Halaman tiket menampilkan tiket + 4 digit WA sebagai kunci lacak.
  - `/tracking`: stepper 4 tahap (Antre → Dibordir → Siap → Diambil) dan kotak alamat/jam saat SIAP.
  - **Kasir:** `KpiStrip` (Kartu Merah, Siap Diambil, Antrean Aktif, Stok Menipis) di semua tab dan bisa diklik; menggantikan `PipelineBar` (dihapus). Pencarian pesanan via tiket/nama/WA (termasuk yang sudah diambil). Tab "Cek Stok & Rak" default di HP. Tombol `/` untuk fokus ke kolom cari.
  - `StockRow`: lokasi rak ditonjolkan, tombol 44px, klik angka stok untuk set jumlah persis (memakai `adjustStock(delta)`, tanpa migrasi).
  - Perubahan perilaku: Kartu Merah tidak lagi menghitung pesanan `READY` (bordir sudah selesai, hanya belum diambil).
  - Tidak ada teks 10–11px tersisa; target sentuh tombol utama ≥ 44px.
  - Lint 0 warning, build 7/7, `npm run test:e2e` 7/7 lulus. Dicek visual via Chrome headless (lebar 500px & 1366px) dalam Mode Demo.

- [x] **Fase 11 — Redesign Clean Retail E-Commerce (Tokopedia / Uniqlo inspired, Zero AI-Slop) (Selesai, branch `feature/redesign-dark-technest`)**
  - **Prinsip Desain:** Menghilangkan elemen murahan/AI-slop (seperti neon blur blobs, gradien bertumpuk, latar kartun gelap) dan menggantinya dengan estetika clean e-commerce retail otentik berstandar dinas militer.
  - **Palet Warna & Tipografi:** Background canvas Slate-50 (`#F8FAFC`), permukaan kartu putih solid (`#FFFFFF`) dengan border presisi Slate-200 (`#E2E8F0`), aksen hijau dinas militer wibawa (`#1B3C20`) dan hijau retail solid (`#15803D`). Tipografi berkontras tinggi pekat Slate-900 (`#0F172A`).
  - **Header & Navbar:** Top announcement bar Slate-900 dengan status rak fisik live & jam toko; main navbar putih bersih dengan badge resmi TNI & DINAS, tautan navigasi jelas, dan tombol WhatsApp kasir yang kontras.
  - **Hero Layout Fungsional (7:5 Kolom):** Headline tegas "Perlengkapan Dinas TNI & Bordir Komputer Presisi", kotak pencarian instan nama atribut / rak fisik, indikator jumlah stok toko live, serta 3 kartu aksi utama (Cek Stok Rak, Pesan Bordir Online, Lacak Status Tiket).
  - **Value Proposition 3 Pilar:** Panel bersih horizontal (Bordir 1–2 Hari Kerja, 100% Standar Mabes TNI, Stok Rak Fisik Sinkron).
  - **Katalog E-Commerce Grid:** Filter pills kategori responsif dengan hitungan item dinamis, kartu produk aspect 4:3 berbingkai halus dengan badge stok hijau/merah/kuning, harga tebal, nomor rak toko (`Rak A-02`), dan tombol aksi 1-klik (Pesan Bordir / Tanya WA).
  - **Info Pemesanan Regu & Departemen Visual:** Banner editorial bersih untuk pemesanan massal batalyon/regu dan kartu showcase visual atribut resmi.
  - **Footer Bersih & Operasional:** Banner WhatsApp konsultasi khusus regu, detail alamat, jam operasional, dan tautan akses kasir.
  - **Pengujian & Kestabilan:** `npm run lint` lulus (0 warnings, 0 errors), `npm run test:e2e` lulus 7/7 skenario, dev server berjalan lancar di port 3000.

- [x] **Fase 12 — Redesign Halaman Admin Dashboard (Data Table Focused, Zero Confusion) (Selesai, branch `feature/redesign-dark-technest`)**
  - **Analisis Design System via UI/UX Pro Max Skill:** Menggunakan pencarian "admin dashboard retail store inventory management" dengan hasil rekomendasi: Industrial slate + stock green palette, Fira Code/Fira Sans typography, data-focused layout.
  - **Prinsip Redesign Admin:**
    1. **Visual Hierarchy Jelas:** KPI cards raksasa dengan angka besar (Stok Kritis, Stok Menipis, Pesanan Siap, Kartu Merah) yang mudah dibaca sekilas dari jarak jauh.
    2. **Tabel Data Utama:** Zebra striping (baris bergantian warna) untuk memudahkan pelacakan horizontal, header sticky, dan kolom tersusun logis (Nama → Kategori → Stok → Rak → Harga → Aksi).
    3. **Inline Quick Actions:** Edit stok langsung klik angka (muncul input field + tombol simpan/batal), tombol +/- untuk adjust cepat tanpa modal popup.
    4. **Warna Status Semantik:** Hijau (stok aman), Kuning/Amber (menipis <5), Merah (kosong/kritis), tanpa efek neon atau gradien buatan.
    5. **Kemudahan Modifikasi:** Semua aksi utama (edit stok, ubah status pesanan, kirim WA) tersedia di baris tabel tanpa perlu navigasi tambahan.
  - **Komponen Utama:**
    - **4 KPI Cards Besar:** Stok Kritis (merah), Stok Menipis (kuning), Pesanan Siap (hijau), Kartu Merah (merah).
    - **Tab Navigation:** "Manajemen Stok Barang" (default) dan "Antrean Pesanan Bordir".
    - **Tabel Stok:** 6 kolom (Nama Barang, Kategori, Stok, Lokasi Rak, Harga, Aksi Cepat), inline edit stok dengan validasi, tombol +/- langsung adjust.
    - **Tabel Pesanan:** 7 kolom (Tiket, Pemesan, Jenis Bordir, Jumlah, Tanggal, Status, Aksi), tombol ubah status 1-klik, link WhatsApp konfirmasi.
    - **Filter Cerdas:** "Semua", "Menipis", "Habis" untuk stok; pencarian real-time untuk barang dan pesanan.
  - **Pengujian:** `npm run lint` lulus (0 errors, 0 warnings), `npm run build` sukses (7/7 static routes), `npm run test:e2e` lulus 7/7 skenario end-to-end.

---

## 5. Status Terkini (Current State)

- **Branch Aktif:** `feature/redesign-dark-technest` (push ke remote, PR siap di-buka).
- **Status Build & Lint:** Lulus (7/7 static routes, 0 errors, 0 warnings); `test:e2e` 7/7 lulus.
- **Catatan:** Foto produk demo di `src/lib/demo-data.ts` adalah foto Unsplash yang tidak sesuai barang (mis. tas, obat). Perlu diganti foto asli toko.
- **Catatan:** Beberapa class Tailwind v4 (`shadow-xs`, `shadow-2xs`, `w-88`) masih ada di file lama padahal proyek memakai Tailwind v3, sehingga class tersebut tidak berefek.

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
