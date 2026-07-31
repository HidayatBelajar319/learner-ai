-- Migration: 0004_seed_content.sql
-- Seed materi pembelajaran awal

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
('mat-aljabar-1', 'Pengenalan Aljabar', 'mathematics', 'Aljabar Dasar', 'Dasar', 'lesson', 'markdown', '# Pengenalan Aljabar

Aljabar adalah cabang matematika yang menggunakan **huruf** untuk mewakili angka yang belum diketahui.

## Variabel

Variabel adalah simbol (biasanya huruf seperti *x* atau *y*) yang mewakili angka.

Contoh:

```
x + 3 = 7
x = 4
```

## Koefisien dan Konstanta

- **Koefisien**: angka yang mengalikan variabel (dalam `3x`, koefisiennya adalah 3)
- **Konstanta**: angka tetap (dalam `3x + 5`, konstantanya adalah 5)

## Contoh Soal

1. Jika `x + 5 = 12`, berapakah nilai x?
   - Jawaban: x = 7

2. Sederhanakan: `2x + 3x`
   - Jawaban: `5x`

> **Tips**: Anggap variabel seperti kotak misterius. Tugasmu mencari isi kotaknya!', '{"tags":["aljabar","variabel","dasar"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('mat-aljabar-2', 'Persamaan Linear', 'mathematics', 'Aljabar Dasar', 'Dasar', 'lesson', 'markdown', '# Persamaan Linear Satu Variabel

Persamaan linear satu variabel memiliki bentuk umum:

```
ax + b = c
```

dengan a ≠ 0.

## Langkah Penyelesaian

1. Pindahkan konstanta ke ruas kanan
2. Bagi kedua ruas dengan koefisien

## Contoh

Selesaikan `2x + 3 = 11`:

```
2x = 11 - 3
2x = 8
x = 4
```

## Latihan

1. Selesaikan `x + 7 = 15`
2. Selesaikan `3x - 5 = 10`
3. Selesaikan `4x + 2 = 2x + 8`', '{"tags":["persamaan","linear"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('mat-geometri-1', 'Bangun Datar', 'mathematics', 'Geometri', 'Dasar', 'lesson', 'markdown', '# Bangun Datar

Bangun datar adalah bentuk dua dimensi (memiliki panjang dan lebar).

## Jenis-Jenis Bangun Datar

- **Persegi**: 4 sisi sama panjang
- **Persegi Panjang**: 2 pasang sisi sama panjang
- **Segitiga**: 3 sisi
- **Lingkaran**: dibatasi kurva lengkung

## Rumus Luas

| Bangun | Rumus Luas |
|--------|------------|
| Persegi | s × s |
| Persegi Panjang | p × l |
| Segitiga | ½ × a × t |
| Lingkaran | π × r² |

## Contoh

Persegi dengan sisi 5 cm:

```
Luas = 5 × 5 = 25 cm²
```', '{"tags":["geometri","bangun datar"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('mat-statis-1', 'Rata-Rata dan Median', 'mathematics', 'Statistika', 'Menengah', 'lesson', 'markdown', '# Rata-Rata (Mean) dan Median

## Rata-Rata

Rata-rata dihitung dengan menjumlahkan semua data lalu dibagi banyaknya data.

```
Mean = (jumlah semua data) / (banyak data)
```

## Median

Median adalah nilai tengah setelah data diurutkan.

- Jika jumlah data **ganjil**: median = data ke-((n+1)/2)
- Jika jumlah data **genap**: median = rata-rata dua data tengah

## Contoh

Data: 4, 7, 9, 10, 5

```
Urutkan: 4, 5, 7, 9, 10
Mean = (4+5+7+9+10)/5 = 35/5 = 7
Median = 7 (nilai tengah)
```', '{"tags":["statistika","rata-rata","median"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('bind-1', 'Kalimat Efektif', 'bahasa-indonesia', 'Tata Bahasa Dasar', 'Dasar', 'lesson', 'markdown', '# Kalimat Efektif

Kalimat efektif adalah kalimat yang mudah dipahami dan sesuai kaidah bahasa Indonesia.

## Ciri-Ciri Kalimat Efektif

1. **Kehematan** — tidak boros kata
   - Salah: Para para siswa-siswa belajar
   - Benar: Para siswa belajar

2. **Kepaduan** — hubungan antar unsur jelas

3. **Kebermaknaan** — memiliki makna yang jelas

## Unsur Kalimat

Kalimat minimal terdiri dari **Subjek (S)** dan **Predikat (P)**.

Contoh:
- Ibu memasak. (S = Ibu, P = memasak)
- Adik bermain bola. (S = Adik, P = bermain, O = bola)', '{"tags":["tata bahasa","kalimat"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('bind-2', 'Paragraf Narasi', 'bahasa-indonesia', 'Menulis Karangan', 'Menengah', 'lesson', 'markdown', '# Paragraf Narasi

Paragraf narasi adalah paragraf yang menceritakan suatu kejadian secara runtut.

## Struktur Narasi

1. **Orientasi** — pengenalan tokoh, tempat, waktu
2. **Komplikasi** — munculnya masalah
3. **Resolusi** — penyelesaian masalah

## Contoh

> Pada suatu pagi, Rina bergegas ke sekolah karena hari ini adalah hari ujian. Sesampainya di kelas, ia sadar lupa membawa kalkulator. Untungnya, temannya Budi bersedia meminjamkan kalkulator miliknya.

## Ciri Kebahasaan

- Menggunakan kata kerja tindakan (berlari, membaca)
- Menggunakan kata penghubung waktu (lalu, kemudian, akhirnya)', '{"tags":["narasi","menulis"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('bing-1', 'Simple Present Tense', 'bahasa-inggris', 'Basic Grammar', 'Pemula', 'lesson', 'markdown', '# Simple Present Tense

Simple Present Tense digunakan untuk:
- Kebiasaan (habits)
- Fakta umum (general truths)
- Jadwal tetap

## Rumus

**Positif:** Subject + Verb1 (+s/es) + Object

**Negatif:** Subject + do/does + not + Verb1 + Object

**Tanya:** Do/Does + Subject + Verb1 + Object?

## Contoh

- She **eats** breakfast every day.
- They **do not** like coffee.
- **Does** he **play** football?

## Kata Kerja untuk He/She/It

Tambahkan -s/-es:
- play → plays
- go → goes
- watch → watches
- study → studies', '{"tags":["grammar","tenses"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('bing-2', 'Greetings & Introductions', 'bahasa-inggris', 'Vocabulary Building', 'Pemula', 'lesson', 'markdown', '# Greetings and Introductions

## Salam (Greetings)

| Situasi | Ungkapan |
|---------|----------|
| Pagi | Good morning |
| Siang | Good afternoon |
| Sore | Good evening |
| Bertemu | Hello / Hi |

## Memperkenalkan Diri

- My name is... (Nama saya...)
- I am from... (Saya berasal dari...)
- I am a student. (Saya seorang pelajar.)
- Nice to meet you. (Senang bertemu denganmu.)

## Percakapan Contoh

> **A:** Hello, my name is Dewi. What is your name?
> **B:** Hi Dewi, I am Bagas. Nice to meet you.
> **A:** Nice to meet you too, Bagas.', '{"tags":["greetings","vocabulary"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('ipa-fisika-1', 'Gaya dan Gerak', 'ipa', 'Fisika Dasar', 'Dasar', 'lesson', 'markdown', '# Gaya dan Gerak

## Gaya

Gaya adalah tarikan atau dorongan yang dapat mengubah gerak benda. Satuan gaya adalah **Newton (N)**.

## Hukum Newton

### Hukum I Newton (Kelembaman)
Benda tetap diam atau bergerak lurus beraturan jika tidak ada gaya total.

### Hukum II Newton

```
F = m × a
```

F = gaya (N), m = massa (kg), a = percepatan (m/s²)

### Hukum III Newton

Setiap aksi memiliki reaksi yang sama besar dan berlawanan arah.

## Contoh Soal

Massa 10 kg, percepatan 2 m/s²:

```
F = 10 × 2 = 20 N
```', '{"tags":["fisika","gaya","gerak"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('ipa-kimia-1', 'Atom dan Molekul', 'ipa', 'Kimia Dasar', 'Dasar', 'lesson', 'markdown', '# Atom dan Molekul

## Atom

Atom adalah partikel terkecil penyusun materi.

Bagian-bagian atom:
- **Proton** (+), di inti
- **Neutron** (0), di inti
- **Elektron** (−), mengelilingi inti

## Molekul

Molekul terbentuk saat dua atau lebih atom berikatan.

Contoh:
- H₂O (air): 2 hidrogen + 1 oksigen
- CO₂ (karbon dioksida): 1 karbon + 2 oksigen

## Tabel Periodik

Tabel periodik mengelompokkan unsur berdasarkan sifat kimianya.', '{"tags":["kimia","atom","molekul"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('ips-sejarah-1', 'Sejarah Kemerdekaan Indonesia', 'ips', 'Sejarah Indonesia', 'Dasar', 'lesson', 'markdown', '# Proklamasi Kemerdekaan Indonesia

## Latar Belakang

Setelah Jepang menyerah pada Agustus 1945, Indonesia memiliki kesempatan untuk memproklamasikan kemerdekaan.

## Peristiwa Penting

1. **16 Agustus 1945** — Peristiwa Rengasdengklok, Soekarno dan Hatta diamankan
2. **17 Agustus 1945** — Pembacaan teks Proklamasi di Jalan Pegangsaan Timur 56, Jakarta

## Isi Proklamasi

> "Kami bangsa Indonesia dengan ini menjatakan kemerdekaan Indonesia."

Proklamasi dibacakan oleh **Ir. Soekarno** didampingi **Dr. Mohammad Hatta**.', '{"tags":["sejarah","kemerdekaan"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('prog-html-1', 'Dasar HTML', 'pemrograman', 'HTML & CSS', 'Pemula', 'lesson', 'markdown', '# Dasar HTML

HTML (HyperText Markup Language) adalah bahasa untuk membuat struktur halaman web.

## Struktur Dasar

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Judul</title>
  </head>
  <body>
    <h1>Halo Dunia!</h1>
  </body>
</html>
```

## Tag Umum

- `<h1>` sampai `<h6>` — heading
- `<p>` — paragraf
- `<a href="...">` — link
- `<img src="...">` — gambar
- `<div>` — kontainer

## Contoh

```html
<h1>Judul Utama</h1>
<p>Ini adalah paragraf.</p>
<a href="https://contoh.com">Klik disini</a>
```', '{"tags":["html","web"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z'),
('prog-js-1', 'Pengenalan JavaScript', 'pemrograman', 'JavaScript Dasar', 'Pemula', 'lesson', 'markdown', '# Pengenalan JavaScript

JavaScript adalah bahasa pemrograman untuk membuat halaman web interaktif.

## Variabel

```js
let nama = "Budi";
const umur = 17;
var kota = "Jakarta";
```

## Tipe Data

- `string` — teks ("halo")
- `number` — angka (42)
- `boolean` — true/false
- `array` — [1, 2, 3]
- `object` — { nama: "Budi" }

## Fungsi

```js
function sapa(nama) {
  return "Halo, " + nama;
}

console.log(sapa("Budi")); // "Halo, Budi"
```

## Kondisi

```js
if (umur >= 17) {
  console.log("Bisa buat KTP");
} else {
  console.log("Masih di bawah umur");
}
```', '{"tags":["javascript","pemrograman"]}', '2026-07-30T00:00:00.000Z', '2026-07-30T00:00:00.000Z');
