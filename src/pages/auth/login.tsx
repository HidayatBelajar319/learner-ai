import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    requires_2fa?: boolean;
    user_id?: string;
    partial_token?: string;
    user?: {
      id: string;
      email: string;
      username: string;
      full_name: string;
      role: string;
      profile: Record<string, unknown>;
      preferences: Record<string, unknown>;
    };
    token?: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFA, setTwoFA] = useState<{ userId: string; partialToken: string } | null>(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post<LoginResponse>('/auth/login', { email, password });
      if (res.data.requires_2fa && res.data.user_id && res.data.partial_token) {
        setTwoFA({ userId: res.data.user_id, partialToken: res.data.partial_token });
        return;
      }
      setAuth({ ...res.data.user!, created_at: new Date().toISOString() }, res.data.token!);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal login');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFA = async () => {
    if (!twoFA || twoFACode.length !== 6) return;
    setTwoFALoading(true);
    setError('');
    try {
      const res = await api.post<LoginResponse>('/auth/2fa/validate', {
        user_id: twoFA.userId,
        token: twoFACode,
        partial_token: twoFA.partialToken,
      });
      setAuth({ ...res.data.user!, created_at: new Date().toISOString() }, res.data.token!);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kode 2FA tidak valid');
    } finally {
      setTwoFALoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-5xl">🧠</span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Learner AI</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Platform Pembelajaran Berbasis AI</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {twoFA ? 'Verifikasi 2FA' : 'Masuk'}
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {twoFA ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Masukkan kode 6 digit dari aplikasi authenticator:
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="input text-center font-mono text-lg tracking-widest"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setTwoFA(null); setTwoFACode(''); setError(''); }}
                  className="btn-secondary flex-1"
                >
                  Kembali
                </button>
                <button
                  onClick={handleTwoFA}
                  disabled={twoFALoading || twoFACode.length !== 6}
                  className="btn-primary flex-1"
                >
                  {twoFALoading ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          )}

          {!twoFA && (
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-primary-500 hover:text-primary-600">
                Daftar
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
