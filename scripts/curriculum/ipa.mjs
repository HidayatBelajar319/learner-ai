// scripts/curriculum/ipa.mjs
const L = (id, title, subject, topic, level, data, tags = []) => ({ id, title, subject, topic, level, data, tags });

export default [
  // ===== IPA =====
  // -- SD --
  L('ipa-sd-alam-1', 'Mengenal Alam Sekitar', 'ipa', 'Makhluk Hidup', 'SD', `# Mengenal Alam Sekitar

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

Sebutkan tiga ciri makhluk hidup dan dua contoh benda tak hidup!`, ['alam', 'sd']),

  L('ipa-sd-makhluk-1', 'Makhluk Hidup dan Habitatnya', 'ipa', 'Makhluk Hidup', 'SD', `# Makhluk Hidup dan Habitatnya

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

Buatlah satu rantai makanan yang ada di sawah!`, ['makhluk hidup', 'sd']),

  L('ipa-sd-materi-1', 'Wujud Benda', 'ipa', 'Materi', 'SD', `# Wujud Benda

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

Es batu yang dibiarkan di udara akan berubah menjadi air. Peristiwa apakah itu?`, ['materi', 'sd']),

  L('ipa-sd-energi-1', 'Energi dan Sumbernya', 'ipa', 'Energi', 'SD', `# Energi dan Sumbernya

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

Sebutkan dua contoh energi terbarukan dan satu contoh energi tidak terbarukan!`, ['energi', 'sd']),

  // -- SMP --
  L('ipa-smp-sel-1', 'Sel sebagai Unit Kehidupan', 'ipa', 'Biologi', 'SMP', `# Sel sebagai Unit Kehidupan

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

Apa perbedaan utama sel tumbuhan dan sel hewan?`, ['sel', 'biologi', 'smp']),

  L('ipa-smp-gerak-1', 'Gerak dan Gaya', 'ipa', 'Fisika', 'SMP', `# Gerak dan Gaya

## Gerak

Gerak adalah perubahan kedudukan benda terhadap titik acuan.

- **Kecepatan** = jarak : waktu (m/s)

\`\`\`
v = s / t
\`\`\`

## Gaya

Gaya adalah tarikan atau dorongan. Satuan gaya adalah **Newton (N)**.

- **Hukum I Newton**: benda cenderung mempertahankan keadaan diam/bergerak (inersia)
- **Hukum II Newton**: percepatan sebanding dengan gaya

\`\`\`
F = m x a
\`\`\`

dengan F = gaya (N), m = massa (kg), a = percepatan (m/s²).

## Jenis Gaya

- Gaya gesek: menghambat gerak
- Gaya gravitasi: menarik benda ke bawah
- Gaya magnet: menarik benda logam tertentu

## Latihan

Sebuah benda bermassa 2 kg dipercepat 3 m/s². Berapa gaya yang bekerja?`, ['gerak', 'gaya', 'fisika', 'smp']),

  L('ipa-smp-listrik-1', 'Listrik Dasar', 'ipa', 'Fisika', 'SMP', `# Listrik Dasar

## Arus Listrik

Arus listrik adalah aliran muatan listrik. Satuan arus adalah **Ampere (A)**.

Rangkaian:

- **Seri**: satu jalur, lampu menyala lebih redup
- **Paralel**: cabang terpisah, lampu tetap terang

## Hukum Ohm

\`\`\`
V = I x R
\`\`\`

dengan V = tegangan (volt), I = arus (ampere), R = hambatan (ohm).

## Contoh

Hambatan 5 ohm dialiri arus 2 A. Berapa tegangannya?

\`\`\`
V = I x R = 2 x 5 = 10 volt
\`\`\`

## Rangkaian di Rumah

Instalasi rumah menggunakan rangkaian **paralel** agar tiap alat bisa menyala sendiri.

## Latihan

Sebuah lampu dialiri arus 0,5 A dengan tegangan 220 V. Hitung hambatannya!`, ['listrik', 'fisika', 'smp']),

  L('ipa-smp-tatasurya-1', 'Tata Surya', 'ipa', 'Bumi dan Antariksa', 'SMP', `# Tata Surya

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

Apa akibat rotasi bumi dan revolusi bumi?`, ['tata surya', 'smp']),

  L('ipa-smp-zat-1', 'Zat dan Perubahannya', 'ipa', 'Kimia', 'SMP', `# Zat dan Perubahannya

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

Klasifikasikan: kayu terbakar, kapur barus menyublim, nasi menjadi basi (fisika/kimia)!`, ['zat', 'kimia', 'smp']),

  // -- SMA --
  L('ipa-sma-kinematika-1', 'Kinematika', 'ipa', 'Fisika', 'SMA', `# Kinematika

Kinematika mempelajari gerak tanpa memperhatikan penyebabnya.

## Gerak Lurus Beraturan (GLB)

Kecepatan tetap, percepatan nol.

\`\`\`
s = v x t
\`\`\`

## Gerak Lurus Berubah Beraturan (GLBB)

Percepatan tetap.

\`\`\`
v_t = v_0 + a x t
s = v_0 x t + 1/2 x a x t^2
\`\`\`

## Gerak Jatuh Bebas

Benda dijatuhkan tanpa kecepatan awal.

\`\`\`
v_t = g x t
h = 1/2 x g x t^2
\`\`\`

dengan g = 9,8 m/s² (percepatan gravitasi).

## Contoh

Sebuah mobil bergerak dari diam dengan percepatan 2 m/s² selama 5 detik. Berapa kecepatan akhirnya?

\`\`\`
v_t = 0 + 2 x 5 = 10 m/s
\`\`\`

## Latihan

Bola dijatuhkan dari gedung dan mencapai tanah dalam 2 detik. Berapa ketinggiannya? (g = 10 m/s²)`, ['kinematika', 'fisika', 'sma']),

  L('ipa-sma-dinamika-1', 'Dinamika dan Hukum Newton', 'ipa', 'Fisika', 'SMA', `# Dinamika dan Hukum Newton

Dinamika mempelajari gerak beserta penyebabnya (gaya).

## Hukum Newton

**Hukum I** (inersia): benda mempertahankan keadaannya jika tidak ada gaya total.

**Hukum II**: percepatan sebanding gaya total dan berbanding terbalik massa.

\`\`\`
F = m x a
\`\`\`

**Hukum III** (aksi-reaksi): tiap aksi ada reaksi yang sama besar dan berlawanan arah.

## Gaya Normal dan Gesek

- **Gaya normal**: gaya tegak lurus permukaan
- **Gaya gesek**: menghambat gerak, sebanding dengan gaya normal

\`\`\`
f = m x N
\`\`\`

## Contoh

Gaya 20 N mendorong balok 4 kg. Percepatannya?

\`\`\`
a = F / m = 20 / 4 = 5 m/s^2
\`\`\`

## Latihan

Jika gaya 50 N menghasilkan percepatan 2 m/s², berapa massanya?`, ['dinamika', 'fisika', 'sma']),

  L('ipa-sma-gelombang-1', 'Gelombang dan Bunyi', 'ipa', 'Fisika', 'SMA', `# Gelombang dan Bunyi

Gelombang adalah getaran yang merambat membawa energi.

## Jenis Gelombang

- **Mekanik**: butuh medium (bunyi, air)
- **Elektromagnetik**: tidak butuh medium (cahaya, radio)

Berdasarkan arah rambat:

- **Transversal**: tegak lurus arah rambat (tali)
- **Longitudinal**: sejajar arah rambat (bunyi)

## Rumus Cepat Rambat

\`\`\`
v = f x lambda
\`\`\`

v = kecepatan (m/s), f = frekuensi (Hz), lambda = panjang gelombang (m).

## Bunyi

- **Nada**: bunyi dengan frekuensi teratur
- **Keras lembut**: bergantung amplitudo
- **Tinggi rendah**: bergantung frekuensi

## Latihan

Gelombang berfrekuensi 50 Hz memiliki panjang gelombang 2 m. Berapa cepat rambatnya?`, ['gelombang', 'fisika', 'sma']),

  L('ipa-sma-termo-1', 'Termodinamika', 'ipa', 'Fisika', 'SMA', `# Termodinamika

Termodinamika mempelajari hubungan antara kalor, kerja, dan energi.

## Hukum I Termodinamika

\`\`\`
Delta U = Q - W
\`\`\`

Perubahan energi dalam = kalor yang masuk dikurangi kerja yang dilakukan sistem.

## Proses-proses

- **Isotermal**: suhu tetap (Delta U = 0)
- **Isobarik**: tekanan tetap
- **Isokhorik**: volume tetap (W = 0)
- **Adiabatik**: tanpa pertukaran kalor (Q = 0)

## Siklus dan Mesin

Mesin kalor mengubah kalor menjadi kerja. Efisiensi Carnot:

\`\`\`
e = 1 - (T2 / T1)
\`\`\`

## Latihan

Jika Q = 300 J masuk ke sistem dan W = 100 J, berapa perubahan energi dalam?`, ['termodinamika', 'fisika', 'sma']),

  L('ipa-sma-strukturatom-1', 'Struktur Atom', 'ipa', 'Kimia', 'SMA', `# Struktur Atom

Atom adalah partikel terkecil suatu unsur yang masih memiliki sifat unsur tersebut.

## Partikel Penyusun Atom

- **Proton** (muatan +): di inti
- **Neutron** (netral): di inti
- **Elektron** (muatan -): mengelilingi inti

## Nomor Atom dan Nomor Massa

\`\`\`
Nomor atom (Z) = jumlah proton
Nomor massa (A) = proton + neutron
\`\`\`

Lambang: A/Z X

## Konfigurasi Elektron

Elektron tersusun dalam kulit: K (2), L (8), M (18), N (32).

Contoh, Natrium (Z = 11): 2, 8, 1.

## Isotop

Unsur sama dengan jumlah neutron berbeda.

## Latihan

Unsur Karbon memiliki nomor atom 6 dan nomor massa 12. Berapa jumlah neutronnya?`, ['struktur atom', 'kimia', 'sma']),

  L('ipa-sma-stoikiometri-1', 'Stoikiometri', 'ipa', 'Kimia', 'SMA', `# Stoikiometri

Stoikiometri mempelajari hubungan kuantitatif zat dalam reaksi kimia.

## Konsep Mol

\`\`\`
n = m / Mr
\`\`\`

n = mol, m = massa (gram), Mr = massa molekul relatif.

Satu mol mengandung 6,022 x 10^23 partikel (bilangan Avogadro).

## Massa Molar

Mr dihitung dari jumlah massa atom relatif (Ar).

Contoh, H2O: (2 x 1) + 16 = 18 g/mol.

## Perbandingan Koefisien

Koefisien reaksi menunjukkan perbandingan mol.

Contoh: 2H2 + O2 → 2H2O. Untuk 2 mol H2 diperlukan 1 mol O2 dan dihasilkan 2 mol H2O.

## Latihan

Berapa mol dari 36 gram air (Mr H2O = 18)?`, ['stoikiometri', 'kimia', 'sma']),

  L('ipa-sma-redoks-1', 'Reaksi Redoks', 'ipa', 'Kimia', 'SMA', `# Reaksi Redoks

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

Tentukan zat yang teroksidasi dan tereduksi dalam reaksi di atas!`, ['redoks', 'kimia', 'sma']),

  L('ipa-sma-genetika-1', 'Genetika', 'ipa', 'Biologi', 'SMA', `# Genetika

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

\`\`\`
    A     a
A   AA    Aa
a   Aa    aa
\`\`\`

## Latihan

Berapa perbandingan fenotipe hasil persilangan Aa x Aa?`, ['genetika', 'biologi', 'sma']),

  L('ipa-sma-evolusi-1', 'Evolusi', 'ipa', 'Biologi', 'SMA', `# Evolusi

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

Jelaskan perbedaan inti teori Lamarck dan Darwin!`, ['evolusi', 'biologi', 'sma']),

  L('ipa-sma-ekologi-1', 'Ekologi', 'ipa', 'Biologi', 'SMA', `# Ekologi

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

Urutkan tingkat organisasi ekologi dari individu sampai biosfer!`, ['ekologi', 'biologi', 'sma']),

  // ===== IPS =====
  // -- SD --
  L('ips-sd-lingkungan-1', 'Lingkungan Sekitar', 'ips', 'Geografi', 'SD', `# Lingkungan Sekitar

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

Sebutkan dua contoh lingkungan alam dan dua contoh lingkungan buatan!`, ['lingkungan', 'sd']),

  L('ips-sd-ekonomi-1', 'Kegiatan Ekonomi', 'ips', 'Ekonomi', 'SD', `# Kegiatan Ekonomi

## Jenis Kegiatan Ekonomi

1. **Produksi**: membuat barang. Contoh: petani menanam padi
2. **Distribusi**: menyalurkan barang. Contoh: pedagang mengangkut hasil tani ke kota
3. **Konsumsi**: memakai barang. Contoh: ibu membeli dan memasak beras

## Mata Pencaharian

- Petani, nelayan, peternak (alam)
- Pedagang, buruh (jasa/perdagangan)

## Latihan

Ibu membeli sayur di pasar termasuk kegiatan apa?`, ['ekonomi', 'sd']),

  // -- SMP --
  L('ips-smp-interaksi-1', 'Interaksi Sosial', 'ips', 'Sosiologi', 'SMP', `# Interaksi Sosial

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

Beri satu contoh interaksi sosial asosiatif dan satu contoh disosiatif!`, ['interaksi sosial', 'sosiologi', 'smp']),

  L('ips-smp-pasar-1', 'Pasar dan Permintaan Penawaran', 'ips', 'Ekonomi', 'SMP', `# Pasar dan Permintaan Penawaran

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

Mengapa permintaan naik saat harga turun?`, ['pasar', 'ekonomi', 'smp']),

  L('ips-smp-asean-1', 'ASEAN dan Kerja Sama', 'ips', 'Geografi', 'SMP', `# ASEAN dan Kerja Sama

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

Sebutkan tiga negara pendiri ASEAN dan tujuan kerja sama ASEAN!`, ['asean', 'geografi', 'smp']),

  // -- SMA --
  L('ips-sma-geografi-1', 'Geografi: Litosfer dan Pedosfer', 'ips', 'Geografi', 'SMA', `# Litosfer dan Pedosfer

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

Sebutkan tiga jenis batuan beserta contohnya!`, ['geografi', 'sma']),

  L('ips-sma-sosiologi-1', 'Sosiologi: Nilai, Norma, dan Sosialisasi', 'ips', 'Sosiologi', 'SMA', `# Nilai, Norma, dan Sosialisasi

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

Sebutkan empat tingkat norma beserta contohnya!`, ['sosiologi', 'sma']),

  L('ips-sma-ekonomi-1', 'Ekonomi: Pendapatan Nasional', 'ips', 'Ekonomi', 'SMA', `# Pendapatan Nasional

Pendapatan nasional adalah total nilai barang dan jasa yang dihasilkan suatu negara dalam satu tahun.

## Metode Perhitungan

1. **Metode produksi**: jumlah nilai tambah semua sektor
2. **Metode pendapatan**: jumlah seluruh pendapatan faktor produksi
3. **Metode pengeluaran**: konsumsi + investasi + belanja pemerintah + ekspor - impor

\`\`\`
Y = C + I + G + (X - M)
\`\`\`

## Indikator

- **PDB (GDP)**: produksi di dalam negeri
- **PNB (GNP)**: milik warga negara di mana pun berada
- **Pendapatan per kapita**: PNB dibagi jumlah penduduk

## Latihan

Tuliskan rumus pendapatan nasional metode pengeluaran!`, ['ekonomi', 'sma']),

  // ===== Sejarah =====
  // -- SD --
  L('sej-sd-pahlawan-1', 'Pahlawan Indonesia', 'sejarah', 'Sejarah Indonesia', 'SD', `# Pahlawan Indonesia

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

Sebutkan satu pahlawan dan jasa besarnya untuk Indonesia!`, ['pahlawan', 'sd']),

  L('sej-sd-kelas4-1', 'Mengenal Sejarah Keluarga dan Daerah', 'sejarah', 'Sejarah Indonesia', 'SD', `# Mengenal Sejarah Keluarga dan Daerah

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

Tuliskan satu cerita atau tradisi yang dikenal di daerahmu!`, ['sejarah daerah', 'sd']),

  // -- SMP --
  L('sej-smp-nasional-1', 'Pergerakan Nasional', 'sejarah', 'Sejarah Indonesia', 'SMP', `# Pergerakan Nasional

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

Apa isi tiga butir Sumpah Pemuda?`, ['pergerakan nasional', 'smp']),

  L('sej-smp-hindu-budha-1', 'Kerajaan Hindu-Buddha dan Islam', 'sejarah', 'Sejarah Indonesia', 'SMP', `# Kerajaan Hindu-Buddha dan Islam

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

Sebutkan satu kerajaan Hindu-Buddha dan satu kerajaan Islam beserta cirinya!`, ['kerajaan', 'smp']),

  // -- SMA --
  L('sej-sma-kolonial-1', 'Kolonialisme dan Imperialisme', 'sejarah', 'Sejarah Indonesia', 'SMA', `# Kolonialisme dan Imperialisme

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

Jelaskan dampak Tanam Paksa bagi rakyat Indonesia!`, ['kolonialisme', 'sma']),

  L('sej-sma-kemerdekaan-1', 'Proklamasi dan Perjuangan Mempertahankan Kemerdekaan', 'sejarah', 'Sejarah Indonesia', 'SMA', `# Proklamasi Kemerdekaan

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

Sebutkan tiga peristiwa mempertahankan kemerdekaan setelah proklamasi!`, ['kemerdekaan', 'sma']),

  L('sej-sma-orde-1', 'Orde Lama, Orde Baru, dan Reformasi', 'sejarah', 'Sejarah Indonesia', 'SMA', `# Orde Lama, Orde Baru, dan Reformasi

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

Apa tuntutan utama gerakan reformasi 1998?`, ['orde', 'reformasi', 'sma']),
];
