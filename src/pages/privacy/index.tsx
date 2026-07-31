import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Kebijakan Privasi</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Terakhir diperbarui: 30 Juli 2026</p>
      </div>

      <div className="card space-y-6">
        <Section title="1. Informasi yang Kami Kumpulkan">
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li><strong>Informasi Akun:</strong> nama lengkap, email, username, password (dienkripsi).</li>
            <li><strong>Data Pembelajaran:</strong> progres belajar, nilai quiz, aktivitas flashcards, sertifikat.</li>
            <li><strong>Data Penggunaan:</strong> halaman yang dikunjungi, fitur yang digunakan.</li>
            <li><strong>Informasi Perangkat:</strong> browser, sistem operasi, alamat IP (anonim).</li>
          </ul>
        </Section>

        <Section title="2. Penggunaan Informasi">
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li>Menyediakan dan meningkatkan layanan pembelajaran.</li>
            <li>Personalisasi pengalaman belajar berdasarkan AI.</li>
            <li>Mengirim notifikasi terkait aktivitas belajar.</li>
            <li>Menganalisis penggunaan untuk pengembangan fitur.</li>
            <li>Keamanan akun dan pencegahan penyalahgunaan.</li>
          </ul>
        </Section>

        <Section title="3. Penyimpanan & Keamanan Data">
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li>Data disimpan di server Cloudflare yang aman (D1 Database & KV).</li>
            <li>Password dienkripsi menggunakan bcrypt hash.</li>
            <li>Token 2FA (TOTP) menggunakan algoritma HMAC-SHA1.</li>
            <li>Kami tidak pernah menjual data pengguna ke pihak ketiga.</li>
          </ul>
        </Section>

        <Section title="4. API Key & BYOK">
          Jika Anda menyimpan API key sendiri (Bring Your Own Key), key tersebut disimpan dalam database terenkripsi dan hanya digunakan untuk permintaan AI atas nama Anda. Kami tidak membagikan API key Anda ke siapapun.
        </Section>

        <Section title="5. Cookies">
          Kami menggunakan cookie autentikasi untuk menjaga sesi login. Cookie ini tidak digunakan untuk pelacakan iklan.
        </Section>

        <Section title="6. Hak Pengguna">
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li>Mengakses data pribadi Anda kapan saja.</li>
            <li>Memperbarui atau mengubah informasi akun.</li>
            <li>Menghapus akun dan seluruh data terkait.</li>
            <li>Menonaktifkan notifikasi kapan saja.</li>
          </ul>
        </Section>

        <Section title="7. Kontak">
          Untuk pertanyaan mengenai Kebijakan Privasi, hubungi: <a href="mailto:hidayat3911@sd.belajar.id" className="text-primary-500 hover:underline">hidayat3911@sd.belajar.id</a>
        </Section>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Baca juga <Link to="/tos" className="text-primary-500 hover:underline">Syarat & Ketentuan</Link>
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{children}</div>
    </div>
  );
}
