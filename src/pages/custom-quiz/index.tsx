import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

type QuestionType = 'multiple_choice' | 'true_false' | 'checkbox' | 'fill_blank' | 'short_answer' | 'matching' | 'essay';

interface Question {
  type: QuestionType;
  prompt: string;
  points: number;
  options?: string[];
  correct?: number | number[] | boolean;
  answers?: string[];
  pairs?: Array<{ left: string; rightIndex: number }>;
  explanation?: string;
}

interface QuizMeta {
  id: string;
  title: string;
  subject: string;
  description: string;
  timer_minutes: number;
  created_at: string;
  updated_at: string;
}

const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  checkbox: 'Pilihan Ganda (lebih dari satu)',
  fill_blank: 'Isian Singkat',
  short_answer: 'Jawaban Singkat',
  matching: 'Menjodohkan',
  essay: 'Essay',
};

const SUBJECTS = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPA',
  'IPS',
  'Pemrograman',
  'Pendidikan Agama',
  'Pancasila',
  'PJOK',
  'Informatika',
  'Seni dan Budaya',
  'Sejarah',
  'Umum',
];

const newQuestion = (type: QuestionType): Question => {
  const base: Question = { type, prompt: '', points: 1 };
  switch (type) {
    case 'multiple_choice':
      return { ...base, options: ['', '', '', ''], correct: 0 };
    case 'true_false':
      return { ...base, correct: true };
    case 'checkbox':
      return { ...base, options: ['', '', '', ''], correct: [] };
    case 'fill_blank':
    case 'short_answer':
      return { ...base, answers: [''] };
    case 'matching':
      return { ...base, pairs: [{ left: '', rightIndex: 0 }, { left: '', rightIndex: 1 }], options: ['', ''] };
    case 'essay':
      return base;
    default:
      return base;
  }
};

