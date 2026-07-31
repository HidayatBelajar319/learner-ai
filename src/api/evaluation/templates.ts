export interface TemplateQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

type QuestionSeed = Omit<TemplateQuestion, 'id'>;

const BANKS: Record<string, QuestionSeed[]> = {
  mathematics: [
    { question: 'Jika x + 5 = 12, berapakah nilai x?', options: ['7', '17', '-7', '5'], correct: 0, explanation: 'x = 12 - 5 = 7.' },
    { question: 'Berapakah 25% dari 200?', options: ['50', '25', '75', '100'], correct: 0, explanation: '25% × 200 = 0,25 × 200 = 50.' },
    { question: 'Hitunglah 15 + 3 × 4', options: ['27', '72', '18', '32'], correct: 0, explanation: 'Kerjakan perkalian dulu: 3 × 4 = 12, lalu 15 + 12 = 27.' },
    { question: 'Manakah yang merupakan bilangan prima?', options: ['7', '9', '15', '21'], correct: 0, explanation: 'Bilangan prima hanya habis dibagi 1 dan dirinya sendiri. 7 memenuhi.' },
    { question: 'Luas persegi dengan sisi 6 cm adalah?', options: ['36 cm²', '12 cm²', '24 cm²', '18 cm²'], correct: 0, explanation: 'Luas persegi = sisi × sisi = 6 × 6 = 36 cm².' },
    { question: 'Sederhanakan pecahan 8/12', options: ['2/3', '4/6', '3/4', '1/3'], correct: 0, explanation: '8 dan 12 sama-sama habis dibagi 4, sehingga 8/12 = 2/3.' },
    { question: 'Nilai dari 2³ adalah?', options: ['8', '6', '9', '4'], correct: 0, explanation: '2³ = 2 × 2 × 2 = 8.' },
    { question: 'Keliling lingkaran dengan jari-jari 7 cm (π = 22/7) adalah?', options: ['44 cm', '22 cm', '154 cm', '28 cm'], correct: 0, explanation: 'Keliling = 2πr = 2 × 22/7 × 7 = 44 cm.' },
    { question: 'Berapakah akar dari 81?', options: ['9', '8', '7', '6'], correct: 0, explanation: '9 × 9 = 81, sehingga √81 = 9.' },
    { question: 'Jika 2y - 3 = 7, maka y = ?', options: ['5', '10', '2', '8'], correct: 0, explanation: '2y = 7 + 3 = 10, sehingga y = 5.' },
  ],
  'bahasa-indonesia': [
    { question: 'Kalimat berikut yang merupakan kalimat efektif adalah?', options: ['Adik membaca buku di kamar.', 'Adik buku di kamar membaca.', 'Membaca adik buku di kamar.', 'Di kamar adik membaca buku yang.'] , correct: 0, explanation: 'Kalimat efektif memiliki susunan subjek-predikat yang jelas.' },
    { question: 'Sinonim dari kata "pandai" adalah?', options: ['cerdas', 'malas', 'bodoh', 'lambat'], correct: 0, explanation: 'Sinonim pandai adalah cerdas.' },
    { question: 'Kata "merah" termasuk kata...', options: ['sifat', 'kerja', 'benda', 'hubung'], correct: 0, explanation: 'Kata sifat (adjektiva) menyatakan sifat atau keadaan.' },
    { question: 'Awalan "ber-" pada kata "berlari" menunjukkan arti...', options: ['melakukan kegiatan', 'mempunyai', 'dibuat menjadi', 'bersifat'], correct: 0, explanation: 'Awalan ber- bermakna melakukan aktivitas/kegiatan.' },
    { question: 'Penulisan kalimat langsung yang benar adalah...', options: ['"Kapan kamu pulang?" tanya ibu.', '"Kapan kamu pulang"? tanya ibu.', 'Kapan kamu pulang, "tanya ibu."', '"Kapan kamu pulang" tanya, ibu.'] , correct: 0, explanation: 'Tanda kutip mengapit ucapan, lalu diikuti penulis tuturan.' },
    { question: 'Antonim dari kata "rajin" adalah...', options: ['malas', 'tekun', 'giat', 'sungguh-sungguh'], correct: 0, explanation: 'Antonim rajin adalah malas.' },
    { question: 'Paragraf yang kalimat utamanya di awal disebut paragraf...', options: ['deduktif', 'induktif', 'campuran', 'naratif'], correct: 0, explanation: 'Paragraf deduktif menempatkan kalimat utama di awal.' },
    { question: 'Kalimat tanya "Di mana kamu tinggal?" menanyakan...', options: ['tempat', 'waktu', 'orang', 'alasan'], correct: 0, explanation: 'Kata tanya "di mana" menanyakan tempat.' },
    { question: '"Kuda-kuda" dalam ungkapan berarti...', options: ['bersiap-siap', 'binatang', 'mainan', 'tempat'], correct: 0, explanation: 'Kuda-kuda berarti sikap bersiap atau posisi awal.' },
    { question: 'Lawan kata "boros" adalah...', options: ['hemat', 'kaya', 'sederhana', 'mewah'], correct: 0, explanation: 'Antonim boros adalah hemat.' },
  ],
  'bahasa-inggris': [
    { question: 'Choose the correct sentence:', options: ['She goes to school every day.', 'She go to school every day.', 'She going to school every day.', 'She gone to school every day.'], correct: 0, explanation: 'Dengan subjek tunggal "She", kata kerja diberi -s: goes.' },
    { question: 'The plural form of "child" is...', options: ['children', 'childs', 'childes', 'childrens'], correct: 0, explanation: 'Bentuk jamak child adalah children (irregular plural).' },
    { question: '"Book" dalam bahasa Indonesia berarti...', options: ['buku', 'pensil', 'meja', 'tas'], correct: 0, explanation: 'Book = buku.' },
    { question: 'Complete: "I ____ a student."', options: ['am', 'is', 'are', 'be'], correct: 0, explanation: 'Setelah "I" gunakan to be "am".' },
    { question: 'What is the synonym of "big"?', options: ['large', 'small', 'tiny', 'short'], correct: 0, explanation: 'Big = large (besar).' },
    { question: '"Yesterday" menunjukkan waktu...', options: ['masa lalu', 'masa kini', 'masa depan', 'abadi'], correct: 0, explanation: 'Yesterday = kemarin (past time).' },
    { question: 'Choose the correct question:', options: ['Are you ready?', 'You are ready?', 'Is you ready?', 'Am you ready?'], correct: 0, explanation: 'Pertanyaan dengan "you" menggunakan to be "are".' },
    { question: 'The antonym of "hot" is...', options: ['cold', 'warm', 'spicy', 'sunny'], correct: 0, explanation: 'Antonym of hot (panas) is cold (dingin).' },
    { question: 'Complete: "They ____ playing football now."', options: ['are', 'is', 'am', 'be'], correct: 0, explanation: 'Subjek jamak "They" menggunakan to be "are".' },
    { question: '"Happy" dalam bahasa Indonesia berarti...', options: ['bahagia', 'sedih', 'marah', 'takut'], correct: 0, explanation: 'Happy = bahagia.' },
  ],
  ipa: [
    { question: 'Sumber energi utama bagi makhluk hidup adalah...', options: ['Matahari', 'Bulan', 'Bintang', 'Bumi'], correct: 0, explanation: 'Matahari adalah sumber energi utama di bumi.' },
    { question: 'Perubahan wujud dari cair menjadi gas disebut...', options: ['menguap', 'mencair', 'membeku', 'mengembun'], correct: 0, explanation: 'Penguapan terjadi saat zat cair berubah menjadi gas.' },
    { question: 'Organ yang berfungsi memompa darah adalah...', options: ['jantung', 'paru-paru', 'lambung', 'ginjal'], correct: 0, explanation: 'Jantung memompa darah ke seluruh tubuh.' },
    { question: 'Hewan yang berkembang biak dengan cara melahirkan disebut...', options: ['vivipar', 'ovipar', 'ovovivipar', 'metamorfosis'], correct: 0, explanation: 'Vivipar = melahirkan (misal kucing, sapi).' },
    { question: 'Salah satu sumber energi terbarukan adalah...', options: ['angin', 'batu bara', 'minyak bumi', 'gas alam'], correct: 0, explanation: 'Angin termasuk energi terbarukan yang tidak habis.' },
    { question: 'Fotosintesis terjadi di bagian tumbuhan bernama...', options: ['daun', 'akar', 'batang', 'bunga'], correct: 0, explanation: 'Fotosintesis terjadi di klorofil daun.' },
    { question: 'Benda yang dapat menghantarkan panas dengan baik disebut...', options: ['konduktor', 'isolator', 'semiisolator', 'resistansi'], correct: 0, explanation: 'Konduktor contohnya logam seperti tembaga.' },
    { question: 'Satuan dari gaya adalah...', options: ['Newton', 'Joule', 'Watt', 'Pascal'], correct: 0, explanation: 'Gaya diukur dalam satuan Newton (N).' },
    { question: 'Proses pernapasan manusia membutuhkan gas...', options: ['oksigen', 'karbondioksida', 'nitrogen', 'hidrogen'], correct: 0, explanation: 'Manusia menghirup oksigen dan mengeluarkan karbondioksida.' },
    { question: 'Air yang mendidih pada suhu...', options: ['100°C', '0°C', '37°C', '50°C'], correct: 0, explanation: 'Air mendidih pada 100°C pada tekanan 1 atm.' },
  ],
  ips: [
    { question: 'Semboyan "Bhinneka Tunggal Ika" berarti...', options: ['Berbeda-beda tetapi tetap satu', 'Bersatu kita teguh', 'Satu untuk semua', 'Persatuan dan kesatuan'], correct: 0, explanation: 'Bhinneka Tunggal Ika artinya berbeda-beda tetapi tetap satu jua.' },
    { question: 'Gunung Merapi terletak di provinsi...', options: ['DI Yogyakarta', 'Jawa Barat', 'Jawa Timur', 'Sumatera Barat'], correct: 0, explanation: 'Gunung Merapi berada di perbatasan DI Yogyakarta dan Jawa Tengah.' },
    { question: 'Benua terbesar di dunia adalah...', options: ['Asia', 'Afrika', 'Eropa', 'Amerika'], correct: 0, explanation: 'Asia adalah benua terbesar.' },
    { question: 'Organisasi ASEAN didirikan pada tahun...', options: ['1967', '1945', '1955', '1980'], correct: 0, explanation: 'ASEAN berdiri pada 8 Agustus 1967 di Bangkok.' },
    { question: 'Mata uang negara Jepang adalah...', options: ['Yen', 'Won', 'Yuan', 'Ringgit'], correct: 0, explanation: 'Mata uang Jepang adalah Yen.' },
    { question: 'Proklamasi kemerdekaan Indonesia terjadi pada tanggal...', options: ['17 Agustus 1945', '28 Oktober 1928', '1 Juni 1945', '20 Mei 1908'], correct: 0, explanation: 'Proklamasi dibacakan 17 Agustus 1945.' },
    { question: 'Kegiatan ekonomi yang menghasilkan barang disebut...', options: ['produksi', 'distribusi', 'konsumsi', 'investasi'], correct: 0, explanation: 'Produksi adalah kegiatan menghasilkan barang/jasa.' },
    { question: 'Laut yang memisahkan Indonesia dengan Australia adalah...', options: ['Laut Arafura', 'Laut Jawa', 'Laut Cina Selatan', 'Laut Banda'], correct: 0, explanation: 'Laut Arafura memisahkan Indonesia (Papua) dengan Australia.' },
    { question: 'Ibukota negara Malaysia adalah...', options: ['Kuala Lumpur', 'Bangkok', 'Manila', 'Jakarta'], correct: 0, explanation: 'Ibukota Malaysia adalah Kuala Lumpur.' },
    { question: 'Lapisan atmosfer paling bawah adalah...', options: ['troposfer', 'stratosfer', 'mesosfer', 'termosfer'], correct: 0, explanation: 'Troposfer adalah lapisan terdekat dengan bumi.' },
  ],
  pemrograman: [
    { question: 'Tag HTML untuk judul terbesar adalah...', options: ['<h1>', '<h6>', '<title>', '<header>'], correct: 0, explanation: '<h1> adalah heading terbesar di HTML.' },
    { question: 'Output dari console.log(2 + 2) di JavaScript adalah...', options: ['4', '22', 'error', 'undefined'], correct: 0, explanation: 'Operator + menjumlahkan angka: 2 + 2 = 4.' },
    { question: 'Fungsi untuk menampilkan output di Python adalah...', options: ['print()', 'echo()', 'log()', 'write()'], correct: 0, explanation: 'Di Python gunakan print() untuk menampilkan output.' },
    { question: 'CSS digunakan untuk...', options: ['mengatur tampilan', 'menyimpan data', 'menghubungkan database', 'membuat logika'], correct: 0, explanation: 'CSS (Cascading Style Sheets) mengatur tampilan halaman web.' },
    { question: 'Variabel di JavaScript dideklarasikan dengan kata kunci...', options: ['let', 'var = 1', 'int', 'string'], correct: 0, explanation: 'let dan const adalah cara modern mendeklarasikan variabel di JS.' },
    { question: 'Struktur pengulangan di pemrograman disebut...', options: ['loop', 'if', 'function', 'array'], correct: 0, explanation: 'Loop (for/while) digunakan untuk mengulang kode.' },
    { question: 'Tipe data untuk teks di JavaScript adalah...', options: ['string', 'integer', 'boolean', 'float'], correct: 0, explanation: 'String menyimpan data teks.' },
    { question: 'Fungsi yang dipanggil otomatis saat halaman HTML dimuat di React adalah...', options: ['useEffect', 'useState', 'return', 'render'], correct: 0, explanation: 'useEffect dengan dependency [] berjalan saat komponen dimuat.' },
    { question: 'Bahasa markup untuk membuat struktur halaman web adalah...', options: ['HTML', 'Python', 'Java', 'SQL'], correct: 0, explanation: 'HTML adalah bahasa markup untuk struktur halaman.' },
    { question: 'Perintah untuk menyimpan data dalam array JavaScript...', options: ['push()', 'pop()', 'join()', 'split()'], correct: 0, explanation: 'push() menambahkan elemen di akhir array.' },
  ],
  'bahasa-asing': [
    { question: 'Kata "arigatou" dalam bahasa Jepang berarti...', options: ['terima kasih', 'selamat pagi', 'sampai jumpa', 'maaf'], correct: 0, explanation: 'Arigatou berarti terima kasih.' },
    { question: '"Bonjour" adalah sapaan dalam bahasa...', options: ['Prancis', 'Spanyol', 'Jerman', 'Italia'], correct: 0, explanation: 'Bonjour = selamat pagi/halo dalam bahasa Prancis.' },
    { question: 'Kata "danke" berasal dari bahasa...', options: ['Jerman', 'Jepang', 'Korea', 'Arab'], correct: 0, explanation: 'Danke = terima kasih dalam bahasa Jerman.' },
    { question: '"Annyeonghaseyo" berarti...', options: ['halo', 'terima kasih', 'maaf', 'selamat tinggal'], correct: 0, explanation: 'Annyeonghaseyo = halo/sapaan hormat dalam bahasa Korea.' },
    { question: '"Merci" dalam bahasa Indonesia berarti...', options: ['terima kasih', 'tolong', 'ya', 'tidak'], correct: 0, explanation: 'Merci = terima kasih (Prancis).' },
    { question: 'Kata "grazie" digunakan di negara...', options: ['Italia', 'Portugal', 'Belanda', 'Rusia'], correct: 0, explanation: 'Grazie = terima kasih dalam bahasa Italia.' },
    { question: '"Thank you" jika diucapkan dengan sopan dalam bahasa Jepang adalah...', options: ['arigatou gozaimasu', 'konnichiwa', 'sayounara', 'sumimasen'], correct: 0, explanation: 'Arigatou gozaimasu = bentuk sopan terima kasih.' },
    { question: '"Hola" adalah sapaan dalam bahasa...', options: ['Spanyol', 'Inggris', 'Jerman', 'Turki'], correct: 0, explanation: 'Hola = halo dalam bahasa Spanyol.' },
    { question: 'Kata "salamat" digunakan di negara...', options: ['Filipina', 'Thailand', 'Vietnam', 'Malaysia'], correct: 0, explanation: 'Salamat = terima kasih dalam bahasa Filipina (Tagalog).' },
    { question: '"Bitte" dalam bahasa Jerman berarti...', options: ['silahkan/permisi', 'terima kasih', 'selamat datang', 'sampai jumpa'], correct: 0, explanation: 'Bitte bisa berarti silakan, permisi, atau tolong.' },
  ],
  keterampilan: [
    { question: 'Langkah pertama dalam membuat usaha adalah...', options: ['menentukan ide usaha', 'membeli bahan', 'meminjam uang', 'menjual produk'], correct: 0, explanation: 'Ide usaha adalah awal dari semua kegiatan bisnis.' },
    { question: 'Dalam manajemen waktu, teknik Pomodoro menggunakan interval kerja...', options: ['25 menit', '1 jam', '10 menit', '5 menit'], correct: 0, explanation: 'Pomodoro: kerja 25 menit lalu istirahat 5 menit.' },
    { question: 'Kegiatan memperkenalkan produk kepada calon pembeli disebut...', options: ['promosi', 'produksi', 'distribusi', 'evaluasi'], correct: 0, explanation: 'Promosi adalah cara mengenalkan dan memasarkan produk.' },
    { question: 'Prinsip dasar desain yang mengatur keseimbangan visual adalah...', options: ['balance', 'contrast', 'repetition', 'alignment'], correct: 0, explanation: 'Balance (keseimbangan) mengatur distribusi elemen visual.' },
    { question: 'Cara terbaik menghadapi kegagalan adalah...', options: ['belajar dari kesalahan', 'menyerah', 'menyalahkan orang lain', 'menghindar'], correct: 0, explanation: 'Kegagalan adalah pembelajaran menuju keberhasilan.' },
    { question: 'Public speaking adalah keterampilan...', options: ['berbicara di depan umum', 'menulis laporan', 'menghitung cepat', 'menggambar'], correct: 0, explanation: 'Public speaking = berbicara di depan audiens.' },
    { question: 'Dalam bernegosiasi, tujuan utama adalah...', options: ['mencapai kesepakatan', 'menang sendiri', 'berdebat', 'mengalah'], correct: 0, explanation: 'Negosiasi bertujuan mencapai kesepakatan yang saling menguntungkan.' },
    { question: 'Modal utama seorang wirausaha adalah...', options: ['kemauan dan ide', 'uang banyak', 'mobil', 'karyawan'], correct: 0, explanation: 'Kemauan dan ide adalah modal awal yang paling penting.' },
    { question: 'Etika bekerja sama dalam tim menuntut...', options: ['saling menghargai', 'menang sendiri', 'boros bicara', 'diam saja'], correct: 0, explanation: 'Saling menghargai membuat kerja sama tim berjalan baik.' },
    { question: 'Keterampilan menyusun anggaran disebut...', options: ['literasi keuangan', 'literasi digital', 'literasi membaca', 'literasi sains'], correct: 0, explanation: 'Mengelola uang dan anggaran termasuk literasi keuangan.' },
  ],
};

