import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

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
  issued_at: string;
  parsed: CertData;
}

const subjects = [
  { value: '', label: 'Semua' },
  { value: 'mathematics', label: 'Matematika' },
  { value: 'bahasa-indonesia', label: 'Bahasa Indonesia' },
  { value: 'bahasa-inggris', label: 'Bahasa Inggris' },
  { value: 'ipa', label: 'IPA' },
  { value: 'ips', label: 'IPS' },
  { value: 'pemrograman', label: 'Pemrograman' },
  { value: 'pendidikan-agama', label: 'Pendidikan Agama dan Budi Pekerti' },
  { value: 'pancasila', label: 'Pendidikan Pancasila' },
  { value: 'pjok', label: 'PJOK' },
  { value: 'informatika', label: 'Informatika' },
  { value: 'seni-budaya', label: 'Seni dan Budaya' },
  { value: 'prakarya', label: 'Prakarya' },
  { value: 'sejarah', label: 'Sejarah' },
  { value: 'kewirausahaan', label: 'Kreatif dan Kewirausahaan' },
];

const typeLabels: Record<string, string> = {
  completion: 'Completion',
  achievement: 'Achievement',
  mastery: 'Mastery',
};

function subjectLabel(value: string): string {
  return subjects.find(s => s.value === value)?.label || value || '';
}

