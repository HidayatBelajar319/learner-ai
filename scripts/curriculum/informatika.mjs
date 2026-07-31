// scripts/curriculum/informatika.mjs
const L = (id, title, subject, topic, level, data, tags = []) => ({ id, title, subject, topic, level, data, tags });

export default [
  // ===== Informatika =====
  L('inf-sd-komputer-1', 'Mengenal Komputer', 'informatika', 'Dasar', 'SD', `# Mengenal Komputer

Komputer adalah alat elektronik yang mengolah data menjadi informasi.

## Bagian Komputer

1. **CPU**: otak komputer
2. **Monitor**: layar untuk melihat tampilan
3. **Keyboard**: untuk mengetik
4. **Mouse**: untuk mengarahkan kursor

## Perangkat Lunak dan Keras

- **Perangkat keras (hardware)**: bagian fisik (monitor, keyboard, printer)
- **Perangkat lunak (software)**: program (game, aplikasi menggambar, browser)

## Menggunakan Komputer dengan Aman

- Jangan makan atau minum di dekat komputer
- Gunakan dengan duduk tegak
- Minta izin orang tua saat online

## Latihan

Sebutkan tiga bagian komputer dan fungsinya!`, ['komputer', 'sd']),

  L('inf-sd-amandata-1', 'Aman Bermedia Digital', 'informatika', 'Digital', 'SD', `# Aman Bermedia Digital

## Aturan Dasar

1. Jangan membuka situs sembarangan
2. Jangan memberi tahu kata sandi kepada siapa pun
3. Jangan berteman dengan orang tak dikenal
4. Beri tahu orang tua jika ada hal aneh

## Data Pribadi

Data pribadi adalah informasi tentang diri kita:

- Nama lengkap
- Alamat rumah
- Nomor telepon
- Foto pribadi

Jangan membagikan data pribadi di internet.

## Layar Sehat

- Batasi waktu main gadget
- Istirahat setiap 20 menit menatap layar

## Latihan

Sebutkan tiga data pribadi yang tidak boleh dibagikan di internet!`, ['keamanan digital', 'sd']),

  L('inf-smp-berpikir-1', 'Berpikir Komputasional', 'informatika', 'Dasar', 'SMP', `# Berpikir Komputasional

Berpikir komputasional adalah cara berpikir untuk menyelesaikan masalah secara sistematis.

## Empat Pilar

1. **Dekomposisi**: memecah masalah menjadi bagian kecil
2. **Pengenalan pola**: menemukan kemiripan masalah
3. **Abstraksi**: fokus pada informasi penting
4. **Algoritma**: menyusun langkah penyelesaian

## Contoh

Membuat kue:

- Dekomposisi: belanja bahan, mencampur, memanggang
- Algoritma: langkah berurutan resep

## Manfaat

Berpikir komputasional dapat digunakan di semua bidang, bukan hanya komputer.

## Latihan

Terapkan dekomposisi dan algoritma untuk masalah "menyiapkan bekal sekolah"!`, ['berpikir komputasional', 'smp']),

  L('inf-smp-algoritma-1', 'Algoritma dan Flowchart', 'informatika', 'Pemrograman', 'SMP', `# Algoritma dan Flowchart

Algoritma adalah langkah-langkah berurutan untuk menyelesaikan masalah.

## Contoh Algoritma

**Menyimpan file:**

1. Klik menu File
2. Pilih Save
3. Ketik nama file
4. Klik Simpan

## Flowchart

Diagram alir yang menggambarkan algoritma.

Simbol:

- **Oval**: mulai/selesai
- **Persegi panjang**: proses
- **Jajar genjang**: input/output
- **Belah ketupat**: keputusan (ya/tidak)

## Karakteristik Algoritma Baik

1. Tersusun urut
2. Jelas dan pasti
3. Ada akhir (terminasi)
4. Efektif dan efisien

## Latihan

Buat algoritma sederhana untuk membuat secangkir teh!`, ['algoritma', 'smp']),

  L('inf-smp-jaringan-1', 'Jaringan Komputer dan Internet', 'informatika', 'Jaringan', 'SMP', `# Jaringan Komputer dan Internet

## Jaringan

Jaringan komputer menghubungkan komputer agar dapat berbagi data.

- **LAN**: jaringan lokal (sekolah, kantor)
- **WAN**: jaringan luas (antar kota/negara)

## Internet

Internet adalah jaringan komputer global yang saling terhubung.

## Komponen Koneksi Internet

1. **Modem**: mengubah sinyal data
2. **Router**: membagi sinyal ke banyak perangkat
3. **ISP**: penyedia layanan internet

## Kegunaan Internet

- Mencari informasi
- Berkomunikasi
- Belajar daring
- Berdagang online

## Latihan

Apa perbedaan LAN dan WAN? Sebutkan dua kegunaan internet!`, ['jaringan', 'internet', 'smp']),

  // -- SMA --
  L('inf-sma-teknologi-1', 'Teknologi Informasi dan Komunikasi', 'informatika', 'Dasar', 'SMA', `# Teknologi Informasi dan Komunikasi

## Komponen TIK

1. **Hardware**: perangkat keras
2. **Software**: perangkat lunak
3. **Brainware**: manusia pengguna

## Perangkat Lunak

- **Sistem operasi**: Windows, Linux, macOS
- **Aplikasi**: pengolah kata, spreadsheet, browser
- **Bahasa pemrograman**: Python, JavaScript, C++

## Cloud Computing

Menyimpan dan mengolah data di server internet:

- Google Drive
- iCloud
- Dropbox

## Keamanan Siber

- Gunakan kata sandi kuat
- Aktifkan autentikasi dua faktor
- Hati-hati dengan email mencurigakan (phishing)

## Latihan

Sebutkan tiga contoh cloud computing dan dua cara menjaga keamanan akun!`, ['tik', 'sma']),

  L('inf-sma-databases-1', 'Database dan Pengolahan Data', 'informatika', 'Data', 'SMA', `# Database dan Pengolahan Data

## Pengertian Database

Database adalah kumpulan data terstruktur yang disimpan dan dikelola secara teratur.

## Sistem Database

- **Spreadsheet** (Excel/Sheets): tabel sederhana
- **DBMS**: sistem manajemen database (MySQL, PostgreSQL)
- **SQL**: bahasa untuk mengelola database

## Perintah Dasar SQL

\`\`\`
SELECT * FROM siswa;
INSERT INTO siswa (nama) VALUES ('Budi');
UPDATE siswa SET umur = 12 WHERE nama = 'Budi';
DELETE FROM siswa WHERE nama = 'Budi';
\`\`\`

## Manfaat Database

Data terpusat, mudah dicari, dan terhindar dari duplikasi.

## Latihan

Apa kepanjangan SQL dan sebutkan tiga perintah dasarnya!`, ['database', 'data', 'sma']),

  L('inf-sma-siber-1', 'Keamanan Siber', 'informatika', 'Digital', 'SMA', `# Keamanan Siber

## Ancaman di Dunia Digital

- **Malware**: program jahat (virus, ransomware)
- **Phishing**: penipuan meminta data pribadi
- **Social engineering**: manipulasi psikologis
- **Pembajakan akun**: pencurian akun

## Cara Melindungi Diri

1. Kata sandi kuat dan berbeda tiap akun
2. Autentikasi dua faktor (2FA)
3. Perbarui perangkat lunak
4. Jangan klik tautan mencurigakan
5. Rutin mencadangkan (backup) data

## Etika Digital

- Berpikir sebelum membagikan
- Menghargai karya orang (hak cipta)
- Tidak menyebarkan hoaks dan ujaran kebencian

## Latihan

Sebutkan tiga ancaman siber dan tiga cara melindungi akun!`, ['keamanan siber', 'sma']),

  // ===== Pemrograman =====
  L('pro-sd-langkah-1', 'Berpikir Algoritmik untuk Anak', 'pemrograman', 'Dasar', 'SD', `# Berpikir Algoritmik untuk Anak

Algoritma adalah urutan langkah untuk menyelesaikan tugas.

## Contoh Sehari-hari

**Menyikat gigi:**

1. Ambil sikat dan pasta
2. Oleskan pasta
3. Sikat semua gigi
4. Bilas dan kumur

## Coding Tanpa Komputer

- Bermain robot: beri perintah langkah (maju, kiri, kanan)
- Menyusun kartu urutan kegiatan

## Istilah Penting

- **Perintah**: instruksi untuk robot/komputer
- **Urutan**: perintah dikerjakan berurutan

## Latihan

Tuliskan algoritma "membuka pintu" dalam lima langkah!`, ['algoritma', 'sd']),

  L('pro-smp-logika-1', 'Logika Pemrograman', 'pemrograman', 'Logika', 'SMP', `# Logika Pemrograman

## Konsep Dasar

Program adalah kumpulan instruksi yang dijalankan komputer untuk menyelesaikan masalah.

## Urutan, Percabangan, dan Perulangan

1. **Urutan (sequence)**: instruksi berurutan
2. **Percabangan (if)**: keputusan dengan kondisi

\`\`\`
if nilai >= 70:
    print("Lulus")
else:
    print("Belum lulus")
\`\`\`

3. **Perulangan (loop)**: mengulang instruksi

\`\`\`
for i in range(3):
    print("Halo")
\`\`\`

## Pseudo-code

Menuliskan langkah seperti bahasa manusia sebelum kode sebenarnya.

## Latihan

Tuliskan pseudo-code untuk memutuskan apakah bisa naik kelas (nilai >= 75)!`, ['logika', 'smp']),

  L('pro-sma-python-1', 'Pemrograman Python Dasar', 'pemrograman', 'Python', 'SMA', `# Pemrograman Python Dasar

## Variabel dan Tipe Data

\`\`\`
nama = "Budi"
umur = 12
tinggi = 1.55
\`\`\`

## Input dan Output

\`\`\`
nama = input("Siapa namamu? ")
print("Halo,", nama)
\`\`\`

## Percabangan

\`\`\`
if umur >= 17:
    print("Sudah dewasa")
else:
    print("Belum dewasa")
\`\`\`

## Perulangan

\`\`\`
for i in range(1, 6):
    print(i)
\`\`\`

## Fungsi

\`\`\`
def luas_persegi(s):
    return s * s

print(luas_persegi(5))  # 25
\`\`\`

## Latihan

Tulis program Python yang meminta dua angka lalu mencetak jumlahnya!`, ['python', 'sma']),

  L('pro-sma-javascript-1', 'Pemrograman Web (HTML, CSS, JavaScript)', 'pemrograman', 'Web', 'SMA', `# Pemrograman Web

## HTML

Struktur halaman web:

\`\`\`html
<h1>Judul</h1>
<p>Ini paragraf.</p>
<a href="https://contoh.com">Tautan</a>
\`\`\`

## CSS

Mengatur tampilan:

\`\`\`css
h1 {
  color: blue;
  font-size: 24px;
}
\`\`\`

## JavaScript

Membuat halaman interaktif:

\`\`\`js
document.getElementById("tombol").onclick = function() {
  alert("Halo!");
};
\`\`\`

## Cara Belajar

1. Bangun halaman HTML sederhana
2. Perindah dengan CSS
3. Tambahkan interaksi dengan JavaScript

## Latihan

Apa fungsi masing-masing HTML, CSS, dan JavaScript dalam pembuatan web?`, ['web', 'javascript', 'sma']),

  L('pro-sma-dataalgo-1', 'Struktur Data dan Algoritma', 'pemrograman', 'Algoritma', 'SMA', `# Struktur Data dan Algoritma

## Struktur Data Dasar

- **Array**: kumpulan data dengan indeks

\`\`\`
nilai = [80, 90, 75]
print(nilai[0])  # 80
\`\`\`

- **List/daftar**: dapat ditambah dan dihapus
- **Hashmap/dictionary**: data berpasangan kunci-nilai

## Algoritma Pencarian

- **Linear search**: memeriksa satu per satu
- **Binary search**: membagi data di tengah (data harus terurut)

## Algoritma Pengurutan

- **Bubble sort**: menukar berulang sampai terurut
- **Selection sort**: memilih nilai terkecil tiap langkah

## Kompleksitas

Menunjukkan seberapa cepat algoritma berjalan. Semakin kecil, semakin efisien.

## Latihan

Kapan binary search lebih cepat daripada linear search?`, ['struktur data', 'algoritma', 'sma']),

  // ===== Keterampilan =====
  L('ket-sd-tekstil-1', 'Mengenal Bahan dan Kerajinan Tekstil', 'keterampilan', 'Tekstil', 'SD', `# Mengenal Bahan dan Kerajinan Tekstil

## Jenis Bahan Tekstil

1. **Katun**: dari kapas, lembut, menyerap keringat
2. **Wol**: dari bulu hewan, hangat
3. **Sutra**: dari ulat sutra, halus dan licin
4. **Poliester**: serat buatan

## Kerajinan Tekstil Sederhana

- Menjahit kain perca menjadi tempat pensil
- Merajut dengan benang wol
- Membatik dengan pewarna

## Keselamatan Menggunakan Jarum

Gunakan bidal, simpan jarum di tempatnya, dan minta bantuan orang dewasa.

## Latihan

Sebutkan empat jenis bahan tekstil beserta asalnya!`, ['tekstil', 'sd']),

  L('ket-smp-pangan-1', 'Pengolahan Bahan Pangan', 'keterampilan', 'Pangan', 'SMP', `# Pengolahan Bahan Pangan

## Pengertian

Mengolah bahan mentah menjadi makanan yang lebih bermanfaat dan tahan lama.

## Teknik Dasar

- **Merebus**: memasak dalam air mendidih
- **Menggoreng**: memasak dengan minyak
- **Mengukus**: memasak dengan uap air
- **Mengawetkan**: membuat tahan lama (asinan, manisan)

## Gizi dalam Pangan

- Karbohidrat: sumber energi
- Protein: pembangun tubuh
- Vitamin dan mineral: penjaga kesehatan

## Keamanan Pangan

Cuci tangan dan bahan, masak hingga matang, simpan makanan dengan benar.

## Latihan

Sebutkan tiga teknik pengolahan pangan dan dua contoh makanan awetan!`, ['pangan', 'smp']),

  L('ket-smp-elektronika-1', 'Dasar Elektronika', 'keterampilan', 'Elektronika', 'SMP', `# Dasar Elektronika

## Komponen Elektronika

1. **Resistor**: menghambat arus listrik
2. **Kapasitor**: menyimpan muatan
3. **Dioda**: mengalirkan arus satu arah
4. **Transistor**: penguat dan saklar
5. **LED**: lampu hemat energi

## Rangkaian Sederhana

LED + resistor + baterai membentuk rangkaian paling dasar.

## Keselamatan Listrik

- Jangan menyentuh komponen saat listrik menyala
- Gunakan tegangan rendah untuk latihan
- Minta bantuan guru/orang dewasa

## Latihan

Sebutkan fungsi resistor, dioda, dan transistor!`, ['elektronika', 'smp']),

  L('ket-sma-proyek-1', 'Manajemen Proyek Keterampilan', 'keterampilan', 'Proyek', 'SMA', `# Manajemen Proyek Keterampilan

## Tahap Proyek

1. **Perencanaan**: tujuan, bahan, dan jadwal
2. **Pelaksanaan**: membuat produk sesuai rencana
3. **Evaluasi**: memeriksa hasil dan kendala
4. **Tindak lanjut**: memperbaiki dan mendokumentasikan

## Contoh Proyek

Membuat lampu hias dari botol bekas dengan LED.

## Dokumentasi

Catat: bahan, langkah, biaya, waktu, dan foto hasil.

## Soft Skills

Kerja tim, komunikasi, manajemen waktu, dan pemecahan masalah.

## Latihan

Buat rencana sederhana proyek keterampilan: tujuan, bahan, dan jadwalnya!`, ['proyek', 'sma']),
];
