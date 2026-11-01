# Fitur: Aksi "Sudah Diambil" untuk Pesanan Siap Diambil (Fase 5.1)

## Tujuan
- Pesanan berstatus `READY` di `/admin` belum punya aksi lanjutan, sehingga antrean menumpuk selamanya. Tambahkan tombol untuk menandainya `COMPLETED` saat pemesan sudah mengambil barang di toko.

## Rencana
1. Tombol "Sudah Diambil" (dengan konfirmasi) di baris pesanan `READY` pada `src/app/admin/page.tsx`, memakai `updateOrderStatus(..., "COMPLETED")` yang sudah ada.
2. Badge status "Sudah Diambil" dan filter baru "Sudah Diambil (n)".
3. Filter "Semua" hanya menampilkan antrean aktif (bukan `COMPLETED`).
4. Tanpa perubahan SQL/skema: RLS `orders_admin_all` sudah mengizinkan update; `/tracking` sudah menampilkan `COMPLETED`.

## Kriteria Selesai
- [x] Tombol, badge, dan filter "Sudah Diambil" berfungsi di kode (Mode Demo dan live memakai jalur yang sama dengan aksi status lain).
- [x] `npm run lint` dan `npm run build` lulus.
- [x] `AGENTS.md` diperbarui.
- [ ] Diuji dengan Supabase nyata (menunggu setup dari pemilik).

## Batasan
- Jangan sentuh folder `figcraft/`.
- Jangan commit secret.
- Tidak mengubah skema database.
- Branch ini bertumpuk di atas `feature/supabase-integration` (belum dimerge ke `main`).
