import { useState, useEffect } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  total_users: number;
  total_sessions: number;
  total_quizzes: number;
  total_cards: number;
  total_certs: number;
  active_today: number;
  total_content: number;
}

interface AdminUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  is_active: number;
  created_at: string;
  total_xp: number | null;
}

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    if (!token) return;
    Promise.all([
      api.get<{ success: boolean; data: DashboardData }>('/admin/stats', token).then((r) => setData(r.data)).catch(() => null),
      api.get<{ success: boolean; data: AdminUser[] }>('/admin/users', token).then((r) => setUsers(r.data)).catch(() => null),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role, navigate]);

  const toggleUser = async (id: string) => {
    try {
      await api.post(`/admin/users/${id}/toggle`, {}, token);
      setMessage('Status user diperbarui');
      load();
    } catch (e: any) {
      setMessage(e?.message || 'Gagal update user');
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
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h2 className="font-bold text-amber-800 dark:text-amber-300">Admin Panel</h2>
            <p className="text-sm text-amber-600 dark:text-amber-400">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Admin</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola platform Learner AI</p>
        </div>
        {message && <span className="text-sm text-emerald-600 dark:text-emerald-400">{message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total User" icon="👥" value={data?.total_users ?? 0} />
        <StatCard label="Sesi Belajar" icon="📖" value={data?.total_sessions ?? 0} />
        <StatCard label="Quiz Dibuat" icon="📝" value={data?.total_quizzes ?? 0} />
        <StatCard label="Materi" icon="📚" value={data?.total_content ?? 0} />
        <StatCard label="Flashcards" icon="🃏" value={data?.total_cards ?? 0} />
        <StatCard label="Sertifikat" icon="🏆" value={data?.total_certs ?? 0} />
        <StatCard label="Aktif Hari Ini" icon="⚡" value={data?.active_today ?? 0} />
        <StatCard label="XP Total" icon="✨" value={users.reduce((s, u) => s + (u.total_xp || 0), 0)} />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">👥 Manajemen Pengguna</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aktifkan / nonaktifkan akun pengguna</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="pb-2 pr-4 font-medium">Nama</th>
                <th className="pb-2 pr-4 font-medium">Email</th>
                <th className="pb-2 pr-4 font-medium">Role</th>
                <th className="pb-2 pr-4 font-medium">XP</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800/50">
                  <td className="py-2 pr-4 font-medium text-gray-900 dark:text-gray-100">{u.full_name}</td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{u.total_xp ?? 0}</td>
                  <td className="py-2 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.is_active === 1 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                      {u.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => toggleUser(u.id)}
                      disabled={u.id === user?.id}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-40 dark:text-primary-400"
                    >
                      {u.id === user?.id ? '—' : u.is_active === 1 ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, icon, value }: { label: string; icon: string; value: number }) {
  return (
    <div className="card text-center">
      <span className="text-3xl">{icon}</span>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{value.toLocaleString('id-ID')}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
