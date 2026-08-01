import { useState } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { useUiStore } from '@/contexts/ui-settings-store';
import { api } from '@/lib/api';

interface UiOChange {
  key: string;
  label: string;
  value: string;
}

interface UiOProposal {
  summary: string;
  changes: UiOChange[];
  new_pages: Array<{ title: string; icon: string; content: string }>;
  provider?: string;
  model?: string;
}

const CHANGE_LABELS: Record<string, { label: string; desc: string }> = {
  accent: { label: 'Warna aksen', desc: 'Warna tombol & sorotan aktif di seluruh aplikasi' },
  sidebar_bg: { label: 'Latar sidebar', desc: 'Warna latar menu sidebar' },
  sidebar_text: { label: 'Teks sidebar', desc: 'Warna teks menu sidebar' },
  font: { label: 'Font aplikasi', desc: 'Jenis huruf utama aplikasi' },
  radius: { label: 'Sudut membulat', desc: 'Pembulatan sudut elemen (px)' },
};

export default function UiEditorPage() {
  const { token } = useAuthStore();
  const { settings, pages, saveSettings, addPage, removePage, load } = useUiStore();

  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [proposal, setProposal] = useState<UiOProposal | null>(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) {
      setError('Tuliskan perubahan UI yang kamu inginkan');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    setApplied(false);
    try {
      const res = await api.post<{ success: boolean; data: UiOProposal }>('/ui/design', {
        prompt,
        current: {
          accent: settings.accent,
          sidebar_bg: settings.sidebar_bg,
          sidebar_text: settings.sidebar_text,
          font: settings.font,
          radius: settings.radius,
          pages: pages.map((p) => ({ title: p.title })),
        },
      }, token);
      if (res.success) {
        setProposal(res.data);
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal membuat usulan UI');
    } finally {
      setBusy(false);
    }
  };

  const applyProposal = async () => {
    if (!proposal) return;
    setBusy(true);
    setError('');
    try {
      const themePatch: any = {};
      proposal.changes.forEach((ch) => {
        if (ch.key === 'accent') themePatch.accent = ch.value;
        if (ch.key === 'sidebar_bg') themePatch.sidebar_bg = ch.value;
        if (ch.key === 'sidebar_text') themePatch.sidebar_text = ch.value;
        if (ch.key === 'font') themePatch.font = ch.value;
        if (ch.key === 'radius') themePatch.radius = Number(ch.value) || settings.radius;
      });
      if (Object.keys(themePatch).length > 0) {
        await saveSettings(token, themePatch);
      }
      for (const p of proposal.new_pages) {
        await addPage(token, p);
      }
      setMessage('Perubahan UI berhasil diterapkan. Periksa sidebar dan tema aplikasi!');
      setProposal(null);
      setApplied(true);
      setPrompt('');
    } catch (e: any) {
      setError(e?.message || 'Gagal menerapkan perubahan');
    } finally {
      setBusy(false);
    }
  };

  const resetAll = async () => {
    if (!confirm('Kembalikan semua pengaturan UI ke default?')) return;
    await saveSettings(token, { accent: '#4F46E5', sidebar_bg: '#ffffff', sidebar_text: '#374151', font: 'Inter', radius: 12 });
    for (const p of pages) {
      try { await removePage(token, p.id); } catch { /* abaikan */ }
    }
    setMessage('Pengaturan UI dikembalikan ke default.');
    await load(token);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI UI Editor</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Minta AI mengubah tampilan aplikasi: warna aksen, warna sidebar, font, hingga menambahkan halaman & menu baru. Tinjau dulu sebelum diterapkan.
        </p>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

      {/* Status saat ini */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tema saat ini</h2>
          <button onClick={resetAll} className="text-xs font-medium text-red-500 hover:underline">↺ Atur Ulang</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <span className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700" style={{ backgroundColor: settings.accent }} />
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Warna aksen</p>
              <p className="text-xs text-gray-400">{settings.accent}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <span className="h-8 w-8 rounded-md border border-gray-200 dark:border-gray-700" style={{ backgroundColor: settings.sidebar_bg }} />
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Latar sidebar</p>
              <p className="text-xs text-gray-400">{settings.sidebar_bg}</p>
            </div>
          </div>
        </div>
        {pages.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">Halaman kustom ({pages.length})</p>
            <div className="flex flex-wrap gap-2">
              {pages.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {p.icon} {p.title}
                  <button onClick={() => removePage(token, p.id)} className="text-gray-400 hover:text-red-500">✕</button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prompt */}
      <div className="card space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi perubahan UI</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="input"
            placeholder='Contoh: "Ubah warna sidebar menjadi biru dan tambahkan halaman berisi jadwal pelajaran"'
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={generate} disabled={busy} className="btn-primary flex-1 sm:flex-none">
            {busy ? 'Memproses...' : '✨ Buat Usulan Perubahan'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Ubah warna sidebar menjadi biru', 'Ganti warna aksen menjadi hijau', 'Tambahkan halaman "Kegiatan Sekolah"', 'Ubah font aplikasi menjadi Georgia'].map((s) => (
            <button key={s} onClick={() => setPrompt(s)} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Proposisi */}
      {proposal && (
        <div className="card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Usulan Perubahan</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{proposal.summary}</p>
              {proposal.provider && <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">Dibuat dengan {proposal.provider} ({proposal.model})</p>}
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => setProposal(null)} className="btn-secondary text-xs">Batal</button>
              <button onClick={applyProposal} disabled={busy} className="btn-primary text-xs">{busy ? 'Menerapkan...' : '✓ Terapkan'}</button>
            </div>
          </div>

          {proposal.changes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tema</p>
              {proposal.changes.map((ch, i) => {
                const meta = CHANGE_LABELS[ch.key] || { label: ch.key, desc: '' };
                const isColor = ch.key === 'accent' || ch.key === 'sidebar_bg' || ch.key === 'sidebar_text';
                return (
                  <div key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{meta.label}</p>
                      <p className="text-xs text-gray-400">{meta.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {isColor ? (
                        <>
                          <span className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500 line-through dark:border-gray-700">
                            {ch.key === 'accent' ? settings.accent : ch.key === 'sidebar_bg' ? settings.sidebar_bg : settings.sidebar_text}
                          </span>
                          <span className="h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: ch.value }} />
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{ch.value}</span>
                        </>
                      ) : (
                        <>
                          <span className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500 line-through dark:border-gray-700">
                            {ch.key === 'font' ? settings.font : `${settings.radius}px`}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{ch.value}{ch.key === 'radius' ? 'px' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {proposal.new_pages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Halaman & Menu Baru</p>
              {proposal.new_pages.map((p, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.icon} {p.title}</p>
                  <p className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">{p.content.slice(0, 300)}{p.content.length > 300 ? '…' : ''}</p>
                </div>
              ))}
              <p className="text-[11px] text-gray-400">Setiap halaman baru otomatis muncul sebagai menu di sidebar.</p>
            </div>
          )}
        </div>
      )}

      {applied && proposal === null && (
        <div className="card space-y-3 text-center">
          <span className="text-4xl">🎨</span>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Perubahan sudah diterapkan. Lihat warna aksen & sidebar berubah, dan halaman kustom muncul di menu.
          </p>
        </div>
      )}
    </div>
  );
}
