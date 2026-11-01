# Fitur: Setup Workflow & Inisialisasi Toko Gaperta

## Tujuan
- Menerapkan workflow Git profesional dan mendokumentasikan spesifikasi awal sistem Toko Gaperta (katalog stok, pesanan custom bordir, dashboard manajemen, chatbot asisten).

## Kriteria Selesai
- [x] Audit repo dan inisialisasi git dengan branch `main`
- [x] File `.gitignore` dikonfigurasi
- [ ] File `PLAN.md` terdokumentasi
- [ ] File `.github/pull_request_template.md` dibuat
- [ ] File `.github/workflows/ci.yml` dibuat
- [ ] File `WORKFLOW.md` dibuat sebagai pedoman permanen
- [ ] Desain UI di Figma via FigCraft selesai & disetujui
- [ ] Setup project Next.js + Tailwind + Supabase

## Batasan
- Jangan ubah: file konfigurasi FigCraft (`figcraft/`)
- Jangan commit file secret (`.env`, `.env.local`, API keys)
- Jangan push/merge langsung ke `main` tanpa PR

## Langkah
1. Buat file `PLAN.md`
2. Buat template PR `.github/pull_request_template.md`
3. Buat GitHub Action CI `.github/workflows/ci.yml`
4. Buat pedoman kerja `WORKFLOW.md`
5. Commit bertahap sesuai aturan konvensi commit
