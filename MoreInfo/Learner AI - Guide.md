# Learner AI - Guide

**Versi:** 1.0.0 | **Tanggal:** 26 Juli 2026

---

## 📋 Daftar Isi

1. [Persyaratan](#-persyaratan)
2. [Install Project](#-install-project)
3. [Install Dependency](#-install-dependency)
4. [Konfigurasi](#-konfigurasi)
5. [Run Development](#-run-development)
6. [Build Production](#-build-production)
7. [Deploy ke Cloudflare](#-deploy-ke-cloudflare)
8. [Update Project](#-update-project)
9. [Maintenance](#-maintenance)
10. [Struktur Folder](#-struktur-folder)
11. [Ganti AI/Model/API](#-ganti-aimodelapi)
12. [Troubleshooting](#-troubleshooting)
13. [FAQ](#-faq)

---

## 💻 Persyaratan

- **Node.js:** 18.x+ (rekomendasi: 20.x LTS)
- **npm/yarn:** 9.x+
- **Git:** 2.x+
- **Wrangler:** 3.x+ (`npm install -g wrangler`)
- **Akun Cloudflare:** Gratis
- **API Key:** Mistral/OpenAI/Anthropic

---

## 📥 Install Project

```bash
git clone https://github.com/hidayat3911/learner-ai.git
cd learner-ai
npm install -g wrangler
wrangler login
```

---

## 🔧 Install Dependency

```bash
npm install
# atau
yarn install
```

---

## ⚙️ Konfigurasi

### File Utama

**`wrangler.toml`** (Cloudflare):
```toml
name = "learner-ai"
main = "src/index.ts"
compatibility_date = "2026-07-26"

[[r2_buckets]]
binding = "LEARNER_STORAGE"
bucket_name = "learner-storage"

[[d1_databases]]
binding = "LEARNER_DB"
database_name = "learner-db"

[vars]
MISTRAL_API_KEY = "@mistral_api_key"
```

**.env** (Local):
```bash
MISTRAL_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

---

## 🚀 Run Development

```bash
npm run dev
# Akses: http://localhost:8787
```

---

## 🏗️ Build Production

```bash
npm run build
# Output: folder dist/
```

---

## ☁️ Deploy ke Cloudflare

```bash
# Deploy production
npm run deploy

# Deploy development
wrangler dev

# Cek logs
wrangler tail
```

---

## 🔄 Update Project

```bash
git pull origin main
npm update
npm run build
npm run deploy
```

---

## 🧹 Maintenance

```bash
# Clean
rm -rf node_modules dist
npm cache clean --force

# Backup D1
wrangler d1 export learner-db backup.sql

# Backup KV
wrangler kv bulk get --binding LEARNER_KV > kv_backup.json
```

---

## 🗂️ Struktur Folder

```
learner-ai/
├── src/
│   ├── api/          # Endpoints
│   ├── components/   # React components
│   ├── pages/        # Halaman
│   ├── lib/          # Utilities
│   ├── styles/       # CSS
│   └── index.ts      # Entry point
├── public/          # Assets
├── content/         # Konten pembelajaran
├── tests/           # Tests
├── package.json
├── wrangler.toml
└── .env
```

---

## 🤖 Ganti AI/Model/API

### Ganti AI Provider
Edit `src/lib/ai/config.ts`:
```typescript
export const AI_PROVIDER = 'mistral'; // atau 'openai', 'anthropic'
```

Update `.env`:
```bash
MISTRAL_API_KEY=new_key
OPENAI_API_KEY=new_key
```

Update secrets:
```bash
wrangler secret put MISTRAL_API_KEY
```

### Ganti Model
Edit `src/lib/ai/models.ts`:
```typescript
export const DEFAULT_MODEL = 'mistral-small-latest';
```

---

## ❓ Troubleshooting

### Error Umum

**1. Wrangler not found**
```bash
npm install -g wrangler
```

**2. API Key invalid**
- Cek `.env` file
- Pastikan key valid
- Cek saldo API

**3. Deploy failed**
```bash
wrangler tail  # Lihat error detail
npm run build  # Coba build ulang
```

**4. Connection timeout**
- Cek koneksi internet
- Cek firewall
- Coba lagi nanti

**5. Workers quota exceeded**
- Free tier: 100,000 requests/hari
- Upgrade ke Pro jika diperlukan

**6. D1/KV/R2 not found**
- Buat dulu di Cloudflare Dashboard
- Update ID di `wrangler.toml`

**7. Module not found**
```bash
npm install
rm -rf node_modules
npm install
```

**8. TypeScript error**
```bash
npm run build  # Lihat error detail
```

---

## ❔ FAQ

**Q: Bagaimana cara dapat API Key?**
- Mistral: https://mistral.ai
- OpenAI: https://openai.com
- Anthropic: https://anthropic.com

**Q: Berapa biaya operasi?**
- Cloudflare Workers: Free tier tersedia
- AI API: Bayar per request (lihat pricing masing-masing)

**Q: Bisa offline?**
- Tidak, memerlukan koneksi internet untuk AI

**Q: Bisa di-host di lain?**
- Saat ini hanya Cloudflare Workers

**Q: Bagaimana backup data?**
- Gunakan `wrangler d1 export` dan `wrangler kv bulk get`

---

## ✅ Best Practice

- Gunakan **TypeScript** untuk type safety
- **Lazy loading** untuk performa
- **Cache** response AI untuk efisiensi
- **Sanitize** HTML dari AI
- **Rate limiting** untuk mencegah abuse
- **Error handling** yang baik
- **Testing** sebelum deploy

---

*Dokumen terakhir diperbarui: 26 Juli 2026*