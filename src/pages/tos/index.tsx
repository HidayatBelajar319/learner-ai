import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="text-center">
        <span className="text-5xl">📜</span>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Syarat & Ketentuan</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Terakhir diperbarui: 30 Juli 2026</p>
      </div>

      <div className="card space-y-6">
        <Section title="1. Penerimaan Ketentuan">
          Dengan mengakses dan menggunakan platform Learner AI ("Layanan"), Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju, jangan gunakan Layanan.
        </Section>

        <Section title="2. Deskripsi Layanan">
          Learner AI adalah platform pembelajaran berbasis AI yang menyediakan materi belajar, quiz, flashcards, dan fitur interaktif lainnya untuk mendukung proses belajar mandiri.
        </Section>

        <Section title="3. Akun Pengguna">
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li>Anda bertanggung jawab penuh atas keamanan akun dan password Anda.</li>
            <li>Anda harus memberikan informasi yang akurat saat mendaftar.</li>
            <li>Kami berhak menonaktifkan akun jika ditemukan pelanggaran.</li>
            <li>Pengguna dengan email <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">@sd.belajar.id</code> mendapatkan fitur tambahan secara otomatis.</li>
          </ul>
        </Section>

        <Section title="4. Penggunaan yang Diizinkan">
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li>Mengakses materi pembelajaran untuk tujuan belajar pribadi.</li>
            <li>Tidak menyalahgunakan fitur AI untuk konten ilegal.</li>
            <li>Tidak mencoba merusak atau mengganggu sistem.</li>
            <li>Menghormati hak cipta dan kekayaan intelektual.</li>
          </ul>
        </Section>

        <Section title="5. Pembatasan Tanggung Jawab">
          Layanan disediakan "apa adanya" tanpa jaminan apapun. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan Layanan, termasuk namun tidak terbatas pada kehilangan data atau gangguan belajar.
        </Section>

        <Section title="6. Perubahan Ketentuan">
          Kami dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Pengguna akan diberitahu melalui email atau notifikasi di platform.
        </Section>

        <Section title="7. Kontak">
          Untuk pertanyaan mengenai Syarat & Ketentuan, hubungi: <a href="mailto:hidayat3911@sd.belajar.id" className="text-primary-500 hover:underline">hidayat3911@sd.belajar.id</a>
        </Section>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Baca juga <Link to="/privacy" className="text-primary-500 hover:underline">Kebijakan Privasi</Link>
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
