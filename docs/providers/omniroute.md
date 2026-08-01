# OmniRoute (Provider Lokal)

**OmniRoute** adalah provider AI yang berjalan **secara lokal** menggunakan
[Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/).
Dengan OmniRoute, LearnerAI bisa memakai model AI tanpa API key eksternal —
semua permintaan diteruskan ke server lokal yang berjalan di
`http://localhost:20128/v1`.

> ⚠️ **Penting:** OmniRoute harus **berjalan terlebih dahulu** sebelum
> LearnerAI menggunakannya sebagai provider. Jika OmniRoute tidak berjalan,
> request AI akan gagal (koneksi ditolak ke `localhost`).

---

## Apa itu OmniRoute

OmniRoute adalah gateway/routernya model AI berbasis Worker yang berjalan lokal.
Ia menyediakan endpoint OpenAI-compatible (`/v1`) sehingga LearnerAI bisa
menghubungkannya persis seperti provider OpenAI pada umumnya.

Keunggulan OmniRoute:

- **Gratis** — tidak membutuhkan API key berbayar.
- **Lokal** — data tidak keluar dari mesin developer.
- **Fleksibel** — model bisa diatur lewat request (`model: "auto"` default).
- **OpenAI-compatible** — mudah diintegrasikan ke aplikasi apa pun.

---

## Requirement

- [Node.js](https://nodejs.org/) versi 18+.
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
  terinstal (`npm i -g wrangler`).
- Proyek OmniRoute sendiri (berisi `wrangler.toml` dan `src/index.ts`).
- Network lokal `localhost` — port **20128**.

---

## Cara Install

```bash
# 1. Install Wrangler global (jika belum)
npm i -g wrangler

# 2. Clone / buat proyek OmniRoute
git clone <url-repo-omniroute> omniroute
cd omniroute

# 3. Install dependency
npm install
```

---

## Cara Menjalankan

Jalankan di direktori proyek OmniRoute:

```bash
wrangler dev --port 20128
```

Perintah di atas menjalankan Worker secara lokal pada port `20128`.
Pastikan terminal menampilkan sesuatu seperti:

```
[vite] server running at http://localhost:20128
```

Biarkan proses ini tetap berjalan (jangan ditutup) selama LearnerAI
menggunakan OmniRoute.

> Untuk menjalankan di background/terminal terpisah, buka jendela terminal
> baru sebelum memulai LearnerAI.

---

## Cara Konfigurasi

Buka halaman **Pengaturan → API Key AI (BYOK)** di LearnerAI, lalu:

1. Pilih provider **OmniRoute (Local)**.
2. **Endpoint URL** diisi:
   ```
   http://localhost:20128/v1
   ```
   (default sudah terisi otomatis, boleh diganti jika port berbeda).
3. **Model**: biarkan `auto` atau isi nama model yang didukung OmniRoute
   (contoh: `openai/gpt-4o-mini`).
4. Klik **🧪 Test Koneksi** untuk memastikan koneksi berhasil, lalu **Simpan**.

OmniRoute tidak membutuhkan API key, jadi kolom API Key bisa dikosongkan
atau diisi `local`.

---

## Cara Menghubungkan ke LearnerAI

OmniRoute terintegrasi penuh ke LearnerAI sebagai provider AI biasa.
Setelah dikonfigurasi, OmniRoute otomatis tersedia untuk semua fitur AI:

- Chat AI (Chat assistant, Tutor)
- Creatives — AI Designer & Chat AI
- AI UI Editor
- Auto Pick Model (task apapun)
- Pembuatan Quiz, Materi, Flashcards, dan konten lainnya

**Urutan menjalankan:**

```bash
# Terminal 1 — jalankan OmniRoute
cd omniroute
wrangler dev --port 20128

# Terminal 2 — jalankan LearnerAI
npm run dev
```

### Koneksi dari Worker (Deploy/Remote)

Saat LearnerAI dijalankan di Cloudflare Workers, Worker **tidak bisa**
mengakses `localhost` di mesin developer. OmniRoute hanya cocok untuk:

- `npm run dev` (dev server lokal), atau
- `wrangler dev` pada LearnerAI (tunnel lokal).

Untuk environment production, gunakan provider online (OpenAI, Mistral,
Groq, DeepSeek, dll.) atau Workers AI default.

---

## Cara Debug

### Koneksi ditolak (ECONNREFUSED)

Penyebab paling umum adalah OmniRoute **belum berjalan**.

```bash
# Cek apakah OmniRoute merespons
curl http://localhost:20128/v1/models
```

Jika gagal:

1. Pastikan `wrangler dev --port 20128` sudah berjalan di terminal lain.
2. Pastikan port tidak bentrok dengan proses lain:
   ```bash
   # Windows
   netstat -ano | findstr 20128
   ```
3. Jika port terpakai, ubah port di kedua sisi (OmniRoute + Endpoint URL
   di Pengaturan LearnerAI).

### 401 Unauthorized / Invalid API Key

OmniRoute tidak butuh API key. Jika muncul, cek:

- Kolom API Key di Pengaturan kosongkan atau isi `local`.
- Endpoint URL tidak keliru menambahkan kredensial.

### 404 Not Found

Pastikan Endpoint URL diakhiri `/v1`:
`http://localhost:20128/v1` (bukan `http://localhost:20128`).

### Model tidak tersedia

Model yang diminta tidak dikenal OmniRoute. Gunakan model default `auto`
atau daftar model yang didukung OmniRoute.

### Waktu tunggu (Timeout)

- Proses AI memakan waktu; perbesar waktu tunggu di sisi OmniRoute.
- Pastikan tidak ada firewall yang memblokir `localhost:20128`.