export default function Certificates() {
  const { token } = useAuthStore();
  const [certs, setCerts] = useState<CertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genForm, setGenForm] = useState({ type: 'completion', title: '', subject: '' });
  const [genLoading, setGenLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [preview, setPreview] = useState<CertRecord | null>(null);
  const [editing, setEditing] = useState<CertRecord | null>(null);
  const [editForm, setEditForm] = useState({ title: '', type: 'completion', subject: '', full_name: '', level: 1, total_xp: 0 });
  const [editLoading, setEditLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const previewRef = useRef<HTMLDivElement>(null);

  const loadCerts = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (typeFilter) params.set('category', typeFilter);
      const qs = params.toString();
      const res: any = await api.get(`/learning/certificates${qs ? `?${qs}` : ''}`, token);
      if (res.success) setCerts(res.data);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat sertifikat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCerts(); }, [token, search, typeFilter]);

  const generate = async () => {
    if (!genForm.title.trim()) return;
    setGenLoading(true);
    setError('');
    try {
      const res: any = await api.post('/learning/certificates/generate', genForm, token);
      if (res.success) {
        setMessage('Sertifikat berhasil dibuat.');
        await loadCerts();
        setShowGenerate(false);
        setGenForm({ type: 'completion', title: '', subject: '' });
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal membuat sertifikat');
    } finally {
      setGenLoading(false);
    }
  };

  const duplicateCert = async (cert: CertRecord) => {
    try {
      const res: any = await api.post(`/learning/certificates/${cert.id}/duplicate`, undefined, token);
      if (res.success) {
        setMessage(`Sertifikat "${res.data.title}" diduplikasi sebagai template.`);
        await loadCerts();
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal menduplikasi');
    }
  };

  const deleteCert = async (cert: CertRecord) => {
    if (!confirm(`Hapus sertifikat "${cert.parsed.title}"?`)) return;
    try {
      await api.delete(`/learning/certificates/${cert.id}`, token);
      setMessage('Sertifikat dihapus.');
      await loadCerts();
    } catch (e: any) {
      setError(e?.message || 'Gagal menghapus');
    }
  };

  const openEdit = (cert: CertRecord) => {
    setEditing(cert);
    setEditForm({
      title: cert.parsed.title,
      type: cert.parsed.type || 'completion',
      subject: cert.parsed.subject || '',
      full_name: cert.parsed.full_name || '',
      level: cert.parsed.level || 1,
      total_xp: cert.parsed.total_xp || 0,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!editForm.title.trim()) {
      setError('Judul tidak boleh kosong');
      return;
    }
    setEditLoading(true);
    setError('');
    try {
      const data = {
        ...editing.parsed,
        title: editForm.title.trim(),
        type: editForm.type,
        subject: editForm.subject,
        full_name: editForm.full_name.trim(),
        level: Number(editForm.level) || 1,
        total_xp: Number(editForm.total_xp) || 0,
      };
      await api.put(`/learning/certificates/${editing.id}`, { title: editForm.title.trim(), type: editForm.type, subject: editForm.subject, data }, token);
      setMessage('Sertifikat diperbarui.');
      setEditing(null);
      await loadCerts();
    } catch (e: any) {
      setError(e?.message || 'Gagal memperbarui');
    } finally {
      setEditLoading(false);
    }
  };

  const exportPng = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${(preview?.parsed.title || 'sertifikat').replace(/[^\w\- ]+/g, '').trim()}.png`;
      a.click();
      setMessage('Sertifikat diunduh sebagai PNG.');
    } catch {
      setError('Gagal mengunduh PNG');
    } finally {
      setExporting(false);
    }
  };

  const exportPdf = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, cacheBust: true });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1123, 794], hotfixes: ['px_scaling'] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 1123, 794);
      pdf.save(`${(preview?.parsed.title || 'sertifikat').replace(/[^\w\- ]+/g, '').trim()}.pdf`);
      setMessage('Sertifikat diunduh sebagai PDF.');
    } catch {
      setError('Gagal mengunduh PDF');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sertifikat</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sertifikat pencapaian belajarmu</p>
        </div>
        <button onClick={() => setShowGenerate(true)} className="btn-primary">+ Sertifikat Baru</button>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

      <div className="card flex flex-wrap items-center gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul sertifikat..." className="input flex-1 min-w-[200px]" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input">
          <option value="">Semua tipe</option>
          <option value="completion">Completion</option>
          <option value="achievement">Achievement</option>
          <option value="mastery">Mastery</option>
        </select>
      </div>

      {showGenerate && (
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buat Sertifikat Baru</h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
            <input value={genForm.title} onChange={e => setGenForm(p => ({...p, title: e.target.value}))} className="input" placeholder="Contoh: Penyelesaian Aljabar Dasar" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
                {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
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
            <div key={cert.id} className="card group">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏆</span>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">{cert.parsed.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 capitalize">{typeLabels[cert.parsed.type] || cert.parsed.type}</p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    {new Date(cert.issued_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setPreview(cert)} className="btn-secondary text-xs">Lihat</button>
                <button onClick={() => duplicateCert(cert)} className="btn-secondary text-xs">Duplikat</button>
                <button onClick={() => openEdit(cert)} className="btn-secondary text-xs">Edit</button>
                <button onClick={() => deleteCert(cert)} className="btn-secondary text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-4 shadow-xl dark:bg-gray-900" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pratinjau Sertifikat</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={exportPng} disabled={exporting} className="btn-secondary text-xs">🖼 Download PNG</button>
                <button onClick={exportPdf} disabled={exporting} className="btn-secondary text-xs">📄 Download PDF</button>
                <button onClick={() => setPreview(null)} className="btn-primary text-xs">Tutup</button>
              </div>
            </div>
            <div className="flex justify-center rounded bg-gray-100 p-4 dark:bg-gray-800">
              <div
                ref={previewRef}
                className="relative w-[720px] max-w-full overflow-hidden bg-white p-10 text-center shadow-lg"
                style={{ aspectRatio: '1123 / 794' }}
              >
                <div className="absolute inset-3 rounded border-[6px] border-primary-500" />
                <div className="absolute inset-6 rounded border border-primary-300" />
                <div className="relative flex h-full flex-col items-center justify-center gap-3">
                  <span className="text-5xl">🏆</span>
                  <h1 className="text-3xl font-bold tracking-wide text-primary-600">SERTIFIKAT</h1>
                  <p className="text-sm text-gray-500">{preview.parsed.title}</p>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Diberikan kepada</p>
                  <p className="text-3xl font-bold text-gray-900">{preview.parsed.full_name}</p>
                  {preview.parsed.subject && (
                    <p className="text-sm text-gray-600">{subjectLabel(preview.parsed.subject)}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Level {preview.parsed.level} · {preview.parsed.total_xp} Total XP
                  </p>
                  <div className="mt-2 flex w-full items-end justify-between px-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Diterbitkan</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(preview.parsed.issued_at).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-serif text-xl italic text-gray-800">{preview.parsed.full_name}</p>
                      <div className="mt-1 border-t border-gray-400 px-6" />
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">Penerima</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Sertifikat</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
              <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="input" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
                <select value={editForm.type} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))} className="input">
                  <option value="completion">Completion</option>
                  <option value="achievement">Achievement</option>
                  <option value="mastery">Mastery</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mata Pelajaran</label>
                <select value={editForm.subject} onChange={e => setEditForm(p => ({ ...p, subject: e.target.value }))} className="input">
                  {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Penerima</label>
                <input value={editForm.full_name} onChange={e => setEditForm(p => ({ ...p, full_name: e.target.value }))} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
                  <input type="number" min={1} value={editForm.level} onChange={e => setEditForm(p => ({ ...p, level: Number(e.target.value) || 1 }))} className="input" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Total XP</label>
                  <input type="number" min={0} value={editForm.total_xp} onChange={e => setEditForm(p => ({ ...p, total_xp: Number(e.target.value) || 0 }))} className="input" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={editLoading} className="btn-primary flex-1">
                {editLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-secondary">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
