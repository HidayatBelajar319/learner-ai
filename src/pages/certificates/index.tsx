import { useState, useEffect } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface CertData {
  id: string;
  type: string;
  title: string;
  subject?: string;
  full_name: string;
  level: number;
  total_xp: number;
  issued_at: string;
}

interface CertRecord {
  id: string;
  type: string;
  title: string;
  data: string;
  issued_at: string;
}

const subjects = [
  { value: 'mathematics', label: 'Matematika' },
  { value: 'bahasa-indonesia', label: 'Bahasa Indonesia' },
  { value: 'bahasa-inggris', label: 'Bahasa Inggris' },
  { value: 'ipa', label: 'IPA' },
  { value: 'ips', label: 'IPS' },
  { value: 'pemrograman', label: 'Pemrograman' },
];

export default function Certificates() {
  const { token } = useAuthStore();
  const [certs, setCerts] = useState<CertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genForm, setGenForm] = useState({ type: 'completion', title: '', subject: '' });
  const [genLoading, setGenLoading] = useState(false);
  const [preview, setPreview] = useState<CertData | null>(null);

  const loadCerts = async () => {
    if (!token) return;
    try {
      const res: any = await api.get('/learning/certificates', token);
      if (res.success) setCerts(res.data.map((c: CertRecord) => JSON.parse(c.data)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCerts(); }, [token]);

  const generate = async () => {
    if (!genForm.title.trim()) return;
    setGenLoading(true);
    try {
      const res: any = await api.post('/learning/certificates/generate', genForm, token);
      if (res.success) {
        await loadCerts();
        setShowGenerate(false);
        setGenForm({ type: 'completion', title: '', subject: '' });
      }
    } finally {
      setGenLoading(false);
    }
  };

  const handlePrint = (cert: CertData) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>${cert.title}</title>
      <style>
        body { font-family: 'Georgia', serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f3f4f6; }
        .cert { width: 800px; padding: 60px; background: white; border: 8px solid #4F46E5; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #4F46E5; font-size: 32px; margin-top: 0; }
        .subtitle { color: #6b7280; font-size: 14px; margin: 8px 0; }
        .name { font-size: 28px; font-weight: bold; margin: 24px 0; color: #111827; }
        .detail { color: #4b5563; font-size: 16px; margin: 12px 0; }
        .footer { margin-top: 40px; color: #9ca3af; font-size: 12px; }
      </style></head><body>
      <div class="cert">
        <h1>🏆 Sertifikat</h1>
        <p class="subtitle">${cert.title}</p>
        <div class="name">${cert.full_name}</div>
        <p class="detail">Level ${cert.level} &middot; ${cert.total_xp} Total XP</p>
        ${cert.subject ? `<p class="detail">${subjects.find(s => s.value === cert.subject)?.label || cert.subject}</p>` : ''}
        <p class="detail">Diterbitkan: ${new Date(cert.issued_at).toLocaleDateString('id-ID')}</p>
        <div class="footer">Learner AI &mdash; Platform Pembelajaran Berbasis AI</div>
      </div>
      </body></html>
    `);
    win.document.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sertifikat</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sertifikat pencapaian belajarmu</p>
        </div>
        <button onClick={() => setShowGenerate(true)} className="btn-primary">+ Sertifikat Baru</button>
      </div>

      {showGenerate && (
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buat Sertifikat Baru</h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
            <input value={genForm.title} onChange={e => setGenForm(p => ({...p, title: e.target.value}))} className="input" placeholder="Contoh: Penyelesaian Aljabar Dasar" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
            <select value={genForm.type} onChange={e => setGenForm(p => ({...p, type: e.target.value}))} className="input">
              <option value="completion">Completion</option>
              <option value="achievement">Achievement</option>
              <option value="mastery">Mastery</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mata Pelajaran (opsional)</label>
            <select value={genForm.subject} onChange={e => setGenForm(p => ({...p, subject: e.target.value}))} className="input">
              <option value="">Pilih...</option>
              {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={generate} disabled={genLoading} className="btn-primary flex-1">
              {genLoading ? 'Membuat...' : 'Buat Sertifikat'}
            </button>
            <button onClick={() => setShowGenerate(false)} className="btn-secondary">Batal</button>
          </div>
        </div>
      )}

      {certs.length === 0 ? (
        <div className="text-center pt-12">
          <span className="text-5xl">🏆</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Belum ada sertifikat</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Selesaikan pembelajaran untuk mendapatkan sertifikat</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {certs.map(cert => (
            <div key={cert.id} className="card">
              <span className="text-4xl">🏆</span>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{cert.title}</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 capitalize">{cert.type}</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {new Date(cert.issued_at).toLocaleDateString('id-ID')}
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setPreview(cert)} className="btn-secondary flex-1 text-xs">Lihat</button>
                <button onClick={() => handlePrint(cert)} className="btn-primary flex-1 text-xs">Cetak</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreview(null)}>
          <div className="w-full max-w-2xl rounded-xl bg-white p-8 text-center shadow-xl dark:bg-gray-900" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-primary-500">🏆 Sertifikat</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{preview.title}</p>
            <p className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">{preview.full_name}</p>
            <p className="mt-4 text-gray-500">Level {preview.level} &middot; {preview.total_xp} Total XP</p>
            {preview.subject && <p className="text-gray-500">{subjects.find(s => s.value === preview.subject)?.label || preview.subject}</p>}
            <p className="mt-2 text-sm text-gray-400">Diterbitkan: {new Date(preview.issued_at).toLocaleDateString('id-ID')}</p>
            <div className="mt-8 flex gap-3 justify-center">
              <button onClick={() => handlePrint(preview)} className="btn-primary">Cetak</button>
              <button onClick={() => setPreview(null)} className="btn-secondary">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