const DEFAULT_BANK: QuestionSeed[] = [
  { question: 'Apa inti utama dari konsep "{topic}"?', options: ['Definisi dan penerapan yang benar', 'Definisi yang keliru', 'Hal yang tidak berkaitan', 'Opini tanpa dasar'], correct: 0, explanation: 'Inti konsep "{topic}" adalah definisi dan penerapannya yang tepat.' },
  { question: 'Manfaat utama mempelajari "{topic}" adalah...', options: ['menambah wawasan dan keterampilan', 'membuang waktu', 'tidak berguna', 'sekadar formalitas'], correct: 0, explanation: 'Mempelajari "{topic}" bermanfaat menambah wawasan dan keterampilan.' },
  { question: 'Contoh penerapan "{topic}" dalam kehidupan sehari-hari adalah...', options: ['Contoh yang relevan dan nyata', 'Contoh yang tidak berhubungan', 'Contoh yang keliru', 'Tidak ada contoh'], correct: 0, explanation: 'Penerapan "{topic}" terlihat dari contoh nyata di sekitar kita.' },
  { question: 'Cara terbaik memahami "{topic}" adalah...', options: ['belajar bertahap dan berlatih', 'menghafal tanpa mengerti', 'menonton tanpa praktik', 'menunda terus'], correct: 0, explanation: 'Belajar bertahap disertai latihan adalah cara efektif.' },
  { question: 'Kesalahan umum dalam belajar "{topic}" adalah...', options: ['tidak membaca ulang materi', 'sering berlatih', 'bertanya saat bingung', 'membuat catatan'], correct: 0, explanation: 'Tidak mengulang materi adalah kesalahan umum pelajar.' },
  { question: 'Materi "{topic}" biasanya dikaitkan dengan...', options: ['konsep yang berhubungan erat', 'hal yang tidak relevan', 'hal yang bertentangan', 'topik acak'], correct: 0, explanation: 'Setiap topik saling berkaitan dengan konsep pendukungnya.' },
];

export function generateSubjectTemplate(subject: string, topic: string, count: number): TemplateQuestion[] {
  const bank = BANKS[subject] ?? DEFAULT_BANK;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, bank.length));

  return selected.map((t, i) => {
    const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    const options = order.map((o) => t.options[o]);
    return {
      id: i,
      question: t.question.replaceAll('{topic}', topic),
      options,
      correct: order.indexOf(t.correct),
      explanation: t.explanation.replaceAll('{topic}', topic),
    };
  });
}
