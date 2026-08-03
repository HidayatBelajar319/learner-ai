import { lazy, Suspense, useEffect, Component, type ReactNode } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { useThemeStore } from '@/contexts/theme-store';
import { api } from '@/lib/api';
import RootLayout from '@/components/layout/root-layout';

const Dashboard = lazy(() => import('@/pages/dashboard'));
const Login = lazy(() => import('@/pages/auth/login'));
const Register = lazy(() => import('@/pages/auth/register'));
const Learn = lazy(() => import('@/pages/learn'));
const Practice = lazy(() => import('@/pages/practice'));
const Quiz = lazy(() => import('@/pages/quiz'));
const Flashcards = lazy(() => import('@/pages/flashcards'));
const CustomQuiz = lazy(() => import('@/pages/custom-quiz'));
const Certificates = lazy(() => import('@/pages/certificates'));
const Playground = lazy(() => import('@/pages/playground'));
const Visual = lazy(() => import('@/pages/visual'));
const Social = lazy(() => import('@/pages/social'));
const AiChat = lazy(() => import('@/pages/ai-chat'));
const Creatives = lazy(() => import('@/pages/creatives'));
const UiEditor = lazy(() => import('@/pages/ui-editor'));
const UiPageView = lazy(() => import('@/pages/ui-page'));
const Settings = lazy(() => import('@/pages/settings'));
const AdminDashboard = lazy(() => import('@/pages/admin'));
const TermsOfService = lazy(() => import('@/pages/tos'));
const PrivacyPolicy = lazy(() => import('@/pages/privacy'));

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 text-5xl">😵</div>
            <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Oops! Terjadi kesalahan</h1>
            <p className="mb-6 break-words text-sm text-gray-500 dark:text-gray-400">{error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}

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
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
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
            <Route path="ai-chat" element={<AiChat />} />
            <Route path="learn" element={<Learn />} />
            <Route path="learn/:subjectId" element={<Learn />} />
            <Route path="learn/:subjectId/:contentId" element={<Learn />} />
            <Route path="practice" element={<Practice />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="quiz/custom" element={<CustomQuiz />} />
            <Route path="custom-quiz" element={<Navigate to="/quiz/custom" replace />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="playground" element={<Playground />} />
            <Route path="visual" element={<Visual />} />
            <Route path="creatives" element={<Creatives />} />
            <Route path="ui-editor" element={<UiEditor />} />
            <Route path="ui/page/:id" element={<UiPageView />} />
            <Route path="social" element={<Social />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
