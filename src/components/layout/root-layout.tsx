import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';

const navItems = [
  { to: '/dashboard', label: 'Beranda', icon: '🏠' },
  { to: '/learn', label: 'Belajar', icon: '📚' },
  { to: '/practice', label: 'Latihan', icon: '✏️' },
  { to: '/quiz', label: 'Quiz', icon: '📝' },
  { to: '/settings', label: 'Pengaturan', icon: '⚙️' },
];

export default function RootLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
          <span className="text-2xl">🧠</span>
          <span className="text-lg font-bold text-primary-500">Learner</span>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ml-64 flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-end gap-4 border-b border-gray-100 bg-white px-8">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
              <p className="text-xs text-gray-500">Level {user?.xp?.level ?? 1}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {user?.full_name?.charAt(0)?.toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Keluar
            </button>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
