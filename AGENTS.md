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
   👉 *Solusi:* Form pemesanan custom bordir online yang rapi & otomatis generate Nomor Tiket Pesanan.
2. **Pesanan Bordir Sering Terlewat:** Ada bordiran yang sudah seminggu belum dikerjakan karena lupa/terselip.  
   👉 *Solusi:* Dashboard pemilik dengan fitur **Alert Kartu Merah** untuk pesanan yang sudah > 3 hari belum selesai.
3. **Kewalahan Cek Stok:** Saat pembeli datang langsung ke toko, pemilik bingung mencari barang dan ternyata stok kosong.  
   👉 *Solusi:* Katalog ketersediaan stok transparan (`TERSEDIA` / `KOSONG`) dan fitur **Kasir Quick-Check** (cari barang langsung keluar sisa stok & lokasi rak).

> **Catatan Batasan:** Web ini **BUKAN** e-commerce antar barang / payment gateway online. Transaksi dan pengambilan barang tetap dilakukan langsung di toko fisik.

---

## 2. Tech Stack & Arsitektur

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, TypeScript) | SSR, cepat, SEO-friendly |
| **Styling** | Tailwind CSS | Clean, responsif, ramah orang gaptek |
| **Tema Warna** | Nuansa Militer TNI | Hijau Army (`#2D5A27`), Emas (`#C5A059`), Netral Bersih (`#F7F9F6`) |
| **Icons** | Lucide React | Konsisten dan minimalis |
| **Database & Auth** | Supabase (PostgreSQL) | Manajemen stok, tabel pesanan bordir, auth admin |
| **Bot Asisten** | Gemini API | Membantu customer mencari barang & cek status pesanan |
| **Desain UI** | Figma via FigCraft MCP | 4 Frame UI prototipe sudah dibuat di kanvas Figma |
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
  - Berhasil generate 4 frame utama di Figma Desktop:
    1. `01 - Beranda & Katalog Stok` (Hero TNI, Search, Filter Kategori, Card Stok).
    2. `02 - Form Pesan Bordir Custom` (Form pemesan, jenis bordir, catatan, upload).
    3. `03 - Cek Status Pesanan` (Input No. WA/Tiket, Visual Timeline 3 langkah).
    4. `04 - Dashboard Pemilik Toko` (KPI stats, Alert > 3 hari, Kasir Quick-Check, Tabel Antrean).
  - Audit desain FigCraft: `0 error, 0 unsafe`.
  - Pull Request #2 (`feature/design-ui-figma`) sukses dimerge ke `main`.
- [x] **Fase 1.5 — Dokumentasi Memori Agen (Selesai)**
  - Dibuat file `AGENTS.md` sebagai memori abadi antar-agen.
- [x] **Fase 2 — Inisialisasi Kode Web App Next.js 15 + Tailwind CSS (Selesai)**
  - Setup Next.js 15, TypeScript, Tailwind CSS dengan palet warna militer TNI.
  - Setup library pendukung (`lucide-react`, `clsx`, `tailwind-merge`, `@supabase/supabase-js`).
  - Implementasi halaman utama `src/app/page.tsx` sesuai desain Figma (Katalog stok real-time, pencarian instan, filter kategori, badge stok jelas).
  - Build check (`npm run build`) dan lint check (`npm run lint`) terverifikasi 100% lulus (0 errors, 0 warnings).

---

## 5. Status Terkini (Current State)

- **Branch Aktif:** `feature/init-web-app`
- **Kondisi Working Directory:** Siap dicommit dan dipush.
- **Tugas Selanjutnya:** Buka PR #3 (`feature/init-web-app` ke `main`), lalu lanjut ke **Fase 3: Form Pemesanan Custom Bordir & Halaman Tracking Pesanan**.

---

## 6. Instruksi untuk Agent Berikutnya (Cara Melanjutkan)

Jika Anda adalah agen baru yang baru saja membuka proyek ini, lakukan langkah berikut:
1. Baca file ini (`AGENTS.md`) dan [`PLAN.md`](./PLAN.md) untuk memahami status terakhir.
2. Pastikan branch `feature/init-web-app` sudah dimerge ke `main`, lalu tarik `main` terbaru (`git pull origin main`).
3. Buat branch baru untuk fitur berikutnya:
   ```bash
   git checkout -b feature/order-and-tracking
   ```
4. Kembangkan halaman form pemesanan custom bordir online (`src/app/pesan/page.tsx`) dan halaman tracking status pesanan (`src/app/tracking/page.tsx`).
5. Jalankan `npm run build` dan `npm run lint` sebelum commit.
6. Push branch dan berikan link PR kepada pengguna.
7. **Perbarui bagian "Riwayat Pekerjaan Selesai" dan "Status Terkini" di file `AGENTS.md` ini.**
