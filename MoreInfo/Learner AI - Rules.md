# Learner AI - Rules

**Versi:** 1.0.0 | **Tanggal:** 26 Juli 2026 | **Developer:** HidayatBelajar319

---

## 📋 Daftar Isi

1. [Coding Style](#-coding-style)
2. [Naming Convention](#-naming-convention)
3. [UI Rules](#-ui-rules)
4. [UX Rules](#-ux-rules)
5. [Security Rules](#-security-rules)
6. [Accessibility Rules](#-accessibility-rules)
7. [Performance Rules](#-performance-rules)
8. [AI Rules](#-ai-rules)
9. [Documentation Rules](#-documentation-rules)
10. [Git Rules](#-git-rules)

---

## 💻 Coding Style

### General

- **Indentation:** 2 spasi (tidak pakai tab)
- **Line Length:** Maksimal 100-120 karakter per baris
- **File Size:** Maksimal 500 baris per file
- **Encoding:** UTF-8
- **End of File:** Selalu ada newline di akhir file

### Formatting

- **Brackets:** Gunakan curly braces `{}` untuk semua block
- **Semicolons:** Gunakan semicolon `;` di akhir statement
- **Quotes:** Gunakan single quote `'` untuk string
- **Commas:** Selalu ada trailing comma di object/array multi-line
- **Line Breaks:** Gunakan LF (Unix-style)

### Example

```typescript
// ✅ Benar
function greet(name: string) {
  return `Hello, ${name}!`;
}

const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
};

// ❌ Salah
function greet(name: string) {
  return "Hello, " + name + "!";
}

const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
}
```

---

## 🏷️ Naming Convention

### Variables &amp; Functions


| Type     | Convention                | Example                             |
| -------- | ------------------------- | ----------------------------------- |
| Variable | camelCase                 | `userName`, `totalCount`            |
| Function | camelCase                 | `getUserData()`, `calculateTotal()` |
| Constant | UPPER\_SNAKE\_CASE        | `MAX_RETRIES`, `API_URL`            |
| Boolean  | `is`, `has`, `can` prefix | `isValid`, `hasError`, `canEdit`    |


### Classes &amp; Types


| Type      | Convention | Example                        |
| --------- | ---------- | ------------------------------ |
| Class     | PascalCase | `UserModel`, `DatabaseService` |
| Interface | PascalCase | `UserInterface`, `ApiResponse` |
| Type      | PascalCase | `UserType`, `StatusType`       |
| Enum      | PascalCase | `UserRole`, `HttpMethod`       |


### Files &amp; Folders


| Type      | Convention      | Example                            |
| --------- | --------------- | ---------------------------------- |
| File      | kebab-case      | `user-service.ts`, `api-client.ts` |
| Folder    | kebab-case      | `user-services/`, `api-clients/`   |
| Component | PascalCase      | `UserCard.tsx`, `NavBar.tsx`       |
| Test      | `.test.` suffix | `user-service.test.ts`             |


### CSS Classes


| Type      | Convention   | Example                        |
| --------- | ------------ | ------------------------------ |
| Utility   | kebab-case   | `text-primary`, `bg-secondary` |
| Component | kebab-case   | `user-card`, `nav-bar`         |
| State     | `is-` prefix | `is-active`, `is-disabled`     |


---

## 🎨 UI Rules

### Desain

- **Consistency:** Gunakan pattern yang sama di seluruh aplikasi
- **Simplicity:** Hindari complexity yang tidak perlu
- **Clarity:** Setiap elemen harus jelas fungsinya
- **Feedback:** Berikan feedback visual untuk setiap interaksi

### Warna

- **Primary Color:** `#4F46E5` (Indigo)
- **Secondary Color:** `#10B981` (Emerald)
- **Accent Color:** `#F59E0B` (Amber)
- **Success:** `#10B981`
- **Warning:** `#F59E0B`
- **Error:** `#EF4444`
- **Info:** `#3B82F6`

### Spasi

- **Base Unit:** 4px
- **Spacing Scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64
- **Padding:** Gunakan spacing scale, jangan arbitrary value
- **Margin:** Gunakan spacing scale

### Tipografi

- **Font Family:** Inter
- **Font Size:** Gunakan scale: 12, 14, 16, 18, 20, 24, 30, 36, 48
- **Font Weight:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Height:** 1.5 untuk body text

### Radius

- **Small:** 4px
- **Medium:** 8px
- **Large:** 12px
- **XL:** 16px
- **Full:** 9999px (untuk circle)

---

## 👥 UX Rules

### User-Centered

- **User First:** Selalu prioritaskan kebutuhan pengguna
- **Clear Goals:** Setiap halaman harus memiliki tujuan yang jelas
- **Minimal Steps:** Kurangi jumlah langkah untuk menyelesaikan tugas

### Navigasi

- **Intuitive:** Navigasi harus mudah dipahami
- **Consistent:** Pattern navigasi harus konsisten
- **Breadcrumb:** Gunakan breadcrumb untuk navigasi nested
- **Back Button:** Selalu ada cara untuk kembali

### Feedback

- **Visual Feedback:** Berikan feedback visual untuk setiap interaksi
- **Loading State:** Selalu ada indikator loading
- **Error State:** Selalu ada pesan error yang jelas
- **Success State:** Berikan konfirmasi untuk action berhasil

### Form

- **Label:** Setiap input harus memiliki label
- **Placeholder:** Gunakan placeholder yang helpful
- **Validation:** Validasi input secara real-time
- **Error Message:** Pesan error yang spesifik
- **Auto-focus:** Auto-focus field pertama

### Accessibility

- **Keyboard Navigation:** Semua fitur harus bisa diakses dengan keyboard
- **Focus State:** Selalu ada focus state yang jelas
- **Skip Links:** Sediakan skip links untuk screen reader

---

## 🔒 Security Rules

### Input Validation

- **Selalu Validasi:** Validasi semua input dari user
- **Type Checking:** Cek tipe data yang benar
- **Length Check:** Cek panjang input
- **Format Check:** Cek format input (email, phone, dll.)
- **Sanitization:** Sanitize input sebelum diproses

### Output Encoding

- **HTML Encoding:** Encode HTML sebelum render
- **URL Encoding:** Encode URL parameter
- **JSON Encoding:** Encode JSON response

### Authentication

- **Strong Password:** Password minimal 8 karakter
- **Password Hashing:** Selalu hash password (jangan plain text)
- **Session Management:** Gunakan session yang secure
- **Token Expiry:** Set expiry time untuk token
- **Rate Limiting:** Batasi request autentikasi

### Authorization

- **Role-Based:** Akses berdasarkan role
- **Permission Check:** Selalu cek permission sebelum action
- **Ownership Check:** Cek ownership data
- **Least Privilege:** Berikan akses minimal yang diperlukan

### Data Protection

- **Encryption:** Enkripsi data sensitif
- **HTTPS:** Selalu gunakan HTTPS
- **CORS:** Konfigurasi CORS yang tepat
- **CSP:** Content Security Policy
- **HSTS:** HTTP Strict Transport Security

### AI Security

- **Prompt Filtering:** Filter prompt yang berbahaya
- **Output Filtering:** Filter output yang berbahaya
- **Content Moderation:** Moderasi konten AI
- **Sandboxing:** Eksekusi kode dalam sandbox
- **Rate Limiting:** Batasi request ke AI

---

## ♿ Accessibility Rules

### WCAG Compliance

- **Target:** WCAG 2.1 AA
- **Contrast:** Minimal 4.5:1 untuk teks normal
- **Text Size:** Minimal 16px untuk body text

### Screen Reader

- **Semantic HTML:** Gunakan HTML semantik
- **ARIA Labels:** Gunakan label ARIA
- **Alt Text:** Selalu ada alt text untuk gambar
- **Form Labels:** Selalu ada label untuk input

### Keyboard Navigation

- **Tab Order:** Urutan tab yang logis
- **Focus Management:** Manajemen focus yang baik
- **Skip Links:** Link untuk melewati navigasi
- **Keyboard Shortcuts:** Shortcut keyboard yang intuitif

### Visual Accessibility

- **High Contrast Mode:** Mode kontras tinggi
- **Dark Mode:** Mode gelap
- **Color Blind Mode:** Mode untuk buta warna
- **Text Scaling:** Penskalaan teks
- **Zoom:** Dukungan zoom

### Cognitive Accessibility

- **Simple Language:** Bahasa yang sederhana
- **Clear Instructions:** Instruksi yang jelas
- **Consistent Layout:** Layout yang konsisten
- **Error Prevention:** Pencegahan error

---

## ⚡ Performance Rules

### Code Optimization

- **Lazy Loading:** Muat komponen secara malas
- **Code Splitting:** Bagi kode menjadi chunks
- **Tree Shaking:** Hapus kode yang tidak terpakai
- **Minification:** Minify code untuk production
- **Compression:** Kompres file (gzip, brotli)

### Caching

- **Static Assets:** Cache asset statis
- **API Response:** Cache response API
- **AI Response:** Cache response AI (jika mungkin)
- **Cache Headers:** Set cache headers yang tepat

### Database

- **Indexing:** Buat index untuk query yang sering digunakan
- **Query Optimization:** Optimalkan query SQL
- **Connection Pooling:** Gunakan connection pooling
- **Batch Operations:** Gunakan batch untuk operasi massal

### Images

- **Optimization:** Optimalkan ukuran gambar
- **Format:** Gunakan format modern (WebP, AVIF)
- **Lazy Loading:** Lazy load gambar
- **Placeholder:** Gunakan placeholder

### Monitoring

- **Performance Metrics:** Monitor metrik performa
- **Error Tracking:** Track error dan warning
- **Logging:** Logging yang informatif
- **Alerting:** Alert untuk issue kritis

---

## 🤖 AI Rules

### Content Generation

- **Accuracy:** Output harus akurat
- **Relevance:** Output harus relevan
- **Safety:** Output harus aman
- **Ethics:** Output harus etis
- **Bias:** Minimalisasi bias

### Prompt Engineering

- **Clear Instructions:** Instruksi yang jelas
- **Context:** Berikan konteks yang cukup
- **Examples:** Berikan contoh jika diperlukan
- **Constraints:** Berikan constraints yang jelas
- **Formatting:** Minta format output yang spesifik

### Model Selection

- **Cost-Effective:** Pilih model yang cost-effective
- **Performance:** Pilih model yang performa baik
- **Fallback:** Sediakan fallback model
- **Load Balancing:** Distribusikan request ke multiple provider

### Memory Management

- **Short-term:** Simpan konteks sesi saat ini
- **Long-term:** Simpan riwayat dan preferensi
- **Vector DB:** Simpan embedding untuk pencarian
- **Cleanup:** Bersihkan memori yang tidak diperlukan

---

## 📚 Documentation Rules

### Code Documentation

- **Function:** Dokumentasi fungsi (JSDoc)
- **Class:** Dokumentasi class
- **Module:** Dokumentasi module
- **Complex Logic:** Dokumentasi logic kompleks

### Example JSDoc

```typescript
/**
 * Menghitung total XP dari aktivitas
 * @param userId - ID pengguna
 * @param activityType - Tipe aktivitas
 * @returns Total XP yang didapat
 */
function calculateXP(userId: string, activityType: string): number {
  // ...
}
```

### Project Documentation

- **README:** Dokumentasi utama
- **GUIDE:** Panduan teknis
- **ARCHITECTURE:** Arsitektur sistem
- **CHANGELOG:** Riwayat perubahan
- **CONTRIBUTING:** Pedoman kontribusi

### Format Documentation

- **Language:** Bahasa Indonesia
- **Clarity:** Jelas dan mudah dipahami
- **Completeness:** Lengkap dan terperinci
- **Consistency:** Konsisten di seluruh dokumen

---

## 🪂 Git Rules

### Branching

- **Main Branch:** `main` (production)
- **Development Branch:** `dev` (development)
- **Feature Branch:** `feature/[nama]` (fitur baru)
- **Bugfix Branch:** `bugfix/[nama]` (perbaikan bug)
- **Hotfix Branch:** `hotfix/[nama]` (perbaikan kritis)

### Commit Message

- **Format:** `[type]: [deskripsi]`
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Example:** `feat: tambah sistem gamifikasi`
- **Body:** Jelaskan perubahan secara detail (jika diperlukan)

### Pull Request

- **Title:** Jelas dan deskriptif
- **Description:** Jelaskan perubahan
- **Linked Issues:** Link ke issue yang relevan
- **Review:** Minimal 1 approval sebelum merge

### Code Review

- **Be Respectful:** Berikan feedback yang sopan
- **Be Specific:** Feedback yang spesifik
- **Be Constructive:** Feedback yang membangun
- **Be Timely:** Review secepatnya

---

## 📝 Catatan

- **✅** = Wajib diikuti
- **🟡** = Disarankan
- **❌** = Dilarang

*Dokumen terakhir diperbarui: 26 Juli 2026*