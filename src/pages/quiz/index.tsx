import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/contexts/auth-store';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface QuizResponse {
  success: boolean;
  data: {
    id: string;
    subject: string;
    topic: string;
    level: string;
    source?: 'ai' | 'template';
    questions: Question[];
  };
}

interface SubmitResponse {
  success: boolean;
  data: {
    score: number;
    correct: number;
    total: number;
    xp_gained: number;
    results: Array<{
      question_id: number;
      question: string;
      correct: number;
      correct_answer: string;
      explanation: string | null;
      user_answer: number;
      is_correct: boolean;
    }>;
  };
}

const subjects = [
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

const levels = ['Dasar', 'Menengah', 'Mahir'];

interface QuizPrefill {
  subject?: string;
  topic?: string;
  level?: string;
  count?: number;
}

export default function Quiz() {
  const { token } = useAuthStore();
  const location = useLocation();
  const prefill = (location.state ?? {}) as QuizPrefill;
  const [subject, setSubject] = useState(prefill.subject ?? 'mathematics');
  const [topic, setTopic] = useState(prefill.topic ?? '');
  const [level, setLevel] = useState(prefill.level ?? 'Dasar');
  const [count, setCount] = useState(prefill.count ?? 5);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizSource, setQuizSource] = useState<'ai' | 'template' | null>(null);
  const [quizId, setQuizId] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultData, setResultData] = useState<SubmitResponse['data'] | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!topic.trim()) {
      setError('Masukkan topik yang ingin dipelajari');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post<QuizResponse>('/evaluation/quizzes/generate', { subject, topic, level, count }, token);
      setQuestions(res.data.questions);
      setQuizSource(res.data.source ?? null);
      setQuizId(res.data.id);
      setAnswers([]);
      setResultData(null);
      setSubmitError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefill.topic) {
      handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQ] = idx;
      return copy;
    });
    if (idx === questions[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentQ === questions.length - 1) {
      setSubmitting(true);
      setSubmitError('');
      try {
        const res = await api.post<SubmitResponse>(`/evaluation/quizzes/${quizId}/submit`, { answers }, token);
        setResultData(res.data);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Gagal menyimpan hasil quiz');
      } finally {
        setSubmitting(false);
        setShowResult(true);
      }
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 dark:border-primary-800 dark:border-t-primary-400" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Membuat soal...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const displayScore = resultData ? resultData.score : Math.round((score / questions.length) * 100);
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="w-full max-w-md px-4 text-center">
          <span className="text-6xl">🎉</span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Quiz Selesai!</h1>
          {resultData ? (
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Kamu menjawab {resultData.correct} benar dari {resultData.total} soal
            </p>
          ) : (
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Kamu mendapat skor {score} dari {questions.length}
            </p>
          )}
          <div className="mt-6 text-5xl font-bold text-primary-500">
            {displayScore}%
          </div>
          {resultData && (
            <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              +{resultData.xp_gained} XP
            </p>
          )}
          {submitError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {submitError}
            </div>
          )}
          <button onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); setSelected(null); setAnswered(false); setQuestions([]); setTopic(''); setQuizId(''); setAnswers([]); setResultData(null); setSubmitError(''); }} className="btn-primary mt-8">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-6 px-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quiz</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Uji pemahamanmu dengan quiz</p>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mata Pelajaran</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input">{subjects.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Topik</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Contoh: Aljabar, Tata Bahasa" className="input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="input">{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah Soal</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="input">{[3, 5, 10].map((n) => <option key={n} value={n}>{n} soal</option>)}</select>
          </div>
          <button onClick={handleStart} className="btn-primary w-full">Mulai Quiz</button>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="mx-auto max-w-2xl px-4">
      {quizSource === 'template' && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          ⚠️ AI tidak terhubung, quiz memakai bank soal offline. Hubungkan API key AI (Mistral/OpenAI/Gemini/Anthropic) di Pengaturan agar soal dibuat AI.
        </div>
      )}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Pertanyaan {currentQ + 1} dari {questions.length}</span>
          <span>Skor: {score}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{question.question}</h2>

        <div className="mt-6 space-y-3">
          {question.options.map((opt, idx) => {
            let optionClass = 'w-full rounded-lg border p-3 text-left text-sm transition-colors';
            if (answered) {
              if (idx === question.correct) optionClass += ' border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
              else if (idx === selected) optionClass += ' border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400';
              else optionClass += ' border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400';
            } else {
              optionClass += ' border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/20';
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} className={optionClass} disabled={answered}>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <button onClick={handleNext} disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? 'Menyimpan...' : currentQ === questions.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'}
          </button>
        )}
      </div>
    </div>
  );
}
