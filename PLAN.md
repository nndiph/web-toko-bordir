# Fitur: Supabase Lokal & Uji SQL/RLS (Fase 5.2)

## Tujuan
- SQL Fase 5 belum pernah dijalankan. Jalankan di Postgres/Supabase lokal (Docker) dan buktikan aturan RLS/RPC benar sebelum dipakai di project cloud.

## Rencana
1. `npx supabase init` + `supabase start` (migrasi & seed otomatis diterapkan).
2. Skrip uji `supabase/smoke-test.mjs` (supabase-js, peran anon / admin / user non-admin).
3. Perbaiki bug yang ditemukan uji pada `0001_init.sql`.
4. Skrip npm `db:start|db:stop|db:reset|db:test` (tanpa menambah dependency).
5. `.env.local` lokal (di-gitignore) agar `npm run dev` langsung memakai DB lokal.

## Kriteria Selesai
- [x] Migrasi + seed berhasil diterapkan di Postgres 17 lokal.
- [x] 31/31 skenario uji lulus setelah `db reset`.
- [x] Bug `adjust_stock` terbuka untuk anon diperbaiki (revoke dari `anon, authenticated`).
- [x] `npm run lint` dan `npm run build` lulus dengan env live.
- [x] `AGENTS.md` diperbarui.
- [ ] Setup cloud oleh pemilik; uji UI browser.

## Batasan
- Jangan sentuh folder `figcraft/`.
- Jangan commit secret: `.env.local` di-gitignore; kunci di dokumen hanyalah kunci default Supabase lokal.
- Tidak menambah dependency npm.
