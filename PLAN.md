# Fitur: Perbaikan UX Berbasis Kebutuhan Tiap Pengguna (Fase 10)

Branch: `feature/ux-per-user` (dicabang dari `feature/full-stack-integration`, karena Fase 9 belum dimerge ke `main`).

## Siapa Penggunanya & Apa Tugas Utamanya

| Pengguna | Konteks | Tugas utama (harus ≤ 2 klik) |
| :--- | :--- | :--- |
| **Pembeli / anggota TNI** | Disuruh komandan, buka dari HP, sering tidak paham teknologi, kadang memesan untuk 1 regu | Cek stok barang, pesan bordir, lacak tiket |
| **Kasir / pemilik** | Berdiri di meja kasir, ada pembeli di depannya, sering pakai HP/tablet | Cari barang + lokasi rak, serahkan pesanan berdasarkan tiket, lihat pesanan terlewat, update stok |

## Temuan Audit (Masalah Nyata di Kode Sekarang)

### Sisi Pembeli
1. **Tugas utama tertimbun.** Di `/`, pembeli harus melewati hero, 3 pilar, dan kartu departemen sebelum sampai ke kolom cari stok. Pintasan "Lacak Pesanan" tidak ada di halaman utama.
2. **Data palsu di hero.** Kartu "Pangkat Serda — Tersedia (24 pcs)" ditulis langsung di kode. Isinya bisa bertentangan dengan stok asli, sehingga merusak tujuan "stok transparan".
3. **Navigasi kategori dobel dan tidak konsisten.** Kartu departemen dan filter pill sama-sama memfilter, tapi labelnya berbeda ("Custom Bordir" vs "Badge & Bordir").
4. **Pencarian hanya mencocokkan nama.** Mengetik "kopel" atau "A-02" tidak menemukan barang lewat kategori atau rak.
5. **Tombol barang HABIS membingungkan.** Tombolnya mati tapi bertuliskan "Pre-Order Toko". Tidak ada jalan untuk tanya restock.
6. **HP: katalog 1 kolom.** Kartu sangat tinggi dan pembeli harus scroll jauh. Marketplace (Tokopedia) memakai 2 kolom ringkas.
7. **Teks terlalu kecil.** Ada 39 pemakaian `text-[10px]`/`text-[11px]`, sulit dibaca pengguna usia lanjut di HP.
8. **Menu "Dashboard Pemilik" tampil untuk pembeli** di navbar utama, sehingga mengganggu dan membingungkan.
9. **`/pesan`:** kolom catatan berupa teks bebas tanpa panduan sesuai jenis bordir, sehingga isinya sering kurang lengkap dan kasir harus tanya ulang via WA. Halaman tiket tidak menegaskan bahwa **4 digit WA** diperlukan untuk melacak.
10. **`/tracking`:** stepper tidak membedakan tahap "sudah lewat", "sedang", dan "belum". Saat status SIAP, alamat dan jam buka toko tidak ditampilkan.

### Sisi Kasir / Pemilik
11. **Tidak bisa mencari pesanan.** Saat pembeli datang membawa tiket, kasir harus scroll antrean. Tidak ada pencarian berdasarkan tiket, nama, atau no. WA.
12. **Quick-Check stok tersembunyi di tab kedua.** Padahal itu yang paling sering dipakai saat ada pembeli di depan meja.
13. **Tidak ada ringkasan KPI di atas.** Kartu Merah, Siap Diambil, dan Stok Menipis tersebar di tab berbeda.
14. **Update stok hanya ±1.** Restock 20 pcs berarti 20 kali klik.
15. **Di HP, indikator stok disembunyikan** (`hidden sm:flex`). Tombol aksi kecil (h-9/py-2), di bawah target sentuh 44px.
16. Footer admin menampilkan "Sistem Kasir Sinkron" yang selalu hijau walau sedang Mode Demo, sehingga menyesatkan.

## Rencana Pengerjaan

