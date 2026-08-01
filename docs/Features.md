# Learner AI - Features

**Versi:** 1.0.0 | **Tanggal:** 01 Agustus 2026 | **Developer:** HidayatBelajar319

---

## 🎨 Creatives

**Creatives** adalah editor visual yang memiliki konsep serupa Canva, namun
merupakan implementasi orisinal LearnerAI dengan kemampuan AI dan integrasi
penuh ke seluruh fitur aplikasi.

Berbeda dengan Canva yang hanya berfokus pada desain, Creatives menyatu dengan
seluruh ekosistem LearnerAI — mulai dari pembelajaran, quiz, sertifikat,
hingga personalisasi UI aplikasi itu sendiri — semuanya digerakkan oleh AI.

### Kemampuan Creatives

#### AI Image

- Generasi gambar dari deskripsi pengguna.
- Mendukung semua provider BYOK (OpenAI, Anthropic, Gemini, Groq, Mistral,
  DeepSeek, OmniRoute, OpenRouter, dan lainnya).
- Default menggunakan Cloudflare Workers AI karena gratis.

#### AI UI

- Mengubah tampilan aplikasi LearnerAI secara langsung dari perintah teks.
- Contoh: *"Ubah warna sidebar menjadi biru"*, *"Tambahkan menu baru"*,
  *"Pindahkan tombol"*, *"Tambahkan halaman"*.
- AI menghasilkan **patch UI yang dapat ditinjau pengguna sebelum diterapkan**
  (review-before-apply), sehingga aman dan terkontrol.
- Mendukung halaman kustom baru yang ditambahkan ke sidebar.
- Default menggunakan Cloudflare AI, semua provider BYOK juga didukung.

#### AI Design

- Membuat desain dari prompt dengan berbagai kategori:
  banner, poster, thumbnail, sertifikat, presentasi, dan infografis.
- Mengedit/remix desain yang sudah ada.
- Mengubah warna, font, layout, dan ukuran desain.
- Semua hasil dapat disimpan, di-load ulang, dan diekspor (PNG/PDF).

#### Certificate Designer

- Mendesain sertifikat langsung dari Creatives.
- Upload logo dan background, menambahkan QR Code, mengganti font,
  dan menambahkan watermark.
- AI Designer dapat membuat desain sertifikat otomatis dari deskripsi.
- Contoh: *"Buat sertifikat bertema teknologi warna biru"*.

#### Quiz Designer

- Editor Custom Quiz terpusat di menu Creatives.
- Jenis soal: Pilihan Ganda, Essay, True/False, Checkbox, Matching,
  Fill in the Blank, dan Short Answer.
- Pengguna menentukan jawaban benar, penjelasan, nilai, dan timer.

#### Flashcard Designer

- Membuat dan mendesain kartu belajar dalam ekosistem Creatives.
- Terintegrasi dengan sistem Flashcards yang sudah ada.

---

## Integrasi Provider AI

Semua kemampuan AI Creatives menggunakan sistem provider tunggal LearnerAI:

| Provider        | Tipe          | API Key |
| --------------- | ------------- | ------- |
| Cloudflare AI   | Default       | Tidak   |
| OpenAI          | BYOK          | Ya      |
| Anthropic       | BYOK          | Ya      |
| Google Gemini   | BYOK          | Ya      |
| Groq            | BYOK          | Ya      |
| Mistral         | BYOK          | Ya      |
| DeepSeek        | BYOK          | Ya      |
| OpenRouter      | BYOK          | Ya      |
| OmniRoute       | Lokal         | Tidak   |

> Lihat [docs/providers/omniroute.md](providers/omniroute.md) untuk cara
> menjalankan dan menghubungkan OmniRoute ke LearnerAI.

---

## Catatan

- **⬜** = Belum diimplementasi
- **✅** = Sudah diimplementasi
- **🟡** = Dalam pengembangan

*Dokumen terakhir diperbarui: 01 Agustus 2026*
