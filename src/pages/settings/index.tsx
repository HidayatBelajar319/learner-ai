import { useAuthStore } from '@/contexts/auth-store';

export default function Settings() {
  const { user } = useAuthStore();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="mt-1 text-gray-500">Atur preferensi akun kamu</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900">Profil</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" value={user?.full_name ?? ''} readOnly className="input bg-gray-50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={user?.email ?? ''} readOnly className="input bg-gray-50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input type="text" value={user?.username ?? ''} readOnly className="input bg-gray-50" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900">Preferensi</h2>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notifikasi</p>
              <p className="text-sm text-gray-500">Dapatkan notifikasi aktivitas belajar</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-500 peer-checked:after:translate-x-full" />
            </label>
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-900">Bahasa</label>
            <select className="input" defaultValue="id">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
