# Fitur: Perbaikan Warna Menyatu & Tipografi Tegas (Clean & Authentic)

## Tujuan
- Memperbaiki ketidakharmonisan warna (menghilangkan border keruh kehijauan, menggunakan canvas netral bersih Gray-50/White, teks kontras tajam Gray-900, dan aksen hijau militer solid).
- Mengintegrasikan font Google Plus Jakarta Sans via `@import` di `globals.css` agar tipografi tegas, berwibawa, dan rapi layaknya katalog toko profesional.
- Menjaga desain tetap bersih, fungsional, dan jujur tanpa elemen "AI slop" (tanpa icon placeholder buatan, tanpa kartu marketing palsu, tanpa ornamen berlebih).

## Kriteria Selesai
- [x] Font Plus Jakarta Sans aktif dan tajam di seluruh aplikasi.
- [x] Border seluruh kartu dan input dinetralisir ke Gray-200/300 bersih (tidak kusam/kehijauan).
- [x] Teks judul dan harga menggunakan Gray-900 kontras tinggi (`tabular-nums` untuk nominal).
- [x] Warna brand hijau militer solid `#1E3E20` pada tombol utama dan elemen penting.
- [x] Halaman Katalog Beranda (`src/app/page.tsx`) bersih, jujur, dan mudah dibaca.
- [x] Form Pemesanan (`src/app/pesan/page.tsx`) rapi dan intuitif.
- [x] Tracking Status (`src/app/tracking/page.tsx`) bersih dan mudah dipahami.
- [x] Dashboard Pemilik (`src/app/admin/page.tsx`) fungsional dengan data inventaris dan antrean yang jelas.
- [x] Pengujian build (`npm run build`) dan linting (`npm run lint`) lulus 100%.

## Batasan
- Jangan sentuh folder `figcraft/`.
- Jangan tambahkan ornamen/gimmick tidak perlu (no AI slop).
- Jangan ubah logika fungsional bisnis.
