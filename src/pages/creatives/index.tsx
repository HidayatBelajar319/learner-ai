import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { useUiStore } from '@/contexts/ui-settings-store';
import { api } from '@/lib/api';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';

/* ============================================================
 * TIPE DATA
 * ============================================================ */

interface DesignElement {
  id: string;
  type: 'text' | 'shape' | 'sticker' | 'icon' | 'image' | 'qr' | 'barcode' | 'table' | 'chart';
  x: number;
  y: number;
  rotation: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  align?: string;
  shape?: 'rect' | 'circle' | 'line' | 'triangle' | 'rounded';
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
  chart?: 'bar' | 'line' | 'pie';
  labels?: string[];
  data?: number[];
  width?: number;
  height?: number;
}

interface Design {
  title: string;
  width: number;
  height: number;
  background: string;
  elements: DesignElement[];
}

interface SavedDesign {
  id: string;
  title: string;
  category: string;
  type: string;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

interface AssetItem {
  id: string;
  kind: string;
  name: string;
  size: number;
  created_at: string;
}

interface UiPatch {
  summary: string;
  changes: Array<{ key: string; label: string; value: string }>;
  new_pages: Array<{ title: string; icon: string; content: string }>;
}

/** Pisahkan blok ```ui-patch``` dari jawaban chat AI. */
function extractUiPatch(content: string): { text: string; patch: UiPatch | null } {
  const m = content.match(/```ui-patch\s*([\s\S]*?)```/);
  if (m) {
    try {
      const obj = JSON.parse(m[1].trim());
      return {
        text: content.replace(m[0], '').trim(),
        patch: {
          summary: String(obj?.summary || ''),
          changes: Array.isArray(obj?.changes) ? obj.changes.slice(0, 8) : [],
          new_pages: Array.isArray(obj?.new_pages) ? obj.new_pages.slice(0, 3) : [],
        },
      };
    } catch {
      // blok tidak valid JSON → abaikan
    }
  }
  return { text: content, patch: null };
}

/* ============================================================
 * UTIL
 * ============================================================ */

const uid = () => `el_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const CATEGORIES = [
  'sertifikat',
  'banner',
  'poster',
  'infografis',
  'undangan',
  'kartu',
  'presentasi',
  'lembar kerja',
  'desain',
];

const FONTS = ['Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Comic Sans MS', 'Trebuchet MS', 'Impact'];

const STICKERS = ['🎉', '🎓', '⭐', '🔥', '❤️', '✨', '🎨', '📚', '✏️', '🏆', '🥇', '💡', '🚀', '🌈', '🎵', '🧠', '✅', '❌', '🎯', '📈'];
const ICONS = ['⭐', '❤️', '🔥', '🎓', '✅', '🚀', '💡', '🏆', '🥇', '📚', '🧠', '🎯', '🌍', '✏️', '💻', '🔬', '🧪', '🎭', '⚽', '🎼'];

function normalizeElement(raw: any): DesignElement {
  const base = {
    id: raw.id || uid(),
    x: Number(raw.x) || 0,
    y: Number(raw.y) || 0,
    rotation: Number(raw.rotation) || 0,
  };
  switch (raw.type) {
    case 'text':
      return { ...base, type: 'text' as const, text: String(raw.text ?? 'Teks'), width: Number(raw.width) || 400, height: Number(raw.height) || 60, fontSize: Number(raw.fontSize) || 32, fontFamily: raw.fontFamily || 'Arial', color: raw.color || '#111827', bold: !!raw.bold, italic: !!raw.italic, align: raw.align || 'center' };
    case 'shape':
      return { ...base, type: 'shape' as const, shape: raw.shape || 'rect', width: Number(raw.width) || 200, height: Number(raw.height) || 120, color: raw.color || '#4F46E5', fill: raw.fill !== false, borderRadius: Number(raw.borderRadius) || 8 };
    case 'sticker':
      return { ...base, type: 'sticker' as const, emoji: raw.emoji || '🎉', fontSize: Number(raw.fontSize) || 64 };
    case 'icon':
      return { ...base, type: 'icon' as const, icon: raw.icon || '⭐', fontSize: Number(raw.fontSize) || 48, color: raw.color || '#F59E0B' };
    case 'image':
      return { ...base, type: 'image' as const, src: raw.src || '', width: Number(raw.width) || 200, height: Number(raw.height) || 150, borderRadius: Number(raw.borderRadius) || 0 };
    case 'qr':
      return { ...base, type: 'qr' as const, value: raw.value || 'https://learner.hidayat3911.workers.dev', size: Number(raw.size) || 120, color: raw.color || '#000000' };
    case 'barcode':
      return { ...base, type: 'barcode' as const, value: raw.value || 'LEARNER-AI-2026', width: Number(raw.width) || 300, height: Number(raw.height) || 80 };
    case 'table':
      return { ...base, type: 'table' as const, rows: Number(raw.rows) || 3, cols: Number(raw.cols) || 2, headers: Array.isArray(raw.headers) ? raw.headers : ['Kolom 1', 'Kolom 2'], cells: Array.isArray(raw.cells) ? raw.cells : [['a', 'b'], ['c', 'd']], width: Number(raw.width) || 400, height: Number(raw.height) || 150, color: raw.color || '#374151' };
    case 'chart':
      return { ...base, type: 'chart' as const, chart: raw.chart || 'bar', labels: Array.isArray(raw.labels) ? raw.labels : ['A', 'B', 'C'], data: Array.isArray(raw.data) ? raw.data.map(Number) : [10, 25, 15], width: Number(raw.width) || 320, height: Number(raw.height) || 220, color: raw.color || '#4F46E5' };
    default:
      return { ...base, type: 'text' as const, text: String(raw.text ?? 'Teks'), width: Number(raw.width) || 400, height: Number(raw.height) || 60, fontSize: Number(raw.fontSize) || 32, fontFamily: 'Arial', color: '#111827', align: 'center' };
  }
}

function normalizeDesign(parsed: any): Design {
  return {
    title: String(parsed?.title || 'Tanpa judul'),
    width: Math.min(Math.max(Number(parsed?.width) || 1200, 400), 2400),
    height: Math.min(Math.max(Number(parsed?.height) || 800, 300), 1600),
    background: typeof parsed?.background === 'string' ? parsed.background : '#ffffff',
    elements: Array.isArray(parsed?.elements) ? parsed.elements.map(normalizeElement).slice(0, 80) : [],
  };
}

/* ============================================================
 * SUB-RENDERER: QR, Barcode, Chart, Shape, Table
 * ============================================================ */

function QrView({ value, size, color }: { value: string; size: number; color?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value || ' ', {
      width: Math.max(Math.min(size, 600) * 2, 80),
      margin: 1,
      color: { dark: color || '#000000', light: '#ffffff' },
    })
      .then((url) => { if (alive) setSrc(url); })
      .catch(() => { if (alive) setSrc(null); });
    return () => { alive = false; };
  }, [value, size, color]);
  if (!src) {
    return <div className="flex h-full w-full items-center justify-center bg-white text-[10px] text-gray-400">QR</div>;
  }
  return <img src={src} alt="QR" className="h-full w-full object-contain" draggable={false} />;
}

function BarcodeView({ value, height }: { value: string; height: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    try {
      JsBarcode(ref.current, value || ' ', {
        format: 'CODE128',
        width: 1.6,
        height: Math.max(height * 0.55, 30),
        displayValue: false,
        margin: 2,
        background: '#ffffff',
        lineColor: '#000000',
      });
    } catch {
      // abaikan barcode invalid
    }
  }, [value, height]);
  return <canvas ref={ref} className="h-full w-full bg-white" />;
}

function ShapeView({ shape, color, fill, borderRadius }: { shape: string; color: string; fill: boolean; borderRadius: number }) {
  if (shape === 'line') {
    return (
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="50" x2="100" y2="50" stroke={color} strokeWidth={6} />
      </svg>
    );
  }
  if (shape === 'triangle') {
    return (
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polygon points="50,4 98,96 2,96" fill={fill ? color : 'transparent'} stroke={fill ? 'none' : color} strokeWidth={3} />
      </svg>
    );
  }
  const radius = shape === 'circle' ? '50%' : shape === 'rounded' ? `${borderRadius}px` : '0px';
  return (
    <div
      className="h-full w-full"
      style={{
        borderRadius: radius,
        backgroundColor: fill ? color : 'transparent',
        border: fill ? 'none' : `2px solid ${color}`,
      }}
    />
  );
}

function ChartView({ chart, labels, data, color, width, height }: { chart: string; labels: string[]; data: number[]; color: string; width: number; height: number }) {
  const max = Math.max(...data, 1);
  const pad = 24;
  const cw = Math.max(width, 10);
  const ch = Math.max(height, 10);
  const plotW = cw - pad - 6;
  const plotH = ch - pad - 16;

  const bars = labels.map((l, i) => {
    const bw = plotW / Math.max(labels.length, 1) * 0.6;
    const bx = pad + (plotW / Math.max(labels.length, 1)) * i + (plotW / Math.max(labels.length, 1) - bw) / 2;
    const bh = (data[i] / max) * plotH;
    return { bx, bw, bh, by: pad + plotH - bh, label: l, value: data[i] };
  });

  const linePoints = labels.map((l, i) => {
    const x = pad + (plotW / Math.max(labels.length - 1, 1)) * i;
    const y = pad + plotH - (data[i] / max) * plotH;
    return { x, y, label: l, value: data[i] };
  });

  const pieTotal = data.reduce((a, b) => a + Math.max(b, 0), 0) || 1;
  const cx = cw / 2;
  const cy = (ch - pad) / 2;
  const r = Math.min(plotW, plotH) / 2.4;
  let angle = -Math.PI / 2;
  const pieSlice = data.map((d, i) => {
    const frac = Math.max(d, 0) / pieTotal;
    const start = angle;
    const end = angle + frac * Math.PI * 2;
    angle = end;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const hue = (i * 137.508) % 360;
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, fill: color, light: `hsl(${hue}, 60%, 55%)`, label: labels[i], value: data[i] };
  });

  if (chart === 'pie') {
    return (
      <svg width={cw} height={ch}>
        {pieSlice.map((s, i) => (
          <path key={i} d={s.path} fill={s.light} stroke="#ffffff" strokeWidth={1.5} />
        ))}
        <text x={cx} y={ch - 6} textAnchor="middle" fontSize={9} fill="#6b7280">{labels.join(' · ')}</text>
      </svg>
    );
  }

  if (chart === 'line') {
    return (
      <svg width={cw} height={ch}>
        {linePoints.length > 1 && (
          <polyline
            points={linePoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {linePoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill={color} />
            <text x={p.x} y={ch - 4} textAnchor="middle" fontSize={8} fill="#6b7280">{p.label}</text>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg width={cw} height={ch}>
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={b.bx} y={b.by} width={b.bw} height={b.bh} rx={2} fill={color} />
          <text x={b.bx + b.bw / 2} y={ch - 4} textAnchor="middle" fontSize={8} fill="#6b7280">{b.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
 * HALAMAN UTAMA
 * ============================================================ */

export default function CreativesPage() {
  const { token } = useAuthStore();

  const [design, setDesign] = useState<Design>({
    title: 'Desain Baru',
    width: 1200,
    height: 800,
    background: '#ffffff',
    elements: [],
  });
  const [savedId, setSavedId] = useState<string | null>(null);
  const [category, setCategory] = useState('desain');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null);

  const [panel, setPanel] = useState<'elements' | 'assets' | 'ai' | 'chat'>('elements');
  const [tab, setTab] = useState<'editor' | 'library'>('editor');

  const [myDesigns, setMyDesigns] = useState<SavedDesign[]>([]);
  const [assets, setAssets] = useState<AssetItem[]>([]);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('desain');
  const [aiBusy, setAiBusy] = useState(false);

  const [chatMsgs, setChatMsgs] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [chatMode, setChatMode] = useState<'creatives' | 'chatting'>('creatives');

  const [uiPatch, setUiPatch] = useState<UiPatch | null>(null);
  const [uiPatchBusy, setUiPatchBusy] = useState(false);

  const { settings: uiSettings, pages: uiPages, saveSettings, addPage } = useUiStore();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [libraryCat, setLibraryCat] = useState('');

  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasInnerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const MAX_DISPLAY_W = 880;
  const scale = Math.min(1, MAX_DISPLAY_W / design.width);

  const selected = useMemo(() => design.elements.find((e) => e.id === selectedId) ?? null, [design.elements, selectedId]);

  /* ---------- operasi elemen ---------- */

  const updateElement = useCallback((id: string, patch: Partial<DesignElement>) => {
    setDesign((d) => ({ ...d, elements: d.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  }, []);

  const addElement = (partial: Partial<DesignElement> & { type: DesignElement['type'] }) => {
    const el: DesignElement = { id: uid(), x: 60, y: 60, rotation: 0, ...partial } as DesignElement;
    setDesign((d) => ({ ...d, elements: [...d.elements, el] }));
    setSelectedId(el.id);
  };

  const duplicateElement = () => {
    if (!selected) return;
    const copy: DesignElement = { ...selected, id: uid(), x: selected.x + 20, y: selected.y + 20 };
    setDesign((d) => ({ ...d, elements: [...d.elements, copy] }));
    setSelectedId(copy.id);
  };

  const deleteElement = () => {
    if (!selectedId) return;
    setDesign((d) => ({ ...d, elements: d.elements.filter((e) => e.id !== selectedId) }));
    setSelectedId(null);
  };

  const bringToFront = () => {
    if (!selected) return;
    setDesign((d) => ({ ...d, elements: [...d.elements.filter((e) => e.id !== selected.id), selected] }));
  };

  /* ---------- drag ---------- */

  const handleElPointerDown = (e: React.PointerEvent, el: DesignElement) => {
    e.stopPropagation();
    setSelectedId(el.id);
    const rect = canvasWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = rect.width / design.width;
    const dx = (e.clientX - rect.left) / s - el.x;
    const dy = (e.clientY - rect.top) / s - el.y;
    setDrag({ id: el.id, dx, dy });
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const rect = canvasWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = rect.width / design.width;
    const x = Math.round((e.clientX - rect.left) / s - drag.dx);
    const y = Math.round((e.clientY - rect.top) / s - drag.dy);
    updateElement(drag.id, { x: Math.max(0, Math.min(x, design.width)), y: Math.max(0, Math.min(y, design.height)) });
  };

  useEffect(() => {
    const up = () => setDrag(null);
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  /* ---------- data ---------- */

  const refreshDesigns = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (libraryCat) params.set('category', libraryCat);
      const qs = params.toString();
      const res = await api.get<{ success: boolean; data: SavedDesign[] }>(`/creatives/designs${qs ? `?${qs}` : ''}`, token);
      if (res.success) setMyDesigns(res.data);
    } catch {
      // abaikan
    }
  };

  const refreshAssets = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: AssetItem[] }>('/creatives/assets', token);
      if (res.success) setAssets(res.data);
    } catch {
      // abaikan
    }
  };

  useEffect(() => { refreshDesigns(); }, [token, search, libraryCat]);
  useEffect(() => { refreshAssets(); }, [token]);

  const openDesign = async (id: string) => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: any }>(`/creatives/designs/${id}`, token);
      if (res.success) {
        const normalized = normalizeDesign(res.data.design);
        setDesign(normalized);
        setSavedId(res.data.id);
        setCategory(res.data.category || 'desain');
        setTab('editor');
        setSelectedId(null);
        setMessage(`Desain "${res.data.title}" dimuat.`);
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat desain');
    }
  };

  const saveDesign = async () => {
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      if (savedId) {
        await api.put(`/creatives/designs/${savedId}`, { title: design.title, category, design: { width: design.width, height: design.height, background: design.background, elements: design.elements } }, token);
        setMessage('Desain diperbarui.');
      } else {
        const res = await api.post<{ success: boolean; data: { id: string } }>('/creatives/designs', { title: design.title, category, design: { width: design.width, height: design.height, background: design.background, elements: design.elements } }, token);
        if (res.success) {
          setSavedId(res.data.id);
          setMessage('Desain disimpan.');
        }
      }
      await refreshDesigns();
    } catch (e: any) {
      setError(e?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const deleteDesign = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/creatives/designs/${id}`, token);
      if (savedId === id) {
        setSavedId(null);
        setDesign({ title: 'Desain Baru', width: 1200, height: 800, background: '#ffffff', elements: [] });
      }
      await refreshDesigns();
    } catch (e: any) {
      setError(e?.message || 'Gagal menghapus');
    }
  };

  /* ---------- AI design ---------- */

  const generateDesign = async () => {
    if (!aiPrompt.trim()) {
      setError('Prompt wajib diisi');
      return;
    }
    setAiBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post<{ success: boolean; data: any }>('/creatives/designs/generate', { prompt: aiPrompt, category: aiCategory, width: design.width, height: design.height }, token);
      if (res.success) {
        const normalized = normalizeDesign(res.data);
        setDesign(normalized);
        setCategory(aiCategory);
        setSelectedId(null);
        setMessage(`Desain dibuat dengan ${res.data.provider} (${res.data.model}).`);
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal membuat desain');
    } finally {
      setAiBusy(false);
    }
  };

  const remixDesign = async () => {
    if (!aiPrompt.trim()) {
      setError('Prompt remix wajib diisi');
      return;
    }
    if (design.elements.length === 0) {
      setError('Buat desain dulu sebelum remix');
      return;
    }
    setAiBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post<{ success: boolean; data: any }>('/creatives/designs/remix', { prompt: aiPrompt, design: { width: design.width, height: design.height, background: design.background, elements: design.elements }, width: design.width, height: design.height }, token);
      if (res.success) {
        setDesign(normalizeDesign(res.data));
        setSelectedId(null);
        setMessage('Desain diperbarui oleh AI.');
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal meremix desain');
    } finally {
      setAiBusy(false);
    }
  };

  /* ---------- chat ---------- */

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const next: Array<{ role: 'user' | 'assistant'; content: string }> = [...chatMsgs, { role: 'user', content: chatInput }];
    setChatMsgs(next);
    setChatInput('');
    setChatBusy(true);
    try {
      const res = await api.post<{ success: boolean; data: { content: string } }>('/creatives/chat', {
        messages: next.map((m) => ({ role: m.role, content: m.content })),
        design: { width: design.width, height: design.height, background: design.background, elements: design.elements },
        mode: chatMode,
        uiContext: {
          accent: uiSettings.accent,
          sidebar_bg: uiSettings.sidebar_bg,
          sidebar_text: uiSettings.sidebar_text,
          font: uiSettings.font,
          pages: uiPages.map((p) => ({ title: p.title })),
        },
      }, token);
      if (res.success) {
        if (chatMode === 'chatting') {
          const { text, patch } = extractUiPatch(res.data.content);
          const assistant = text || 'Aku menemukan perubahan yang bisa diterapkan. Tinjau lalu klik Terapkan!';
          setChatMsgs([...next, { role: 'assistant', content: assistant }]);
          if (patch && (patch.changes.length > 0 || patch.new_pages.length > 0)) {
            setUiPatch(patch);
          }
        } else {
          setChatMsgs([...next, { role: 'assistant', content: res.data.content }]);
        }
      }
    } catch (e: any) {
      setChatMsgs([...next, { role: 'assistant', content: `⚠️ ${e?.message || 'Gagal memproses chat'}` }]);
    } finally {
      setChatBusy(false);
    }
  };

  const applyUiPatch = async () => {
    if (!uiPatch) return;
    setUiPatchBusy(true);
    setError('');
    try {
      const themePatch: any = {};
      uiPatch.changes.forEach((ch) => {
        if (ch.key === 'accent') themePatch.accent = ch.value;
        if (ch.key === 'sidebar_bg') themePatch.sidebar_bg = ch.value;
        if (ch.key === 'sidebar_text') themePatch.sidebar_text = ch.value;
        if (ch.key === 'font') themePatch.font = ch.value;
        if (ch.key === 'radius') themePatch.radius = Number(ch.value) || uiSettings.radius;
      });
      if (Object.keys(themePatch).length > 0) {
        await saveSettings(token, themePatch);
      }
      for (const p of uiPatch.new_pages) {
        await addPage(token, p);
      }
      setMessage('Perubahan UI diterapkan! Periksa tema & menu sidebar.');
      setUiPatch(null);
    } catch (e: any) {
      setError(e?.message || 'Gagal menerapkan perubahan UI');
    } finally {
      setUiPatchBusy(false);
    }
  };

  /* ---------- upload ---------- */

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      const name = file.name;
      try {
        if (token) {
          await api.post('/creatives/assets', { kind: 'image', name, data: dataUrl }, token);
          await refreshAssets();
        }
        addElement({ type: 'image', src: dataUrl, width: 240, height: 180 });
        setMessage('Gambar ditambahkan ke kanvas.');
      } catch (err: any) {
        setError(err?.message || 'Gagal mengunggah gambar');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const useAsset = async (a: AssetItem) => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: { data: string } }>(`/creatives/assets/${a.id}/data`, token);
      if (res.success) {
        addElement({ type: 'image', src: res.data.data, width: 240, height: 180 });
        setMessage(`Asset "${a.name}" ditambahkan.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat asset');
    }
  };

  const deleteAsset = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/creatives/assets/${id}`, token);
      await refreshAssets();
    } catch (err: any) {
      setError(err?.message || 'Gagal menghapus asset');
    }
  };

  /* ---------- export ---------- */

  const downloadPng = async () => {
    if (!canvasInnerRef.current) return;
    try {
      const dataUrl = await toPng(canvasInnerRef.current, {
        width: design.width,
        height: design.height,
        pixelRatio: 2,
        backgroundColor: design.background,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${design.title.replace(/[^\w\- ]+/g, '').trim() || 'desain'}.png`;
      a.click();
      setMessage('Desain diunduh sebagai PNG.');
    } catch {
      setError('Gagal mengunduh PNG');
    }
  };

  const downloadPdf = async () => {
    if (!canvasInnerRef.current) return;
    try {
      const dataUrl = await toPng(canvasInnerRef.current, {
        width: design.width,
        height: design.height,
        pixelRatio: 2,
        backgroundColor: design.background,
        cacheBust: true,
      });
      const pdf = new jsPDF({
        orientation: design.width > design.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [design.width, design.height],
        hotfixes: ['px_scaling'],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, design.width, design.height);
      pdf.save(`${design.title.replace(/[^\w\- ]+/g, '').trim() || 'desain'}.pdf`);
      setMessage('Desain diunduh sebagai PDF.');
    } catch {
      setError('Gagal mengunduh PDF');
    }
  };

  /* ---------- render element ---------- */

  const renderElement = (el: DesignElement) => {
    const common: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width ?? undefined,
      height: el.height ?? undefined,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      cursor: drag?.id === el.id ? 'grabbing' : 'grab',
    };
    switch (el.type) {
      case 'text':
        return (
          <div
            key={el.id}
            style={{ ...common, touchAction: 'none' }}
            className={`group flex items-center justify-center ${drag?.id === el.id ? 'z-10' : ''}`}
            onPointerDown={(e) => handleElPointerDown(e, el)}
          >
            <span
              style={{
                fontSize: el.fontSize,
                fontFamily: el.fontFamily,
                color: el.color,
                fontWeight: el.bold ? 700 : 400,
                fontStyle: el.italic ? 'italic' : 'normal',
                textAlign: el.align as any,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.2,
                width: '100%',
              }}
            >
              {el.text}
            </span>
          </div>
        );
      case 'shape':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none' }} className={drag?.id === el.id ? 'z-10' : ''} onPointerDown={(e) => handleElPointerDown(e, el)}>
            <ShapeView shape={el.shape || 'rect'} color={el.color || '#4F46E5'} fill={el.fill !== false} borderRadius={el.borderRadius || 8} />
          </div>
        );
      case 'sticker':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none' }} className={drag?.id === el.id ? 'z-10' : ''} onPointerDown={(e) => handleElPointerDown(e, el)}>
            <span style={{ fontSize: el.fontSize, lineHeight: 1 }}>{el.emoji}</span>
          </div>
        );
      case 'icon':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none', color: el.color }} className={`flex items-center justify-center ${drag?.id === el.id ? 'z-10' : ''}`} onPointerDown={(e) => handleElPointerDown(e, el)}>
            <span style={{ fontSize: el.fontSize, lineHeight: 1 }}>{el.icon}</span>
          </div>
        );
      case 'image':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none' }} className={`overflow-hidden ${drag?.id === el.id ? 'z-10' : ''}`} onPointerDown={(e) => handleElPointerDown(e, el)}>
            {el.src ? <img src={el.src} alt="" className="h-full w-full object-contain" draggable={false} style={{ borderRadius: el.borderRadius || 0 }} /> : <div className="h-full w-full bg-gray-100" />}
          </div>
        );
      case 'qr':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none', width: el.size, height: el.size }} className={drag?.id === el.id ? 'z-10' : ''} onPointerDown={(e) => handleElPointerDown(e, el)}>
            <QrView value={el.value || ''} size={el.size || 120} color={el.color} />
          </div>
        );
      case 'barcode':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none' }} className={drag?.id === el.id ? 'z-10' : ''} onPointerDown={(e) => handleElPointerDown(e, el)}>
            <BarcodeView value={el.value || ''} height={el.height || 80} />
          </div>
        );
      case 'table':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none' }} className={`overflow-hidden rounded border border-gray-300 bg-white ${drag?.id === el.id ? 'z-10' : ''}`} onPointerDown={(e) => handleElPointerDown(e, el)}>
            <table className="h-full w-full border-collapse text-xs" style={{ color: el.color }}>
              <tbody>
                {(el.headers || []).length > 0 && (
                  <tr>
                    {(el.headers || []).map((h, i) => (
                      <th key={i} className="border border-gray-300 bg-gray-100 px-1 py-0.5 font-semibold text-[10px]">{h}</th>
                    ))}
                  </tr>
                )}
                {(el.cells || []).map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => (
                      <td key={j} className="border border-gray-300 px-1 py-0.5 text-[10px]">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'chart':
        return (
          <div key={el.id} style={{ ...common, touchAction: 'none' }} className={drag?.id === el.id ? 'z-10' : ''} onPointerDown={(e) => handleElPointerDown(e, el)}>
            <ChartView chart={el.chart || 'bar'} labels={el.labels || []} data={el.data || []} color={el.color || '#4F46E5'} width={el.width || 320} height={el.height || 220} />
          </div>
        );
      default:
        return null;
    }
  };

  /* ---------- properties panel ---------- */

  const renderProperties = () => {
    if (!selected) {
      return (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Judul desain</label>
            <input value={design.title} onChange={(e) => setDesign((d) => ({ ...d, title: e.target.value }))} className="input text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Lebar (px)</label>
              <input type="number" value={design.width} onChange={(e) => setDesign((d) => ({ ...d, width: Math.min(Math.max(Number(e.target.value) || 400, 400), 2400) }))} className="input text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Tinggi (px)</label>
              <input type="number" value={design.height} onChange={(e) => setDesign((d) => ({ ...d, height: Math.min(Math.max(Number(e.target.value) || 300, 300), 1600) }))} className="input text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Warna latar</label>
            <div className="flex items-center gap-2">
              <input type="color" value={design.background} onChange={(e) => setDesign((d) => ({ ...d, background: e.target.value }))} className="h-9 w-12 cursor-pointer rounded border border-gray-300 dark:border-gray-700" />
              <input value={design.background} onChange={(e) => setDesign((d) => ({ ...d, background: e.target.value }))} className="input flex-1 text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Kategori</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input text-sm">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Pilih elemen di kanvas untuk mengatur propertinya.</p>
        </div>
      );
    }

    const num = (v: any, def = 0) => ({ value: v, onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateElement(selected.id, { [e.target.name]: Number(e.target.value) || def } as any) });

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selected.type.toUpperCase()}</h3>
          <div className="flex gap-1">
            <button onClick={bringToFront} className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Pindah ke depan">⤴</button>
            <button onClick={duplicateElement} className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Duplikat">⧉</button>
            <button onClick={deleteElement} className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30" title="Hapus">🗑</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">X</label>
            <input type="number" name="x" className="input text-sm" {...num(selected.x)} />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Y</label>
            <input type="number" name="y" className="input text-sm" {...num(selected.y)} />
          </div>
          {(selected.type === 'text' || selected.type === 'image' || selected.type === 'shape' || selected.type === 'barcode' || selected.type === 'table' || selected.type === 'chart') && (
            <>
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Lebar</label>
                <input type="number" name="width" className="input text-sm" {...num(selected.width, 100)} />
              </div>
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Tinggi</label>
                <input type="number" name="height" className="input text-sm" {...num(selected.height, 40)} />
              </div>
            </>
          )}
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Rotasi</label>
            <input type="number" name="rotation" className="input text-sm" {...num(selected.rotation)} />
          </div>
        </div>

        {selected.type === 'text' && (
          <>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Teks</label>
              <textarea value={selected.text} onChange={(e) => updateElement(selected.id, { text: e.target.value })} rows={2} className="input text-sm" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Ukuran font</label>
              <input type="number" value={selected.fontSize} onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) || 12 })} className="input text-sm" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Font</label>
              <select value={selected.fontFamily} onChange={(e) => updateElement(selected.id, { fontFamily: e.target.value })} className="input text-sm">
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Warna</label>
              <div className="flex items-center gap-2">
                <input type="color" value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-700" />
                <input value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} className="input flex-1 text-sm" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={!!selected.bold} onChange={(e) => updateElement(selected.id, { bold: e.target.checked })} /> Tebal
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={!!selected.italic} onChange={(e) => updateElement(selected.id, { italic: e.target.checked })} /> Miring
              </label>
              <select value={selected.align} onChange={(e) => updateElement(selected.id, { align: e.target.value })} className="input text-sm">
                <option value="left">Kiri</option>
                <option value="center">Tengah</option>
                <option value="right">Kanan</option>
              </select>
            </div>
          </>
        )}

        {selected.type === 'shape' && (
          <>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Bentuk</label>
              <select value={selected.shape} onChange={(e) => updateElement(selected.id, { shape: e.target.value as any })} className="input text-sm">
                <option value="rect">Persegi</option>
                <option value="rounded">Persegi membulat</option>
                <option value="circle">Lingkaran</option>
                <option value="triangle">Segitiga</option>
                <option value="line">Garis</option>
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Warna</label>
              <div className="flex items-center gap-2">
                <input type="color" value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-700" />
                <input value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} className="input flex-1 text-sm" />
              </div>
            </div>
            {selected.shape === 'rounded' && (
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Radius</label>
                <input type="number" value={selected.borderRadius} onChange={(e) => updateElement(selected.id, { borderRadius: Number(e.target.value) || 0 })} className="input text-sm" />
              </div>
            )}
            <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
              <input type="checkbox" checked={selected.fill !== false} onChange={(e) => updateElement(selected.id, { fill: e.target.checked })} /> Terisi
            </label>
          </>
        )}

        {(selected.type === 'sticker' || selected.type === 'icon') && (
          <>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Ukuran</label>
              <input type="number" value={selected.fontSize} onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) || 12 })} className="input text-sm" />
            </div>
            {selected.type === 'icon' && (
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Warna</label>
                <input type="color" value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-700" />
              </div>
            )}
          </>
        )}

        {selected.type === 'image' && (
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">URL / Data gambar</label>
            <textarea value={selected.src} onChange={(e) => updateElement(selected.id, { src: e.target.value })} rows={2} className="input font-mono text-xs" />
          </div>
        )}

        {selected.type === 'qr' && (
          <>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Isi QR</label>
              <input value={selected.value} onChange={(e) => updateElement(selected.id, { value: e.target.value })} className="input text-sm" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Ukuran</label>
              <input type="number" value={selected.size} onChange={(e) => updateElement(selected.id, { size: Number(e.target.value) || 40 })} className="input text-sm" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Warna</label>
              <input type="color" value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-700" />
            </div>
          </>
        )}

        {selected.type === 'barcode' && (
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Isi barcode</label>
            <input value={selected.value} onChange={(e) => updateElement(selected.id, { value: e.target.value })} className="input text-sm" />
          </div>
        )}

        {selected.type === 'table' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Baris</label>
                <input type="number" value={selected.rows} onChange={(e) => updateElement(selected.id, { rows: Math.min(Math.max(Number(e.target.value) || 1, 1), 20) })} className="input text-sm" />
              </div>
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Kolom</label>
                <input type="number" value={selected.cols} onChange={(e) => updateElement(selected.id, { cols: Math.min(Math.max(Number(e.target.value) || 1, 1), 10) })} className="input text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Header (pisahkan koma)</label>
              <input value={(selected.headers || []).join(',')} onChange={(e) => updateElement(selected.id, { headers: e.target.value.split(',').map((s) => s.trim()) })} className="input text-sm" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Sel (pisahkan koma)</label>
              <textarea
                value={(selected.cells || []).map((row) => row.join(',')).join('\n')}
                onChange={(e) => {
                  const cells = e.target.value.split('\n').map((row) => row.split(',').map((s) => s.trim()));
                  updateElement(selected.id, { cells, rows: Math.max(cells.length, selected.rows || 1), cols: Math.max(Math.max(...cells.map((r) => r.length)), selected.cols || 1) });
                }}
                rows={3}
                className="input font-mono text-xs"
              />
            </div>
          </>
        )}

        {selected.type === 'chart' && (
          <>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Jenis</label>
              <select value={selected.chart} onChange={(e) => updateElement(selected.id, { chart: e.target.value as any })} className="input text-sm">
                <option value="bar">Batang</option>
                <option value="line">Garis</option>
                <option value="pie">Lingkaran</option>
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Label (pisahkan koma)</label>
              <input value={(selected.labels || []).join(',')} onChange={(e) => updateElement(selected.id, { labels: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="input text-sm" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Data (pisahkan koma)</label>
              <input value={(selected.data || []).join(',')} onChange={(e) => updateElement(selected.id, { data: e.target.value.split(',').map((s) => Number(s.trim()) || 0) })} className="input text-sm" />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Warna</label>
              <input type="color" value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-700" />
            </div>
          </>
        )}
      </div>
    );
  };

  /* ---------- render ---------- */

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Studio Desain</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Editor desain ala Canva: teks, bentuk, sticker, QR, barcode, tabel, grafik, plus AI untuk membuat dan mengedit.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('editor')} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === 'editor' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-300'}`}>Editor</button>
          <button onClick={() => setTab('library')} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === 'library' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-300'}`}>Desain Saya</button>
        </div>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

      {tab === 'library' ? (
        <div className="space-y-4">
          <div className="card flex flex-wrap items-center gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari desain..." className="input flex-1 min-w-[200px]" />
            <select value={libraryCat} onChange={(e) => setLibraryCat(e.target.value)} className="input">
              <option value="">Semua kategori</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => { setSavedId(null); setDesign({ title: 'Desain Baru', width: 1200, height: 800, background: '#ffffff', elements: [] }); setTab('editor'); }} className="btn-primary">Desain Baru</button>
          </div>

          {myDesigns.length === 0 ? (
            <div className="card p-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Belum ada desain. Buat desain pertama dengan AI atau dari editor.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myDesigns.map((d) => (
                <div key={d.id} className="card group cursor-pointer overflow-hidden" onClick={() => openDesign(d.id)}>
                  <div
                    className="relative flex h-36 items-center justify-center border-b border-gray-100 dark:border-gray-800"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                  >
                    <div className="flex h-24 w-32 flex-col items-center justify-center rounded bg-white shadow-lg">
                      <span className="text-2xl">🎨</span>
                      <span className="mt-1 max-w-[100px] truncate px-1 text-[10px] font-medium text-gray-700">{d.title}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Hapus desain "${d.title}"?`)) deleteDesign(d.id); }}
                      className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{d.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{d.category} · {d.width}×{d.height} · {new Date(d.updated_at).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr_280px]">
          {/* SIDEBAR KIRI */}
          <div className="order-2 lg:order-1">
            <div className="card p-3 lg:sticky lg:top-4">
              <div className="mb-3 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                {[
                  { key: 'elements' as const, label: 'Elemen' },
                  { key: 'assets' as const, label: 'Gambar' },
                  { key: 'ai' as const, label: 'AI' },
                  { key: 'chat' as const, label: 'Chat AI' },
                ].map((p) => (
                  <button key={p.key} onClick={() => setPanel(p.key)} className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${panel === p.key ? 'bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {p.label}
                  </button>
                ))}
              </div>

              {panel === 'elements' && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">TEKS</p>
                    <button onClick={() => addElement({ type: 'text', text: 'Judul', fontSize: 48, color: '#111827', align: 'center' })} className="btn-secondary w-full justify-center text-xs">✚ Teks</button>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">BENTUK</p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['rect', 'rounded', 'circle', 'triangle', 'line'] as const).map((s) => (
                        <button key={s} onClick={() => addElement({ type: 'shape', shape: s, color: '#4F46E5' })} className="flex h-9 items-center justify-center rounded bg-gray-50 text-lg hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-gray-700" title={s}>
                          {s === 'rect' ? '▭' : s === 'rounded' ? '▢' : s === 'circle' ? '◯' : s === 'triangle' ? '△' : '▬'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">STICKER & IKON</p>
                    <div className="mb-2 grid grid-cols-6 gap-1">
                      {STICKERS.slice(0, 12).map((s) => (
                        <button key={s} onClick={() => addElement({ type: 'sticker', emoji: s })} className="flex h-8 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800">{s}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {ICONS.slice(0, 12).map((s) => (
                        <button key={s} onClick={() => addElement({ type: 'icon', icon: s, color: '#F59E0B' })} className="flex h-8 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800">{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">DATA & GRAFIS</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => addElement({ type: 'qr' })} className="btn-secondary justify-center text-xs">▪ QR Code</button>
                      <button onClick={() => addElement({ type: 'barcode' })} className="btn-secondary justify-center text-xs">▌ Barcode</button>
                      <button onClick={() => addElement({ type: 'table' })} className="btn-secondary justify-center text-xs">☰ Tabel</button>
                      <button onClick={() => addElement({ type: 'chart', chart: 'bar' })} className="btn-secondary justify-center text-xs">▤ Grafik</button>
                    </div>
                  </div>
                </div>
              )}

              {panel === 'assets' && (
                <div className="space-y-3">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  <button onClick={() => fileRef.current?.click()} className="btn-primary w-full justify-center text-xs">📤 Unggah Gambar</button>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Maksimal 5 MB. Gambar otomatis ditambahkan ke kanvas.</p>
                  <div className="max-h-72 space-y-1 overflow-y-auto">
                    {assets.length === 0 ? (
                      <p className="py-4 text-center text-xs text-gray-400">Belum ada gambar tersimpan.</p>
                    ) : (
                      assets.map((a) => (
                        <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-2 py-1.5 dark:border-gray-800">
                          <span className="min-w-0 flex-1 truncate text-xs text-gray-700 dark:text-gray-300">{a.name}</span>
                          <button onClick={() => useAsset(a)} className="shrink-0 text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">Pakai</button>
                          <button onClick={() => deleteAsset(a.id)} className="shrink-0 text-xs text-red-500 hover:underline">✕</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {panel === 'ai' && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Deskripsi desain</label>
                    <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={4} className="input text-sm" placeholder="Contoh: Poster jadwal piket kelas dengan tema warna biru, ada 5 kolom nama dan gambar sekolah" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                    <select value={aiCategory} onChange={(e) => setAiCategory(e.target.value)} className="input text-sm">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={generateDesign} disabled={aiBusy} className="btn-primary w-full justify-center text-sm">
                      {aiBusy ? 'Membuat desain...' : '✨ Generate dengan AI'}
                    </button>
                    <button onClick={remixDesign} disabled={aiBusy || design.elements.length === 0} className="btn-secondary w-full justify-center text-sm">
                      {aiBusy ? 'Memproses...' : '🔁 Remix desain saat ini'}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Generate membuat desain baru dari prompt. Remix mengubah desain yang sedang dibuka sesuai perintah.</p>
                </div>
              )}

              {panel === 'chat' && (
                <div className="flex h-[400px] flex-col">
                  <div className="mb-2 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                    <button
                      onClick={() => setChatMode('creatives')}
                      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${chatMode === 'creatives' ? 'bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      🎨 Creatives
                    </button>
                    <button
                      onClick={() => setChatMode('chatting')}
                      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${chatMode === 'chatting' ? 'bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      💬 Chatting
                    </button>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                    {chatMsgs.length === 0 ? (
                      chatMode === 'chatting' ? (
                        <p className="py-6 text-center text-xs text-gray-400 dark:text-gray-500">
                          Ngobrol bebas dengan AI, atau minta mengubah UI aplikasi. Contoh: "Ubah warna sidebar jadi biru", "Tambahkan halaman jadwal".
                        </p>
                      ) : (
                        <p className="py-6 text-center text-xs text-gray-400 dark:text-gray-500">Tanya apa saja tentang desain, warna, font, atau layout.</p>
                      )
                    ) : (
                      chatMsgs.map((m, i) => (
                        <div key={i} className={`max-w-[95%] rounded-lg px-2.5 py-1.5 text-xs ${m.role === 'user' ? 'ml-auto bg-primary-100 text-primary-900 dark:bg-primary-900/40 dark:text-primary-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                          {m.role === 'user' ? (
                            <span className="whitespace-pre-wrap">{m.content}</span>
                          ) : (
                            <div className="prose prose-xs dark:prose-invert max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0 [&>ul]:mt-1 [&>ul]:pl-4 [&>ol]:mt-1 [&>ol]:pl-4 [&>pre]:overflow-x-auto [&>pre]:rounded [&>pre]:bg-gray-200 [&>pre]:p-2 dark:[&>pre]:bg-gray-700 [&>code]:rounded [&>code]:bg-gray-200 [&>code]:px-1 dark:[&>code]:bg-gray-700">
                              <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {chatBusy && <div className="text-xs text-gray-400">Sedang mengetik...</div>}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !chatBusy) sendChat(); }}
                      placeholder={chatMode === 'chatting' ? 'Ketik pesan atau perintah UI...' : 'Ketik pesan...'}
                      className="input flex-1 text-sm"
                    />
                    <button onClick={sendChat} disabled={chatBusy} className="btn-primary shrink-0">➤</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KANVAS */}
          <div className="order-1 lg:order-2">
            <div className="card p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    value={design.title}
                    onChange={(e) => setDesign((d) => ({ ...d, title: e.target.value }))}
                    className="input max-w-[220px] text-sm"
                    placeholder="Judul desain"
                  />
                  {savedId ? (
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Tersimpan</span>
                  ) : (
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">Belum disimpan</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={downloadPng} className="btn-secondary text-xs">🖼 PNG</button>
                  <button onClick={downloadPdf} className="btn-secondary text-xs">📄 PDF</button>
                  <button onClick={saveDesign} disabled={saving} className="btn-primary text-xs">{saving ? 'Menyimpan...' : '💾 Simpan'}</button>
                </div>
              </div>

              <div className="flex justify-center overflow-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <div
                  ref={canvasWrapperRef}
                  className="relative shrink-0 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
                  style={{ width: design.width * scale, height: design.height * scale }}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerDown={() => setSelectedId(null)}
                >
                  <div
                    ref={canvasInnerRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: design.width,
                      height: design.height,
                      backgroundColor: design.background,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    {design.elements.map((el) => renderElement(el))}
                    {selected && (
                      <div
                        className="pointer-events-none absolute border-2 border-dashed border-primary-500"
                        style={{
                          left: selected.x - 4,
                          top: selected.y - 4,
                          width: (selected.width ?? selected.size ?? 120) + 8,
                          height: (selected.height ?? selected.size ?? 60) + 8,
                          transform: selected.rotation ? `rotate(${selected.rotation}deg)` : undefined,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
                Klik elemen untuk memilih & seret untuk memindahkan. Ukuran tampilan {Math.round(scale * 100)}% dari {design.width}×{design.height}px.
              </p>
            </div>
          </div>

          {/* SIDEBAR KANAN */}
          <div className="order-3">
            <div className="card p-4 lg:sticky lg:top-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Properti</h3>
              {renderProperties()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL REVIEW AI UI EDITOR */}
      {uiPatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setUiPatch(null)}>
          <div className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-xl bg-white p-5 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🖌️ AI UI Editor</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{uiPatch.summary || 'AI mengusulkan perubahan UI berikut. Tinjau sebelum diterapkan.'}</p>
              </div>
              <button onClick={() => setUiPatch(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
            </div>

            {uiPatch.changes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Perubahan Tema</p>
                {uiPatch.changes.map((ch, i) => {
                  const isColor = ch.key === 'accent' || ch.key === 'sidebar_bg' || ch.key === 'sidebar_text';
                  const oldVal = ch.key === 'accent' ? uiSettings.accent : ch.key === 'sidebar_bg' ? uiSettings.sidebar_bg : ch.key === 'sidebar_text' ? uiSettings.sidebar_text : ch.key === 'font' ? uiSettings.font : `${uiSettings.radius}px`;
                  return (
                    <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{ch.label || ch.key}</span>
                      <span className="flex items-center gap-2 text-sm">
                        <span className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500 line-through dark:border-gray-700">{oldVal}</span>
                        {isColor && <span className="h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: ch.value }} />}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{ch.value}{ch.key === 'radius' ? 'px' : ''}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {uiPatch.new_pages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Halaman & Menu Baru</p>
                {uiPatch.new_pages.map((p, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.icon} {p.title}</p>
                    <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs text-gray-500 dark:text-gray-400">{p.content.slice(0, 200)}{p.content.length > 200 ? '…' : ''}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={applyUiPatch} disabled={uiPatchBusy} className="btn-primary flex-1 justify-center">
                {uiPatchBusy ? 'Menerapkan...' : '✓ Terapkan Perubahan'}
              </button>
              <button onClick={() => setUiPatch(null)} className="btn-secondary">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
