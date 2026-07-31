import { useState, useEffect } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';
import MindMapViewer, { MindMapNode } from '@/components/visual/mind-map-viewer';
import DiagramViewer from '@/components/visual/diagram-viewer';

interface SavedMindMap {
  id: string;
  title: string;
  topic: string | null;
  nodes: MindMapNode[];
  created_at: string;
}

interface SavedDiagram {
  id: string;
  title: string;
  description: string | null;
  type: string;
  mermaid: string;
  created_at: string;
}

const levels = [
  { value: '', label: 'Semua level' },
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA' },
  { value: 'Pemula', label: 'Pemula' },
  { value: 'Menengah', label: 'Menengah' },
  { value: 'Mahir', label: 'Mahir' },
];

const diagramTypes = [
  { value: 'flowchart', label: 'Flowchart' },
  { value: 'sequence', label: 'Sequence Diagram' },
  { value: 'mindmap', label: 'Mind Map (Mermaid)' },
  { value: 'class', label: 'Class Diagram' },
  { value: 'state', label: 'State Diagram' },
  { value: 'er', label: 'ER Diagram' },
  { value: 'gantt', label: 'Gantt Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'journey', label: 'User Journey' },
  { value: 'git', label: 'Git Graph' },
];

export default function Visual() {
  const { token } = useAuthStore();
  const [tab, setTab] = useState<'mindmap' | 'diagram'>('mindmap');

  const [mmTopic, setMmTopic] = useState('');
  const [mmLevel, setMmLevel] = useState('');
  const [mmGenerating, setMmGenerating] = useState(false);
  const [mmTitle, setMmTitle] = useState('');
  const [mmNodes, setMmNodes] = useState<MindMapNode[]>([]);
  const [mmSaved, setMmSaved] = useState<SavedMindMap[]>([]);

  const [dgDescription, setDgDescription] = useState('');
  const [dgType, setDgType] = useState('flowchart');
  const [dgTitle, setDgTitle] = useState('');
  const [dgGenerating, setDgGenerating] = useState(false);
  const [dgCode, setDgCode] = useState('');
  const [dgResultTitle, setDgResultTitle] = useState('');
  const [dgResultType, setDgResultType] = useState('flowchart');
  const [dgSaved, setDgSaved] = useState<SavedDiagram[]>([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const refreshSaved = async () => {
    if (!token) return;
    try {
      const [mm, dg] = await Promise.all([
        api.get<{ success: boolean; data: SavedMindMap[] }>('/visual/mind-maps', token),
        api.get<{ success: boolean; data: SavedDiagram[] }>('/visual/diagrams', token),
      ]);
      if (mm.success) setMmSaved(mm.data);
      if (dg.success) setDgSaved(dg.data);
    } catch {
      // abaikan error list
    }
  };

  useEffect(() => {
    refreshSaved();
  }, [token]);

  const generateMindMap = async () => {
    if (!mmTopic.trim()) {
      setError('Topik wajib diisi');
      return;
    }
    setMmGenerating(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post<{ success: boolean; data: any }>('/visual/mind-maps/generate', { topic: mmTopic, level: mmLevel }, token);
      if (res.success) {
        setMmTitle(res.data.title);
        setMmNodes(res.data.nodes);
        setMessage('Mind map berhasil dibuat.');
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal membuat mind map');
    } finally {
      setMmGenerating(false);
    }
  };

  const saveMindMap = async () => {
    if (mmNodes.length === 0) return;
    setSaving(true);
    setError('');
    try {
      const res = await api.post<{ success: boolean }>('/visual/mind-maps', { title: mmTitle, topic: mmTopic, nodes: mmNodes }, token);
      if (res.success) {
        setMessage('Mind map disimpan.');
        await refreshSaved();
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const deleteMindMap = async (id: string) => {
    await api.delete(`/visual/mind-maps/${id}`, token);
    await refreshSaved();
  };

  const loadMindMap = (m: SavedMindMap) => {
    setMmTitle(m.title);
    setMmNodes(m.nodes);
    setMmTopic(m.topic || '');
    setMessage(`Mind map "${m.title}" dimuat.`);
  };

  const generateDiagram = async () => {
    if (!dgDescription.trim()) {
      setError('Deskripsi wajib diisi');
      return;
    }
    setDgGenerating(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post<{ success: boolean; data: any }>('/visual/diagrams/generate', { description: dgDescription, type: dgType, title: dgTitle || undefined }, token);
      if (res.success) {
        setDgCode(res.data.mermaid);
        setDgResultTitle(res.data.title);
        setDgResultType(res.data.type);
        setMessage('Diagram berhasil dibuat.');
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal membuat diagram');
    } finally {
      setDgGenerating(false);
    }
  };

  const saveDiagram = async () => {
    if (!dgCode.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await api.post<{ success: boolean }>('/visual/diagrams', { title: dgResultTitle || dgTitle || dgDescription.slice(0, 60), description: dgDescription, type: dgResultType, mermaid: dgCode }, token);
      if (res.success) {
        setMessage('Diagram disimpan.');
        await refreshSaved();
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const deleteDiagram = async (id: string) => {
    await api.delete(`/visual/diagrams/${id}`, token);
    await refreshSaved();
  };

  const loadDiagram = (d: SavedDiagram) => {
    setDgCode(d.mermaid);
    setDgResultTitle(d.title);
    setDgResultType(d.type);
    setDgDescription(d.description || '');
    setMessage(`Diagram "${d.title}" dimuat.`);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(dgCode);
      setMessage('Kode mermaid disalin.');
    } catch {
      setError('Gagal menyalin kode.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fitur Visual</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Buat mind map dan diagram pembelajaran dengan bantuan AI. Hasil bisa disimpan dan dibuka kembali.
        </p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {[
          { key: 'mindmap' as const, label: '🧠 Mind Map' },
          { key: 'diagram' as const, label: '📊 Diagram' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setError('');
              setMessage('');
            }}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-primary-500 text-primary-700 dark:text-primary-300'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

      {tab === 'mindmap' ? (
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generate Mind Map</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Topik</label>
                <input
                  value={mmTopic}
                  onChange={(e) => setMmTopic(e.target.value)}
                  placeholder="Contoh: Sistem Pencernaan Manusia"
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
                <select value={mmLevel} onChange={(e) => setMmLevel(e.target.value)} className="input">
                  {levels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={generateMindMap} disabled={mmGenerating} className="btn-primary">
              {mmGenerating ? 'Membuat mind map...' : 'Generate Mind Map'}
            </button>
          </div>

          {mmNodes.length > 0 && (
            <div className="card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{mmTitle}</h2>
                <div className="flex gap-2">
                  <button onClick={saveMindMap} disabled={saving} className="btn-primary">
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button onClick={() => { setMmNodes([]); setMmTitle(''); }} className="btn-secondary">
                    Tutup
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Klik node untuk menciutkan / membuka cabang.</p>
              <MindMapViewer rootLabel={mmTitle} nodes={mmNodes} />
            </div>
          )}

          {mmSaved.length > 0 && (
            <div className="card">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Mind Map Tersimpan</h2>
              <div className="space-y-2">
                {mmSaved.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800">
                    <button onClick={() => loadMindMap(m)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{m.title}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {m.topic || 'Tanpa topik'} · {new Date(m.created_at).toLocaleString('id-ID')}
                      </p>
                    </button>
                    <button onClick={() => deleteMindMap(m.id)} className="shrink-0 text-sm text-red-600 hover:text-red-700 dark:text-red-400">
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generate Diagram</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi diagram</label>
                <textarea
                  value={dgDescription}
                  onChange={(e) => setDgDescription(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Alur login pengguna di aplikasi Learner AI dari mulai buka halaman sampai masuk dashboard"
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis diagram</label>
                <select value={dgType} onChange={(e) => setDgType(e.target.value)} className="input">
                  {diagramTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul (opsional)</label>
                <input
                  value={dgTitle}
                  onChange={(e) => setDgTitle(e.target.value)}
                  placeholder="Contoh: Alur Login"
                  className="input"
                />
              </div>
            </div>
            <button onClick={generateDiagram} disabled={dgGenerating} className="btn-primary">
              {dgGenerating ? 'Membuat diagram...' : 'Generate Diagram'}
            </button>
          </div>

          {dgCode && (
            <div className="card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dgResultTitle}</h2>
                <div className="flex gap-2">
                  <button onClick={saveDiagram} disabled={saving} className="btn-primary">
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button onClick={copyCode} className="btn-secondary">Salin Kode</button>
                </div>
              </div>
              <DiagramViewer code={dgCode} />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Kode Mermaid</label>
                <textarea
                  value={dgCode}
                  onChange={(e) => setDgCode(e.target.value)}
                  rows={8}
                  spellCheck={false}
                  className="input font-mono text-xs"
                />
              </div>
            </div>
          )}

          {dgSaved.length > 0 && (
            <div className="card">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Diagram Tersimpan</h2>
              <div className="space-y-2">
                {dgSaved.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800">
                    <button onClick={() => loadDiagram(d)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{d.title}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {d.type} · {new Date(d.created_at).toLocaleString('id-ID')}
                      </p>
                    </button>
                    <button onClick={() => deleteDiagram(d.id)} className="shrink-0 text-sm text-red-600 hover:text-red-700 dark:text-red-400">
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
