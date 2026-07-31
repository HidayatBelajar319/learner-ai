-- Migration: 0006_seed_curriculum.sql
-- Seed kurikulum lengkap SD-SMK untuk semua mata pelajaran
-- Dihasilkan otomatis oleh scripts/seed-content.mjs (jangan diedit manual)

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sd-membaca-1', 'Membaca Pemahaman', 'bahasa-indonesia', 'Membaca', 'SD', 'lesson', 'markdown', '# Membaca Pemahaman

Membaca pemahaman adalah membaca untuk memahami isi bacaan.

## Langkah Membaca Pemahaman

1. Baca judul dan perkirakan isi teks
2. Baca seluruh teks dengan teliti
3. Tandai kata atau kalimat penting
4. Jawab pertanyaan: apa, siapa, kapan, di mana, mengapa, bagaimana

## Cara Menemukan Gagasan Pokok

Gagasan pokok biasanya terletak pada **kalimat pertama** atau **kalimat terakhir** paragraf.

## Contoh

> Sapi adalah hewan herbivora. Ia memakan rumput dan dedaunan. Sapi menghasilkan susu yang baik untuk kesehatan tubuh.

Gagasan pokok paragraf di atas adalah **sapi adalah hewan herbivora**.

## Latihan

Bacalah paragraf berikut:

> Kupu-kupu mengalami metamorfosis sempurna. Telurnya menetas menjadi ulat. Ulat kemudian berubah menjadi kepompong. Dari kepompong keluarlah kupu-kupu dewasa.

