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
  inactive_reason: string | null;
  created_at: string;
  total_xp: number | null;
}

type ModalAction = 'deactivate' | 'activate' | 'delete';

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ user: AdminUser; action: ModalAction } | null>(null);
  const [reason, setReason] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

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

  const openModal = (u: AdminUser, action: ModalAction) => {
    setReason('');
    setError('');
    setModal({ user: u, action });
  };

  const closeModal = () => {
    if (modalLoading) return;
    setModal(null);
    setReason('');
  };

  const confirmModal = async () => {
    if (!modal) return;
    const { user: target, action } = modal;
    const requiresReason = action === 'deactivate' || action === 'delete';
    if (requiresReason && reason.trim().length < 3) {
      setError('Alasan wajib diisi (minimal 3 karakter)');
      return;
    }
    setModalLoading(true);
    setError('');
    setMessage('');
    try {
      if (action === 'delete') {
        await api.post(`/admin/users/${target.id}/delete`, { reason }, token);
        setMessage(`Akun ${target.email} berhasil dihapus`);
      } else {
        await api.post(`/admin/users/${target.id}/toggle`, action === 'deactivate' ? { reason } : {}, token);
        setMessage(action === 'deactivate' ? `Akun ${target.email} dinonaktifkan` : `Akun ${target.email} diaktifkan`);
      }
      closeModal();
      load();
    } catch (e: any) {
      setError(e?.message || 'Gagal memproses permintaan');
    } finally {
      setModalLoading(false);
    }
  };

  const changeRole = async (u: AdminUser, role: string) => {
    if (u.role === role) return;
    setError('');
    setMessage('');
    try {
      await api.post(`/admin/users/${u.id}/role`, { role }, token);
      setMessage(`Role ${u.email} diubah menjadi ${role}`);
      load();
    } catch (e: any) {
      setError(e?.message || 'Gagal mengubah role');
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
        {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
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
                    {u.role === 'admin' ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                        admin
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u, e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <option value="student">Siswa</option>
                        <option value="teacher">Guru</option>
                        <option value="premium">Premium</option>
                      </select>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{u.total_xp ?? 0}</td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${u.is_active === 1 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                        {u.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                      </span>
                      {u.is_active !== 1 && u.inactive_reason && (
                        <span className="max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400" title={u.inactive_reason}>
                          {u.inactive_reason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openModal(u, u.is_active === 1 ? 'deactivate' : 'activate')}
                        disabled={u.id === user?.id}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-40 dark:text-primary-400"
                      >
                        {u.id === user?.id ? '—' : u.is_active === 1 ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      {u.id !== user?.id && (
                        <button
                          onClick={() => openModal(u, 'delete')}
                          className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {modal.action === 'delete' ? 'Hapus Akun' : modal.action === 'deactivate' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {modal.user.full_name} &lt;{modal.user.email}&gt;
            </p>

            {modal.action === 'delete' && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Akun akan dihapus permanen beserta seluruh data (XP, sesi, quiz, sertifikat, dll). Tidak bisa dikembalikan.
              </div>
            )}

            {(modal.action === 'deactivate' || modal.action === 'delete') && (
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alasan {modal.action === 'delete' ? 'penghapusan' : 'penonaktifan'} (akan ditampilkan ke pemilik akun)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Contoh: banyak akun testing, akun spam, dll."
                  className="input"
                />
              </div>
            )}

            {modal.action === 'activate' && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Akun akan diaktifkan kembali dan bisa login seperti biasa.
              </p>
            )}

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} disabled={modalLoading} className="btn-secondary">
                Batal
              </button>
              <button
                onClick={confirmModal}
                disabled={modalLoading}
                className={modal.action === 'delete' ? 'btn-danger' : 'btn-primary'}
              >
                {modalLoading ? 'Memproses...' : modal.action === 'delete' ? 'Ya, Hapus Akun' : modal.action === 'deactivate' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}
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
