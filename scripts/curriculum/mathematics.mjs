// scripts/curriculum/mathematics.mjs
const L = (id, title, topic, level, data, tags = []) => ({ id, title, subject: 'mathematics', topic, level, data, tags });

export default [
  // ===== SD =====
  L('mat-sd-bilangan-1', 'Bilangan Cacah dan Bilangan Bulat', 'Bilangan', 'SD', `# Bilangan Cacah dan Bilangan Bulat

Bilangan adalah konsep dasar matematika untuk menghitung benda.

## Bilangan Cacah

Bilangan cacah adalah bilangan yang dimulai dari nol: **0, 1, 2, 3, 4, ...**

## Bilangan Bulat

Bilangan bulat terdiri dari bilangan negatif, nol, dan bilangan positif: **... -3, -2, -1, 0, 1, 2, 3 ...**

## Garis Bilangan

Garis bilangan membantu kita melihat urutan bilangan:

\`\`\`
<---|----|----|----|----|----|----|--->
   -3   -2   -1    0    1    2    3
\`\`\`

- Semakin ke **kanan**, nilai semakin **besar**
- Semakin ke **kiri**, nilai semakin **kecil**

## Membandingkan Bilangan

Gunakan tanda:

- **>** lebih besar dari
- **<** lebih kecil dari
- **=** sama dengan

Contoh: 7 > 3 dan 5 < 8.

## Contoh Soal

1. Urutkan bilangan berikut dari yang terkecil: 8, 2, 5, 10
   - Jawaban: 2, 5, 8, 10

2. Isi tanda yang tepat: 4 ... 9
   - Jawaban: 4 < 9`, ['bilangan', 'sd']),

  L('mat-sd-operasi-1', 'Operasi Hitung: Penjumlahan dan Pengurangan', 'Operasi Hitung', 'SD', `# Operasi Hitung: Penjumlahan dan Pengurangan

## Penjumlahan

Penjumlahan adalah menggabungkan dua atau lebih bilangan.

Contoh: 35 + 27 = 62

Cara bersusun:

\`\`\`
  35
  27
---- +
  62
\`\`\`

## Pengurangan

Pengurangan adalah mengambil sebagian dari suatu bilangan.

Contoh: 62 - 27 = 35

Cara bersusun:

\`\`\`
  62
  27
---- -
  35
\`\`\`

## Sifat Penjumlahan

1. **Komutatif**: a + b = b + a (contoh: 3 + 4 = 4 + 3)
2. **Asosiatif**: (a + b) + c = a + (b + c)

## Contoh Soal

1. Hitunglah: 148 + 57 = ?
   - Jawaban: 205

2. Hitunglah: 300 - 145 = ?
   - Jawaban: 155`, ['operasi hitung', 'sd']),

  L('mat-sd-perkalian-1', 'Perkalian dan Pembagian', 'Operasi Hitung', 'SD', `# Perkalian dan Pembagian

## Perkalian

Perkalian adalah penjumlahan berulang. Contoh: 4 × 3 berarti 3 + 3 + 3 + 3 = 12.

**Tabel Perkalian Dasar:**

| × | 1 | 2 | 3 | 4 | 5 |
|---|--|--|--|--|--|
| 2 | 2 | 4 | 6 | 8 | 10 |
| 3 | 3 | 6 | 9 | 12 | 15 |
| 4 | 4 | 8 | 12 | 16 | 20 |
| 5 | 5 | 10 | 15 | 20 | 25 |

## Pembagian

Pembagian adalah kebalikan dari perkalian. Contoh: 12 : 3 = 4, karena 4 × 3 = 12.

## Operasi Campuran

Urutan pengerjaan (KA-BA-TA-KU):

1. **Kurung** ( )
2. **Pangkat**
3. **Kali** dan **Bagi** (dikerjakan dari kiri)
4. **Tambah** dan **Kurang** (dikerjakan dari kiri)

Contoh: 8 + 6 × 2 = 8 + 12 = 20

## Contoh Soal

1. Hitunglah: 7 × 8 = ?
   - Jawaban: 56

2. Hitunglah: 45 : 9 = ?
   - Jawaban: 5`, ['perkalian', 'pembagian', 'sd']),

  L('mat-sd-pecahan-1', 'Pecahan Sederhana', 'Pecahan', 'SD', `# Pecahan Sederhana

Pecahan menyatakan bagian dari keseluruhan. Contoh: 1/2 berarti 1 bagian dari 2 bagian sama besar.

## Bagian Pecahan

- **Pembilang**: angka di atas (menyatakan bagian yang diambil)
- **Penyebut**: angka di bawah (menyatakan banyaknya bagian)

\`\`\`
  3   <- pembilang
  -
  4   <- penyebut
\`\`\`

## Pecahan Senilai

Pecahan senilai adalah pecahan yang nilainya sama. Contoh: 1/2 = 2/4 = 4/8

Cara mencari pecahan senilai: kalikan pembilang dan penyebut dengan bilangan yang sama.

## Membandingkan Pecahan

Untuk pecahan dengan penyebut sama, bandingkan pembilangnya.

Contoh: 2/5 < 3/5

## Contoh Soal

1. Sederhanakan pecahan 4/8
   - Jawaban: 4/8 = 1/2 (bagi pembilang dan penyebut dengan 4)

2. Mana yang lebih besar: 1/4 atau 3/4?
   - Jawaban: 3/4`, ['pecahan', 'sd']),

  L('mat-sd-desimal-1', 'Bilangan Desimal dan Persen', 'Pecahan', 'SD', `# Bilangan Desimal dan Persen

## Bilangan Desimal

Desimal menggunakan tanda koma. Contoh: 0,5  (dibaca nol koma lima)

- 0,1 = 1/10
- 0,25 = 25/100
- 0,75 = 75/100

## Persen

Persen berarti per seratus (%). Contoh: 50% = 50/100 = 0,5

| Pecahan | Desimal | Persen |
|---------|---------|--------|
| 1/2     | 0,5     | 50%    |
| 1/4     | 0,25    | 25%    |
| 3/4     | 0,75    | 75%    |
| 1/10    | 0,1     | 10%    |

## Mengubah Pecahan ke Persen

Kalikan pecahan dengan 100%.

Contoh: 3/5 = 3/5 × 100% = 60%

## Contoh Soal

1. Ubah 2/5 menjadi persen
   - Jawaban: 2/5 × 100% = 40%

2. Ubah 0,4 menjadi pecahan
   - Jawaban: 0,4 = 4/10 = 2/5`, ['desimal', 'persen', 'sd']),

  L('mat-sd-bangun-1', 'Keliling dan Luas Bangun Datar', 'Bangun Datar', 'SD', `# Keliling dan Luas Bangun Datar

## Bangun Datar

Bangun datar adalah bentuk dua dimensi. Contoh: persegi, persegi panjang, segitiga, lingkaran.

## Rumus Keliling

Keliling adalah jumlah panjang semua sisi.

| Bangun | Rumus Keliling |
|--------|----------------|
| Persegi | 4 × s |
| Persegi Panjang | 2 × (p + l) |
| Segitiga | a + b + c |
| Lingkaran | 2 × π × r |

## Rumus Luas

Luas adalah ukuran daerah di dalam bangun.

| Bangun | Rumus Luas |
|--------|------------|
| Persegi | s × s |
| Persegi Panjang | p × l |
| Segitiga | 1/2 × a × t |
| Lingkaran | π × r² |

## Contoh Soal

1. Persegi dengan sisi 6 cm. Hitung luasnya!
   - Jawaban: 6 × 6 = 36 cm²

2. Persegi panjang dengan panjang 8 cm dan lebar 5 cm. Hitung kelilingnya!
   - Jawaban: 2 × (8 + 5) = 26 cm`, ['bangun datar', 'sd']),

  L('mat-sd-ruang-1', 'Volume Bangun Ruang', 'Bangun Ruang', 'SD', `# Volume Bangun Ruang

Volume adalah ukuran isi dari bangun ruang (tiga dimensi).

## Kubus

Kubus memiliki 6 sisi persegi yang sama besar.

\`\`\`
Volume kubus = s × s × s = s³
\`\`\`

## Balok

Balok memiliki panjang (p), lebar (l), dan tinggi (t).

\`\`\`
Volume balok = p × l × t
\`\`\`

## Contoh Soal

1. Kubus dengan rusuk 5 cm. Hitung volumenya!
   - Jawaban: 5 × 5 × 5 = 125 cm³

2. Balok berukuran 6 cm × 4 cm × 3 cm. Hitung volumenya!
   - Jawaban: 6 × 4 × 3 = 72 cm³

## Tips

Satuan volume menggunakan kubik, misalnya cm³ (dibaca sentimeter kubik).`, ['bangun ruang', 'volume', 'sd']),

  L('mat-sd-pengukuran-1', 'Pengukuran: Panjang, Berat, dan Waktu', 'Pengukuran', 'SD', `# Pengukuran: Panjang, Berat, dan Waktu

## Satuan Panjang

\`\`\`
km - hm - dam - m - dm - cm - mm
\`\`\`

Setiap turun satu tingkat dikali 10, naik satu tingkat dibagi 10.

Contoh: 1 km = 1000 m, dan 1 m = 100 cm.

## Satuan Berat

\`\`\`
kg - hg - dag - g - dg - cg - mg
\`\`\`

Contoh: 1 kg = 1000 g, dan 1 kg = 10 ons.

## Satuan Waktu

- 1 menit = 60 detik
- 1 jam = 60 menit
- 1 hari = 24 jam
- 1 minggu = 7 hari
- 1 tahun = 12 bulan

## Contoh Soal

1. 3 kg = ... gram?
   - Jawaban: 3000 gram

2. 2 jam 15 menit = ... menit?
   - Jawaban: 135 menit`, ['pengukuran', 'sd']),

  L('mat-sd-data-1', 'Pengolahan Data Sederhana', 'Statistika', 'SD', `# Pengolahan Data Sederhana

## Data

Data adalah kumpulan informasi berupa angka atau keterangan.

## Cara Menyajikan Data

1. **Tabel** - menyajikan data dalam baris dan kolom
2. **Diagram batang** - batang tegak menunjukkan nilai data
3. **Diagram garis** - garis menunjukkan perubahan data

## Contoh

Data banyak siswa SD Harapan: Kelas 1 = 30, Kelas 2 = 28, Kelas 3 = 32.

| Kelas | Jumlah Siswa |
|-------|--------------|
| 1     | 30           |
| 2     | 28           |
| 3     | 32           |

## Rata-rata

Rata-rata = jumlah semua data : banyak data

Contoh: (30 + 28 + 32) : 3 = 90 : 3 = 30

Jadi rata-rata siswa per kelas adalah 30.

## Contoh Soal

Nilai ulangan Budi: 80, 90, 85. Hitung rata-ratanya!
- Jawaban: (80 + 90 + 85) : 3 = 255 : 3 = 85`, ['data', 'statistika', 'sd']),

  // ===== SMP =====
  L('mat-smp-pangkat-1', 'Bilangan Berpangkat dan Bentuk Akar', 'Bilangan', 'SMP', `# Bilangan Berpangkat dan Bentuk Akar

## Bilangan Berpangkat

Bilangan berpangkat adalah perkalian berulang.

\`\`\`
aⁿ = a × a × a × ... (sebanyak n kali)
\`\`\`

Contoh: 2³ = 2 × 2 × 2 = 8

## Sifat Perpangkatan

1. aᵐ × aⁿ = aᵐ⁺ⁿ
2. aᵐ : aⁿ = aᵐ⁻ⁿ
3. (aᵐ)ⁿ = aᵐˣⁿ
4. a⁰ = 1

## Bentuk Akar

Akar adalah kebalikan dari pangkat.

\`\`\`
√9 = 3 karena 3² = 9
\`\`\`

## Contoh Soal

1. Hitunglah 3² × 3³
   - Jawaban: 3²⁺³ = 3⁵ = 243

2. Hitunglah √64
   - Jawaban: 8`, ['pangkat', 'akar', 'smp']),

  L('mat-smp-aljabar-1', 'Bentuk Aljabar', 'Aljabar', 'SMP', `# Bentuk Aljabar

## Pengertian

Bentuk aljabar memuat variabel, koefisien, dan konstanta.

Dalam bentuk **3x + 5**:

- **3** = koefisien
- **x** = variabel
- **5** = konstanta

## Suku Sejenis

Suku sejenis memiliki variabel yang sama. Contoh: 2x dan 5x adalah sejenis, sedangkan 2x dan 2y bukan.

## Penjumlahan dan Pengurangan

Hanya suku sejenis yang boleh dijumlahkan atau dikurangkan.

Contoh: 3x + 2x = 5x dan 7y - 3y = 4y

## Perkalian Bentuk Aljabar

Contoh: 2x × 3x = 6x²

## Contoh Soal

1. Sederhanakan: 4x + 3 + 2x - 1
   - Jawaban: (4x + 2x) + (3 - 1) = 6x + 2

2. Sederhanakan: 3x × 4y
   - Jawaban: 12xy`, ['aljabar', 'smp']),

  L('mat-smp-persamaan-1', 'Persamaan dan Pertidaksamaan Linear', 'Aljabar', 'SMP', `# Persamaan dan Pertidaksamaan Linear

## Persamaan Linear Satu Variabel (PLSV)

Bentuk umum: ax + b = c, dengan a ≠ 0.

Langkah penyelesaian:

1. Pindahkan konstanta ke ruas kanan
2. Bagi kedua ruas dengan koefisien x

Contoh: 2x + 3 = 11

\`\`\`
2x = 11 - 3
2x = 8
x = 4
\`\`\`

## Pertidaksamaan Linear

Bentuk umum: ax + b < c, ax + b > c, dan seterusnya.

**Penting:** Jika kedua ruas dikali atau dibagi bilangan negatif, tanda dibalik.

Contoh: -2x < 6 maka x > -3

## Contoh Soal

1. Selesaikan 3x - 5 = 10
   - Jawaban: 3x = 15, maka x = 5

2. Selesaikan x + 7 ≥ 12
   - Jawaban: x ≥ 5`, ['persamaan', 'pertidaksamaan', 'smp']),

  L('mat-smp-himpunan-1', 'Himpunan', 'Himpunan', 'SMP', `# Himpunan

## Pengertian

Himpunan adalah kumpulan objek yang dapat didefinisikan dengan jelas.

Contoh: Himpunan bilangan asli kurang dari 5 = {1, 2, 3, 4}

## Notasi

- Himpunan ditulis dengan kurung kurawal **{ }**
- Anggota himpunan dipisahkan dengan koma
- Himpunan kosong dilambangkan **{ }** atau **∅**

## Operasi Himpunan

- **Gabungan (∪)**: semua anggota yang ada di A atau B
- **Irisan (∩)**: anggota yang ada di A dan B sekaligus

Contoh: A = {1, 2, 3}, B = {3, 4, 5}

- A ∪ B = {1, 2, 3, 4, 5}
- A ∩ B = {3}

## Diagram Venn

Diagram Venn menggambarkan hubungan antar himpunan dengan lingkaran.

## Contoh Soal

Jika A = {a, b, c} dan B = {b, c, d}, tentukan A ∩ B!
- Jawaban: {b, c}`, ['himpunan', 'smp']),

  L('mat-smp-perbandingan-1', 'Perbandingan dan Skala', 'Perbandingan', 'SMP', `# Perbandingan dan Skala

## Perbandingan Senilai

Perbandingan senilai: jika satu nilai naik, nilai lain juga naik.

Contoh: 3 pensil harganya Rp 6.000. Harga 5 pensil?

\`\`\`
3 : 5 = 6000 : x
3x = 30000
x = 10000
\`\`\`

## Perbandingan Berbalik Nilai

Jika satu nilai naik, nilai lain turun.

Contoh: 6 pekerja selesai dalam 8 hari. 4 pekerja selesai dalam ... hari?

\`\`\`
6 × 8 = 4 × x
x = 12 hari
\`\`\`

## Skala

Skala = jarak pada peta : jarak sebenarnya

Contoh: skala 1:100.000 artinya 1 cm di peta = 100.000 cm (1 km) di lapangan.

## Contoh Soal

Jarak dua kota pada peta 4 cm dengan skala 1:250.000. Berapa jarak sebenarnya?
- Jawaban: 4 × 250.000 = 1.000.000 cm = 10 km`, ['perbandingan', 'skala', 'smp']),

  L('mat-smp-fungsi-1', 'Relasi dan Fungsi', 'Fungsi', 'SMP', `# Relasi dan Fungsi

## Relasi

Relasi adalah hubungan antara dua himpunan.

Contoh: himpunan A = {Budi, Siti} dan himpunan B = {SD, SMP, SMA}. Relasi "bersekolah di" menghubungkan anggota A ke B.

## Fungsi

Fungsi adalah relasi khusus di mana **setiap anggota A dipasangkan tepat satu anggota B**.

\`\`\`
f(x) = ax + b
\`\`\`

Contoh: f(x) = 2x + 1, maka f(3) = 2(3) + 1 = 7

## Domain, Kodomain, dan Range

- **Domain**: daerah asal (himpunan A)
- **Kodomain**: daerah kawan (himpunan B)
- **Range**: hasil pemetaan (anggota B yang terpasang)

## Contoh Soal

Diketahui f(x) = 3x - 2. Tentukan f(5)!
- Jawaban: 3(5) - 2 = 13`, ['fungsi', 'relasi', 'smp']),

  L('mat-smp-garis-1', 'Persamaan Garis Lurus', 'Fungsi', 'SMP', `# Persamaan Garis Lurus

## Gradien

Gradien (m) menunjukkan kemiringan garis. Semakin besar gradien, semakin curam garisnya.

\`\`\`
m = (y2 - y1) / (x2 - x1)
\`\`\`

## Bentuk Persamaan Garis

Bentuk umum: **y = mx + c**, dengan m = gradien dan c = titik potong sumbu y.

## Menentukan Gradien dari Dua Titik

Diketahui titik (2, 3) dan (5, 9):

\`\`\`
m = (9 - 3) / (5 - 2) = 6 / 3 = 2
\`\`\`

## Menentukan Persamaan Garis

Garis melalui titik (x1, y1) dengan gradien m:

\`\`\`
y - y1 = m(x - x1)
\`\`\`

## Contoh Soal

Garis melalui (1, 2) dengan gradien 3. Tentukan persamaannya!
- Jawaban: y - 2 = 3(x - 1) maka y = 3x - 1`, ['garis', 'gradien', 'smp']),

  L('mat-smp-pythagoras-1', 'Teorema Pythagoras', 'Geometri', 'SMP', `# Teorema Pythagoras

## Pengertian

Teorema Pythagoras berlaku pada segitiga siku-siku:

\`\`\`
c² = a² + b²
\`\`\`

dengan c = sisi miring (hipotenusa), a dan b = sisi tegak.

## Contoh

Segitiga siku-siku dengan a = 3 dan b = 4:

\`\`\`
c² = 3² + 4² = 9 + 16 = 25
c = √25 = 5
\`\`\`

## Tripel Pythagoras

Tiga bilangan yang memenuhi teorema Pythagoras, contoh:

- 3, 4, 5
- 6, 8, 10
- 5, 12, 13
- 7, 24, 25

## Contoh Soal

Sebuah tangga bersandar di dinding. Jarak kaki tangga ke dinding 6 m, tinggi tangga di dinding 8 m. Berapa panjang tangga?
- Jawaban: c² = 6² + 8² = 100, maka c = 10 m`, ['pythagoras', 'segitiga', 'smp']),

  L('mat-smp-lingkaran-1', 'Lingkaran', 'Geometri', 'SMP', `# Lingkaran

## Unsur Lingkaran

- **Jari-jari (r)**: jarak pusat ke tepi lingkaran
- **Diameter (d)**: dua kali jari-jari, d = 2r
- **Busur**: bagian dari keliling lingkaran
- **Tali busur**: ruas garis yang menghubungkan dua titik pada lingkaran

## Keliling dan Luas

\`\`\`
Keliling = 2 × π × r   atau   Keliling = π × d
Luas = π × r²
\`\`\`

dengan π = 22/7 atau 3,14.

## Contoh Soal

Lingkaran dengan jari-jari 7 cm. Hitung keliling dan luasnya!

\`\`\`
Keliling = 2 × 22/7 × 7 = 44 cm
Luas = 22/7 × 7 × 7 = 154 cm²
\`\`\`

## Sudut Pusat dan Sudut Keliling

Sudut pusat besarnya dua kali sudut keliling yang menghadap busur yang sama.`, ['lingkaran', 'geometri', 'smp']),

  L('mat-smp-statpel-1', 'Statistika dan Peluang', 'Statistika', 'SMP', `# Statistika dan Peluang

## Ukuran Pemusatan Data

1. **Mean (rata-rata)**: jumlah data : banyak data
2. **Median**: nilai tengah setelah data diurutkan
3. **Modus**: nilai yang paling sering muncul

## Contoh

Data: 6, 7, 8, 8, 9, 9, 10

\`\`\`
Mean = (6+7+8+8+9+9+10) / 7 = 57/7 ≈ 8,14
Median = 8 (data ke-4 setelah diurutkan)
Modus = 8 dan 9 (muncul dua kali)
\`\`\`

## Peluang

\`\`\`
Peluang = banyak kejadian yang diinginkan / banyak seluruh kejadian
\`\`\`

Contoh: Peluang muncul angka genap pada dadu (2, 4, 6) = 3/6 = 1/2.

## Contoh Soal

Satu dadu dilempar. Berapa peluang muncul mata dadu lebih dari 4?
- Jawaban: mata dadu 5 dan 6 = 2/6 = 1/3`, ['statistika', 'peluang', 'smp']),

  // ===== SMA =====
  L('mat-sma-eksponen-1', 'Eksponen dan Logaritma', 'Aljabar', 'SMA', `# Eksponen dan Logaritma

## Sifat Eksponen

\`\`\`
1. aᵐ × aⁿ = aᵐ⁺ⁿ
2. aᵐ : aⁿ = aᵐ⁻ⁿ
3. (aᵐ)ⁿ = aᵐⁿ
4. a⁻ⁿ = 1/aⁿ
5. a^(1/n) = ⁿ√a
\`\`\`

## Fungsi Eksponen

\`\`\`
f(x) = aˣ, dengan a > 0 dan a ≠ 1
\`\`\`

## Logaritma

Logaritma adalah kebalikan dari eksponen.

\`\`\`
a log b = c  artinya  aᶜ = b
\`\`\`

## Sifat Logaritma

\`\`\`
1. a log (x × y) = a log x + a log y
2. a log (x : y) = a log x - a log y
3. a log xⁿ = n × a log x
\`\`\`

## Contoh Soal

1. Hitunglah 2³ × 2⁴!
   - Jawaban: 2³⁺⁴ = 2⁷ = 128

2. Hitunglah ²log 8!
   - Jawaban: 8 = 2³, maka ²log 8 = 3`, ['eksponen', 'logaritma', 'sma']),

  L('mat-sma-barisan-1', 'Barisan dan Deret', 'Barisan dan Deret', 'SMA', `# Barisan dan Deret

## Barisan Aritmetika

Selisih antar suku selalu sama (b = beda).

\`\`\`
Un = a + (n - 1) × b
\`\`\`

Contoh: 2, 5, 8, 11, ... (a = 2, b = 3)
U10 = 2 + 9 × 3 = 29

## Deret Aritmetika

Jumlah n suku pertama:

\`\`\`
Sn = n/2 × (2a + (n - 1) × b)
\`\`\`

## Barisan Geometri

Perbandingan antar suku selalu sama (r = rasio).

\`\`\`
Un = a × rⁿ⁻¹
\`\`\`

Contoh: 3, 6, 12, 24, ... (a = 3, r = 2)
U5 = 3 × 2⁴ = 48

## Contoh Soal

Tentukan suku ke-8 dari barisan 4, 7, 10, 13, ...
- Jawaban: a = 4, b = 3, U8 = 4 + 7 × 3 = 25`, ['barisan', 'deret', 'sma']),

  L('mat-sma-trigonometri-1', 'Trigonometri', 'Trigonometri', 'SMA', `# Trigonometri

## Perbandingan Trigonometri

Pada segitiga siku-siku dengan sudut θ:

\`\`\`
sin θ = depan / miring
cos θ = samping / miring
tan θ = depan / samping
\`\`\`

## Sudut Istimewa

| θ | sin | cos | tan |
|---|-----|-----|-----|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | √3/2 | 1/√3 |
| 45° | 1/2√2 | 1/2√2 | 1 |
| 60° | 1/2√3 | 1/2 | √3 |
| 90° | 1 | 0 | tak hingga |

## Identitas Dasar

\`\`\`
sin²θ + cos²θ = 1
tan θ = sin θ / cos θ
\`\`\`

## Contoh Soal

Segitiga siku-siku dengan sisi depan 3 dan miring 5. Hitung sin θ!
- Jawaban: sin θ = 3/5`, ['trigonometri', 'sma']),

  L('mat-sma-matriks-1', 'Matriks', 'Matriks', 'SMA', `# Matriks

## Pengertian

Matriks adalah susunan bilangan dalam baris dan kolom.

\`\`\`
A = | 2  3 |
    | 1  4 |
\`\`\`

Matriks A memiliki 2 baris dan 2 kolom (orde 2 × 2).

## Operasi Matriks

**Penjumlahan**: jumlahkan elemen yang seletak.

\`\`\`
| 2 3 | + | 1 0 | = | 3 3 |
| 1 4 |   | 2 1 |   | 3 5 |
\`\`\`

**Perkalian skalar**: kalikan setiap elemen dengan skalarnya.

## Perkalian Dua Matriks

Elemen hasil = jumlah hasil kali baris × kolom yang bersesuaian.

## Determinan Matriks 2×2

\`\`\`
det | a b | = ad - bc
    | c d |
\`\`\`

Contoh: det | 2 3 | = 2×4 - 3×1 = 5
            | 1 4 |

## Contoh Soal

Hitung determinan matriks | 5 2 |!
                          | 3 4 |
- Jawaban: 5×4 - 2×3 = 20 - 6 = 14`, ['matriks', 'sma']),

  L('mat-sma-limit-1', 'Limit Fungsi', 'Kalkulus', 'SMA', `# Limit Fungsi

## Pengertian

Limit adalah nilai yang didekati fungsi ketika variabel mendekati suatu nilai.

\`\`\`
lim (x → a) f(x) = L
\`\`\`

## Sifat Limit

\`\`\`
1. lim k = k (konstanta)
2. lim [f(x) ± g(x)] = lim f(x) ± lim g(x)
3. lim [f(x) × g(x)] = lim f(x) × lim g(x)
\`\`\`

## Limit Bentuk 0/0

Jika hasil substitusi berupa 0/0, gunakan pemfaktoran.

Contoh:

\`\`\`
lim (x → 2) (x² - 4)/(x - 2)
= lim (x → 2) (x - 2)(x + 2)/(x - 2)
= lim (x → 2) (x + 2) = 4
\`\`\`

## Contoh Soal

Hitung lim (x → 3) (x² - 9)/(x - 3)!
- Jawaban: (x-3)(x+3)/(x-3) = x+3 = 6`, ['limit', 'kalkulus', 'sma']),

  L('mat-sma-turunan-1', 'Turunan Fungsi', 'Kalkulus', 'SMA', `# Turunan Fungsi

## Pengertian

Turunan mengukur laju perubahan fungsi. Notasi: f'(x) atau dy/dx.

## Rumus Turunan

\`\`\`
Jika f(x) = xⁿ, maka f'(x) = n × xⁿ⁻¹
\`\`\`

Contoh:

- f(x) = x³ → f'(x) = 3x²
- f(x) = 5x → f'(x) = 5
- f(x) = 7 (konstanta) → f'(x) = 0

## Aturan Turunan

1. **Konstanta**: turunan dari bilangan tetap adalah 0
2. **Penjumlahan**: turunan dijumlahkan per suku
3. **Perkalian**: (uv)' = u'v + uv'

## Aplikasi Turunan

- Gradien garis singgung
- Menentukan nilai maksimum dan minimum
- Kecepatan (turunan posisi terhadap waktu)

## Contoh Soal

Tentukan turunan dari f(x) = 4x³ + 2x!
- Jawaban: f'(x) = 12x² + 2`, ['turunan', 'kalkulus', 'sma']),

  L('mat-sma-integral-1', 'Integral', 'Kalkulus', 'SMA', `# Integral

## Integral Tak Tentu

Integral adalah kebalikan dari turunan (anti turunan).

\`\`\`
∫ xⁿ dx = xⁿ⁺¹/(n+1) + C
\`\`\`

Contoh: ∫ x² dx = x³/3 + C

## Integral Tentu

\`\`\`
∫ₐᵇ f(x) dx = F(b) - F(a)
\`\`\`

## Sifat Integral

\`\`\`
1. ∫ k × f(x) dx = k × ∫ f(x) dx
2. ∫ [f(x) ± g(x)] dx = ∫ f(x) dx ± ∫ g(x) dx
\`\`\`

## Aplikasi Integral

- Luas daerah di bawah kurva
- Volume benda putar

## Contoh Soal

Hitunglah ∫₀¹ (2x + 1) dx!

\`\`\`
= [x² + x]₀¹
= (1 + 1) - (0 + 0) = 2
\`\`\`

Jawaban: 2`, ['integral', 'kalkulus', 'sma']),
];
