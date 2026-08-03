import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { useUiStore } from '@/contexts/ui-settings-store';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

type Mode = 'auto' | 'chat' | 'design' | 'ui';

interface DesignElement {
  id: string;
  type: string;
  text?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  align?: string;
  rotation?: number;
  shape?: string;
  fill?: boolean;
  borderRadius?: number;
  emoji?: string;
  icon?: string;
  src?: string;
  value?: string;
  size?: number;
  rows?: number;
  cols?: number;
  headers?: string[];
  cells?: string[][];
  chart?: string;
  labels?: string[];
  data?: number[];
}

interface UiChange {
  key: string;
  label: string;
  value: string;
}

interface UiPatch {
  summary: string;
  changes: UiChange[];
  new_pages: Array<{ title: string; icon: string; content: string }>;
}

interface AssistantResult {
  content: string;
  provider: string;
  model: string;
  mode: 'chat' | 'design' | 'ui';
  design?: { title: string; width: number; height: number; background: string; elements: DesignElement[] };
  ui_patch?: UiPatch;
  tools_used?: Array<{ name: string }>;
}

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  result?: AssistantResult;
  error?: boolean;
}

const MODES: Array<{ value: Mode; label: string; icon: string; hint: string }> = [
  { value: 'auto', label: 'Auto', icon: '✨', hint: 'Deteksi otomatis' },
  { value: 'chat', label: 'Chat', icon: '💬', hint: 'Tutor & tools' },
  { value: 'design', label: 'Desain', icon: '🎨', hint: 'Buat desain Canva' },
  { value: 'ui', label: 'UI', icon: '🖌️', hint: 'Ubah tampilan app' },
];

const SUGGESTIONS = [
  { mode: 'chat', text: 'Buatkan rencana belajar Matematika SMP selama seminggu' },
  { mode: 'chat', text: 'Apa saja materi belajar yang tersedia untuk IPA?' },
  { mode: 'design', text: 'Buat desain poster tentang hari kemerdekaan Indonesia' },
  { mode: 'design', text: 'Buat desain sertifikat penghargaan belajar' },
  { mode: 'ui', text: 'Ubah warna aksen dan sidebar menjadi biru' },
  { mode: 'ui', text: 'Tambahkan halaman menu berisi jadwal pelajaran' },
];

const CHANGE_LABELS: Record<string, string> = {
  accent: 'Warna aksen',
  sidebar_bg: 'Latar sidebar',
  sidebar_text: 'Teks sidebar',
  font: 'Font aplikasi',
  radius: 'Sudut membulat',
};

let msgId = 0;
const nextId = () => `m${++msgId}`;