export default function CustomQuiz() {
  const { token } = useAuthStore();

  const [quizzes, setQuizzes] = useState<QuizMeta[]>([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const [view, setView] = useState<'list' | 'edit' | 'take' | 'result'>('list');
  const [editing, setEditing] = useState<{ id: string | null; title: string; subject: string; description: string; timer_minutes: number; questions: Question[] }>({ id: null, title: '', subject: 'Umum', description: '', timer_minutes: 0, questions: [] });

  const [activeQuiz, setActiveQuiz] = useState<QuizMeta | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<any>(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadQuizzes = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (subjectFilter) params.set('subject', subjectFilter);
      const qs = params.toString();
      const res = await api.get<{ success: boolean; data: QuizMeta[] }>(`/evaluation/custom-quizzes${qs ? `?${qs}` : ''}`, token);
      if (res.success) setQuizzes(res.data);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat quiz');
    }
  };

  useEffect(() => { loadQuizzes(); }, [token, search, subjectFilter]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startEdit = (quiz?: QuizMeta & { questions?: Question[] }) => {
    if (quiz) {
      setEditing({ id: quiz.id, title: quiz.title, subject: quiz.subject || 'Umum', description: quiz.description || '', timer_minutes: quiz.timer_minutes || 0, questions: quiz.questions || [] });
    } else {
      setEditing({ id: null, title: '', subject: 'Umum', description: '', timer_minutes: 0, questions: [] });
    }
    setError('');
    setMessage('');
    setView('edit');
  };

  const updateQ = (idx: number, patch: Partial<Question>) => {
    setEditing((e) => ({ ...e, questions: e.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)) }));
  };

  const addQuestion = (type: QuestionType) => {
    setEditing((e) => ({ ...e, questions: [...e.questions, newQuestion(type)] }));
  };

  const removeQuestion = (idx: number) => {
    setEditing((e) => ({ ...e, questions: e.questions.filter((_, i) => i !== idx) }));
  };

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    setEditing((e) => {
      const qs = [...e.questions];
      const target = idx + dir;
      if (target < 0 || target >= qs.length) return e;
      [qs[idx], qs[target]] = [qs[target], qs[idx]];
      return { ...e, questions: qs };
    });
  };

  const saveQuiz = async () => {
    if (!editing.title.trim()) {
      setError('Judul quiz wajib diisi');
      return;
    }
    if (editing.questions.length === 0) {
      setError('Tambahkan minimal 1 soal');
      return;
    }
    const invalidIdx = editing.questions.findIndex((q) => !q.prompt.trim());
    if (invalidIdx >= 0) {
      setError(`Soal nomor ${invalidIdx + 1} belum memiliki pertanyaan`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = {
        title: editing.title.trim(),
        subject: editing.subject,
        description: editing.description,
        timer_minutes: Number(editing.timer_minutes) || 0,
        questions: editing.questions,
      };
      if (editing.id) {
        await api.put(`/evaluation/custom-quizzes/${editing.id}`, body, token);
        setMessage('Quiz diperbarui.');
      } else {
        await api.post('/evaluation/custom-quizzes', body, token);
        setMessage('Quiz berhasil dibuat.');
      }
      await loadQuizzes();
      setView('list');
    } catch (e: any) {
      setError(e?.message || 'Gagal menyimpan quiz');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm('Hapus quiz ini?')) return;
    try {
      await api.delete(`/evaluation/custom-quizzes/${id}`, token);
      await loadQuizzes();
    } catch (e: any) {
      setError(e?.message || 'Gagal menghapus quiz');
    }
  };

  const startTake = async (quiz: QuizMeta) => {
    try {
      const res = await api.get<{ success: boolean; data: { questions: Question[]; timer_minutes: number; title: string } }>(`/evaluation/custom-quizzes/${quiz.id}`, token);
      if (res.success) {
        setActiveQuiz(quiz);
        setQuestions(res.data.questions);
        setAnswers({});
        setResult(null);
        const mins = res.data.timer_minutes || 0;
        setSecondsLeft(mins > 0 ? mins * 60 : 0);
        setError('');
        setMessage('');
        setView('take');
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat quiz');
    }
  };

  useEffect(() => {
    if (view !== 'take' || secondsLeft <= 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          submitAnswers();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [view, secondsLeft]);

  const submitAnswers = async () => {
    if (!activeQuiz || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; data: any }>(`/evaluation/custom-quizzes/${activeQuiz.id}/submit`, { answers: Object.entries(answers).map(([k, v]) => ({ question_index: Number(k), value: v })) }, token);
      if (res.success) {
        setResult(res.data);
        setView('result');
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal mengumpulkan jawaban');
      setView('take');
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((k) => {
      const v = answers[Number(k)];
      if (v === undefined || v === null || v === '') return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return true;
    }).length;
  }, [answers]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  /* ---------- list view ---------- */
  if (view === 'list') {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quiz Kustom</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Buat quiz sendiri dengan 7 tipe soal dan kerjakan dengan timer.</p>
          </div>
          <button onClick={() => startEdit()} className="btn-primary">+ Quiz Baru</button>
        </div>

        {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</div>}
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

        <div className="card flex flex-wrap items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari quiz..." className="input flex-1 min-w-[200px]" />
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="input">
            <option value="">Semua mapel</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {quizzes.length === 0 ? (
          <div className="card p-10 text-center">
            <span className="text-5xl">📝</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Belum ada quiz kustom</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Buat quiz pertama untuk murid atau latihanmu.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q) => (
              <div key={q.id} className="card flex flex-col">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{q.title}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {q.subject || 'Umum'} · {q.timer_minutes > 0 ? `${q.timer_minutes} menit` : 'Tanpa timer'}
                </p>
                {q.description && <p className="mt-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{q.description}</p>}
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <button onClick={() => startTake(q)} className="btn-primary flex-1 text-xs">Kerjakan</button>
                  <button onClick={async () => {
                    try {
                      const res = await api.get<{ success: boolean; data: any }>(`/evaluation/custom-quizzes/${q.id}`, token);
                      if (res.success) startEdit({ ...q, questions: res.data.questions });
                    } catch (e: any) { setError(e?.message || 'Gagal memuat quiz'); }
                  }} className="btn-secondary flex-1 text-xs">Edit</button>
                  <button onClick={() => deleteQuiz(q.id)} className="text-xs text-red-600 hover:underline dark:text-red-400">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------- result view ---------- */
  if (view === 'result' && result && activeQuiz) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4">
        <div className="card text-center">
          <span className="text-6xl">{result.score >= 80 ? '🏆' : result.score >= 50 ? '💪' : '📚'}</span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">{result.score}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Skor kamu</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Benar {result.earned} dari {result.total} poin · +{result.xp_gained} XP
          </p>
          <div className="mx-auto mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${result.score}%` }} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button onClick={() => startTake(activeQuiz)} className="btn-primary text-sm">Kerjakan Lagi</button>
            <button onClick={() => setView('list')} className="btn-secondary text-sm">Kembali ke Daftar</button>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pembahasan</h2>
          {result.results.map((r: any, i: number) => (
            <div key={i} className={`card border-l-4 ${r.is_correct ? 'border-emerald-500' : r.type === 'essay' ? 'border-sky-500' : 'border-red-500'}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {i + 1}. {r.prompt}
                  {r.type === 'essay' && <span className="ml-2 rounded bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Dikerjakan</span>}
                </p>
                <span className={`shrink-0 text-xs font-semibold ${r.is_correct ? 'text-emerald-600' : 'text-red-600'}`}>
                  {r.is_correct ? `✓ +${r.points}` : `✗ 0/${r.points}`}
                </span>
              </div>
              {r.is_correct === false && r.correct_answer !== null && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  Jawaban benar: <span className="font-semibold">
                    {typeof r.correct_answer === 'object'
                      ? Array.isArray(r.correct_answer)
                        ? r.correct_answer.map((c: any) => typeof c === 'number' ? (r.options?.[c] ?? String(c)) : String(c)).join(', ')
                        : JSON.stringify(r.correct_answer)
                      : String(r.correct_answer)}
                  </span>
                </p>
              )}
              {r.type === 'matching' && r.is_correct === false && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">Jawabanmu: {JSON.stringify(r.user_answer)}</p>
              )}
              {r.explanation && <p className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">💡 {r.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- take view ---------- */
  if (view === 'take' && activeQuiz) {
    const renderAnswer = (q: Question, idx: number) => {
      switch (q.type) {
        case 'multiple_choice':
          return (
            <div className="space-y-2">
              {q.options?.map((opt, oi) => (
                <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm ${answers[idx] === oi ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name={`q${idx}`} checked={answers[idx] === oi} onChange={() => setAnswers((a) => ({ ...a, [idx]: oi }))} className="accent-primary-600" />
                  <span className="text-gray-700 dark:text-gray-300">{String.fromCharCode(65 + oi)}. {opt}</span>
                </label>
              ))}
            </div>
          );
        case 'true_false':
          return (
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <label key={String(v)} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm ${answers[idx] === v ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name={`q${idx}`} checked={answers[idx] === v} onChange={() => setAnswers((a) => ({ ...a, [idx]: v }))} className="accent-primary-600" />
                  {v ? 'Benar' : 'Salah'}
                </label>
              ))}
            </div>
          );
        case 'checkbox':
          return (
            <div className="space-y-2">
              {q.options?.map((opt, oi) => (
                <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm ${(answers[idx] || []).includes(oi) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="checkbox" checked={(answers[idx] || []).includes(oi)} onChange={() => setAnswers((a) => {
                    const cur: number[] = a[idx] || [];
                    const next = cur.includes(oi) ? cur.filter((x) => x !== oi) : [...cur, oi];
                    return { ...a, [idx]: next };
                  })} className="accent-primary-600" />
                  {opt}
                </label>
              ))}
            </div>
          );
        case 'fill_blank':
        case 'short_answer':
          return (
            <input
              value={answers[idx] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [idx]: e.target.value }))}
              placeholder="Ketik jawaban..."
              className="input"
            />
          );
        case 'matching':
          return (
            <div className="space-y-2">
              {q.pairs?.map((p, pi) => (
                <div key={pi} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">{p.left || `Item ${pi + 1}`}</span>
                  <select
                    value={answers[idx]?.[pi] ?? ''}
                    onChange={(e) => setAnswers((a) => ({ ...a, [idx]: { ...(a[idx] || {}), [pi]: Number(e.target.value) } }))}
                    className="input flex-1 text-sm"
                  >
                    <option value="">Pilih pasangan...</option>
                    {q.options?.map((opt, oi) => (
                      <option key={oi} value={oi}>{String.fromCharCode(65 + oi)}. {opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          );
        case 'essay':
          return (
            <textarea
              value={answers[idx] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [idx]: e.target.value }))}
              rows={4}
              placeholder="Tulis jawaban esai..."
              className="input"
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{activeQuiz.title}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{questions.length} soal · {answeredCount}/{questions.length} terjawab</p>
          </div>
          <div className="flex items-center gap-3">
            {secondsLeft > 0 && (
              <span className={`rounded-lg px-3 py-1.5 text-sm font-bold ${secondsLeft <= 60 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                ⏱ {fmtTime(secondsLeft)}
              </span>
            )}
            <button onClick={submitAnswers} disabled={submitting} className="btn-primary text-sm">
              {submitting ? 'Mengirim...' : 'Kumpulkan'}
            </button>
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

        {questions.map((q, i) => (
          <div key={i} className="card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {i + 1}. {q.prompt}
              </p>
              <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {TYPE_LABELS[q.type]} · {q.points} poin
              </span>
            </div>
            {renderAnswer(q, i)}
          </div>
        ))}

        <div className="flex justify-center pb-8">
          <button onClick={submitAnswers} disabled={submitting} className="btn-primary">
            {submitting ? 'Mengirim...' : 'Kumpulkan Jawaban'}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- edit view ---------- */
  const renderEditor = (q: Question, idx: number) => {
    return (
      <div key={idx} className="card space-y-3 border-l-4 border-primary-400">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Soal {idx + 1}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => moveQuestion(idx, -1)} disabled={idx === 0} className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800">↑</button>
            <button onClick={() => moveQuestion(idx, 1)} disabled={idx === editing.questions.length - 1} className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800">↓</button>
            <button onClick={() => removeQuestion(idx)} className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30">Hapus</button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Pertanyaan</label>
            <input value={q.prompt} onChange={(e) => updateQ(idx, { prompt: e.target.value })} className="input text-sm" placeholder="Tulis pertanyaan..." />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Poin</label>
            <input type="number" min={1} value={q.points} onChange={(e) => updateQ(idx, { points: Math.max(1, Number(e.target.value) || 1) })} className="input text-sm" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Tipe soal</label>
          <select value={q.type} onChange={(e) => updateQ(idx, { type: e.target.value as QuestionType })} className="input text-sm">
            {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
        </div>

        {q.type === 'multiple_choice' || q.type === 'checkbox' ? (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Pilihan</label>
            {q.options?.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <span className="w-5 text-xs font-semibold text-gray-500">{String.fromCharCode(65 + oi)}.</span>
                <input
                  value={opt}
                  onChange={(e) => updateQ(idx, { options: q.options?.map((o, j) => (j === oi ? e.target.value : o)) })}
                  className="input flex-1 text-sm"
                  placeholder={`Pilihan ${String.fromCharCode(65 + oi)}`}
                />
                {q.type === 'multiple_choice' ? (
                  <button
                    onClick={() => updateQ(idx, { correct: oi })}
                    className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${q.correct === oi ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}
                  >
                    {q.correct === oi ? '✓ Kunci' : 'Jadikan Kunci'}
                  </button>
                ) : (
                  <button
                    onClick={() => updateQ(idx, { correct: (q.correct as number[] || []).includes(oi) ? (q.correct as number[]).filter((x) => x !== oi) : [...(q.correct as number[] || []), oi] })}
                    className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${(q.correct as number[] || []).includes(oi) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}
                  >
                    {(q.correct as number[] || []).includes(oi) ? '✓' : 'Tandai'}
                  </button>
                )}
                {oi === q.options!.length - 1 && (
                  <button onClick={() => updateQ(idx, { options: [...(q.options || []), ''] })} className="shrink-0 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">+</button>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {q.type === 'true_false' ? (
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <button key={String(v)} onClick={() => updateQ(idx, { correct: v })} className={`rounded-lg px-4 py-2 text-sm font-medium ${q.correct === v ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}>
                {v ? 'Benar' : 'Salah'}
              </button>
            ))}
            <span className="self-center text-xs text-gray-500 dark:text-gray-400">Kunci: {q.correct ? 'Benar' : 'Salah'}</span>
          </div>
        ) : null}

        {(q.type === 'fill_blank' || q.type === 'short_answer') ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Jawaban yang benar (pisahkan koma untuk beberapa alternatif)</label>
            <input
              value={(q.answers || []).join(', ')}
              onChange={(e) => updateQ(idx, { answers: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              className="input text-sm"
              placeholder="Contoh: Jakarta, jakarta"
            />
          </div>
        ) : null}

        {q.type === 'matching' ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Kolom kanan (opsi menjodohkan)</label>
              {q.options?.map((opt, oi) => (
                <div key={oi} className="mb-1 flex items-center gap-2">
                  <span className="w-5 text-xs font-semibold text-gray-500">{String.fromCharCode(65 + oi)}.</span>
                  <input value={opt} onChange={(e) => updateQ(idx, { options: q.options?.map((o, j) => (j === oi ? e.target.value : o)) })} className="input flex-1 text-sm" placeholder={`Jawaban ${String.fromCharCode(65 + oi)}`} />
                  {oi === q.options!.length - 1 && (
                    <button onClick={() => updateQ(idx, { options: [...(q.options || []), ''] })} className="shrink-0 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">+</button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Pasangan (kiri → kanan)</label>
              {q.pairs?.map((p, pi) => (
                <div key={pi} className="mb-1 flex items-center gap-2">
                  <input value={p.left} onChange={(e) => updateQ(idx, { pairs: q.pairs?.map((pp, j) => (j === pi ? { ...pp, left: e.target.value } : pp)) })} className="input flex-1 text-sm" placeholder="Item kiri" />
                  <span className="text-xs text-gray-400">→</span>
                  <select value={p.rightIndex} onChange={(e) => updateQ(idx, { pairs: q.pairs?.map((pp, j) => (j === pi ? { ...pp, rightIndex: Number(e.target.value) } : pp)) })} className="input w-24 text-sm">
                    {q.options?.map((_, oi) => <option key={oi} value={oi}>{String.fromCharCode(65 + oi)}</option>)}
                  </select>
                  {pi === q.pairs!.length - 1 ? (
                    <button onClick={() => updateQ(idx, { pairs: [...(q.pairs || []), { left: '', rightIndex: 0 }] })} className="shrink-0 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">+</button>
                  ) : (
                    <button onClick={() => updateQ(idx, { pairs: q.pairs?.filter((_, j) => j !== pi) })} className="shrink-0 rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Pembahasan (opsional)</label>
          <input value={q.explanation || ''} onChange={(e) => updateQ(idx, { explanation: e.target.value })} className="input text-sm" placeholder="Penjelasan jawaban..." />
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{editing.id ? 'Edit Quiz' : 'Buat Quiz Baru'}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Susun soal dengan berbagai tipe.</p>
        </div>
        <button onClick={() => setView('list')} className="btn-secondary text-sm">← Kembali</button>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

      <div className="card space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul quiz</label>
          <input value={editing.title} onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))} className="input" placeholder="Contoh: Ulangan Harian Aljabar" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mata Pelajaran</label>
            <select value={editing.subject} onChange={(e) => setEditing((s) => ({ ...s, subject: e.target.value }))} className="input">
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Timer (menit, 0 = tanpa timer)</label>
            <input type="number" min={0} max={180} value={editing.timer_minutes} onChange={(e) => setEditing((s) => ({ ...s, timer_minutes: Number(e.target.value) || 0 }))} className="input" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (opsional)</label>
          <textarea value={editing.description} onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} rows={2} className="input" placeholder="Petunjuk atau keterangan quiz..." />
        </div>
      </div>

      <div className="card space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tambahkan Soal</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => (
            <button key={t} onClick={() => addQuestion(t)} className="btn-secondary text-xs">{TYPE_LABELS[t]}</button>
          ))}
        </div>
      </div>

      {editing.questions.length === 0 ? (
        <div className="card p-8 text-center text-sm text-gray-500 dark:text-gray-400">Belum ada soal. Pilih tipe soal di atas untuk mulai.</div>
      ) : (
        editing.questions.map((q, i) => renderEditor(q, i))
      )}

      <div className="flex gap-2 pb-8">
        <button onClick={saveQuiz} disabled={saving} className="btn-primary flex-1">
          {saving ? 'Menyimpan...' : editing.id ? 'Simpan Perubahan' : 'Simpan Quiz'}
        </button>
        <button onClick={() => setView('list')} className="btn-secondary">Batal</button>
      </div>
    </div>
  );
}
