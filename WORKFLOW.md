# 🔄 Aturan Git Workflow Toko Gaperta

Pedoman wajib untuk semua kontributor dan asisten AI pada proyek ini.

## 6 Langkah Workflow
1. **Plan dulu**: Tulis / perbarui `PLAN.md` sebelum coding (tujuan, kriteria, batasan).
2. **Branch baru**: Jangan kerja di `main`. Format: `feature/<nama>`, `fix/<nama>`, `chore/<nama>`.
3. **Commit kecil & sering**: Satu perubahan logis per commit, cek `git diff` sebelum commit.
4. **Push + Pull Request**: Buka PR ke `main` menggunakan template PR.
5. **CI otomatis**: Robot GitHub Actions menjalankan lint, test, dan build. Merge hanya jika hijau.
6. **Merge**: Hanya merge kode yang sudah disetujui dan lulus CI ke `main`.

## Konvensi Commit
Format: `<tipe>: <deskripsi singkat, imperatif, huruf kecil>`
- `feat`: fitur baru
- `fix`: perbaiki bug
- `refactor`: rapikan kode tanpa ubah perilaku
- `docs`: dokumentasi
- `test`: tambah / perbaiki test
- `chore`: konfigurasi, build, atau maintenance
- `ci`: konfigurasi CI/CD

## Aturan Kerja Wajib
- **Propose dulu, eksekusi kemudian**: Tampilkan rencana sebelum mengubah file apa pun.
- **Dilarang keras**: Jangan commit secret (`.env`, token, API keys), jangan push langsung ke `main`, jangan `git push --force`.
- **Verifikasi nyata**: Jangan klaim lulus tanpa menjalankan perintah test/build sebenarnya.