export default function AiChatPage() {
  const { token } = useAuthStore();
  const { settings, pages, saveSettings, addPage } = useUiStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('auto');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const send = async (textOverride?: string, modeOverride?: Mode) => {
    const text = (textOverride ?? input).trim();
    if (!text || busy) return;
    const activeMode = modeOverride ?? mode;
    setInput('');
    setError('');

    const history = [...messages, { id: nextId(), role: 'user' as const, content: text }];
    setMessages(history);

    const placeholder: ChatMsg = { id: nextId(), role: 'assistant', content: '' };
    setMessages([...history, placeholder]);
    setBusy(true);

    try {
      const res = await api.post<{ success: boolean; data: AssistantResult }>(
        '/ai/assistant',
        {
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          mode: activeMode,
          context: {
            settings: {
              accent: settings.accent,
              sidebar_bg: settings.sidebar_bg,
              sidebar_text: settings.sidebar_text,
              font: settings.font,
              radius: settings.radius,
            },
            pages: pages.map((p) => ({ title: p.title })),
          },
        },
        token,
      );
      if (res.success) {
        setMessages((prev) => {
          const copy = prev.map((m) => (m.id === placeholder.id ? { ...m, content: res.data.content, result: res.data } : m));
          return copy;
        });
      }
    } catch (e: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholder.id
            ? { ...m, content: e?.message || 'Terjadi kesalahan', error: true }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const saveDesign = async (design: AssistantResult['design']) => {
    if (!design) return;
    const res = await api.post<{ success: boolean; data: { id: string } }>(
      '/creatives/designs',
      {
        title: design.title,
        design: { title: design.title, width: design.width, height: design.height, background: design.background, elements: design.elements },
        width: design.width,
        height: design.height,
      },
      token,
    );
    if (res.success) {
      navigate(`/creatives?design=${res.data.id}`);
    }
  };

  const applyPatch = async (patch: UiPatch) => {
    const themePatch: any = {};
    patch.changes.forEach((ch) => {
      if (ch.key === 'accent') themePatch.accent = ch.value;
      if (ch.key === 'sidebar_bg') themePatch.sidebar_bg = ch.value;
      if (ch.key === 'sidebar_text') themePatch.sidebar_text = ch.value;
      if (ch.key === 'font') themePatch.font = ch.value;
      if (ch.key === 'radius') themePatch.radius = Number(ch.value) || settings.radius;
    });
    if (Object.keys(themePatch).length > 0) {
      await saveSettings(token, themePatch);
    }
    for (const p of patch.new_pages) {
      await addPage(token, p);
    }
    return patch.changes.length + patch.new_pages.length;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Chat</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Satu asisten untuk belajar, membuat desain, dan mengubah tampilan aplikasi.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              title={m.hint}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m.value
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="mx-auto max-w-xl space-y-6 pt-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-3xl text-white shadow-lg">💬</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Halo! Ada yang bisa saya bantu?</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tanya materi, minta dibuatkan desain, atau ubah tampilan aplikasi langsung dari sini.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => send(s.text, s.mode as Mode)}
                  className="rounded-xl border border-gray-200 bg-white p-3 text-left text-sm text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-primary-700 dark:hover:bg-gray-800"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' ? (
              <div className="flex w-full max-w-3xl items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 text-sm text-white shadow">
                  {m.error ? '⚠️' : '🤖'}
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  {m.content && (
                    <div
                      className={`rounded-2xl rounded-tl-md border px-4 py-3 text-sm leading-relaxed ${
                        m.error
                          ? 'border-red-100 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400'
                          : 'border-gray-100 bg-white text-gray-800 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      <article className="prose prose-sm max-w-none prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 dark:prose-invert">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </article>
                      {m.result?.tools_used && m.result.tools_used.length > 0 && (
                        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                          🔧 Menggunakan {m.result.tools_used.map((t) => t.name).join(', ')}
                        </p>
                      )}
                      {m.result?.provider && !m.error && (
                        <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                          {m.result.provider} · {m.result.model}
                        </p>
                      )}
                    </div>
                  )}

                  {m.result?.design && <DesignCard design={m.result.design} onOpen={() => saveDesign(m.result!.design!)} />}
                  {m.result?.ui_patch && <UiPatchCard patch={m.result.ui_patch} onApply={applyPatch} />}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl rounded-2xl rounded-tr-md bg-primary-500 px-4 py-2.5 text-sm text-white shadow-sm">
                {m.content}
              </div>
            )}
          </div>
        ))}

        {busy && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 text-sm text-white shadow">🤖</div>
            <div className="rounded-2xl rounded-tl-md border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-2 border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-primary-400 dark:border-gray-700 dark:bg-gray-900">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={mode === 'design' ? 'Contoh: Buat desain poster...' : mode === 'ui' ? 'Contoh: Ubah warna sidebar menjadi biru...' : 'Tanya apa saja...'}
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
            />
            <button
              onClick={() => send()}
              disabled={busy || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
              title="Kirim"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-gray-400 dark:text-gray-600">
            AI dapat melakukan kesalahan. Cek kembali informasi penting. {mode === 'auto' && 'Mode Auto mendeteksi apakah kamu ingin chat, desain, atau mengubah UI.'}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===== Kartu hasil desain ===== */
function DesignCard({ design, onOpen }: { design: NonNullable<AssistantResult['design']>; onOpen: () => void }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleOpen = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onOpen();
      setSaved(true);
    } catch {
      setSaved(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 p-3 dark:border-gray-800">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">🎨 {design.title}</p>
            <p className="text-[11px] text-gray-400">{design.width} × {design.height} · {design.elements.length} elemen</p>
          </div>
          <button onClick={handleOpen} disabled={busy || saved} className="btn-primary shrink-0 text-xs">
            {busy ? 'Menyimpan...' : saved ? '✓ Dibuka di Canva' : '✏️ Buka di Canva'}
          </button>
        </div>
      </div>
      <DesignPreview design={design} />
    </div>
  );
}

/* ===== Pratinjau desain mini ===== */
function DesignPreview({ design }: { design: NonNullable<AssistantResult['design']> }) {
  const { width, height, background, elements } = design;
  const maxW = 560;
  const maxH = 300;
  const scale = Math.min(maxW / width, maxH / height);
  const viewW = width * scale;
  const viewH = height * scale;

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div
        className="relative overflow-hidden shadow-md"
        style={{ width: viewW, height: viewH, backgroundColor: background }}
      >
        {elements.map((el) => (
          <ElementView key={el.id} el={el} scale={scale} />
        ))}
      </div>
    </div>
  );
}

function ElementView({ el, scale }: { el: DesignElement; scale: number }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: el.x * scale,
    top: el.y * scale,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
  };

  switch (el.type) {
    case 'text':
      return (
        <div
          style={{
            ...style,
            width: (el.width ?? 200) * scale,
            color: el.color || '#111827',
            fontSize: (el.fontSize ?? 24) * scale,
            fontFamily: el.fontFamily,
            fontWeight: el.bold ? 700 : 400,
            fontStyle: el.italic ? 'italic' : 'normal',
            textAlign: (el.align as any) || 'center',
            lineHeight: 1.1,
          }}
        >
          {el.text}
        </div>
      );
    case 'shape':
      return (
        <div
          style={{
            ...style,
            width: (el.width ?? 100) * scale,
            height: (el.height ?? 100) * scale,
            backgroundColor: el.fill ? el.color : 'transparent',
            border: el.fill ? undefined : `2px solid ${el.color}`,
            borderRadius: el.shape === 'circle' ? '9999px' : (el.borderRadius ?? 0) * scale,
            clipPath: el.shape === 'triangle' ? 'polygon(50% 0, 0 100%, 100% 100%)' : undefined,
            transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          }}
        />
      );
    case 'sticker':
      return <div style={{ ...style, fontSize: (el.fontSize ?? 64) * scale }}>{el.emoji}</div>;
    case 'icon':
      return <div style={{ ...style, fontSize: (el.fontSize ?? 48) * scale, color: el.color }}>{el.icon}</div>;
    case 'image':
      return (
        <img
          src={el.src}
          alt=""
          style={{
            ...style,
            width: (el.width ?? 100) * scale,
            height: (el.height ?? 100) * scale,
            objectFit: 'cover',
            borderRadius: (el.borderRadius ?? 0) * scale,
          }}
        />
      );
    case 'qr':
      return <div style={{ ...style, fontSize: (el.size ?? 120) * scale, lineHeight: 1 }}>▦</div>;
    case 'barcode':
      return (
        <div
          style={{
            ...style,
            width: (el.width ?? 300) * scale,
            height: (el.height ?? 80) * scale,
            background: `repeating-linear-gradient(90deg, #000 0 4px, transparent 4px 10px)`,
          }}
        />
      );
    case 'table':
      return (
        <table
          style={{
            ...style,
            width: (el.width ?? 300) * scale,
            borderCollapse: 'collapse',
            fontSize: (el.fontSize ?? 12) * scale,
          }}
        >
          <tbody>
            {(el.cells || []).map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      border: `1px solid ${el.color || '#999'}`,
                      padding: '2px 4px',
                      fontSize: 'inherit',
                      color: el.color,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'chart':
      return (
        <div style={{ ...style, width: (el.width ?? 200) * scale, height: (el.height ?? 140) * scale, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {(el.data || []).map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(v / Math.max(...(el.data || [1]))) * 100}%`,
                backgroundColor: el.color || '#4F46E5',
              }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

/* ===== Kartu usulan UI ===== */
function UiPatchCard({ patch, onApply }: { patch: UiPatch; onApply: (p: UiPatch) => Promise<number> }) {
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');

  const handleApply = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const n = await onApply(patch);
      setApplied(true);
      setMessage(n > 0 ? 'Perubahan berhasil diterapkan!' : 'Tidak ada perubahan yang diterapkan.');
    } catch (e: any) {
      setMessage(e?.message || 'Gagal menerapkan perubahan');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 p-3 dark:border-gray-800">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">🖌️ Usulan Perubahan UI</p>
          <button onClick={handleApply} disabled={busy || applied} className="btn-primary text-xs">
            {busy ? 'Menerapkan...' : applied ? '✓ Diterapkan' : '✓ Terapkan'}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{patch.summary}</p>
      </div>
      <div className="space-y-2 p-3">
        {patch.changes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {patch.changes.map((ch, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 px-2.5 py-1.5 text-xs text-gray-700 dark:border-gray-800 dark:text-gray-300">
                {CHANGE_LABELS[ch.key] || ch.key}:
                {(ch.key === 'accent' || ch.key === 'sidebar_bg' || ch.key === 'sidebar_text') && (
                  <span className="h-3.5 w-3.5 rounded-full border border-gray-300" style={{ backgroundColor: ch.value }} />
                )}
                <span className="font-semibold">{ch.value}</span>
              </span>
            ))}
          </div>
        )}
        {patch.new_pages.map((p, i) => (
          <div key={i} className="rounded-lg border border-gray-100 p-2.5 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{p.icon} {p.title} <span className="text-[10px] font-normal text-gray-400">halaman baru</span></p>
            <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-[11px] text-gray-500 dark:text-gray-400">{p.content.slice(0, 200)}{p.content.length > 200 ? '…' : ''}</p>
          </div>
        ))}
        {applied && message && <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{message}</p>}
      </div>
    </div>
  );
}