1. Apa judul yang cocok untuk paragraf itu?
2. Apa gagasan pokoknya?', '{"tags":["membaca","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sd-menulis-1', 'Menulis Permulaan', 'bahasa-indonesia', 'Menulis', 'SD', 'lesson', 'markdown', '# Menulis Permulaan

Menulis permulaan melatih kita menyusun huruf menjadi kata, kata menjadi kalimat.

## Kalimat Sederhana

Kalimat sederhana terdiri dari **subjek (S)** dan **predikat (P)**.

Contoh:

- Ibu memasak. (S = Ibu, P = memasak)
- Adik bermain. (S = Adik, P = bermain)

## Huruf Kapital

Gunakan huruf kapital untuk:

1. Awal kalimat: **B**udi pergi ke sekolah.
2. Nama orang: Budi
3. Nama tempat: Jakarta

## Tanda Baca

- **Titik (.)** untuk mengakhiri kalimat berita
- **Tanda tanya (?)** untuk kalimat tanya
- **Tanda seru (!)** untuk kalimat perintah atau seruan

## Latihan

Tuliskan tiga kalimat sederhana tentang keluargamu! Gunakan huruf kapital dan tanda titik.', '{"tags":["menulis","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sd-kosakata-1', 'Kosakata dan Kalimat', 'bahasa-indonesia', 'Kebahasaan', 'SD', 'lesson', 'markdown', '# Kosakata dan Kalimat

## Kosakata

Kosakata adalah kumpulan kata yang kita ketahui dan gunakan. Semakin banyak kosakata, semakin mudah kita berkomunikasi.

## Sinonim dan Antonim

- **Sinonim**: kata yang maknanya sama. Contoh: pandai = pintar, besar = raya
- **Antonim**: kata yang maknanya berlawanan. Contoh: besar ≠ kecil, naik ≠ turun

## Kalimat Tanya

Kalimat tanya menggunakan kata tanya:

- **Apa** untuk menanyakan benda/hal
- **Siapa** untuk menanyakan orang
- **Di mana** untuk menanyakan tempat
- **Kapan** untuk menanyakan waktu
- **Mengapa** untuk menanyakan alasan
- **Bagaimana** untuk menanyakan cara

## Latihan

Tentukan antonim dari kata berikut: tinggi, gelap, cepat, kaya!', '{"tags":["kosakata","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sd-puisi-1', 'Puisi Anak', 'bahasa-indonesia', 'Sastra', 'SD', 'lesson', 'markdown', '# Puisi Anak

Puisi adalah karya sastra yang mengungkapkan perasaan dengan bahasa yang indah.

## Ciri-ciri Puisi

1. Menggunakan kata-kata yang indah
2. Ada rima (persamaan bunyi)
3. Tersusun dalam baris dan bait

## Contoh Puisi

> **Guruku**
>
> Guruku pahlawanku,
> Kau membimbingku dengan sabar,
> Mengajariku membaca dan menulis,
> Terima kasih, guruku.

## Unsur Puisi

- **Bait**: kumpulan baris
- **Rima**: persamaan bunyi akhir
- **Diksi**: pilihan kata yang tepat

## Latihan

Buatlah satu puisi sederhana tentang hewan atau bunga kesukaanmu!', '{"tags":["puisi","sastra","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sd-cerita-1', 'Cerita Rakyat', 'bahasa-indonesia', 'Sastra', 'SD', 'lesson', 'markdown', '# Cerita Rakyat

Cerita rakyat adalah cerita yang berkembang di masyarakat dan diwariskan secara turun-temurun.

## Jenis Cerita Rakyat

1. **Fabel**: cerita dengan tokoh hewan (contoh: Si Kancil)
2. **Legenda**: cerita tentang asal-usul suatu tempat (contoh: Danau Toba)
3. **Mite**: cerita tentang dewa atau makhluk gaib
4. **Sage**: cerita yang berisi kepahlawanan

## Unsur Cerita

- **Tokoh**: pelaku cerita
- **Latar**: tempat, waktu, dan suasana
- **Alur**: jalan cerita
- **Amanat**: pesan yang ingin disampaikan

## Latihan

Sebutkan tokoh, latar, dan amanat dari cerita fabel yang pernah kamu baca!', '{"tags":["cerita rakyat","sastra","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-smp-deskripsi-1', 'Teks Deskripsi', 'bahasa-indonesia', 'Teks', 'SMP', 'lesson', 'markdown', '# Teks Deskripsi

Teks deskripsi adalah teks yang menggambarkan suatu objek secara terperinci sehingga pembaca seolah-olah melihat, mendengar, atau merasakannya.

## Struktur Teks Deskripsi

1. **Identifikasi**: pengenalan objek
2. **Deskripsi bagian**: rincian ciri-ciri objek
3. **Kesimpulan/kesan**: penutup

## Ciri Kebahasaan

- Menggunakan kata sifat (indah, hijau, luas)
- Menggunakan kata kerja keadaan (terlihat, terasa)
- Menggunakan perbandingan (seperti, bagaikan)

## Contoh

> Pantai ini memiliki pasir putih yang halus. Ombaknya tenang bergulung-gulung. Di kejauhan terlihat perahu nelayan berlabuh.

## Latihan

Buatlah teks deskripsi singkat tentang kelasmu!', '{"tags":["teks deskripsi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-smp-prosedur-1', 'Teks Prosedur', 'bahasa-indonesia', 'Teks', 'SMP', 'lesson', 'markdown', '# Teks Prosedur

Teks prosedur adalah teks yang berisi langkah-langkah untuk melakukan sesuatu secara urut.

## Struktur Teks Prosedur

1. **Tujuan**: judul atau pernyataan tujuan
2. **Bahan/alat**: apa yang dibutuhkan
3. **Langkah-langkah**: cara melakukan secara urut

## Ciri Kebahasaan

- Menggunakan kata kerja perintah (potong, aduk, campurkan)
- Menggunakan kata penghubung urutan (pertama, kedua, kemudian)
- Menggunakan kalimat efektif

## Contoh

**Cara Menanam Biji Kacang Hijau**

1. Siapkan gelas plastik dan kapas basah
2. Letakkan kapas di dasar gelas
3. Taruh biji kacang hijau di atas kapas
4. Siram secukupnya setiap pagi
5. Tunggu hingga kecambah tumbuh

## Latihan

Tuliskan langkah-langkah cara membuat nasi goreng sederhana!', '{"tags":["teks prosedur","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-smp-eksposisi-1', 'Teks Eksposisi', 'bahasa-indonesia', 'Teks', 'SMP', 'lesson', 'markdown', '# Teks Eksposisi

Teks eksposisi adalah teks yang memaparkan informasi atau pengetahuan secara faktual untuk meyakinkan pembaca.

## Struktur Teks Eksposisi

1. **Tesis**: pernyataan pendapat
2. **Argumentasi**: alasan yang mendukung
3. **Penegasan ulang**: simpulan

## Ciri Kebahasaan

- Menggunakan kata faktual (sesuai kenyataan)
- Menggunakan kata hubung sebab-akibat (karena, oleh karena itu)
- Menggunakan data dan contoh

## Contoh

> Membaca buku memberikan banyak manfaat. Karena itu, kebiasaan membaca harus ditumbuhkan sejak dini. Membaca menambah wawasan, melatih daya pikir, dan memperkaya kosakata.

## Latihan

Buatlah paragraf eksposisi tentang manfaat berolahraga!', '{"tags":["teks eksposisi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-smp-cerpen-1', 'Cerpen', 'bahasa-indonesia', 'Sastra', 'SMP', 'lesson', 'markdown', '# Cerpen

Cerpen (cerita pendek) adalah cerita yang mengisahkan satu peristiwa dengan tokoh terbatas dan dapat dibaca dalam sekali duduk.

## Unsur Intrinsik Cerpen

1. **Tema**: gagasan utama cerita
2. **Tokoh dan penokohan**: pelaku dan karakternya
3. **Alur**: rangkaian peristiwa (awal, tengah, akhir)
4. **Latar**: tempat, waktu, suasana
5. **Sudut pandang**: posisi pengarang
6. **Amanat**: pesan moral

## Alur Cerita

- **Orientasi**: pengenalan
- **Komplikasi**: munculnya masalah
- **Resolusi**: penyelesaian

## Contoh Amanat

Jika cerita tentang kejujuran, amanatnya adalah "jujur membawa kebaikan".

## Latihan

Buatlah kerangka cerpen: tentukan tema, tokoh, latar, dan alur singkat!', '{"tags":["cerpen","sastra","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-smp-surat-1', 'Surat Pribadi dan Surat Dinas', 'bahasa-indonesia', 'Menulis', 'SMP', 'lesson', 'markdown', '# Surat Pribadi dan Surat Dinas

## Surat Pribadi

Surat pribadi ditulis untuk keluarga atau teman dengan bahasa bebas.

Unsur surat pribadi:

1. Alamat dan tanggal surat
2. Salam pembuka
3. Isi surat
4. Penutup
5. Tanda tangan

## Surat Dinas

Surat dinas ditulis oleh instansi dengan bahasa resmi.

Unsur surat dinas:

1. Kop surat (kepala surat)
2. Nomor, lampiran, perihal
3. Tanggal surat
4. Alamat tujuan
5. Salam pembuka
6. Isi
7. Salam penutup dan tanda tangan
8. Tembusan

## Perbedaan

| Aspek | Surat Pribadi | Surat Dinas |
|-------|---------------|-------------|
| Bahasa | Bebas | Resmi |
| Kepala surat | Tidak ada | Ada |
| Nomor surat | Tidak ada | Ada |

## Latihan

Sebutkan tiga perbedaan surat pribadi dan surat dinas!', '{"tags":["surat","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sma-eksplanasi-1', 'Teks Eksplanasi', 'bahasa-indonesia', 'Teks', 'SMA', 'lesson', 'markdown', '# Teks Eksplanasi

Teks eksplanasi adalah teks yang menjelaskan proses terjadinya suatu fenomena (alam, sosial, budaya) secara ilmiah.

## Struktur Teks Eksplanasi

1. **Pernyataan umum**: pengenalan fenomena
2. **Deretan penjelas**: urutan sebab-akibat
3. **Interpretasi**: simpulan atau opini penulis

## Ciri Kebahasaan

- Menggunakan istilah ilmiah
- Menggunakan konjungsi kausal (sebab, akibat, oleh karena itu)
- Menggunakan kalimat pasif

## Contoh

> Tsunami terjadi karena adanya gempa bumi di dasar laut. Gempa menyebabkan dasar laut bergeser dan memindahkan air dalam jumlah besar. Akibatnya, gelombang besar menyebar ke pantai dan menimbulkan kerusakan.

## Latihan

Buatlah teks eksplanasi tentang proses terjadinya hujan!', '{"tags":["teks eksplanasi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sma-editorial-1', 'Teks Editorial', 'bahasa-indonesia', 'Teks', 'SMA', 'lesson', 'markdown', '# Teks Editorial

Teks editorial (tajuk rencana) adalah opini redaksi media tentang isu aktual yang ditulis secara sistematis.

## Struktur Teks Editorial

1. **Pengenalan isu**: penyampaian peristiwa terkini
2. **Argumentasi**: pendapat redaksi disertai alasan
3. **Penegasan ulang**: simpulan dan harapan

## Ciri Kebahasaan

- Menggunakan kalimat persuasif
- Menggunakan kata rujukan
- Berisi fakta dan opini yang seimbang

## Cara Membedakan Fakta dan Opini

- **Fakta**: dapat dibuktikan kebenarannya
- **Opini**: pendapat atau penilaian pribadi

## Latihan

Carilah satu isu terkini, lalu tuliskan dua kalimat fakta dan dua kalimat opini tentang isu tersebut!', '{"tags":["teks editorial","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sma-novel-1', 'Novel', 'bahasa-indonesia', 'Sastra', 'SMA', 'lesson', 'markdown', '# Novel

Novel adalah karya prosa fiksi yang panjang dan menceritakan kehidupan tokoh secara mendalam.

## Unsur Intrinsik Novel

1. Tema
2. Tokoh dan penokohan
3. Alur
4. Latar
5. Sudut pandang
6. Gaya bahasa
7. Amanat

## Unsur Ekstrinsik

Unsur yang berasal dari luar karya: latar belakang pengarang, kondisi sosial, dan nilai budaya.

## Nilai dalam Novel

- Nilai moral
- Nilai sosial
- Nilai religius
- Nilai budaya

## Langkah Menganalisis Novel

1. Baca novel secara menyeluruh
2. Tentukan tema dan amanat
3. Analisis tokoh dan penokohan
4. Kaitkan dengan nilai-nilai kehidupan

## Latihan

Dari novel yang pernah kamu baca, sebutkan tema dan dua amanatnya!', '{"tags":["novel","sastra","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bind-sma-karyailmiah-1', 'Karya Ilmiah', 'bahasa-indonesia', 'Menulis', 'SMA', 'lesson', 'markdown', '# Karya Ilmiah

Karya ilmiah adalah tulisan hasil penelitian atau pemikiran yang disusun secara sistematis dan objektif.

## Bagian Karya Ilmiah

1. **Bagian awal**: halaman judul, kata pengantar, daftar isi
2. **Bagian isi**:
   - Pendahuluan (latar belakang, rumusan masalah, tujuan)
   - Landasan teori
   - Metode penelitian
   - Hasil dan pembahasan
   - Simpulan
3. **Bagian akhir**: daftar pustaka, lampiran

## Ciri Bahasa Karya Ilmiah

- Baku dan formal
- Logis dan objektif
- Menggunakan istilah ilmiah
- Tidak berlebihan (tidak bombastis)

## Daftar Pustaka

Format umum: Nama, Tahun, *Judul*, Penerbit.

Contoh: Nugroho, A. 2020. *Dasar Bahasa Indonesia*. Yogyakarta: Graha Ilmu.

## Latihan

Buatlah kerangka karya ilmiah sederhana dengan judul yang kamu pilih!', '{"tags":["karya ilmiah","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sd-alphabet-1', 'Alphabet and Spelling', 'bahasa-inggris', 'Basics', 'SD', 'lesson', 'markdown', '# Alphabet and Spelling

The English alphabet has **26 letters**: A to Z.

## The Alphabet

```
A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z
```

## Vowels and Consonants

- **Vowels**: A, E, I, O, U
- **Consonants**: the other letters

## Spelling

Spelling means saying the letters of a word one by one.

Example: CAT is spelled C - A - T.

## Practice

1. How many letters are there in the alphabet?
2. Spell your name in English!', '{"tags":["alphabet","spelling","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sd-numbers-1', 'Numbers and Counting', 'bahasa-inggris', 'Basics', 'SD', 'lesson', 'markdown', '# Numbers and Counting

## Numbers 1 to 20

```
1 one      11 eleven
2 two      12 twelve
3 three    13 thirteen
4 four     14 fourteen
5 five     15 fifteen
6 six      16 sixteen
7 seven    17 seventeen
8 eight    18 eighteen
9 nine     19 nineteen
10 ten     20 twenty
```

## Tens

```
20 twenty    60 sixty
30 thirty    70 seventy
40 forty     80 eighty
50 fifty     90 ninety
100 one hundred
```

## Asking About Numbers

- How many books do you have?
- I have three books.

## Practice

1. Write the number: 45
2. Count the vowels in the word "banana"!', '{"tags":["numbers","counting","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sd-family-1', 'My Family', 'bahasa-inggris', 'Vocabulary', 'SD', 'lesson', 'markdown', '# My Family

## Family Members

```
father   - ayah
mother   - ibu
brother  - saudara laki-laki
sister   - saudara perempuan
grandfather - kakek
grandmother - nenek
uncle    - paman
aunt     - bibi
```

## Describing Family

- My father is a teacher.
- My mother is a nurse.
- I have one sister.

## Possessive Adjectives

```
my (milikku)    your (milikmu)
his (miliknya, laki-laki)
her (miliknya, perempuan)
```

## Practice

Write three sentences about your family using "My father/mother/brother is...".', '{"tags":["family","vocabulary","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sd-animals-1', 'Animals and Food', 'bahasa-inggris', 'Vocabulary', 'SD', 'lesson', 'markdown', '# Animals and Food

## Animals

```
cat - kucing     dog - anjing
bird - burung    fish - ikan
cow - sapi       goat - kambing
elephant - gajah tiger - harimau
```

## Food and Drink

```
rice - nasi      bread - roti
egg - telur      milk - susu
water - air      fruit - buah
vegetable - sayur
```

## Simple Sentences

- I like apples. (Saya suka apel)
- I do not like coffee. (Saya tidak suka kopi)
- The cat drinks milk. (Kucing minum susu)

## Practice

Make two sentences: one about an animal and one about food you like.', '{"tags":["animals","food","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-smp-past-1', 'Simple Past Tense', 'bahasa-inggris', 'Grammar', 'SMP', 'lesson', 'markdown', '# Simple Past Tense

Simple Past Tense digunakan untuk kejadian yang terjadi di masa lalu.

## Rumus

```
Positif: Subject + Verb2 + Object
Negatif: Subject + did not + Verb1 + Object
Tanya:   Did + Subject + Verb1 + Object?
```

## Kata Kerja Reguler dan Irregular

**Reguler** (tambah -ed):

- walk → walked
- play → played

**Irregular** (berubah bentuk):

- go → went
- eat → ate
- see → saw

## Contoh

- I **walked** to school yesterday.
- She **did not eat** breakfast.
- **Did** you **watch** the movie?

## Time Signal

- yesterday, last week, last month, two days ago

## Practice

Change this sentence to past tense: "I eat fried rice."', '{"tags":["past tense","grammar","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-smp-future-1', 'Future Tense (Will and Going to)', 'bahasa-inggris', 'Grammar', 'SMP', 'lesson', 'markdown', '# Future Tense: Will and Going to

## Will

Digunakan untuk keputusan spontan dan prediksi.

```
Positif: Subject + will + Verb1
Negatif: Subject + will not + Verb1
Tanya:   Will + Subject + Verb1?
```

## Going to

Digunakan untuk rencana yang sudah disiapkan.

```
Positif: Subject + am/is/are + going to + Verb1
```

## Contoh

- I **will call** you later. (keputusan spontan)
- It **will rain** tomorrow. (prediksi)
- We **are going to visit** grandma this weekend. (rencana)

## Practice

Fill the blank: "I ... (study) tonight because I have a test." Use "am going to".', '{"tags":["future tense","grammar","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-smp-descriptive-1', 'Descriptive Text', 'bahasa-inggris', 'Text Types', 'SMP', 'lesson', 'markdown', '# Descriptive Text

Descriptive text describes a person, place, or thing in detail.

## Structure

1. **Identification**: identifies the subject
2. **Description**: describes features (size, color, behavior)

## Language Features

- Uses adjectives (big, small, beautiful)
- Uses simple present tense
- Uses specific nouns

## Example

> My cat is small and white. It has soft fur and green eyes. It likes to sleep on the sofa.

## Practice

Write a short description of your best friend using at least three adjectives.', '{"tags":["descriptive","text","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-smp-narrative-1', 'Narrative Text', 'bahasa-inggris', 'Text Types', 'SMP', 'lesson', 'markdown', '# Narrative Text

Narrative text tells a story with a problem and its resolution.

## Structure

1. **Orientation**: introduces characters and setting
2. **Complication**: the problem appears
3. **Resolution**: the problem is solved

## Language Features

- Uses past tense
- Uses time connectives (once upon a time, then, finally)
- Uses action verbs

## Example (Short)

> Once upon a time, a rabbit lived near a river. One day, it lost its way. A turtle helped the rabbit find home. The rabbit thanked the turtle.

## Practice

Identify the orientation, complication, and resolution in the example above.', '{"tags":["narrative","text","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-smp-procedure-1', 'Procedure Text', 'bahasa-inggris', 'Text Types', 'SMP', 'lesson', 'markdown', '# Procedure Text

Procedure text explains how to do or make something.

## Structure

1. **Goal**: the aim (title)
2. **Materials**: things needed
3. **Steps**: instructions in order

## Language Features

- Uses imperative verbs (cut, mix, pour)
- Uses sequence words (first, then, next, finally)
- Uses simple present tense

## Example

**How to Make a Cup of Tea**

Materials: tea bag, hot water, sugar, cup.

Steps:

1. Put the tea bag into the cup.
2. Pour hot water into the cup.
3. Add sugar.
4. Stir well.

## Practice

Write the steps of brushing your teeth using sequence words.', '{"tags":["procedure","text","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sma-passive-1', 'Passive Voice', 'bahasa-inggris', 'Grammar', 'SMA', 'lesson', 'markdown', '# Passive Voice

Passive voice menekankan objek yang dikenai tindakan.

## Rumus

```
Aktif:  Subject + Verb + Object
Pasif:  Object + to be + Verb3 + (by Subject)
```

## Contoh

- Active: The chef cooks the food.
- Passive: The food is cooked by the chef.

## Passive per Tense

```
Simple present: is/am/are + V3
Simple past:    was/were + V3
Present perfect: has/have been + V3
Will:           will be + V3
```

## Penggunaan

Passive digunakan ketika:

- Pelaku tidak diketahui
- Pelaku kurang penting

## Practice

Change to passive: "The students clean the classroom."', '{"tags":["passive voice","grammar","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sma-exposition-1', 'Analytical Exposition', 'bahasa-inggris', 'Text Types', 'SMA', 'lesson', 'markdown', '# Analytical Exposition

Analytical exposition presents an opinion supported by arguments.

## Structure

1. **Thesis**: states the writer opinion
2. **Arguments**: reasons with supporting evidence
3. **Reiteration**: restates the opinion

## Language Features

- Uses simple present tense
- Uses linking words (first, moreover, therefore)
- Uses words of opinion (in my opinion, I believe)

## Example

> Reading is important for students. First, reading increases knowledge. Moreover, it improves vocabulary. Therefore, students should read every day.

## Practice

Write an analytical exposition with the thesis "Students should exercise regularly".', '{"tags":["exposition","text","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sma-report-1', 'Report Text', 'bahasa-inggris', 'Text Types', 'SMA', 'lesson', 'markdown', '# Report Text

Report text describes something based on facts and general information.

## Structure

1. **General classification**: states the topic
2. **Description**: describes features in detail

## Perbedaan Report dan Descriptive

- **Report**: umum (facts about a group)
- **Descriptive**: khusus (about one specific thing)

## Example

> Tigers are the largest cat species. They live in Asia. Tigers have orange fur with black stripes. They are carnivores and hunt other animals.

## Practice

Write a short report about elephants using the structure above.', '{"tags":["report","text","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('bing-sma-discussion-1', 'Discussion Text', 'bahasa-inggris', 'Text Types', 'SMA', 'lesson', 'markdown', '# Discussion Text

Discussion text presents both sides of an issue before concluding.

## Structure

1. **Issue**: introduces the topic and the debate
2. **Arguments for**: supporting points
3. **Arguments against**: opposing points
4. **Conclusion**: the writer view

## Language Features

- Uses words like on one hand, on the other hand
- Uses contrastive conjunctions (however, although)
- Uses both opinion and fact

## Example

> Mobile phones in school can help students learn. On the other hand, they can distract students during class. Therefore, schools should set clear rules for phone use.

## Practice

Write a discussion about "Should homework be removed?"', '{"tags":["discussion","text","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('basing-arab-1', 'Bahasa Arab Dasar', 'bahasa-asing', 'Arab', 'Pemula', 'lesson', 'markdown', '# Bahasa Arab Dasar

## Huruf dan Salam

- **Assalamualaikum** = semoga keselamatan untukmu
- **Waalaikumsalam** = dan untukmu juga

## Kosakata Dasar

```
Ya   = ya           La = tidak
Ana  = saya         Anta = kamu (laki-laki)
Ma   = apa          Aina = di mana
```

## Angka 1-5

```
1 wahid    2 itsnan
3 tsalatsah 4 arba''ah
5 khamsah
```

## Kalimat Sederhana

- **Ana thalib** = saya pelajar
- **Ma ismuka?** = siapa namamu?

## Latihan

Terjemahkan: "Ya" dan "Anta"!', '{"tags":["arab","dasar"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('basing-mandarin-1', 'Bahasa Mandarin Dasar', 'bahasa-asing', 'Mandarin', 'Pemula', 'lesson', 'markdown', '# Bahasa Mandarin Dasar

## Salam

```
你好 (nǐ hǎo)     = halo
再见 (zài jiàn)   = sampai jumpa
谢谢 (xiè xie)    = terima kasih
```

## Kosakata Dasar

```
我 (wǒ)  = saya
你 (nǐ)  = kamu
是 (shì) = adalah
好 (hǎo) = baik
```

## Angka 1-5

```
1 一 (yī)    2 二 (èr)
3 三 (sān)   4 四 (sì)
5 五 (wǔ)
```

## Kalimat Sederhana

- **Nǐ hǎo!** = Halo!
- **Xiè xie!** = Terima kasih!

## Latihan

Apa arti "谢谢" dan bagaimana cara mengucapkannya?', '{"tags":["mandarin","dasar"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('basing-jepang-1', 'Bahasa Jepang Dasar', 'bahasa-asing', 'Jepang', 'Pemula', 'lesson', 'markdown', '# Bahasa Jepang Dasar

## Salam

```
こんにちは (konnichiwa)  = selamat siang
ありがとう (arigatou)    = terima kasih
さようなら (sayounara)   = sampai jumpa
```

## Kosakata Dasar

```
わたし (watashi) = saya
あなた (anata)   = kamu
すみません (sumimasen) = permisi/maaf
```

## Angka 1-5

```
1 いち (ichi)   2 に (ni)
3 さん (san)    4 よん (yon)
5 ご (go)
```

## Latihan

Apa arti "arigatou" dan "sumimasen"?', '{"tags":["jepang","dasar"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('basing-korea-1', 'Bahasa Korea Dasar', 'bahasa-asing', 'Korea', 'Pemula', 'lesson', 'markdown', '# Bahasa Korea Dasar

## Salam

```
안녕하세요 (annyeonghaseyo)  = halo (formal)
감사합니다 (gamsahamnida)    = terima kasih
안녕히 가세요 (annyeonghi gaseyo) = sampai jumpa
```

## Kosakata Dasar

```
저 (jeo) = saya
네 (ne)  = ya
아니요 (aniyo) = tidak
```

## Angka 1-5 (Sino-Korea)

```
1 일 (il)  2 이 (i)
3 삼 (sam) 4 사 (sa)
5 오 (o)
```

## Latihan

Apa arti "네" dan "아니요"?', '{"tags":["korea","dasar"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('basing-prancis-1', 'Bahasa Prancis Dasar', 'bahasa-asing', 'Prancis', 'Pemula', 'lesson', 'markdown', '# Bahasa Prancis Dasar

## Salam

```
Bonjour  = selamat pagi/siang
Merci    = terima kasih
Au revoir = sampai jumpa
```

## Kosakata Dasar

```
Oui = ya        Non = tidak
Je  = saya      Tu  = kamu
```

## Angka 1-5

```
1 un   2 deux
3 trois 4 quatre
5 cinq
```

## Kalimat Sederhana

- **Bonjour, comment ca va?** = Halo, apa kabar?
- **Merci beaucoup** = Terima kasih banyak

## Latihan

Apa arti "Bonjour" dan "Au revoir"?', '{"tags":["prancis","dasar"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-sd-komputer-1', 'Mengenal Komputer', 'informatika', 'Dasar', 'SD', 'lesson', 'markdown', '# Mengenal Komputer

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

Sebutkan tiga bagian komputer dan fungsinya!', '{"tags":["komputer","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-sd-amandata-1', 'Aman Bermedia Digital', 'informatika', 'Digital', 'SD', 'lesson', 'markdown', '# Aman Bermedia Digital

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

Sebutkan tiga data pribadi yang tidak boleh dibagikan di internet!', '{"tags":["keamanan digital","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-smp-berpikir-1', 'Berpikir Komputasional', 'informatika', 'Dasar', 'SMP', 'lesson', 'markdown', '# Berpikir Komputasional

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

Terapkan dekomposisi dan algoritma untuk masalah "menyiapkan bekal sekolah"!', '{"tags":["berpikir komputasional","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-smp-algoritma-1', 'Algoritma dan Flowchart', 'informatika', 'Pemrograman', 'SMP', 'lesson', 'markdown', '# Algoritma dan Flowchart

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

Buat algoritma sederhana untuk membuat secangkir teh!', '{"tags":["algoritma","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-smp-jaringan-1', 'Jaringan Komputer dan Internet', 'informatika', 'Jaringan', 'SMP', 'lesson', 'markdown', '# Jaringan Komputer dan Internet

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

Apa perbedaan LAN dan WAN? Sebutkan dua kegunaan internet!', '{"tags":["jaringan","internet","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-sma-teknologi-1', 'Teknologi Informasi dan Komunikasi', 'informatika', 'Dasar', 'SMA', 'lesson', 'markdown', '# Teknologi Informasi dan Komunikasi

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

Sebutkan tiga contoh cloud computing dan dua cara menjaga keamanan akun!', '{"tags":["tik","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-sma-databases-1', 'Database dan Pengolahan Data', 'informatika', 'Data', 'SMA', 'lesson', 'markdown', '# Database dan Pengolahan Data

## Pengertian Database

Database adalah kumpulan data terstruktur yang disimpan dan dikelola secara teratur.

## Sistem Database

- **Spreadsheet** (Excel/Sheets): tabel sederhana
- **DBMS**: sistem manajemen database (MySQL, PostgreSQL)
- **SQL**: bahasa untuk mengelola database

## Perintah Dasar SQL

```
SELECT * FROM siswa;
INSERT INTO siswa (nama) VALUES (''Budi'');
UPDATE siswa SET umur = 12 WHERE nama = ''Budi'';
DELETE FROM siswa WHERE nama = ''Budi'';
```

## Manfaat Database

Data terpusat, mudah dicari, dan terhindar dari duplikasi.

## Latihan

Apa kepanjangan SQL dan sebutkan tiga perintah dasarnya!', '{"tags":["database","data","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('inf-sma-siber-1', 'Keamanan Siber', 'informatika', 'Digital', 'SMA', 'lesson', 'markdown', '# Keamanan Siber

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

Sebutkan tiga ancaman siber dan tiga cara melindungi akun!', '{"tags":["keamanan siber","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pro-sd-langkah-1', 'Berpikir Algoritmik untuk Anak', 'pemrograman', 'Dasar', 'SD', 'lesson', 'markdown', '# Berpikir Algoritmik untuk Anak

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

Tuliskan algoritma "membuka pintu" dalam lima langkah!', '{"tags":["algoritma","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pro-smp-logika-1', 'Logika Pemrograman', 'pemrograman', 'Logika', 'SMP', 'lesson', 'markdown', '# Logika Pemrograman

## Konsep Dasar

Program adalah kumpulan instruksi yang dijalankan komputer untuk menyelesaikan masalah.

## Urutan, Percabangan, dan Perulangan

1. **Urutan (sequence)**: instruksi berurutan
2. **Percabangan (if)**: keputusan dengan kondisi

```
if nilai >= 70:
    print("Lulus")
else:
    print("Belum lulus")
```

3. **Perulangan (loop)**: mengulang instruksi

```
for i in range(3):
    print("Halo")
```

## Pseudo-code

Menuliskan langkah seperti bahasa manusia sebelum kode sebenarnya.

## Latihan

Tuliskan pseudo-code untuk memutuskan apakah bisa naik kelas (nilai >= 75)!', '{"tags":["logika","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pro-sma-python-1', 'Pemrograman Python Dasar', 'pemrograman', 'Python', 'SMA', 'lesson', 'markdown', '# Pemrograman Python Dasar

## Variabel dan Tipe Data

```
nama = "Budi"
umur = 12
tinggi = 1.55
```

## Input dan Output

```
nama = input("Siapa namamu? ")
print("Halo,", nama)
```

## Percabangan

```
if umur >= 17:
    print("Sudah dewasa")
else:
    print("Belum dewasa")
```

## Perulangan

```
for i in range(1, 6):
    print(i)
```

## Fungsi

```
def luas_persegi(s):
    return s * s

print(luas_persegi(5))  # 25
```

## Latihan

Tulis program Python yang meminta dua angka lalu mencetak jumlahnya!', '{"tags":["python","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pro-sma-javascript-1', 'Pemrograman Web (HTML, CSS, JavaScript)', 'pemrograman', 'Web', 'SMA', 'lesson', 'markdown', '# Pemrograman Web

## HTML

Struktur halaman web:

```html
<h1>Judul</h1>
<p>Ini paragraf.</p>
<a href="https://contoh.com">Tautan</a>
```

## CSS

Mengatur tampilan:

```css
h1 {
  color: blue;
  font-size: 24px;
}
```

## JavaScript

Membuat halaman interaktif:

```js
document.getElementById("tombol").onclick = function() {
  alert("Halo!");
};
```

## Cara Belajar

1. Bangun halaman HTML sederhana
2. Perindah dengan CSS
3. Tambahkan interaksi dengan JavaScript

## Latihan

Apa fungsi masing-masing HTML, CSS, dan JavaScript dalam pembuatan web?', '{"tags":["web","javascript","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pro-sma-dataalgo-1', 'Struktur Data dan Algoritma', 'pemrograman', 'Algoritma', 'SMA', 'lesson', 'markdown', '# Struktur Data dan Algoritma

## Struktur Data Dasar

- **Array**: kumpulan data dengan indeks

```
nilai = [80, 90, 75]
print(nilai[0])  # 80
```

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

Kapan binary search lebih cepat daripada linear search?', '{"tags":["struktur data","algoritma","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ket-sd-tekstil-1', 'Mengenal Bahan dan Kerajinan Tekstil', 'keterampilan', 'Tekstil', 'SD', 'lesson', 'markdown', '# Mengenal Bahan dan Kerajinan Tekstil

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

Sebutkan empat jenis bahan tekstil beserta asalnya!', '{"tags":["tekstil","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ket-smp-pangan-1', 'Pengolahan Bahan Pangan', 'keterampilan', 'Pangan', 'SMP', 'lesson', 'markdown', '# Pengolahan Bahan Pangan

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

Sebutkan tiga teknik pengolahan pangan dan dua contoh makanan awetan!', '{"tags":["pangan","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ket-smp-elektronika-1', 'Dasar Elektronika', 'keterampilan', 'Elektronika', 'SMP', 'lesson', 'markdown', '# Dasar Elektronika

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

Sebutkan fungsi resistor, dioda, dan transistor!', '{"tags":["elektronika","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ket-sma-proyek-1', 'Manajemen Proyek Keterampilan', 'keterampilan', 'Proyek', 'SMA', 'lesson', 'markdown', '# Manajemen Proyek Keterampilan

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

Buat rencana sederhana proyek keterampilan: tujuan, bahan, dan jadwalnya!', '{"tags":["proyek","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sd-alam-1', 'Mengenal Alam Sekitar', 'ipa', 'Makhluk Hidup', 'SD', 'lesson', 'markdown', '# Mengenal Alam Sekitar

Alam sekitar terdiri dari **makhluk hidup** dan **benda tak hidup**.

## Makhluk Hidup

Makhluk hidup memiliki ciri-ciri:

1. Bernapas
2. Bergerak
3. Tumbuh dan berkembang
4. Membutuhkan makanan
5. Berkembang biak
6. Peka terhadap rangsangan

Contoh: manusia, hewan, tumbuhan.

## Benda Tak Hidup

Tidak memiliki ciri-ciri di atas.

Contoh: batu, air, tanah, udara.

## Cara Memperlakukan Alam

- Merawat tumbuhan
- Tidak membuang sampah sembarangan
- Menyayangi hewan

## Latihan

Sebutkan tiga ciri makhluk hidup dan dua contoh benda tak hidup!', '{"tags":["alam","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sd-makhluk-1', 'Makhluk Hidup dan Habitatnya', 'ipa', 'Makhluk Hidup', 'SD', 'lesson', 'markdown', '# Makhluk Hidup dan Habitatnya

Habitat adalah tempat tinggal alami makhluk hidup.

## Habitat Darat

- Sawah: padi, katak, ular
- Hutan: harimau, kera, burung
- Gurun: unta, kaktus

## Habitat Air

- Air tawar: ikan lele, kangkung
- Air asin: ikan tuna, rumput laut

## Rantai Makanan

Padi → Tikus → Ular → Elang

- **Produsen**: tumbuhan yang membuat makanan sendiri
- **Konsumen**: hewan yang memakan makhluk lain
- **Pengurai**: bakteri dan jamur

## Latihan

Buatlah satu rantai makanan yang ada di sawah!', '{"tags":["makhluk hidup","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sd-materi-1', 'Wujud Benda', 'ipa', 'Materi', 'SD', 'lesson', 'markdown', '# Wujud Benda

Benda memiliki tiga wujud: **padat**, **cair**, dan **gas**.

## Benda Padat

- Bentuk dan volume tetap
- Contoh: batu, kayu, buku

## Benda Cair

- Bentuk berubah mengikuti wadah, volume tetap
- Contoh: air, minyak, susu

## Benda Gas

- Bentuk dan volume berubah mengikuti wadah
- Contoh: udara, uap air

## Perubahan Wujud

| Peristiwa | Dari | Menjadi |
|-----------|------|---------|
| Mencair | Padat | Cair |
| Membeku | Cair | Padat |
| Menguap | Cair | Gas |
| Mengembun | Gas | Cair |
| Menyublim | Padat | Gas |
| Mengkristal | Gas | Padat |

## Latihan

Es batu yang dibiarkan di udara akan berubah menjadi air. Peristiwa apakah itu?', '{"tags":["materi","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sd-energi-1', 'Energi dan Sumbernya', 'ipa', 'Energi', 'SD', 'lesson', 'markdown', '# Energi dan Sumbernya

Energi adalah kemampuan untuk melakukan kerja.

## Macam-macam Energi

1. **Energi panas**: dari matahari, api
2. **Energi cahaya**: dari matahari, lampu
3. **Energi gerak**: dari benda yang bergerak
4. **Energi bunyi**: dari benda bergetar
5. **Energi listrik**: dari baterai, PLN

## Sumber Energi

- **Terbarukan**: matahari, angin, air, panas bumi
- **Tidak terbarukan**: minyak bumi, batu bara, gas alam

## Energi Alternatif

Energi pengganti yang ramah lingkungan: energi matahari, angin, dan air.

## Latihan

Sebutkan dua contoh energi terbarukan dan satu contoh energi tidak terbarukan!', '{"tags":["energi","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-smp-sel-1', 'Sel sebagai Unit Kehidupan', 'ipa', 'Biologi', 'SMP', 'lesson', 'markdown', '# Sel sebagai Unit Kehidupan

Sel adalah unit terkecil penyusun makhluk hidup.

## Organel Sel

- **Membran sel**: pelindung dan pengatur keluar masuk zat
- **Sitoplasma**: tempat berlangsungnya reaksi
- **Inti sel (nukleus)**: pengatur kegiatan sel
- **Mitokondria**: pusat respirasi sel
- **Kloroplas** (tumbuhan): tempat fotosintesis

## Sel Tumbuhan dan Hewan

Perbedaan utama:

| Sel Tumbuhan | Sel Hewan |
|--------------|-----------|
| Punya dinding sel | Tidak punya |
| Punya kloroplas | Tidak punya |
| Punya vakuola besar | Vakuola kecil |

## Jaringan

Sekumpulan sel sejenis membentuk jaringan, jaringan membentuk organ, organ membentuk sistem organ.

## Latihan

Apa perbedaan utama sel tumbuhan dan sel hewan?', '{"tags":["sel","biologi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-smp-gerak-1', 'Gerak dan Gaya', 'ipa', 'Fisika', 'SMP', 'lesson', 'markdown', '# Gerak dan Gaya

## Gerak

Gerak adalah perubahan kedudukan benda terhadap titik acuan.

- **Kecepatan** = jarak : waktu (m/s)

```
v = s / t
```

## Gaya

Gaya adalah tarikan atau dorongan. Satuan gaya adalah **Newton (N)**.

- **Hukum I Newton**: benda cenderung mempertahankan keadaan diam/bergerak (inersia)
- **Hukum II Newton**: percepatan sebanding dengan gaya

```
F = m x a
```

dengan F = gaya (N), m = massa (kg), a = percepatan (m/s²).

## Jenis Gaya

- Gaya gesek: menghambat gerak
- Gaya gravitasi: menarik benda ke bawah
- Gaya magnet: menarik benda logam tertentu

## Latihan

Sebuah benda bermassa 2 kg dipercepat 3 m/s². Berapa gaya yang bekerja?', '{"tags":["gerak","gaya","fisika","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-smp-listrik-1', 'Listrik Dasar', 'ipa', 'Fisika', 'SMP', 'lesson', 'markdown', '# Listrik Dasar

## Arus Listrik

Arus listrik adalah aliran muatan listrik. Satuan arus adalah **Ampere (A)**.

Rangkaian:

- **Seri**: satu jalur, lampu menyala lebih redup
- **Paralel**: cabang terpisah, lampu tetap terang

## Hukum Ohm

```
V = I x R
```

dengan V = tegangan (volt), I = arus (ampere), R = hambatan (ohm).

## Contoh

Hambatan 5 ohm dialiri arus 2 A. Berapa tegangannya?

```
V = I x R = 2 x 5 = 10 volt
```

## Rangkaian di Rumah

Instalasi rumah menggunakan rangkaian **paralel** agar tiap alat bisa menyala sendiri.

## Latihan

Sebuah lampu dialiri arus 0,5 A dengan tegangan 220 V. Hitung hambatannya!', '{"tags":["listrik","fisika","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-smp-tatasurya-1', 'Tata Surya', 'ipa', 'Bumi dan Antariksa', 'SMP', 'lesson', 'markdown', '# Tata Surya

Tata surya adalah sistem benda langit yang berpusat pada **matahari**.

## Anggota Tata Surya

1. **Matahari**: pusat tata surya, sumber energi utama
2. **Merkurius**: planet terkecil dan terdekat
3. **Venus**: planet terpanas
4. **Bumi**: satu-satunya planet berkehidupan
5. **Mars**: planet merah
6. **Jupiter**: planet terbesar
7. **Saturnus**: memiliki cincin
8. **Uranus** dan **Neptunus**: planet luar

## Gerakan Bumi

- **Rotasi** (24 jam): perputaran pada sumbunya → siang dan malam
- **Revolusi** (365¼ hari): mengelilingi matahari → pergantian tahun

## Gerhana

- **Gerhana bulan**: bumi berada di antara matahari dan bulan
- **Gerhana matahari**: bulan berada di antara matahari dan bumi

## Latihan

Apa akibat rotasi bumi dan revolusi bumi?', '{"tags":["tata surya","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-smp-zat-1', 'Zat dan Perubahannya', 'ipa', 'Kimia', 'SMP', 'lesson', 'markdown', '# Zat dan Perubahannya

Zat adalah segala sesuatu yang memiliki massa dan menempati ruang.

## Wujud Zat

1. **Padat**: partikel rapat, hanya bergetar
2. **Cair**: partikel agak renggang, dapat mengalir
3. **Gas**: partikel sangat renggang, bebas bergerak

## Perubahan Fisika dan Kimia

- **Perubahan fisika**: tidak membentuk zat baru. Contoh: es mencair, garam dilarutkan
- **Perubahan kimia**: membentuk zat baru. Contoh: kertas terbakar, besi berkarat

## Campuran dan Larutan

- **Campuran**: dua zat atau lebih yang digabung (air + pasir)
- **Larutan**: campuran homogen (air + garam)

## Latihan

Klasifikasikan: kayu terbakar, kapur barus menyublim, nasi menjadi basi (fisika/kimia)!', '{"tags":["zat","kimia","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-kinematika-1', 'Kinematika', 'ipa', 'Fisika', 'SMA', 'lesson', 'markdown', '# Kinematika

Kinematika mempelajari gerak tanpa memperhatikan penyebabnya.

## Gerak Lurus Beraturan (GLB)

Kecepatan tetap, percepatan nol.

```
s = v x t
```

## Gerak Lurus Berubah Beraturan (GLBB)

Percepatan tetap.

```
v_t = v_0 + a x t
s = v_0 x t + 1/2 x a x t^2
```

## Gerak Jatuh Bebas

Benda dijatuhkan tanpa kecepatan awal.

```
v_t = g x t
h = 1/2 x g x t^2
```

dengan g = 9,8 m/s² (percepatan gravitasi).

## Contoh

Sebuah mobil bergerak dari diam dengan percepatan 2 m/s² selama 5 detik. Berapa kecepatan akhirnya?

```
v_t = 0 + 2 x 5 = 10 m/s
```

## Latihan

Bola dijatuhkan dari gedung dan mencapai tanah dalam 2 detik. Berapa ketinggiannya? (g = 10 m/s²)', '{"tags":["kinematika","fisika","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-dinamika-1', 'Dinamika dan Hukum Newton', 'ipa', 'Fisika', 'SMA', 'lesson', 'markdown', '# Dinamika dan Hukum Newton

Dinamika mempelajari gerak beserta penyebabnya (gaya).

## Hukum Newton

**Hukum I** (inersia): benda mempertahankan keadaannya jika tidak ada gaya total.

**Hukum II**: percepatan sebanding gaya total dan berbanding terbalik massa.

```
F = m x a
```

**Hukum III** (aksi-reaksi): tiap aksi ada reaksi yang sama besar dan berlawanan arah.

## Gaya Normal dan Gesek

- **Gaya normal**: gaya tegak lurus permukaan
- **Gaya gesek**: menghambat gerak, sebanding dengan gaya normal

```
f = m x N
```

## Contoh

Gaya 20 N mendorong balok 4 kg. Percepatannya?

```
a = F / m = 20 / 4 = 5 m/s^2
```

## Latihan

Jika gaya 50 N menghasilkan percepatan 2 m/s², berapa massanya?', '{"tags":["dinamika","fisika","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-gelombang-1', 'Gelombang dan Bunyi', 'ipa', 'Fisika', 'SMA', 'lesson', 'markdown', '# Gelombang dan Bunyi

Gelombang adalah getaran yang merambat membawa energi.

## Jenis Gelombang

- **Mekanik**: butuh medium (bunyi, air)
- **Elektromagnetik**: tidak butuh medium (cahaya, radio)

Berdasarkan arah rambat:

- **Transversal**: tegak lurus arah rambat (tali)
- **Longitudinal**: sejajar arah rambat (bunyi)

## Rumus Cepat Rambat

```
v = f x lambda
```

v = kecepatan (m/s), f = frekuensi (Hz), lambda = panjang gelombang (m).

## Bunyi

- **Nada**: bunyi dengan frekuensi teratur
- **Keras lembut**: bergantung amplitudo
- **Tinggi rendah**: bergantung frekuensi

## Latihan

Gelombang berfrekuensi 50 Hz memiliki panjang gelombang 2 m. Berapa cepat rambatnya?', '{"tags":["gelombang","fisika","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-termo-1', 'Termodinamika', 'ipa', 'Fisika', 'SMA', 'lesson', 'markdown', '# Termodinamika

Termodinamika mempelajari hubungan antara kalor, kerja, dan energi.

## Hukum I Termodinamika

```
Delta U = Q - W
```

Perubahan energi dalam = kalor yang masuk dikurangi kerja yang dilakukan sistem.

## Proses-proses

- **Isotermal**: suhu tetap (Delta U = 0)
- **Isobarik**: tekanan tetap
- **Isokhorik**: volume tetap (W = 0)
- **Adiabatik**: tanpa pertukaran kalor (Q = 0)

## Siklus dan Mesin

Mesin kalor mengubah kalor menjadi kerja. Efisiensi Carnot:

```
e = 1 - (T2 / T1)
```

## Latihan

Jika Q = 300 J masuk ke sistem dan W = 100 J, berapa perubahan energi dalam?', '{"tags":["termodinamika","fisika","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-strukturatom-1', 'Struktur Atom', 'ipa', 'Kimia', 'SMA', 'lesson', 'markdown', '# Struktur Atom

Atom adalah partikel terkecil suatu unsur yang masih memiliki sifat unsur tersebut.

## Partikel Penyusun Atom

- **Proton** (muatan +): di inti
- **Neutron** (netral): di inti
- **Elektron** (muatan -): mengelilingi inti

## Nomor Atom dan Nomor Massa

```
Nomor atom (Z) = jumlah proton
Nomor massa (A) = proton + neutron
```

Lambang: A/Z X

## Konfigurasi Elektron

Elektron tersusun dalam kulit: K (2), L (8), M (18), N (32).

Contoh, Natrium (Z = 11): 2, 8, 1.

## Isotop

Unsur sama dengan jumlah neutron berbeda.

## Latihan

Unsur Karbon memiliki nomor atom 6 dan nomor massa 12. Berapa jumlah neutronnya?', '{"tags":["struktur atom","kimia","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-stoikiometri-1', 'Stoikiometri', 'ipa', 'Kimia', 'SMA', 'lesson', 'markdown', '# Stoikiometri

Stoikiometri mempelajari hubungan kuantitatif zat dalam reaksi kimia.

## Konsep Mol

```
n = m / Mr
```

n = mol, m = massa (gram), Mr = massa molekul relatif.

Satu mol mengandung 6,022 x 10^23 partikel (bilangan Avogadro).

## Massa Molar

Mr dihitung dari jumlah massa atom relatif (Ar).

Contoh, H2O: (2 x 1) + 16 = 18 g/mol.

## Perbandingan Koefisien

Koefisien reaksi menunjukkan perbandingan mol.

Contoh: 2H2 + O2 → 2H2O. Untuk 2 mol H2 diperlukan 1 mol O2 dan dihasilkan 2 mol H2O.

## Latihan

Berapa mol dari 36 gram air (Mr H2O = 18)?', '{"tags":["stoikiometri","kimia","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-redoks-1', 'Reaksi Redoks', 'ipa', 'Kimia', 'SMA', 'lesson', 'markdown', '# Reaksi Redoks

Reaksi redoks (reduksi-oksidasi) melibatkan perpindahan elektron.

## Oksidasi dan Reduksi

- **Oksidasi**: kehilangan elektron (bilangan oksidasi naik)
- **Reduksi**: menerima elektron (bilangan oksidasi turun)
- **Oksidator**: zat yang menyebabkan oksidasi (tereduksi)
- **Reduktor**: zat yang menyebabkan reduksi (teroksidasi)

## Bilangan Oksidasi

Aturan penting:

- Biloks unsur bebas = 0
- Biloks O = -2 (kecuali peroksida = -1)
- Biloks H = +1 (kecuali hidrida = -1)
- Jumlah biloks senyawa netral = 0

## Contoh

Zn + CuSO4 → ZnSO4 + Cu

- Zn: 0 → +2 (teroksidasi)
- Cu: +2 → 0 (tereduksi)

## Latihan

Tentukan zat yang teroksidasi dan tereduksi dalam reaksi di atas!', '{"tags":["redoks","kimia","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-genetika-1', 'Genetika', 'ipa', 'Biologi', 'SMA', 'lesson', 'markdown', '# Genetika

Genetika mempelajari pewarisan sifat.

## Kromosom dan Gen

- **Gen**: unit pewarisan sifat, tersimpan di kromosom
- **Alel**: pasangan gen pada kromosom homolog
- **Genotipe**: susunan gen (misal Aa)
- **Fenotipe**: sifat yang tampak (misal tinggi)

## Hukum Mendel

**Hukum Segregasi**: saat pembentukan gamet, pasangan alel berpisah.

**Hukum Asortasi Bebas**: alel pada gen berbeda bersegregasi secara bebas.

## Persilangan Monohibrid

Aa x Aa menghasilkan perbandingan genotipe 1:2:1 dan fenotipe 3:1 (dominasi penuh).

## Peta Persilangan

```
    A     a
A   AA    Aa
a   Aa    aa
```

## Latihan

Berapa perbandingan fenotipe hasil persilangan Aa x Aa?', '{"tags":["genetika","biologi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-evolusi-1', 'Evolusi', 'ipa', 'Biologi', 'SMA', 'lesson', 'markdown', '# Evolusi

Evolusi adalah perubahan makhluk hidup secara bertahap dalam waktu yang lama.

## Teori Evolusi

- **Lamarck**: sifat yang diperoleh dari penggunaan (jerapah leher panjang karena menjulurkan leher)
- **Darwin**: seleksi alam (jerapah leher panjang bertahan karena lebih mudah mendapatkan makanan)

## Seleksi Alam

Individu yang paling sesuai lingkungannya akan bertahan dan bereproduksi (survival of the fittest).

## Bukti Evolusi

1. Catatan fosil
2. Perbandingan anatomi (homologi)
3. Perbandingan embriologi
4. Perbandingan DNA

## Latihan

Jelaskan perbedaan inti teori Lamarck dan Darwin!', '{"tags":["evolusi","biologi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ipa-sma-ekologi-1', 'Ekologi', 'ipa', 'Biologi', 'SMA', 'lesson', 'markdown', '# Ekologi

Ekologi mempelajari hubungan makhluk hidup dengan lingkungannya.

## Tingkat Organisasi Ekologi

Individu → populasi → komunitas → ekosistem → bioma → biosfer

## Ekosistem

- **Komponen biotik**: produsen, konsumen, pengurai
- **Komponen abiotik**: air, tanah, udara, cahaya

## Aliran Energi

Energi mengalir: matahari → produsen → konsumen → pengurai. Energi berkurang di setiap tingkatan.

## Piramida Ekologi

Menunjukkan jumlah/biomassa/energi pada setiap tingkatan trofik.

## Latihan

Urutkan tingkat organisasi ekologi dari individu sampai biosfer!', '{"tags":["ekologi","biologi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-sd-lingkungan-1', 'Lingkungan Sekitar', 'ips', 'Geografi', 'SD', 'lesson', 'markdown', '# Lingkungan Sekitar

Lingkungan adalah segala sesuatu di sekitar kita.

## Lingkungan Alam

Terbentuk dengan sendirinya: gunung, sungai, laut, hutan.

## Lingkungan Buatan

Dibuat oleh manusia: rumah, jembatan, sawah.

## Cara Menjaga Lingkungan

1. Membuang sampah pada tempatnya
2. Menanam pohon
3. Tidak menebang hutan sembarangan
4. Menghemat air

## Latihan

Sebutkan dua contoh lingkungan alam dan dua contoh lingkungan buatan!', '{"tags":["lingkungan","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-sd-ekonomi-1', 'Kegiatan Ekonomi', 'ips', 'Ekonomi', 'SD', 'lesson', 'markdown', '# Kegiatan Ekonomi

## Jenis Kegiatan Ekonomi

1. **Produksi**: membuat barang. Contoh: petani menanam padi
2. **Distribusi**: menyalurkan barang. Contoh: pedagang mengangkut hasil tani ke kota
3. **Konsumsi**: memakai barang. Contoh: ibu membeli dan memasak beras

## Mata Pencaharian

- Petani, nelayan, peternak (alam)
- Pedagang, buruh (jasa/perdagangan)

## Latihan

Ibu membeli sayur di pasar termasuk kegiatan apa?', '{"tags":["ekonomi","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-smp-interaksi-1', 'Interaksi Sosial', 'ips', 'Sosiologi', 'SMP', 'lesson', 'markdown', '# Interaksi Sosial

Interaksi sosial adalah hubungan timbal balik antara individu dan individu, individu dan kelompok, atau kelompok dan kelompok.

## Syarat Interaksi Sosial

1. **Kontak sosial**: hubungan langsung (tatap muka) atau tidak langsung
2. **Komunikasi**: penyampaian pesan

## Bentuk Interaksi

- **Asosiatif**: kerja sama, akomodasi, asimilasi
- **Disosiatif**: persaingan, kontravensi, konflik

## Contoh

- Gotong royong membersihkan kelas = kerja sama
- Berlomba menang juara kelas = persaingan

## Latihan

Beri satu contoh interaksi sosial asosiatif dan satu contoh disosiatif!', '{"tags":["interaksi sosial","sosiologi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-smp-pasar-1', 'Pasar dan Permintaan Penawaran', 'ips', 'Ekonomi', 'SMP', 'lesson', 'markdown', '# Pasar dan Permintaan Penawaran

## Pasar

Pasar adalah tempat bertemunya penjual dan pembeli.

- **Pasar konkret**: fisik (pasar tradisional)
- **Pasar abstrak**: tidak berwujud (marketplace online)

## Permintaan (Demand)

Jumlah barang yang ingin dibeli pada harga tertentu.

- Harga naik → permintaan turun

## Penawaran (Supply)

Jumlah barang yang ditawarkan penjual pada harga tertentu.

- Harga naik → penawaran naik

## Harga Keseimbangan

Terjadi saat jumlah permintaan sama dengan jumlah penawaran.

## Latihan

Mengapa permintaan naik saat harga turun?', '{"tags":["pasar","ekonomi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-smp-asean-1', 'ASEAN dan Kerja Sama', 'ips', 'Geografi', 'SMP', 'lesson', 'markdown', '# ASEAN dan Kerja Sama

ASEAN (Association of Southeast Asian Nations) didirikan **8 Agustus 1967** di Bangkok oleh 5 negara.

## Pendiri ASEAN

1. Indonesia
2. Malaysia
3. Filipina
4. Singapura
5. Thailand

## Negara Anggota

Ditambah: Brunei Darussalam, Vietnam, Laos, Myanmar, Kamboja, Timor Leste.

## Kerja Sama ASEAN

- **Ekonomi**: perdagangan bebas (Masyarakat Ekonomi ASEAN)
- **Sosial budaya**: pertukaran pelajar
- **Politik keamanan**: menjaga perdamaian kawasan

## Latihan

Sebutkan tiga negara pendiri ASEAN dan tujuan kerja sama ASEAN!', '{"tags":["asean","geografi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-sma-geografi-1', 'Geografi: Litosfer dan Pedosfer', 'ips', 'Geografi', 'SMA', 'lesson', 'markdown', '# Litosfer dan Pedosfer

Litosfer adalah lapisan batuan penyusun kulit bumi.

## Lapisan Bumi

1. **Kerak bumi**: lapisan terluar
2. **Selubung (mantel)**: lapisan tengah
3. **Inti bumi**: inti luar (cair) dan inti dalam (padat)

## Batuan

- **Beku**: dari magma yang mendingin (granit, basalt)
- **Sedimen**: dari pengendapan (batu kapur, batu pasir)
- **Metamorf**: berubah akibat panas/tekanan (marmer, kuarsit)

## Tenaga Pembentuk Bumi

- **Endogen**: dari dalam bumi (gempa, gunung berapi, tektonik)
- **Eksogen**: dari luar (pelapukan, erosi, sedimentasi)

## Latihan

Sebutkan tiga jenis batuan beserta contohnya!', '{"tags":["geografi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-sma-sosiologi-1', 'Sosiologi: Nilai, Norma, dan Sosialisasi', 'ips', 'Sosiologi', 'SMA', 'lesson', 'markdown', '# Nilai, Norma, dan Sosialisasi

## Nilai Sosial

Prinsip yang dianggap baik dan benar oleh masyarakat.

- Nilai material, vital, dan rohani

## Norma Sosial

Aturan yang mengikat masyarakat:

1. **Cara (usage)**: kebiasaan kecil, contoh cara memegang sendok
2. **Kebiasaan (folkways)**: contoh makan tepat waktu
3. **Tata kelakuan (mores)**: contoh jujur
4. **Adat istiadat (customs)**: contoh upacara adat

## Sosialisasi

Proses belajar nilai dan norma. Agen sosialisasi: keluarga, sekolah, teman sebaya, media.

## Latihan

Sebutkan empat tingkat norma beserta contohnya!', '{"tags":["sosiologi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('ips-sma-ekonomi-1', 'Ekonomi: Pendapatan Nasional', 'ips', 'Ekonomi', 'SMA', 'lesson', 'markdown', '# Pendapatan Nasional

Pendapatan nasional adalah total nilai barang dan jasa yang dihasilkan suatu negara dalam satu tahun.

## Metode Perhitungan

1. **Metode produksi**: jumlah nilai tambah semua sektor
2. **Metode pendapatan**: jumlah seluruh pendapatan faktor produksi
3. **Metode pengeluaran**: konsumsi + investasi + belanja pemerintah + ekspor - impor

```
Y = C + I + G + (X - M)
```

## Indikator

- **PDB (GDP)**: produksi di dalam negeri
- **PNB (GNP)**: milik warga negara di mana pun berada
- **Pendapatan per kapita**: PNB dibagi jumlah penduduk

## Latihan

Tuliskan rumus pendapatan nasional metode pengeluaran!', '{"tags":["ekonomi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sej-sd-pahlawan-1', 'Pahlawan Indonesia', 'sejarah', 'Sejarah Indonesia', 'SD', 'lesson', 'markdown', '# Pahlawan Indonesia

Pahlawan adalah orang yang berjasa besar bagi bangsa dan negara.

## Pahlawan Nasional

- **RA Kartini**: memperjuangkan pendidikan perempuan
- **Cut Nyak Dien**: pejuang dari Aceh
- **Diponegoro**: pemimpin Perang Jawa
- **Ki Hajar Dewantara**: bapak pendidikan Indonesia

## Meneladani Pahlawan

- Rajin belajar
- Suka menolong
- Berani berbuat benar

## Latihan

Sebutkan satu pahlawan dan jasa besarnya untuk Indonesia!', '{"tags":["pahlawan","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sej-sd-kelas4-1', 'Mengenal Sejarah Keluarga dan Daerah', 'sejarah', 'Sejarah Indonesia', 'SD', 'lesson', 'markdown', '# Mengenal Sejarah Keluarga dan Daerah

Sejarah dimulai dari hal terdekat: keluarga dan daerah kita.

## Sejarah Keluarga

- Nama lengkap dan asal daerah orang tua
- Tradisi keluarga
- Cerita masa kecil orang tua

## Sejarah Daerah

Setiap daerah memiliki:

- Cerita asal-usul (legenda)
- Peninggalan bersejarah
- Tradisi dan upacara adat

## Cara Melestarikan Sejarah

- Mempelajari cerita daerah
- Menjaga peninggalan bersejarah
- Menghormati budaya daerah

## Latihan

Tuliskan satu cerita atau tradisi yang dikenal di daerahmu!', '{"tags":["sejarah daerah","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sej-smp-nasional-1', 'Pergerakan Nasional', 'sejarah', 'Sejarah Indonesia', 'SMP', 'lesson', 'markdown', '# Pergerakan Nasional

## Latar Belakang

Politik etis (politik balas budi) membuka pendidikan bagi pribumi, lalu melahirkan golongan terpelajar yang memelopori pergerakan.

## Organisasi Pergerakan

- **Budi Utomo** (1908): dipelopori dr. Sutomo, organisasi modern pertama
- **Sarekat Islam** (1911): perekonomian umat
- **Indische Partij** (1912): politik kemerdekaan
- **Muhammadiyah** (1912): pendidikan dan sosial

## Sumpah Pemuda (28 Oktober 1928)

Ikrar:

1. Satu tanah air: Indonesia
2. Satu bangsa: bangsa Indonesia
3. Satu bahasa: bahasa Indonesia

## Latihan

Apa isi tiga butir Sumpah Pemuda?', '{"tags":["pergerakan nasional","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sej-smp-hindu-budha-1', 'Kerajaan Hindu-Buddha dan Islam', 'sejarah', 'Sejarah Indonesia', 'SMP', 'lesson', 'markdown', '# Kerajaan Hindu-Buddha dan Islam

## Kerajaan Hindu-Buddha

- **Kutai**: kerajaan Hindu tertua di Kalimantan
- **Sriwijaya**: pusat perdagangan dan agama Buddha (Sumatera)
- **Majapahit**: kerajaan besar di Jawa, raja Hayam Wuruk dan Gajah Mada

## Penyebaran Islam

Masuk melalui perdagangan oleh para pedagang Arab, Persia, dan Gujarat.

- **Samudera Pasai**: kerajaan Islam pertama
- **Demak**: kerajaan Islam pertama di Jawa
- **Wali Songo**: penyebar Islam di Jawa

## Akulturasi Budaya

Pengaruh pada seni, bangunan (masjid menara), dan tradisi.

## Latihan

Sebutkan satu kerajaan Hindu-Buddha dan satu kerajaan Islam beserta cirinya!', '{"tags":["kerajaan","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sej-sma-kolonial-1', 'Kolonialisme dan Imperialisme', 'sejarah', 'Sejarah Indonesia', 'SMA', 'lesson', 'markdown', '# Kolonialisme dan Imperialisme

## Awal Kedatangan

Bangsa Eropa (Portugis, Spanyol, Belanda) datang mencari **rempah-rempah**.

- **Portugis** tiba di Malaka 1511, lalu Maluku
- **VOC** (1602) memonopoli perdagangan di Nusantara

## Kebijakan VOC dan Hindia Belanda

- Monopoli perdagangan
- Tanam Paksa (Cultuurstelsel, 1830)
- Politik Etis (1901): irigasi, edukasi, emigrasi

## Perlawanan Rakyat

- Perlawanan Diponegoro (1825-1830)
- Perang Padri (Sumatera Barat)
- Perlawanan Bali (Puputan)

## Latihan

Jelaskan dampak Tanam Paksa bagi rakyat Indonesia!', '{"tags":["kolonialisme","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sej-sma-kemerdekaan-1', 'Proklamasi dan Perjuangan Mempertahankan Kemerdekaan', 'sejarah', 'Sejarah Indonesia', 'SMA', 'lesson', 'markdown', '# Proklamasi Kemerdekaan

## Peristiwa Rengasdengklok

Pemuda mendesak Soekarno-Hatta segera memproklamasikan kemerdekaan. 16 Agustus 1945, keduanya dibawa ke Rengasdengklok.

## Proklamasi

17 Agustus 1945 di Jalan Pegangsaan Timur 56, Jakarta. Teks dibacakan oleh **Soekarno** didampingi **Hatta**.

## Perjuangan Mempertahankan Kemerdekaan

- **Pertempuran Surabaya** (10 November, Hari Pahlawan)
- **Bandung Lautan Api**
- **Agresi Militer Belanda I dan II**
- **Perjanjian Linggajati, Renville, Roem-Royen**
- **Konferensi Meja Bundar (1949)**: pengakuan kedaulatan

## Latihan

Sebutkan tiga peristiwa mempertahankan kemerdekaan setelah proklamasi!', '{"tags":["kemerdekaan","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sej-sma-orde-1', 'Orde Lama, Orde Baru, dan Reformasi', 'sejarah', 'Sejarah Indonesia', 'SMA', 'lesson', 'markdown', '# Orde Lama, Orde Baru, dan Reformasi

## Orde Lama (1945-1966)

- Demokrasi liberal, lalu Demokrasi Terpimpin
- Diakhiri oleh situasi politik dan ekonomi yang memuncak

## Orde Baru (1966-1998)

- Dipimpin Soeharto, stabil namun otoriter
- Krisis moneter 1997 menyebabkan gerakan reformasi

## Reformasi (1998-sekarang)

- Tuntutan: pemilu yang jujur, amandemen UUD 1945, antikorupsi
- Amandemen UUD 1945: pembatasan kekuasaan presiden, pemilihan langsung

## Pelajaran dari Sejarah

Sejarah mengajarkan pentingnya demokrasi, keadilan, dan kewaspadaan terhadap krisis.

## Latihan

Apa tuntutan utama gerakan reformasi 1998?', '{"tags":["orde","reformasi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-bilangan-1', 'Bilangan Cacah dan Bilangan Bulat', 'mathematics', 'Bilangan', 'SD', 'lesson', 'markdown', '# Bilangan Cacah dan Bilangan Bulat

Bilangan adalah konsep dasar matematika untuk menghitung benda.

## Bilangan Cacah

Bilangan cacah adalah bilangan yang dimulai dari nol: **0, 1, 2, 3, 4, ...**

## Bilangan Bulat

Bilangan bulat terdiri dari bilangan negatif, nol, dan bilangan positif: **... -3, -2, -1, 0, 1, 2, 3 ...**

## Garis Bilangan

Garis bilangan membantu kita melihat urutan bilangan:

```
<---|----|----|----|----|----|----|--->
   -3   -2   -1    0    1    2    3
```

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
   - Jawaban: 4 < 9', '{"tags":["bilangan","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-operasi-1', 'Operasi Hitung: Penjumlahan dan Pengurangan', 'mathematics', 'Operasi Hitung', 'SD', 'lesson', 'markdown', '# Operasi Hitung: Penjumlahan dan Pengurangan

## Penjumlahan

Penjumlahan adalah menggabungkan dua atau lebih bilangan.

Contoh: 35 + 27 = 62

Cara bersusun:

```
  35
  27
---- +
  62
```

## Pengurangan

Pengurangan adalah mengambil sebagian dari suatu bilangan.

Contoh: 62 - 27 = 35

Cara bersusun:

```
  62
  27
---- -
  35
```

## Sifat Penjumlahan

1. **Komutatif**: a + b = b + a (contoh: 3 + 4 = 4 + 3)
2. **Asosiatif**: (a + b) + c = a + (b + c)

## Contoh Soal

1. Hitunglah: 148 + 57 = ?
   - Jawaban: 205

2. Hitunglah: 300 - 145 = ?
   - Jawaban: 155', '{"tags":["operasi hitung","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-perkalian-1', 'Perkalian dan Pembagian', 'mathematics', 'Operasi Hitung', 'SD', 'lesson', 'markdown', '# Perkalian dan Pembagian

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
   - Jawaban: 5', '{"tags":["perkalian","pembagian","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-pecahan-1', 'Pecahan Sederhana', 'mathematics', 'Pecahan', 'SD', 'lesson', 'markdown', '# Pecahan Sederhana

Pecahan menyatakan bagian dari keseluruhan. Contoh: 1/2 berarti 1 bagian dari 2 bagian sama besar.

## Bagian Pecahan

- **Pembilang**: angka di atas (menyatakan bagian yang diambil)
- **Penyebut**: angka di bawah (menyatakan banyaknya bagian)

```
  3   <- pembilang
  -
  4   <- penyebut
```

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
   - Jawaban: 3/4', '{"tags":["pecahan","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-desimal-1', 'Bilangan Desimal dan Persen', 'mathematics', 'Pecahan', 'SD', 'lesson', 'markdown', '# Bilangan Desimal dan Persen

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
   - Jawaban: 0,4 = 4/10 = 2/5', '{"tags":["desimal","persen","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-bangun-1', 'Keliling dan Luas Bangun Datar', 'mathematics', 'Bangun Datar', 'SD', 'lesson', 'markdown', '# Keliling dan Luas Bangun Datar

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
   - Jawaban: 2 × (8 + 5) = 26 cm', '{"tags":["bangun datar","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-ruang-1', 'Volume Bangun Ruang', 'mathematics', 'Bangun Ruang', 'SD', 'lesson', 'markdown', '# Volume Bangun Ruang

Volume adalah ukuran isi dari bangun ruang (tiga dimensi).

## Kubus

Kubus memiliki 6 sisi persegi yang sama besar.

```
Volume kubus = s × s × s = s³
```

## Balok

Balok memiliki panjang (p), lebar (l), dan tinggi (t).

```
Volume balok = p × l × t
```

## Contoh Soal

1. Kubus dengan rusuk 5 cm. Hitung volumenya!
   - Jawaban: 5 × 5 × 5 = 125 cm³

2. Balok berukuran 6 cm × 4 cm × 3 cm. Hitung volumenya!
   - Jawaban: 6 × 4 × 3 = 72 cm³

## Tips

Satuan volume menggunakan kubik, misalnya cm³ (dibaca sentimeter kubik).', '{"tags":["bangun ruang","volume","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-pengukuran-1', 'Pengukuran: Panjang, Berat, dan Waktu', 'mathematics', 'Pengukuran', 'SD', 'lesson', 'markdown', '# Pengukuran: Panjang, Berat, dan Waktu

## Satuan Panjang

```
km - hm - dam - m - dm - cm - mm
```

Setiap turun satu tingkat dikali 10, naik satu tingkat dibagi 10.

Contoh: 1 km = 1000 m, dan 1 m = 100 cm.

## Satuan Berat

```
kg - hg - dag - g - dg - cg - mg
```

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
   - Jawaban: 135 menit', '{"tags":["pengukuran","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sd-data-1', 'Pengolahan Data Sederhana', 'mathematics', 'Statistika', 'SD', 'lesson', 'markdown', '# Pengolahan Data Sederhana

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
- Jawaban: (80 + 90 + 85) : 3 = 255 : 3 = 85', '{"tags":["data","statistika","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-pangkat-1', 'Bilangan Berpangkat dan Bentuk Akar', 'mathematics', 'Bilangan', 'SMP', 'lesson', 'markdown', '# Bilangan Berpangkat dan Bentuk Akar

## Bilangan Berpangkat

Bilangan berpangkat adalah perkalian berulang.

```
aⁿ = a × a × a × ... (sebanyak n kali)
```

Contoh: 2³ = 2 × 2 × 2 = 8

## Sifat Perpangkatan

1. aᵐ × aⁿ = aᵐ⁺ⁿ
2. aᵐ : aⁿ = aᵐ⁻ⁿ
3. (aᵐ)ⁿ = aᵐˣⁿ
4. a⁰ = 1

## Bentuk Akar

Akar adalah kebalikan dari pangkat.

```
√9 = 3 karena 3² = 9
```

## Contoh Soal

1. Hitunglah 3² × 3³
   - Jawaban: 3²⁺³ = 3⁵ = 243

2. Hitunglah √64
   - Jawaban: 8', '{"tags":["pangkat","akar","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-aljabar-1', 'Bentuk Aljabar', 'mathematics', 'Aljabar', 'SMP', 'lesson', 'markdown', '# Bentuk Aljabar

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
   - Jawaban: 12xy', '{"tags":["aljabar","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-persamaan-1', 'Persamaan dan Pertidaksamaan Linear', 'mathematics', 'Aljabar', 'SMP', 'lesson', 'markdown', '# Persamaan dan Pertidaksamaan Linear

## Persamaan Linear Satu Variabel (PLSV)

Bentuk umum: ax + b = c, dengan a ≠ 0.

Langkah penyelesaian:

1. Pindahkan konstanta ke ruas kanan
2. Bagi kedua ruas dengan koefisien x

Contoh: 2x + 3 = 11

```
2x = 11 - 3
2x = 8
x = 4
```

## Pertidaksamaan Linear

Bentuk umum: ax + b < c, ax + b > c, dan seterusnya.

**Penting:** Jika kedua ruas dikali atau dibagi bilangan negatif, tanda dibalik.

Contoh: -2x < 6 maka x > -3

## Contoh Soal

1. Selesaikan 3x - 5 = 10
   - Jawaban: 3x = 15, maka x = 5

2. Selesaikan x + 7 ≥ 12
   - Jawaban: x ≥ 5', '{"tags":["persamaan","pertidaksamaan","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-himpunan-1', 'Himpunan', 'mathematics', 'Himpunan', 'SMP', 'lesson', 'markdown', '# Himpunan

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
- Jawaban: {b, c}', '{"tags":["himpunan","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-perbandingan-1', 'Perbandingan dan Skala', 'mathematics', 'Perbandingan', 'SMP', 'lesson', 'markdown', '# Perbandingan dan Skala

## Perbandingan Senilai

Perbandingan senilai: jika satu nilai naik, nilai lain juga naik.

Contoh: 3 pensil harganya Rp 6.000. Harga 5 pensil?

```
3 : 5 = 6000 : x
3x = 30000
x = 10000
```

## Perbandingan Berbalik Nilai

Jika satu nilai naik, nilai lain turun.

Contoh: 6 pekerja selesai dalam 8 hari. 4 pekerja selesai dalam ... hari?

```
6 × 8 = 4 × x
x = 12 hari
```

## Skala

Skala = jarak pada peta : jarak sebenarnya

Contoh: skala 1:100.000 artinya 1 cm di peta = 100.000 cm (1 km) di lapangan.

## Contoh Soal

Jarak dua kota pada peta 4 cm dengan skala 1:250.000. Berapa jarak sebenarnya?
- Jawaban: 4 × 250.000 = 1.000.000 cm = 10 km', '{"tags":["perbandingan","skala","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-fungsi-1', 'Relasi dan Fungsi', 'mathematics', 'Fungsi', 'SMP', 'lesson', 'markdown', '# Relasi dan Fungsi

## Relasi

Relasi adalah hubungan antara dua himpunan.

Contoh: himpunan A = {Budi, Siti} dan himpunan B = {SD, SMP, SMA}. Relasi "bersekolah di" menghubungkan anggota A ke B.

## Fungsi

Fungsi adalah relasi khusus di mana **setiap anggota A dipasangkan tepat satu anggota B**.

```
f(x) = ax + b
```

Contoh: f(x) = 2x + 1, maka f(3) = 2(3) + 1 = 7

## Domain, Kodomain, dan Range

- **Domain**: daerah asal (himpunan A)
- **Kodomain**: daerah kawan (himpunan B)
- **Range**: hasil pemetaan (anggota B yang terpasang)

## Contoh Soal

Diketahui f(x) = 3x - 2. Tentukan f(5)!
- Jawaban: 3(5) - 2 = 13', '{"tags":["fungsi","relasi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-garis-1', 'Persamaan Garis Lurus', 'mathematics', 'Fungsi', 'SMP', 'lesson', 'markdown', '# Persamaan Garis Lurus

## Gradien

Gradien (m) menunjukkan kemiringan garis. Semakin besar gradien, semakin curam garisnya.

```
m = (y2 - y1) / (x2 - x1)
```

## Bentuk Persamaan Garis

Bentuk umum: **y = mx + c**, dengan m = gradien dan c = titik potong sumbu y.

## Menentukan Gradien dari Dua Titik

Diketahui titik (2, 3) dan (5, 9):

```
m = (9 - 3) / (5 - 2) = 6 / 3 = 2
```

## Menentukan Persamaan Garis

Garis melalui titik (x1, y1) dengan gradien m:

```
y - y1 = m(x - x1)
```

## Contoh Soal

Garis melalui (1, 2) dengan gradien 3. Tentukan persamaannya!
- Jawaban: y - 2 = 3(x - 1) maka y = 3x - 1', '{"tags":["garis","gradien","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-pythagoras-1', 'Teorema Pythagoras', 'mathematics', 'Geometri', 'SMP', 'lesson', 'markdown', '# Teorema Pythagoras

## Pengertian

Teorema Pythagoras berlaku pada segitiga siku-siku:

```
c² = a² + b²
```

dengan c = sisi miring (hipotenusa), a dan b = sisi tegak.

## Contoh

Segitiga siku-siku dengan a = 3 dan b = 4:

```
c² = 3² + 4² = 9 + 16 = 25
c = √25 = 5
```

## Tripel Pythagoras

Tiga bilangan yang memenuhi teorema Pythagoras, contoh:

- 3, 4, 5
- 6, 8, 10
- 5, 12, 13
- 7, 24, 25

## Contoh Soal

Sebuah tangga bersandar di dinding. Jarak kaki tangga ke dinding 6 m, tinggi tangga di dinding 8 m. Berapa panjang tangga?
- Jawaban: c² = 6² + 8² = 100, maka c = 10 m', '{"tags":["pythagoras","segitiga","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-lingkaran-1', 'Lingkaran', 'mathematics', 'Geometri', 'SMP', 'lesson', 'markdown', '# Lingkaran

## Unsur Lingkaran

- **Jari-jari (r)**: jarak pusat ke tepi lingkaran
- **Diameter (d)**: dua kali jari-jari, d = 2r
- **Busur**: bagian dari keliling lingkaran
- **Tali busur**: ruas garis yang menghubungkan dua titik pada lingkaran

## Keliling dan Luas

```
Keliling = 2 × π × r   atau   Keliling = π × d
Luas = π × r²
```

dengan π = 22/7 atau 3,14.

## Contoh Soal

Lingkaran dengan jari-jari 7 cm. Hitung keliling dan luasnya!

```
Keliling = 2 × 22/7 × 7 = 44 cm
Luas = 22/7 × 7 × 7 = 154 cm²
```

## Sudut Pusat dan Sudut Keliling

Sudut pusat besarnya dua kali sudut keliling yang menghadap busur yang sama.', '{"tags":["lingkaran","geometri","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-smp-statpel-1', 'Statistika dan Peluang', 'mathematics', 'Statistika', 'SMP', 'lesson', 'markdown', '# Statistika dan Peluang

## Ukuran Pemusatan Data

1. **Mean (rata-rata)**: jumlah data : banyak data
2. **Median**: nilai tengah setelah data diurutkan
3. **Modus**: nilai yang paling sering muncul

## Contoh

Data: 6, 7, 8, 8, 9, 9, 10

```
Mean = (6+7+8+8+9+9+10) / 7 = 57/7 ≈ 8,14
Median = 8 (data ke-4 setelah diurutkan)
Modus = 8 dan 9 (muncul dua kali)
```

## Peluang

```
Peluang = banyak kejadian yang diinginkan / banyak seluruh kejadian
```

Contoh: Peluang muncul angka genap pada dadu (2, 4, 6) = 3/6 = 1/2.

## Contoh Soal

Satu dadu dilempar. Berapa peluang muncul mata dadu lebih dari 4?
- Jawaban: mata dadu 5 dan 6 = 2/6 = 1/3', '{"tags":["statistika","peluang","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sma-eksponen-1', 'Eksponen dan Logaritma', 'mathematics', 'Aljabar', 'SMA', 'lesson', 'markdown', '# Eksponen dan Logaritma

## Sifat Eksponen

```
1. aᵐ × aⁿ = aᵐ⁺ⁿ
2. aᵐ : aⁿ = aᵐ⁻ⁿ
3. (aᵐ)ⁿ = aᵐⁿ
4. a⁻ⁿ = 1/aⁿ
5. a^(1/n) = ⁿ√a
```

## Fungsi Eksponen

```
f(x) = aˣ, dengan a > 0 dan a ≠ 1
```

## Logaritma

Logaritma adalah kebalikan dari eksponen.

```
a log b = c  artinya  aᶜ = b
```

## Sifat Logaritma

```
1. a log (x × y) = a log x + a log y
2. a log (x : y) = a log x - a log y
3. a log xⁿ = n × a log x
```

## Contoh Soal

1. Hitunglah 2³ × 2⁴!
   - Jawaban: 2³⁺⁴ = 2⁷ = 128

2. Hitunglah ²log 8!
   - Jawaban: 8 = 2³, maka ²log 8 = 3', '{"tags":["eksponen","logaritma","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sma-barisan-1', 'Barisan dan Deret', 'mathematics', 'Barisan dan Deret', 'SMA', 'lesson', 'markdown', '# Barisan dan Deret

## Barisan Aritmetika

Selisih antar suku selalu sama (b = beda).

```
Un = a + (n - 1) × b
```

Contoh: 2, 5, 8, 11, ... (a = 2, b = 3)
U10 = 2 + 9 × 3 = 29

## Deret Aritmetika

Jumlah n suku pertama:

```
Sn = n/2 × (2a + (n - 1) × b)
```

## Barisan Geometri

Perbandingan antar suku selalu sama (r = rasio).

```
Un = a × rⁿ⁻¹
```

Contoh: 3, 6, 12, 24, ... (a = 3, r = 2)
U5 = 3 × 2⁴ = 48

## Contoh Soal

Tentukan suku ke-8 dari barisan 4, 7, 10, 13, ...
- Jawaban: a = 4, b = 3, U8 = 4 + 7 × 3 = 25', '{"tags":["barisan","deret","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sma-trigonometri-1', 'Trigonometri', 'mathematics', 'Trigonometri', 'SMA', 'lesson', 'markdown', '# Trigonometri

## Perbandingan Trigonometri

Pada segitiga siku-siku dengan sudut θ:

```
sin θ = depan / miring
cos θ = samping / miring
tan θ = depan / samping
```

## Sudut Istimewa

| θ | sin | cos | tan |
|---|-----|-----|-----|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | √3/2 | 1/√3 |
| 45° | 1/2√2 | 1/2√2 | 1 |
| 60° | 1/2√3 | 1/2 | √3 |
| 90° | 1 | 0 | tak hingga |

## Identitas Dasar

```
sin²θ + cos²θ = 1
tan θ = sin θ / cos θ
```

## Contoh Soal

Segitiga siku-siku dengan sisi depan 3 dan miring 5. Hitung sin θ!
- Jawaban: sin θ = 3/5', '{"tags":["trigonometri","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sma-matriks-1', 'Matriks', 'mathematics', 'Matriks', 'SMA', 'lesson', 'markdown', '# Matriks

## Pengertian

Matriks adalah susunan bilangan dalam baris dan kolom.

```
A = | 2  3 |
    | 1  4 |
```

Matriks A memiliki 2 baris dan 2 kolom (orde 2 × 2).

## Operasi Matriks

**Penjumlahan**: jumlahkan elemen yang seletak.

```
| 2 3 | + | 1 0 | = | 3 3 |
| 1 4 |   | 2 1 |   | 3 5 |
```

**Perkalian skalar**: kalikan setiap elemen dengan skalarnya.

## Perkalian Dua Matriks

Elemen hasil = jumlah hasil kali baris × kolom yang bersesuaian.

## Determinan Matriks 2×2

```
det | a b | = ad - bc
    | c d |
```

Contoh: det | 2 3 | = 2×4 - 3×1 = 5
            | 1 4 |

## Contoh Soal

Hitung determinan matriks | 5 2 |!
                          | 3 4 |
- Jawaban: 5×4 - 2×3 = 20 - 6 = 14', '{"tags":["matriks","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sma-limit-1', 'Limit Fungsi', 'mathematics', 'Kalkulus', 'SMA', 'lesson', 'markdown', '# Limit Fungsi

## Pengertian

Limit adalah nilai yang didekati fungsi ketika variabel mendekati suatu nilai.

```
lim (x → a) f(x) = L
```

## Sifat Limit

```
1. lim k = k (konstanta)
2. lim [f(x) ± g(x)] = lim f(x) ± lim g(x)
3. lim [f(x) × g(x)] = lim f(x) × lim g(x)
```

## Limit Bentuk 0/0

Jika hasil substitusi berupa 0/0, gunakan pemfaktoran.

Contoh:

```
lim (x → 2) (x² - 4)/(x - 2)
= lim (x → 2) (x - 2)(x + 2)/(x - 2)
= lim (x → 2) (x + 2) = 4
```

## Contoh Soal

Hitung lim (x → 3) (x² - 9)/(x - 3)!
- Jawaban: (x-3)(x+3)/(x-3) = x+3 = 6', '{"tags":["limit","kalkulus","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sma-turunan-1', 'Turunan Fungsi', 'mathematics', 'Kalkulus', 'SMA', 'lesson', 'markdown', '# Turunan Fungsi

## Pengertian

Turunan mengukur laju perubahan fungsi. Notasi: f''(x) atau dy/dx.

## Rumus Turunan

```
Jika f(x) = xⁿ, maka f''(x) = n × xⁿ⁻¹
```

Contoh:

- f(x) = x³ → f''(x) = 3x²
- f(x) = 5x → f''(x) = 5
- f(x) = 7 (konstanta) → f''(x) = 0

## Aturan Turunan

1. **Konstanta**: turunan dari bilangan tetap adalah 0
2. **Penjumlahan**: turunan dijumlahkan per suku
3. **Perkalian**: (uv)'' = u''v + uv''

## Aplikasi Turunan

- Gradien garis singgung
- Menentukan nilai maksimum dan minimum
- Kecepatan (turunan posisi terhadap waktu)

## Contoh Soal

Tentukan turunan dari f(x) = 4x³ + 2x!
- Jawaban: f''(x) = 12x² + 2', '{"tags":["turunan","kalkulus","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('mat-sma-integral-1', 'Integral', 'mathematics', 'Kalkulus', 'SMA', 'lesson', 'markdown', '# Integral

## Integral Tak Tentu

Integral adalah kebalikan dari turunan (anti turunan).

```
∫ xⁿ dx = xⁿ⁺¹/(n+1) + C
```

Contoh: ∫ x² dx = x³/3 + C

## Integral Tentu

```
∫ₐᵇ f(x) dx = F(b) - F(a)
```

## Sifat Integral

```
1. ∫ k × f(x) dx = k × ∫ f(x) dx
2. ∫ [f(x) ± g(x)] dx = ∫ f(x) dx ± ∫ g(x) dx
```

## Aplikasi Integral

- Luas daerah di bawah kurva
- Volume benda putar

## Contoh Soal

Hitunglah ∫₀¹ (2x + 1) dx!

```
= [x² + x]₀¹
= (1 + 1) - (0 + 0) = 2
```

Jawaban: 2', '{"tags":["integral","kalkulus","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('agm-sd-akhlak-1', 'Akhlak Terpuji', 'pendidikan-agama', 'Akhlak', 'SD', 'lesson', 'markdown', '# Akhlak Terpuji

Akhlak terpuji adalah perilaku baik yang diajarkan agama.

## Contoh Akhlak Terpuji

1. **Jujur**: berkata dan bertindak sesuai kenyataan
2. **Sopan**: menghormati orang yang lebih tua
3. **Tolong-menolong**: membantu sesama
4. **Bersyukur**: berterima kasih kepada Tuhan

## Akhlak dalam Kehidupan Sehari-hari

- Mengucapkan salam saat masuk rumah
- Membantu pekerjaan orang tua
- Menghormati guru di sekolah

## Menjauhi Akhlak Tercela

Bohong, sombong, iri, dan berkata kasar adalah perilaku yang harus dijauhi.

## Latihan

Sebutkan tiga contoh akhlak terpuji yang bisa kamu lakukan di sekolah!', '{"tags":["akhlak","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('agm-smp-ibadah-1', 'Makna Ibadah', 'pendidikan-agama', 'Ibadah', 'SMP', 'lesson', 'markdown', '# Makna Ibadah

Ibadah adalah bentuk pengabdian kepada Tuhan.

## Ibadah Mahdhah

Ibadah yang ketentuannya sudah jelas:

- Shalat
- Puasa
- Zakat
- Haji (jika mampu)

## Ibadah Ghairu Mahdhah

Segala perbuatan baik yang diniatkan untuk Tuhan:

- Belajar dengan tekun
- Membantu orang tua
- Menjaga kebersihan

## Syarat Diterimanya Amal

1. **Niat ikhlas**: hanya karena Tuhan
2. **Cara yang benar**: sesuai tuntunan

## Latihan

Apa perbedaan ibadah mahdhah dan ghairu mahdhah? Beri satu contoh masing-masing!', '{"tags":["ibadah","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('agm-sma-toleransi-1', 'Toleransi Beragama', 'pendidikan-agama', 'Akhlak', 'SMA', 'lesson', 'markdown', '# Toleransi Beragama

Toleransi adalah sikap menghormati dan menghargai perbedaan keyakinan.

## Bentuk Toleransi

1. Tidak mengganggu ibadah orang lain
2. Menghargai perbedaan hari besar keagamaan
3. Bekerja sama dalam kehidupan sosial

## Batasan Toleransi

Toleransi tidak berarti mencampuradukkan ajaran agama. Keyakinan agama adalah hak pribadi.

## Toleransi dalam Keberagaman

Indonesia memiliki beragam agama yang hidup berdampingan. Toleransi menjaga kerukunan bangsa.

## Latihan

Sebutkan tiga contoh sikap toleransi yang dapat kamu terapkan di sekolah!', '{"tags":["toleransi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pnc-sd-pancasila-1', 'Pancasila Dasar Negara', 'pancasila', 'Pancasila', 'SD', 'lesson', 'markdown', '# Pancasila Dasar Negara

Pancasila adalah dasar negara Indonesia.

## Bunyi Pancasila

1. Ketuhanan Yang Maha Esa
2. Kemanusiaan yang adil dan beradab
3. Persatuan Indonesia
4. Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan
5. Keadilan sosial bagi seluruh rakyat Indonesia

## Lambang Pancasila

Lambang negara adalah **Garuda Pancasila**. Sila pertama dilambangkan bintang, sila kelima padi dan kapas.

## Pengamalan di Kelas

- Berdoa sebelum belajar (sila 1)
- Menghormati teman (sila 2)
- Mengikuti upacara bendera (sila 3)
- Musyawarah memilih ketua kelas (sila 4)
- Berbagi dengan teman (sila 5)

## Latihan

Sebutkan bunyi sila ketiga dan satu contoh pengamalannya!', '{"tags":["pancasila","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pnc-smp-norma-1', 'Norma dan Konstitusi', 'pancasila', 'Hukum', 'SMP', 'lesson', 'markdown', '# Norma dan Konstitusi

## Norma

Aturan yang mengatur tingkah laku manusia:

1. **Norma agama**: dari Tuhan
2. **Norma kesusilaan**: dari hati nurani
3. **Norma kesopanan**: dari masyarakat
4. **Norma hukum**: dari negara, bersifat memaksa

## Undang-Undang Dasar 1945

Konstitusi Indonesia. Berisi pembukaan, batang tubuh (pasal), dan penutup.

## Pembukaan UUD 1945

Memuat: pernyataan kemerdekaan, dasar negara Pancasila, dan tujuan negara.

## Hak dan Kewajiban

- Hak: yang kita terima (pendidikan, perlindungan)
- Kewajiban: yang harus kita lakukan (belajar, menaati aturan)

## Latihan

Sebutkan empat norma beserta sanksi bagi yang melanggar!', '{"tags":["norma","konstitusi","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pnc-sma-ideologi-1', 'Ideologi Pancasila', 'pancasila', 'Pancasila', 'SMA', 'lesson', 'markdown', '# Ideologi Pancasila

Ideologi adalah pandangan hidup yang menjadi pedoman negara.

## Pancasila sebagai Ideologi

Bersifat **terbuka**: tetap, tetapi dapat menyesuaikan perkembangan zaman tanpa mengubah nilai dasarnya.

## Nilai-nilai Pancasila

1. **Nilai dasar**: ketuhanan, kemanusiaan, persatuan, kerakyatan, keadilan
2. **Nilai instrumental**: penjabaran dalam UUD 1945 dan peraturan
3. **Nilai praksis**: penerapan dalam kehidupan sehari-hari

## Tantangan Ideologi Pancasila

- Individualisme dan konsumerisme
- Berita hoaks dan ujaran kebencian
- Lunturnya gotong royong

## Memperkuat Pancasila

- Mengamalkan sila-sila Pancasila
- Menggunakan media sosial dengan bijak
- Menjaga persatuan dalam keberagaman

## Latihan

Apa bedanya nilai dasar, instrumental, dan praksis dalam Pancasila?', '{"tags":["ideologi","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pnc-sma-konstitusi-1', 'Sistem Hukum dan Peradilan Nasional', 'pancasila', 'Hukum', 'SMA', 'lesson', 'markdown', '# Sistem Hukum dan Peradilan Nasional

## Hierarki Peraturan Perundang-undangan

1. UUD NRI 1945
2. Ketetapan MPR
3. Undang-undang / Perpu
4. Peraturan Pemerintah
5. Peraturan Presiden
6. Peraturan Daerah

## Lembaga Peradilan

- **Mahkamah Agung**: peradilan tertinggi
- **Mahkamah Konstitusi**: uji UU terhadap UUD
- **Komisi Yudisial**: pengawas hakim

## Asas Peradilan

- Bebas dan tidak memihak
- Sederhana, cepat, biaya ringan
- Praduga tak bersalah

## Latihan

Urutkan hierarki peraturan perundang-undangan dari yang tertinggi!', '{"tags":["hukum","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pjok-sd-gerak-1', 'Gerak Dasar', 'pjok', 'Olahraga', 'SD', 'lesson', 'markdown', '# Gerak Dasar

Gerak dasar adalah keterampilan awal yang mendasari aktivitas fisik.

## Gerak Lokomotor

Gerak berpindah tempat:

- Berjalan
- Berlari
- Melompat
- Berguling

## Gerak Non-lokomotor

Gerak tidak berpindah tempat:

- Membungkuk
- Memutar badan
- Mengayun lengan

## Gerak Manipulatif

Gerak yang menggunakan alat/benda:

- Melempar bola
- Menangkap bola
- Menendang bola

## Pemanasan

Sebelum berolahraga selalu lakukan pemanasan untuk mencegah cedera.

## Latihan

Klasifikasikan: melompat, mengayun lengan, dan melempar bola ke dalam tiga jenis gerak!', '{"tags":["gerak dasar","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pjok-sd-sehat-1', 'Pola Hidup Sehat', 'pjok', 'Kesehatan', 'SD', 'lesson', 'markdown', '# Pola Hidup Sehat

## Cara Hidup Sehat

1. Makan makanan bergizi (4 sehat 5 sempurna)
2. Olahraga teratur
3. Tidur cukup
4. Mencuci tangan sebelum makan
5. Minum air putih yang cukup

## Makanan Bergizi

Karbohidrat (nasi), protein (telur, ikan), vitamin (sayur, buah), lemak, dan air.

## Bahaya Jajan Sembarangan

- Bisa mengandung bahan berbahaya
- Menyebabkan sakit perut
- Mengurangi nafsu makan

## Latihan

Sebutkan tiga cara menjaga kesehatan tubuh!', '{"tags":["sehat","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pjok-smp-permainan-1', 'Permainan Bola Besar dan Kecil', 'pjok', 'Olahraga', 'SMP', 'lesson', 'markdown', '# Permainan Bola Besar dan Kecil

## Bola Besar

- **Sepak bola**: 11 pemain, menggunakan kaki
- **Bola voli**: memantulkan bola melewati net
- **Bola basket**: memasukkan bola ke ring

## Bola Kecil

- **Kasti**: memukul bola dengan tongkat
- **Bulu tangkis**: menggunakan raket dan kok
- **Tenis meja**: bola dipukul melewati net di atas meja

## Teknik Dasar

- Passing: mengoper bola
- Dribbling: menggiring bola
- Shooting: menembak/memukul ke sasaran

## Keselamatan Bermain

Lakukan pemanasan, patuhi aturan, dan gunakan perlengkapan yang aman.

## Latihan

Sebutkan dua permainan bola besar dan dua permainan bola kecil!', '{"tags":["permainan","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pjok-smp-kebugaran-1', 'Kebugaran Jasmani', 'pjok', 'Kesehatan', 'SMP', 'lesson', 'markdown', '# Kebugaran Jasmani

Kebugaran jasmani adalah kemampuan tubuh melakukan aktivitas tanpa kelelahan berlebih.

## Komponen Kebugaran

1. **Kekuatan**: otot bekerja maksimal
2. **Kelenturan**: sendi bergerak leluasa
3. **Kecepatan**: berpindah cepat
4. **Daya tahan**: bertahan dalam waktu lama
5. **Kelincahan**: mengubah arah cepat

## Latihan

- Push up (kekuatan)
- Sit up (kekuatan otot perut)
- Lari jarak jauh (daya tahan)
- Peregangan (kelenturan)

## Tes Kebugaran

Contoh: lari 12 menit, push up 30 detik, baring duduk 60 detik.

## Latihan

Sebutkan empat komponen kebugaran jasmani!', '{"tags":["kebugaran","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pjok-sma-bela-1', 'Bela Diri dan Senam', 'pjok', 'Olahraga', 'SMA', 'lesson', 'markdown', '# Bela Diri dan Senam

## Bela Diri

Bela diri melatih fisik, mental, dan sikap sportif.

- **Pencak silat**: bela diri asli Indonesia
- **Karate, taekwondo, judo**: bela diri dari luar

Prinsip: tidak menyerang, tapi membela diri.

## Senam

- **Senam lantai**: tanpa alat. Contoh: guling depan, guling belakang, kayang
- **Senam irama**: diiringi musik
- **Senam ketangkasan**: menggunakan alat

## Manfaat

- Meningkatkan kelenturan dan keseimbangan
- Melatih disiplin dan percaya diri

## Latihan

Sebutkan tiga gerakan senam lantai!', '{"tags":["bela diri","senam","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('pjok-sma-aktivitas-1', 'Aktivitas Fisik dan Keselamatan', 'pjok', 'Kesehatan', 'SMA', 'lesson', 'markdown', '# Aktivitas Fisik dan Keselamatan

## Prinsip Latihan

- **FITT**: Frequency (frekuensi), Intensity (intensitas), Time (durasi), Type (jenis)
- Pemanasan sebelum, pendinginan setelah latihan

## Cedera dan Penanganan

- **Keseleo**: kompres es, istirahat
- **Kram**: peregangan pelan
- **Luka**: bersihkan, beri obat, tutup perban

## Keselamatan

1. Gunakan perlengkapan sesuai olahraga
2. Kenali batas kemampuan
3. Minum cukup air

## Latihan

Jelaskan prinsip FITT dalam latihan fisik!', '{"tags":["aktivitas fisik","kesehatan","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sbd-sd-musik-1', 'Seni Musik Dasar', 'seni-budaya', 'Musik', 'SD', 'lesson', 'markdown', '# Seni Musik Dasar

## Unsur Musik

1. **Melodi**: urutan nada yang enak didengar
2. **Irama (ritme)**: ketukan yang teratur
3. **Tempo**: cepat lambatnya lagu
4. **Dinamika**: keras lembutnya suara

## Nada

Tinggi rendahnya bunyi. Notasi angka: 1 (do), 2 (re), 3 (mi), 4 (fa), 5 (sol), 6 (la), 7 (si).

## Lagu Daerah

- Ampar-Ampar Pisang (Kalimantan Selatan)
- Manuk Dadali (Jawa Barat)
- Apuse (Papua)

## Latihan

Sebutkan lima unsur penting dalam musik!', '{"tags":["musik","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sbd-sd-gambar-1', 'Menggambar dan Mewarnai', 'seni-budaya', 'Rupa', 'SD', 'lesson', 'markdown', '# Menggambar dan Mewarnai

## Teknik Dasar Menggambar

1. Menggambar garis: lurus, lengkung, zig-zag
2. Menggambar bentuk: lingkaran, segitiga, persegi
3. Menggambar objek sederhana: hewan, tumbuhan, rumah

## Mewarnai

- **Teknik basah**: cat air, cat poster
- **Teknik kering**: krayon, pensil warna, spidol

## Komposisi Warna

- Warna primer: merah, kuning, biru
- Warna sekunder: hasil campuran dua warna primer

## Latihan

Sebutkan tiga warna primer dan bagaimana warna hijau dibuat!', '{"tags":["menggambar","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sbd-smp-teater-1', 'Seni Teater Dasar', 'seni-budaya', 'Teater', 'SMP', 'lesson', 'markdown', '# Seni Teater Dasar

Teater adalah pertunjukan yang menggabungkan drama, gerak, dan ucapan.

## Unsur Teater

1. Naskah/cerita
2. Pemeran (aktor/aktris)
3. Sutradara
4. Tata panggung, kostum, dan lampu

## Olah Vokal dan Tubuh

- **Artikulasi**: kejelasan pengucapan
- **Intonasi**: naik turunnya nada bicara
- **Ekspresi**: mimik wajah sesuai peran

## Latihan Dasar

- Latihan pernapasan
- Latihan ekspresi wajah
- Improvisasi sederhana

## Latihan

Sebutkan tiga unsur utama dalam pertunjukan teater!', '{"tags":["teater","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sbd-sma-rupa-1', 'Seni Rupa: Apresiasi', 'seni-budaya', 'Rupa', 'SMA', 'lesson', 'markdown', '# Seni Rupa: Apresiasi

Apresiasi seni adalah kegiatan menilai dan menghargai karya seni.

## Jenis Seni Rupa

- **Seni rupa murni**: untuk dinikmati (lukisan, patung)
- **Seni rupa terapan**: untuk dipakai (keramik, batik, desain)

## Unsur Seni Rupa

Garis, bentuk, bidang, warna, tekstur, ruang.

## Prinsip Seni Rupa

Kesatuan, keseimbangan, irama, proporsi, dan fokus (pusat perhatian).

## Langkah Apresiasi

1. Mengamati karya
2. Menganalisis unsur dan prinsip
3. Menafsirkan makna
4. Menilai secara subjektif

## Latihan

Sebutkan unsur dan prinsip seni rupa!', '{"tags":["seni rupa","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('sbd-sma-tari-1', 'Seni Tari dan Tradisi', 'seni-budaya', 'Tari', 'SMA', 'lesson', 'markdown', '# Seni Tari dan Tradisi

## Unsur Tari

1. **Wiraga**: gerak tubuh
2. **Wirama**: irama
3. **Wirasa**: penghayatan perasaan

## Jenis Tari

- **Tari tradisional**: Tari Saman (Aceh), Tari Kecak (Bali), Tari Tor-Tor (Sumatera Utara)
- **Tari kreasi**: dikembangkan dari tradisi

## Fungsi Tari

- Upacara adat
- Hiburan
- Pertunjukan seni
- Sarana pendidikan karakter

## Latihan

Sebutkan tiga unsur tari dan dua contoh tari tradisional!', '{"tags":["tari","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('prk-sd-kerajinan-1', 'Kerajinan Tangan', 'prakarya', 'Kerajinan', 'SD', 'lesson', 'markdown', '# Kerajinan Tangan

## Bahan Kerajinan

- **Bahan alam**: daun, ranting, kulit, tanah liat
- **Bahan bekas**: botol plastik, kardus, kertas koran

## Contoh Kerajinan

- Melipat kertas menjadi bentuk (origami)
- Membuat bingkai dari kardus
- Membuat pot dari botol bekas

## Langkah Membuat Kerajinan

1. Siapkan alat dan bahan
2. Buat rancangan (sketsa)
3. Bentuk sesuai rancangan
4. Hias dan rapikan

## Latihan

Sebutkan alat dan bahan untuk membuat kerajinan dari botol bekas!', '{"tags":["kerajinan","sd"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('prk-smp-produk-1', 'Kerajinan dan Produk Sederhana', 'prakarya', 'Kerajinan', 'SMP', 'lesson', 'markdown', '# Kerajinan dan Produk Sederhana

## Membuat Produk

Langkah: ide → rancangan → pembuatan → pengemasan → pemasaran.

## Bahan Lunak dan Keras

- **Bahan lunak**: tanah liat, plastisin
- **Bahan keras**: kayu, bambu, rotan

## Pengolahan Bahan Pangan

- **Makanan awetan**: asinan, manisan, keripik
- **Minuman**: sari buah, wedang

## Keselamatan Kerja

Gunakan alat sesuai fungsi, jaga kebersihan tempat kerja.

## Latihan

Sebutkan lima tahap membuat produk kerajinan!', '{"tags":["produk","smp"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('prk-sma-wirausaha-1', 'Produk Kreatif dan Kewirausahaan', 'prakarya', 'Wirausaha', 'SMA', 'lesson', 'markdown', '# Produk Kreatif dan Kewirausahaan

## Kewirausahaan

Kewirausahaan adalah kemampuan menciptakan peluang dan usaha.

## Karakter Wirausahawan

1. Kreatif dan inovatif
2. Berani mengambil risiko
3. Pantang menyerah
4. Berorientasi pada pelanggan

## Perencanaan Usaha

1. Menentukan ide produk
2. Analisis pasar
3. Perhitungan modal dan harga
4. Pemasaran (offline dan online)

## Laporan Sederhana

- BEP (Break Even Point): titik balik modal
- Laba = pendapatan - biaya

## Latihan

Sebutkan empat karakter wirausahawan yang baik!', '{"tags":["wirausaha","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('kwu-sma-bisnis-1', 'Dasar Kewirausahaan', 'kewirausahaan', 'Wirausaha', 'SMA', 'lesson', 'markdown', '# Dasar Kewirausahaan

## Pengertian

Wirausaha adalah orang yang menciptakan usaha dengan keberanian mengambil risiko demi peluang.

## Wirausaha vs Karyawan

| Wirausaha | Karyawan |
|-----------|----------|
| Bebas menentukan arah | Mengikuti aturan perusahaan |
| Keuntungan tidak pasti | Gaji tetap |
| Menciptakan lapangan kerja | Mengisi lowongan |

## Pola Pikir Wirausaha

- Melihat masalah sebagai peluang
- Fokus pada solusi
- Belajar dari kegagalan

## Latihan

Apa perbedaan utama antara wirausaha dan karyawan?', '{"tags":["wirausaha","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('kwu-sma-rencana-1', 'Rencana Usaha', 'kewirausahaan', 'Wirausaha', 'SMA', 'lesson', 'markdown', '# Rencana Usaha

## Komponen Rencana Usaha

1. **Ringkasan eksekutif**: gambaran usaha
2. **Deskripsi produk/jasa**
3. **Analisis pasar**: calon pembeli dan pesaing
4. **Rencana pemasaran**: harga, promosi, distribusi
5. **Rencana keuangan**: modal, biaya, proyeksi laba

## Cara Menentukan Harga

```
Harga jual = biaya produksi + laba yang diinginkan
```

## Promosi

- Media sosial
- Mulut ke mulut
- Bazar dan pameran

## Latihan

Sebutkan lima komponen utama rencana usaha!', '{"tags":["rencana usaha","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('kwu-sma-marketing-1', 'Pemasaran dan Branding', 'kewirausahaan', 'Marketing', 'SMA', 'lesson', 'markdown', '# Pemasaran dan Branding

## Bauran Pemasaran (4P)

1. **Product**: produk yang tepat
2. **Price**: harga yang sesuai
3. **Place**: tempat/toko yang strategis
4. **Promotion**: promosi yang menarik

## Branding

Membangun citra produk agar dikenal dan dipercaya:

- Logo dan nama yang mudah diingat
- Kemasan yang menarik
- Kualitas yang konsisten

## Pemasaran Digital

- Marketplace (Shopee, Tokopedia, Lazada)
- Media sosial (Instagram, TikTok, YouTube)
- Marketplace internasional

## Latihan

Sebutkan 4P dalam pemasaran dan satu contoh pemasaran digital!', '{"tags":["pemasaran","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES
  ('kwu-sma-keuangan-1', 'Keuangan Usaha', 'kewirausahaan', 'Keuangan', 'SMA', 'lesson', 'markdown', '# Keuangan Usaha

## Biaya Usaha

- **Biaya tetap**: tidak berubah (sewa, gaji)
- **Biaya variabel**: berubah sesuai produksi (bahan baku)

## Harga Pokok dan Laba

```
HPP = total biaya : jumlah produksi
Laba = pendapatan - total biaya
```

## Break Even Point (BEP)

Titik di mana pendapatan sama dengan total biaya (tidak untung tidak rugi).

```
BEP unit = biaya tetap : (harga jual - biaya variabel per unit)
```

## Catatan Keuangan Sederhana

Catat semua pemasukan dan pengeluaran secara rutin.

## Latihan

Sebutkan rumus laba dan arti BEP!', '{"tags":["keuangan","sma"]}', '2026-07-31T06:09:00.847Z', '2026-07-31T06:09:00.847Z');

