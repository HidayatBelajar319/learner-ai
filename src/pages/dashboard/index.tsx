import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} jam ${minutes} menit`;
  return `${minutes} menit`;
}

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

  const stats = statsData?.data;
  const subjects = subjectsData?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hai, {user?.full_name ?? 'Pengguna'}! 👋
        </h1>
        <p className="mt-1 text-gray-500">Ayo lanjutkan belajarmu hari ini</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
          <p className="text-sm font-medium text-indigo-600">Level</p>
          <p className="mt-1 text-3xl font-bold text-indigo-700">
            {stats?.xp.level ?? 1}
          </p>
          <p className="mt-1 text-xs text-indigo-500">
            {stats?.xp.total_xp ?? 0} XP
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-600">Streak</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">
            {stats?.streak.current ?? 0} 🔥
          </p>
          <p className="mt-1 text-xs text-emerald-500">
            Tertinggi: {stats?.streak.longest ?? 0} hari
          </p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-600">Selesai</p>
          <p className="mt-1 text-3xl font-bold text-amber-700">
            {stats?.sessions.completed ?? 0}
          </p>
          <p className="mt-1 text-xs text-amber-500">
            Dari {stats?.sessions.total ?? 0} sesi
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-medium text-blue-600">Waktu Belajar</p>
          <p className="mt-1 text-3xl font-bold text-blue-700">
            {formatDuration(stats?.total_duration_seconds ?? 0)}
          </p>
          <p className="mt-1 text-xs text-blue-500">Total belajar</p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mata Pelajaran</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => navigate(`/learn/${subject.id}`)}
              className="card text-left transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{subject.icon}</span>
              <h3 className="mt-3 font-semibold text-gray-900">{subject.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{subject.description}</p>
              <p className="mt-2 text-xs font-medium text-primary-500">
                {subject.topics_count} topik
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
