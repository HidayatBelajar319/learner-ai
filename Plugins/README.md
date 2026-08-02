# Plugins

Folder ini berisi plugin-plugin tambahan untuk LearnerAI.  
Setiap plugin berdiri sendiri dan dapat dijalankan secara independen dari aplikasi utama.

> Folder `Plugins/` sengaja **tidak** dimasukkan ke `.gitignore` agar dapat diakses publik dan dikontribusikan oleh siapapun.

---

## Daftar Plugin

| Nama       | Deskripsi                                              | Status |
|------------|--------------------------------------------------------|--------|
| UIPatcher  | Menangkap screenshot UI secara otomatis via Puppeteer  | Aktif  |

---

## UIPatcher

**Lokasi:** `Plugins/UIPatcher/`

### Fungsi

UIPatcher adalah "mata" bagi AI untuk mendeteksi error visual atau perubahan UI pada LearnerAI.  
Plugin ini mengekspor screenshot halaman website ke file PNG menggunakan Puppeteer (headless Chrome).

### Cara Kerja

1. Puppeteer membuka browser headless (tidak terlihat di layar).
2. Browser membuka URL yang ditentukan dan menunggu halaman selesai dimuat.
3. Screenshot diambil dan disimpan ke folder `output/`.

### Persyaratan

- Node.js v18 atau lebih baru
- npm

### Cara Menjalankan

**Cara cepat (Windows):**

```bat
cd Plugins\UIPatcher
run.bat
```

`run.bat` akan menginstal dependensi secara otomatis jika belum ada, lalu menanyakan URL dan nama file output.

**Cara manual (CLI):**

```bash
cd Plugins/UIPatcher
npm install
node capture.mjs [url] [output.png] [--full]
```

**Contoh:**

```bash
# Screenshot viewport (default 1440x900)
node capture.mjs http://localhost:5173 screenshot.png

# Screenshot halaman penuh
node capture.mjs http://localhost:5173/dashboard dashboard.png --full
```

### Output

Screenshot disimpan di `Plugins/UIPatcher/output/`.

### Dependensi

| Package    | Versi   | Fungsi                     |
|------------|---------|----------------------------|
| puppeteer  | 22.15.0 | Headless browser / capture |

---

## Membuat Plugin Baru

1. Buat folder baru di `Plugins/NamaPlugin/`.
2. Tambahkan `package.json` dengan dependensi yang dibutuhkan.
3. Buat file utama (misalnya `index.mjs`).
4. (Opsional) Buat `run.bat` untuk kemudahan menjalankan di Windows.
5. Tambahkan entri ke tabel **Daftar Plugin** di README ini.