### A. Fondasi (tanpa dependensi baru)
- Ganti teks 10–11px menjadi minimal 12px (`text-xs`) untuk informasi penting.
- Satukan konfigurasi toko (No. WA, alamat, jam buka) ke `src/lib/store-info.ts`. Saat ini WA `6281234567890` diulang di banyak file.
- Ekstrak `SiteFooter` agar `/pesan` dan `/tracking` juga punya info toko.

### B. Halaman Utama `/` (pembeli)
- **Hero ringkas, langsung kerja:** judul + kolom cari stok besar + 3 tombol tugas (Cek Stok, Pesan Bordir, Lacak Tiket).
- Hapus kartu produk palsu. Ganti dengan ringkasan stok nyata (jumlah barang tersedia/habis dari data).
- Satu baris filter kategori saja (hapus duplikasi kartu departemen), dengan label yang konsisten.
- Pencarian mencocokkan nama + kategori + lokasi rak.
- Kartu produk 2 kolom di HP, versi ringkas. Barang HABIS diberi tombol "Tanya Restock via WA".
- Pilar keunggulan dipadatkan menjadi strip kecil di bawah hero.

### C. Navbar
- Menu pembeli: Katalog Stok · Pesan Bordir · Lacak Pesanan.
- "Dashboard Pemilik" dipindah ke footer sebagai link kecil "Masuk Kasir".

### D. `/pesan`
- Kolom catatan diberi **panduan dinamis per jenis bordir** (contoh isian Nama Dada vs Pangkat vs Emblem) + tombol "Pakai contoh".
- Validasi nomor WA (angka, 10–14 digit) dengan pesan jelas.
- Halaman tiket menampilkan **Tiket + 4 digit WA** sebagai "kunci lacak", ringkasan pesanan, dan tips screenshot.

### E. `/tracking`
- Stepper 4 tahap (Antre → Dibordir → Siap → Diambil) dengan status selesai/aktif/belum yang jelas.
- Saat SIAP: kotak hijau berisi alamat, jam buka, dan "bawa nomor tiket".

### F. `/admin` (kasir/pemilik)
- **Strip KPI di atas, terlihat di semua tab:** Kartu Merah · Siap Diambil · Sedang Antre · Stok Menipis. Setiap kartu bisa diklik dan langsung memfilter.
- **Pencarian pesanan** (tiket / nama / 4 digit WA) di tab Antrean, untuk alur serah terima di kasir.
- Tab **Kasir & Stok jadi default** saat dibuka di HP. Di desktop tetap Antrean.
- StockRow: indikator stok tampil di HP, tombol +/− 44px, plus tombol **"Atur jumlah"** untuk mengisi stok sekaligus. Memakai `adjustStock(delta)` yang sudah ada, jadi **tanpa migrasi DB**.
- Tombol aksi OrderRow minimal 44px. Footer admin menampilkan status asli (Demo / Supabase).

### G. Verifikasi
- `npm run lint` dan `npm run build` lulus.
- `npm run test:e2e` tetap lulus (data layer tidak diubah).
- Uji visual di browser pada lebar HP (375px) dan desktop untuk keempat halaman.
- Perbarui `AGENTS.md`.

## Di Luar Cakupan
- Bot Gemini, perubahan skema Supabase, dan logo/branding baru.
- Pembuatan gambar AI (skill `/design` untuk logo/banner butuh `GEMINI_API_KEY`; tidak diperlukan di sini).

## Kriteria Selesai
- [ ] Pembeli bisa mencari stok dari hero tanpa scroll, di HP dan desktop.
- [ ] Tidak ada data produk palsu yang ditulis langsung di kode di halaman utama.
- [ ] Kasir bisa menemukan pesanan dari nomor tiket atau 4 digit WA dalam satu ketikan.
- [ ] KPI Kartu Merah / Siap Diambil / Stok Menipis terlihat di semua tab admin.
- [ ] Stok bisa diatur ke jumlah tertentu tanpa klik berulang.
- [ ] Tidak ada teks informasi di bawah 12px, dan target sentuh tombol utama ≥ 44px.
- [ ] Lint, build, dan test e2e lulus. `AGENTS.md` diperbarui.
