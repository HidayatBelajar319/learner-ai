import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { useThemeStore } from '@/contexts/theme-store';
import { api } from '@/lib/api';
import RootLayout from '@/components/layout/root-layout';
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import Learn from '@/pages/learn';
import Practice from '@/pages/practice';
import Quiz from '@/pages/quiz';
import Flashcards from '@/pages/flashcards';
import Certificates from '@/pages/certificates';
import Playground from '@/pages/playground';
import Visual from '@/pages/visual';
import Social from '@/pages/social';
import Settings from '@/pages/settings';
import AdminDashboard from '@/pages/admin';
import TermsOfService from '@/pages/tos';
import PrivacyPolicy from '@/pages/privacy';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const { resolved } = useThemeStore();
  const { token, setUser, setLoading, clearAuth, setAccountNotice } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    setAccountNotice(null);
    api.get<{ success: boolean; data: any }>('/auth/me', token)
      .then((res) => {
        if (!active) return;
        setUser(res.data);
        const status = res.data?.account_status;
        if (status?.inactive) {
          setAccountNotice({ inactive: true, reason: status.reason ?? null, deleted: false });
          if (status.force_logout) {
            clearAuth();
            navigate('/login', {
              replace: true,
              state: { message: status.reason ? `Akun kamu dinonaktifkan. Alasan: ${status.reason}` : 'Akun kamu dinonaktifkan.' },
            });
          }
        }
      })
      .catch((e: any) => {
        if (!active) return;
        if (e.status === 410 && e.data?.account_deleted) {
          clearAuth();
          navigate('/login', { replace: true, state: { message: e.message } });
        } else if (e.status === 401 || e.status === 404) {
          clearAuth();
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, navigate, setUser, setLoading, clearAuth, setAccountNotice]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const store = useThemeStore.getState();
      if (store.theme === 'system') {
        const r = mq.matches ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', r === 'dark');
        store.resolved = r;
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/tos" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="learn" element={<Learn />} />
        <Route path="learn/:subjectId" element={<Learn />} />
        <Route path="learn/:subjectId/:contentId" element={<Learn />} />
        <Route path="practice" element={<Practice />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="playground" element={<Playground />} />
        <Route path="visual" element={<Visual />} />
        <Route path="social" element={<Social />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
