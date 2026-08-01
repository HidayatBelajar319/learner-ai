import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { useUiStore } from '@/contexts/ui-settings-store';
import XpProgress from '@/components/learning/xp-progress';
import Logo from '@/components/brand/logo';
const baseNavItems = [
  { to: '/dashboard', label: 'Beranda', icon: '🏠' },
  { to: '/learn', label: 'Belajar', icon: '📚' },
  { to: '/practice', label: 'Latihan', icon: '✏️' },
  { to: '/quiz', label: 'Quiz', icon: '📝' },
  { to: '/custom-quiz', label: 'Quiz Kustom', icon: '📝' },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { to: '/certificates', label: 'Sertifikat', icon: '🏆' },
  { to: '/playground', label: 'Playground', icon: '💻' },
  { to: '/visual', label: 'Visual', icon: '🧠' },
  { to: '/creatives', label: 'Desain', icon: '🎨' },
  { to: '/ui-editor', label: 'AI UI', icon: '🖌️' },
  { to: '/social', label: 'Sosial', icon: '👥' },
  { to: '/settings', label: 'Pengaturan', icon: '⚙️' },
];

export default function RootLayout() {
  const { user, clearAuth, accountNotice } = useAuthStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const { pages, load } = useUiStore();

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  const navItems = user?.role === 'admin'
    ? [...baseNavItems, { to: '/admin', label: 'Admin', icon: '🛡️' }]
    : baseNavItems;

  const customMenu = pages.map((p) => ({ to: `/ui/page/${p.id}`, label: p.title, icon: p.icon || '📄' }));

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'teacher' ? 'Guru' : user?.role === 'premium' ? 'Premium' : 'Siswa';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {accountNotice?.inactive && !noticeDismissed && (
        <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 bg-red-600 px-4 py-2.5 text-sm text-white shadow-md dark:bg-red-700">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>
              Akun kamu dinonaktifkan{accountNotice.reason ? ` karena ${accountNotice.reason}` : ''}. Kamu akan keluar otomatis setelah beberapa saat.
            </span>
          </div>
          <button
            onClick={() => setNoticeDismissed(true)}
            className="shrink-0 rounded px-2 py-0.5 text-xs font-semibold text-white/80 hover:bg-white/20 hover:text-white"
          >
            Tutup
          </button>
        </div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 transition-transform dark:border-gray-800 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: 'var(--ui-sidebar-bg)', color: 'var(--ui-sidebar-text)' }}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6 dark:border-gray-800" style={{ borderColor: 'var(--ui-sidebar-text, #e5e7eb)' }}>
          <Logo size={28} />
          <span className="text-lg font-bold" style={{ color: 'var(--ui-sidebar-text)' }}>
            Learner<span className="text-primary-500">AI</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: 'var(--ui-sidebar-active-bg)', color: 'var(--ui-sidebar-active-text)' }
                  : { color: 'var(--ui-sidebar-text)' }
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          {customMenu.length > 0 && (
            <>
              <div className="pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ui-sidebar-text)', opacity: 0.6 }}>
                Halaman Kustom
              </div>
              {customMenu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { backgroundColor: 'var(--ui-sidebar-active-bg)', color: 'var(--ui-sidebar-active-text)' }
                      : { color: 'var(--ui-sidebar-text)' }
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="border-t border-gray-100 p-3 dark:border-gray-800">
          <XpProgress compact />
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 sm:px-8">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="flex items-center justify-end gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.full_name}
                {(user?.role === 'admin' || user?.role === 'teacher') && (
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {roleLabel}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            {(user?.profile?.avatar as string) ? (
              <img
                src={user?.profile?.avatar as string}
                alt="avatar"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                {user?.full_name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <button onClick={handleLogout} className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              Keluar
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-gray-200 bg-white py-2 dark:border-gray-800 dark:bg-gray-900 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
                isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
