# Changelog

*Tempat dimana Changelog berada.*

## [0.4.1] - 1 Agustus 2026

### Ditambahkan / Diperbarui
- **Cari Teman kini menampilkan semua akun** secara default (tanpa kata kunci), sehingga user bisa langsung memilih teman; pencarian tetap tersedia bila jumlah pengguna sudah banyak.
  - `GET /api/social/search` tanpa parameter `q` mengembalikan seluruh user aktif (`is_active = 1`, kecuali user sendiri) diurutkan nama, dengan param `limit` (default 50, maks 100).
  - Tab "Cari Teman" langsung memuat daftar akun saat dibuka; empty state menampilkan "Belum ada pengguna lain…" bila memang kosong.
- **Deployed:** worker versi `8e0c2c4a-eb55-4572-a35a-c433a5924bb1`.
- **Docs:** semua tautan internal di `MoreInfo/*.md` dan `README.md` kini valid (anchor eksplisit `<a id="…">` pada heading agar link TOC berfungsi di GitHub & editor, menggantikan anchor `#-…` yang tidak konsisten antar renderer).

## [0.4.0] - 31 Juli 2026

### Ditambahkan
- **AI tanpa API key (Workers AI):**
  - Binding `[ai] binding = "AI"` di `wrangler.toml`; fallback otomatis ke Workers AI bila user belum punya BYOK key dan tidak ada env key server (berlaku untuk chat AI, generate quiz, mind map, diagram).
  - Provider `workersai` di `src/lib/ai/providers.ts`; model default `@cf/openai/gpt-oss-20b` (mendukung format OpenAI `choices` + `reasoning_content` dan format `{response}`).
  - Daftar model Workers AI tersedia di halaman Pengaturan (model yang di-deprecate otomatis tidak muncul).

- **Sistem Sosial:**
  - Halaman baru `/social` (nav "Sosial" 👥) dengan 4 tab: Teman, Permintaan (badge), Cari Teman, Peringkat; plus badge unread chat di header.
  - **Pertemanan:** cari user, kirim/terima/tolak/batalkan permintaan, hapus teman. Permintaan saling otomatis diterima bila keduanya mengirim.
  - **Chat:** modal chat antar teman (polling 5 detik, auto mark read, kirim dengan Enter, pesan >1000 karakter dipotong).
  - **Peringkat:** leaderboard berdasarkan total XP (top 3 🥇🥈🥉, baris user sendiri disorot).
  - Endpoint baru `/api/social/*`: `overview`, `search`, `friends`, `requests` (GET/POST/accept/reject), `messages`, `leaderboard`.
  - Migration `0010_social.sql`: tabel `friendships` dan `messages` (diterapkan ke D1 remote).

### Diperbaiki / Diperbarui
- **Deployed:** worker versi `5634b61a-2dfc-4f60-9042-9fe37dd13dc4` (Sistem Sosial + Workers AI final).
- Model `@cf/meta/llama-3.1-8b-instruct` di-deprecate oleh Cloudflare, diganti default ke `@cf/openai/gpt-oss-20b`.

### Catatan
- Sistem Sosial diuji end-to-end (2 akun: request → accept → chat → unread badge → leaderboard); data tes dibersihkan.

## [0.3.0] - 31 Juli 2026

### Ditambahkan
- **Fitur Visual (Mind Map + Diagram generator):**
  - Halaman baru `/visual` (nav "Visual") dengan 2 tab: Mind Map dan Diagram.
  - **Mind Map Generator:** input topik + level, AI menghasilkan struktur peta pikiran, dirender sebagai SVG interaktif (node bisa diciutkan/dibuka). Bisa disimpan, dilihat, dan dihapus.
  - **Diagram Generator:** deskripsi + jenis diagram (flowchart, sequence, class, state, er, gantt, pie, journey, git, mindmap), AI menghasilkan kode Mermaid yang dirender via library `mermaid` (lazy-loaded, code split). Kode bisa diedit, disalin, dan disimpan.
  - Endpoint baru `/api/visual/*`: `mind-maps/generate`, `mind-maps` (GET/POST/DELETE), `diagrams/generate`, `diagrams` (GET/POST/DELETE).
  - Migration `0009_visual_storage.sql`: tabel `user_mind_maps` dan `user_diagrams` (diterapkan ke D1 remote + local).
- **Deployed:** worker versi `20a9ddee` (mermaid di-code-split, bundle utama tetap ~443 kB).

### Catatan
- Generate mind map/diagram memakai provider AI yang dikonfigurasi user (BYOK di Pengaturan) atau env key server. Tanpa API key akan muncul pesan "API key AI tidak ditemukan. Tambahkan key di Pengaturan."

## [0.2.0] - 31 Juli 2026

### Ditambahkan
- **Kurikulum lengkap SD–SMK (134 lesson):** seed migration `0006_seed_curriculum.sql` berisi materi untuk 16 mata pelajaran:
  - Matematika (26), IPA (19), Bahasa Indonesia (14), Bahasa Inggris (13), Bahasa Asing (5: Arab, Mandarin, Jepang, Korea, Prancis), Informatika (8), IPS (8), Sejarah (7), PJOK (6), Seni Budaya (5), Pancasila (4), Kewirausahaan (4), Keterampilan (4), Pendidikan Agama (3), Prakarya (3), Pemrograman (5).
  - Tingkat materi: SD, SMP, SMA (+ level Pemula untuk Bahasa Asing).
- **Generator seed:** `scripts/seed-content.mjs` — membaca data kurikulum dari `scripts/curriculum/*.mjs` dan menghasilkan migration SQL otomatis (INSERT OR REPLACE, validasi ID duplikat, metadata tags).
- **Data kurikulum** di `scripts/curriculum/`: `mathematics.mjs`, `bahasa.mjs`, `ipa.mjs`, `sekolah.mjs`, `informatika.mjs`.

### Diperbaiki / Diperbarui
- Migration `0006_seed_curriculum.sql` dapat dijalankan ulang dengan aman (INSERT OR REPLACE).
- Generator `seed-content.mjs` kini menghasilkan **satu INSERT per baris** (D1 menolak statement tunggal terlalu besar — `SQLITE_TOOBIG`).
- **Deployed:** migration `0006` diterapkan ke D1 production (`learner-db`) + worker di-deploy. Verifikasi `/api/content/subjects` menunjukkan semua 16 mapel terisi materi.

### Catatan
- Mapel baru sebelumnya (Agama, Pancasila, PJOK, Informatika, Seni Budaya, Prakarya, Sejarah, Kewirausahaan) sudah terdaftar di `src/api/content/index.ts`, dropdown quiz/flashcards/certificates, dan fallback `tools.ts`.
- Deploy kurikulum dilakukan dengan menerapkan migration D1 lalu `npm run deploy` (wrangler).
