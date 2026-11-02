# Fitur: Redesain Dashboard Admin (Fase 6)

## Masalah
- `/admin` menampilkan 3 kartu KPI besar, tabel kasir, dan tabel antrean 6 kolom sekaligus dengan bobot visual sama. Pemilik harus membaca semuanya untuk tahu apa yang mendesak.
- Usia pesanan hanya teks; tidak ada visual alur proses maupun level stok.

## Rencana
1. **Hierarki:** alert pesanan terlewat di paling atas, lalu alur proses + antrean aktif. Hal tidak mendesak (pesanan selesai, kasir) tidak ikut menumpuk.
2. **Dua tab:** `Antrean Bordir` dan `Stok & Kasir`, masing-masing dengan badge angka (terlewat / perlu restock) agar peringatan tidak tersembunyi.
3. **Visual tanpa library baru:** pipeline 3 tahap yang bisa diklik sebagai filter + batang proporsi; batang usia per pesanan (hijau/kuning/merah); batang level stok; panel "Perlu restock".
4. **Antrean ringkas:** daftar kartu (bukan tabel 6 kolom), urut terlewat dulu lalu paling lama, satu aksi utama per baris, catatan dilipat.
5. Komponen presentasi dipisah ke `src/components/admin/`; state & logika data tetap di `src/app/admin/page.tsx`.
6. Perbaikan kecil terkait: tautan WhatsApp memakai helper `toWaNumber` (mengabaikan tanda strip/spasi dan awalan 62).

## Perubahan perilaku yang disengaja
- Daftar "perlu restock" mencakup stok 0 dan < 5 (sebelumnya hanya 1 s/d 4), kecuali produk `CUSTOM`.
- Tombol "Muat ulang" ditambahkan (pesanan baru dari publik tidak realtime).

## Kriteria Selesai
- [x] Semua fungsi lama tetap ada: mulai bordir, tandai siap, kirim WA, sudah diambil, +/- stok, filter, login/keluar, Mode Demo.
- [x] `npm run lint` dan `npm run build` lulus.
- [ ] Dicek di browser oleh pemilik.
- [x] `AGENTS.md` diperbarui.

## Batasan
- Jangan sentuh folder `figcraft/`; jangan commit secret.
- Tanpa dependency baru; tanpa perubahan skema/data layer.
- Palet hijau militer dan font Plus Jakarta Sans dipertahankan.
