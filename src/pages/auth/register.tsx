import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      full_name: string;
      role: string;
    };
    token: string;
  };
  errors?: string[];
}

export default function Register() {
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors([]);
    setLoading(true);

    try {
      const res = await api.post<RegisterResponse>('/auth/register', form);
      setAuth({ ...res.data.user, profile: {}, preferences: { theme: 'system', language: 'id', notifications: true }, created_at: new Date().toISOString() }, res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal mendaftar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-5xl">🧠</span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Learner AI</h1>
          <p className="mt-2 text-gray-500">Buat akun baru</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Daftar</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <ul className="list-inside list-disc space-y-1">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Nama kamu"
                required
                className="input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Contoh: andi123"
                required
                className="input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                required
                className="input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                required
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-600">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
