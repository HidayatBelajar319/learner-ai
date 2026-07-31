import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface StatsResponse {
  success: boolean;
  data: {
    xp: { total_xp: number; level: number };
    streak: { current: number; longest: number };
    sessions: { total: number; completed: number };
    total_duration_seconds: number;
  };
}

interface SubjectsResponse {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    levels: string[];
    topics_count: number;
  }>;
}

interface HistoryItem {
  id: string;
  activity_type: string;
  content_id: string | null;
  score: number | null;
  duration: number;
  completed_at: string;
}

interface AchievementItem {
  id: string;
  type: string;
  title: string;
  description: string;
  earned_at: string;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} jam ${minutes} menit`;
  return `${minutes} menit`;
}

const activityLabels: Record<string, { label: string; icon: string }> = {
  material: { label: 'Membaca materi', icon: '📖' },
  exercise: { label: 'Mengerjakan latihan', icon: '✏️' },
  quiz: { label: 'Menyelesaikan quiz', icon: '📝' },
};

const achievementIcons: Record<string, string> = {
  first_lesson: '🌱',
  first_quiz: '📝',
  quiz_10: '⚡',
  xp_100: '💡',
  xp_500: '🧠',
  xp_1000: '🏆',
  streak_3: '🔥',
  streak_7: '⭐',
  flashcard_10: '🃏',
  first_certificate: '🎖️',
};

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const { data: statsData } = useQuery<StatsResponse>({
    queryKey: ['learning-stats'],
    queryFn: () => api.get('/learning/stats', token),
  });

  const { data: subjectsData } = useQuery<SubjectsResponse>({
    queryKey: ['subjects'],
    queryFn: () => api.get('/content/subjects', token),
  });

  const { data: historyData } = useQuery<{ success: boolean; data: HistoryItem[] }>({
    queryKey: ['learning-history'],
    queryFn: () => api.get('/learning/history?limit=30', token),
  });

  const { data: achievementsData } = useQuery<{ success: boolean; data: AchievementItem[] }>({
    queryKey: ['achievements'],
    queryFn: () => api.get('/learning/achievements', token),
  });

  const stats = statsData?.data;
  const subjects = subjectsData?.data ?? [];
  const history = historyData?.data ?? [];
  const achievements = achievementsData?.data ?? [];

  const xp = stats?.xp.total_xp ?? 0;
  const level = stats?.xp.level ?? 1;

  const weekDays = buildWeekDays(history);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
            Hai, {user?.full_name ?? 'Pengguna'}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Ayo lanjutkan belajarmu hari ini</p>
        </div>
        <Link to="/practice" className="btn-primary">
          Mulai Latihan
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard color="indigo" label="Level" value={`${level}`} sub={`${xp} XP`} />
        <StatCard color="emerald" label="Streak" value={`${stats?.streak.current ?? 0}`} sub={`Tertinggi: ${stats?.streak.longest ?? 0} hari`} />
        <StatCard color="amber" label="Selesai" value={`${stats?.sessions.completed ?? 0}`} sub={`Dari ${stats?.sessions.total ?? 0} sesi`} />
        <StatCard color="blue" label="Waktu Belajar" value={formatDuration(stats?.total_duration_seconds ?? 0)} sub="Total belajar" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🔥 Streak Minggu Ini</h2>
            <span className="text-sm font-bold text-orange-500">{stats?.streak.current ?? 0} hari</span>
          </div>
          <div className="mt-4 flex justify-between gap-1">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{day.label}</span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                    day.active
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300'
                      : 'bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600'
                  }`}
                >
                  {day.active ? '🔥' : '·'}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Belajar setiap hari untuk menjaga streakmu tetap menyala
          </p>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🏅 Pencapaian</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{achievements.length} terkumpul</span>
          </div>
          {achievements.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Belum ada pencapaian. Selesaikan materi & quiz untuk mengumpulkan badge!
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {achievements.slice(0, 10).map((a) => (
                <div key={a.id} className="flex flex-col items-center rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-900/20">
                  <span className="text-2xl">{achievementIcons[a.type] ?? '🎖️'}</span>
                  <span className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">{a.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Aktivitas Terbaru</h2>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Belum ada aktivitas belajar.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {history.slice(0, 6).map((item) => {
                const meta = activityLabels[item.activity_type] ?? { label: item.activity_type, icon: '📚' };
                return (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">{meta.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{meta.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {item.activity_type === 'quiz' && item.score != null ? `Skor ${item.score} · ` : ''}
                        {formatTime(item.completed_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Mata Pelajaran</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => navigate(`/learn/${subject.id}`)}
                className="card text-left transition-shadow hover:shadow-md"
              >
                <span className="text-3xl">{subject.icon}</span>
                <h3 className="mt-3 font-semibold text-gray-900">{subject.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{subject.description}</p>
                <p className="mt-2 text-xs font-medium text-primary-500">{subject.topics_count} topik</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildWeekDays(history: HistoryItem[]): Array<{ label: string; active: boolean }> {
  const days: Array<{ label: string; date: string; active: boolean }> = [];
  const activeSet = new Set(
    history
      .map((h) => h.completed_at.slice(0, 10))
      .filter(Boolean),
  );

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      label: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()],
      date: iso,
      active: activeSet.has(iso),
    });
  }

  return days;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function StatCard({ color, label, value, sub }: { color: string; label: string; value: string; sub: string }) {
  const colors: Record<string, { bg: string; text: string; sub: string }> = {
    indigo: { bg: 'bg-indigo-50 border-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-900/50', text: 'text-indigo-700 dark:text-indigo-300', sub: 'text-indigo-500 dark:text-indigo-400' },
    emerald: { bg: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', sub: 'text-emerald-500 dark:text-emerald-400' },
    amber: { bg: 'bg-amber-50 border-amber-100 dark:bg-amber-950/50 dark:border-amber-900/50', text: 'text-amber-700 dark:text-amber-300', sub: 'text-amber-500 dark:text-amber-400' },
    blue: { bg: 'bg-blue-50 border-blue-100 dark:bg-blue-950/50 dark:border-blue-900/50', text: 'text-blue-700 dark:text-blue-300', sub: 'text-blue-500 dark:text-blue-400' },
  };
  const c = colors[color] || colors.indigo;
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${c.bg}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className={`mt-1 text-2xl font-bold sm:text-3xl ${c.text}`}>{value}</p>
      <p className={`mt-1 text-xs ${c.sub}`}>{sub}</p>
    </div>
  );
}
