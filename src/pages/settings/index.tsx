import { useState, useEffect } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { useThemeStore } from '@/contexts/theme-store';
import { api } from '@/lib/api';

interface Provider {
  name: string;
  label: string;
  defaultModel: string;
  models: string[];
  baseUrl?: string;
  customBaseUrl?: boolean;
  requiresKey?: boolean;
}

interface ApiKey {
  id: string;
  provider: string;
  model: string | null;
  base_url?: string | null;
  is_active: number;
  created_at: string;
}

const themeOptions = [
  { value: 'light', label: 'Terang' },
  { value: 'dark', label: 'Gelap' },
  { value: 'system', label: 'Ikuti Sistem' },
];

const PROVIDER_LABELS: Record<string, string> = {
  openrouter: 'OpenRouter',
  openai: 'OpenAI',
  mistral: 'Mistral AI',
  anthropic: 'Anthropic',
  google: 'Google Gemini',
  omniroute: 'OmniRoute (Local)',
  workersai: 'Workers AI',
  groq: 'Groq',
  deepseek: 'DeepSeek',
};

export default function Settings() {
  const { token } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [baseUrlValue, setBaseUrlValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pickTask, setPickTask] = useState('chat');
  const [pickPrefer, setPickPrefer] = useState('');
  const [picking, setPicking] = useState(false);
  const [pickResult, setPickResult] = useState<{
    best: { provider: string; model: string; score: number; reasons: string[] };
    ranking: Array<{ provider: string; model: string; score: number; reasons: string[] }>;
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get('/ai/providers', token).then((res: any) => {
      if (res.success) setProviders(res.data);
    });
    api.get('/ai/keys', token).then((res: any) => {
      if (res.success) setKeys(res.data);
    });
  }, [token]);

  const currentProvider = providers.find(p => p.name === selectedProvider);
  const existingKey = keys.find(k => k.provider === selectedProvider);

  async function handleSave() {
    if (!token || !selectedProvider) return;
    const provider = providers.find(p => p.name === selectedProvider);
    if (!provider) return;
    if (provider.requiresKey !== false && !keyValue) return;
    setSaving(true);
    try {
      const res: any = await api.post('/ai/keys', {
        provider: selectedProvider,
        key: keyValue || 'local',
        model: selectedModel || undefined,
        baseUrl: baseUrlValue || undefined,
      }, token);
      if (res.success) {
        const updated: any = await api.get('/ai/keys', token);
        if (updated.success) setKeys(updated.data);
        setKeyValue('');
        setBaseUrlValue('');
        setSelectedModel('');
        setTestResult({ ok: true, message: 'API key disimpan.' });
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: `❌ ${e.message || 'Gagal menyimpan API key'}` });
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!token || !selectedProvider) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res: any = await api.post('/ai/keys/test', {
        provider: selectedProvider,
        key: keyValue || undefined,
        baseUrl: baseUrlValue || undefined,
        model: selectedModel || undefined,
      }, token);
      if (res.success) {
        setTestResult({ ok: true, message: `✅ Koneksi berhasil (${res.data.model}, ${res.data.latency_ms}ms)` });
      } else {
        setTestResult({ ok: false, message: `❌ ${res.message}` });
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: `❌ ${e.message || 'Koneksi gagal'}` });
    } finally {
      setTesting(false);
    }
  }

  async function handleLoadModels() {
    if (!token || !selectedProvider) return;
    setLoadingModels(true);
    setTestResult(null);
    try {
      const res: any = await api.post('/ai/models', {
        provider: selectedProvider,
        key: keyValue || undefined,
        baseUrl: baseUrlValue || undefined,
      }, token);
      if (res.success && Array.isArray(res.data.models)) {
        setAvailableModels(res.data.models);
        setTestResult({ ok: true, message: `✅ ${res.data.models.length} model ditemukan. Pilih model lalu simpan.` });
        if (res.data.models.length === 0) {
          setTestResult({ ok: false, message: '⚠️ Tidak ada model yang ditemukan. Kamu bisa ketik nama model manual.' });
        }
      } else {
        setTestResult({ ok: false, message: `❌ ${res.message}` });
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: `❌ ${e.message || 'Gagal mengambil model'}` });
    } finally {
      setLoadingModels(false);
    }
  }

  async function handleDelete(provider: string) {
    if (!token) return;
    try {
      const res: any = await api.delete(`/ai/keys/${provider}`, token);
      if (res.success) {
        const updated: any = await api.get('/ai/keys', token);
        if (updated.success) setKeys(updated.data);
      }
    } catch {}
  }

  async function handleAutoPick() {
    if (!token) return;
    setPicking(true);
    setPickResult(null);
    try {
      const res: any = await api.post('/ai/auto-pick', {
        task: pickTask,
        ...(pickPrefer ? { prefer: pickPrefer } : {}),
      }, token);
      if (res.success) {
        setPickResult(res.data);
      } else {
        setPickResult(null);
        setTestResult({ ok: false, message: `❌ ${res.message}` });
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: `❌ ${e.message || 'Gagal memilih model'}` });
    } finally {
      setPicking(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Atur preferensi akun kamu</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profil</h2>
        <ProfileSection />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Peran Akun</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pilih peran kamu. Guru dan Siswa memiliki akses fitur yang sama; peran hanya menandai status.
        </p>
        <RoleSection token={token} />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preferensi</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Notifikasi</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dapatkan notifikasi aktivitas belajar</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-500 peer-checked:after:translate-x-full" />
            </label>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-900">Tema</label>
            <div className="flex gap-2">
              {themeOptions.map(o => (
                <button
                  key={o.value}
                  onClick={() => setTheme(o.value as any)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    theme === o.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {o.value === 'light' && '☀️ '}
                  {o.value === 'dark' && '🌙 '}
                  {o.value === 'system' && '💻 '}
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-900 dark:text-gray-100">Bahasa</label>
            <select className="input w-full" defaultValue="id">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🔐 Keamanan Akun</h2>

        <div className="mt-4 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Ganti Password</h3>
          <ChangePasswordSection token={token} />
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Autentikasi Dua Faktor (2FA)</h3>
          <TwoFASection token={token} />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">API Key AI (BYOK)</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gunakan API key kamu sendiri untuk akses AI</p>
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          ⚠️ <strong>OpenRouter memblokir server Cloudflare</strong>, jadi AI tidak bisa terhubung lewat provider itu.
          Gunakan <strong>Mistral AI, Groq, DeepSeek, OpenAI, Gemini, atau Anthropic</strong> agar AI berfungsi. Cek koneksi dengan tombol
          <strong> 🧪 Test Koneksi</strong> sebelum menyimpan.
        </p>

        <div className="mt-4 space-y-4">
          {keys.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key tersimpan:</p>
              {keys.map(k => {
                const prov = providers.find(p => p.name === k.provider);
                return (
                  <div key={k.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{prov?.label ?? k.provider}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {k.model || 'Model default'}
                        {k.base_url ? ` · ${k.base_url}` : ''}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(k.provider)} className="text-sm text-red-500 hover:text-red-700">
                      Hapus
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Provider</label>
              <select
                className="input w-full"
                value={selectedProvider}
                onChange={e => {
                  setSelectedProvider(e.target.value);
                  const prov = providers.find(p => p.name === e.target.value);
                  const existing = keys.find(k => k.provider === e.target.value);
                  setKeyValue('');
                  setBaseUrlValue(existing?.base_url || (prov?.customBaseUrl ? prov.baseUrl || '' : ''));
                  setSelectedModel(existing?.model || '');
                  setAvailableModels([]);
                  setTestResult(null);
                }}
              >
                <option value="">Pilih provider...</option>
                {providers.map(p => (
                  <option key={p.name} value={p.name}>{p.label}</option>
                ))}
              </select>
            </div>

            {currentProvider && (
              <>
                {testResult && (
                  <div className={`rounded-lg p-3 text-sm ${testResult.ok ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {testResult.message}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    API Key {currentProvider.requiresKey === false ? '(opsional untuk local)' : existingKey ? '(ganti)' : ''}
                  </label>
                  <input
                    type="password"
                    className="input w-full text-sm"
                    placeholder={existingKey ? '••••••••' : currentProvider.requiresKey === false ? 'Kosongkan jika tidak butuh key' : `Masukkan API key ${currentProvider.label}`}
                    value={keyValue}
                    onChange={e => setKeyValue(e.target.value)}
                  />
                </div>

                {currentProvider.customBaseUrl && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Endpoint URL</label>
                    <input
                      type="text"
                      className="input w-full text-sm"
                      placeholder={currentProvider.baseUrl || 'http://localhost:20128/v1'}
                      value={baseUrlValue}
                      onChange={e => setBaseUrlValue(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      OmniRoute lokal berjalan di <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">http://localhost:20128/v1</code>. Jalankan <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">wrangler dev</code> agar Worker bisa mengakses localhost.
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Model</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      list="ai-models"
                      className="input w-full text-sm"
                      placeholder={currentProvider.defaultModel ? `Default: ${currentProvider.defaultModel}` : 'Ketik nama model (misal: openai/gpt-4o-mini)'}
                      value={selectedModel}
                      onChange={e => setSelectedModel(e.target.value)}
                    />
                    <button
                      onClick={handleLoadModels}
                      disabled={loadingModels}
                      className="btn-secondary shrink-0 text-sm"
                    >
                      {loadingModels ? '...' : 'Muat Model'}
                    </button>
                  </div>
                  {availableModels.length > 0 && (
                    <>
                      <datalist id="ai-models">
                        {availableModels.map(m => <option key={m} value={m} />)}
                      </datalist>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {availableModels.length} model tersedia — ketik untuk memilih
                      </p>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving || !selectedProvider || (currentProvider.requiresKey !== false && !keyValue)}
                    className="btn-primary"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan API Key'}
                  </button>
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="btn-secondary"
                  >
                    {testing ? 'Menguji...' : '🧪 Test Koneksi'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🤖 Auto Pick Model</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Biarkan sistem memilih provider & model AI terbaik otomatis berdasarkan tugas dan key yang kamu punya.
        </p>

        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tugas</label>
              <select className="input w-full" value={pickTask} onChange={e => setPickTask(e.target.value)}>
                <option value="general">Umum</option>
                <option value="chat">Chat</option>
                <option value="coding">Coding</option>
                <option value="reasoning">Reasoning / Analisis</option>
                <option value="creative">Kreatif / Menulis</option>
                <option value="vision">Vision (Gambar)</option>
                <option value="image">Generate Gambar</option>
                <option value="fast">Cepat / Ringan</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Prioritas</label>
              <select className="input w-full" value={pickPrefer} onChange={e => setPickPrefer(e.target.value)}>
                <option value="">Seimbang</option>
                <option value="speed">Kecepatan</option>
                <option value="cost">Hemat Biaya</option>
              </select>
            </div>
          </div>

          <button onClick={handleAutoPick} disabled={picking} className="btn-primary">
            {picking ? 'Menganalisis...' : '🎯 Pilih Model Terbaik'}
          </button>

          {pickResult && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Model terbaik:</p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">{pickResult.best.model}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {PROVIDER_LABELS[pickResult.best.provider] ?? pickResult.best.provider} · skor {Math.round(pickResult.best.score)}/100
              </p>
              {pickResult.best.reasons.length > 0 && (
                <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-gray-600 dark:text-gray-400">
                  {pickResult.best.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              )}
            </div>
          )}

          {pickResult && pickResult.ranking.length > 1 && (
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Peringkat ({pickResult.ranking.length} tersedia):</p>
              <ol className="mt-2 space-y-1.5">
                {pickResult.ranking.map((r, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 dark:text-gray-200">
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">{i + 1}</span>
                      {r.model}
                      <span className="ml-2 text-xs text-gray-400">({PROVIDER_LABELS[r.provider] ?? r.provider})</span>
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{Math.round(r.score)}/100</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChangePasswordSection({ token }: { token: string | null }) {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = async () => {
    if (!token || !oldPwd || !newPwd) return;
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res: any = await api.post('/auth/change-password', { old_password: oldPwd, new_password: newPwd }, token);
      if (res.success) {
        setMessage('Password berhasil diubah!');
        setOldPwd('');
        setNewPwd('');
      }
    } catch (e: any) {
      setError(e.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {message && <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</p>}
      <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="Password lama" className="input w-full text-sm" />
      <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Password baru (min. 8 karakter)" className="input w-full text-sm" />
      <button onClick={handleChange} disabled={loading || !oldPwd || !newPwd} className="btn-primary text-sm">
        {loading ? 'Menyimpan...' : 'Simpan Password'}
      </button>
    </div>
  );
}

function TwoFASection({ token }: { token: string | null }) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState<{ secret: string; qr_otpauth: string; backup_codes: string[] } | null>(null);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    api.get('/auth/2fa/status', token).then((res: any) => {
      if (res.success) setEnabled(res.data.enabled);
    }).finally(() => setLoading(false));
  }, [token]);

  const handleSetup = async () => {
    if (!token) return;
    setMessage('');
    try {
      const res: any = await api.post('/auth/2fa/setup', {}, token);
      if (res.success) setSetupData(res.data);
    } catch (e: any) {
      setMessage(e.message || 'Gagal setup');
    }
  };

  const handleVerify = async () => {
    if (!token || !verifyToken) return;
    setVerifyLoading(true);
    setMessage('');
    try {
      const res: any = await api.post('/auth/2fa/verify', { token: verifyToken }, token);
      if (res.success) {
        setEnabled(true);
        setSetupData(null);
        setVerifyToken('');
        setMessage('✅ TOTP berhasil diaktifkan!');
      }
    } catch (e: any) {
      setMessage(e.message || 'Kode tidak valid');
    } finally {
      setVerifyLoading(false);
    }
  };

  if (loading) return <p className="mt-2 text-sm text-gray-400">Memuat...</p>;

  if (enabled) {
    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <span>✅</span> 2FA aktif
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {message && <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>}

      {!setupData ? (
        <button onClick={handleSetup} className="btn-secondary text-sm">
          Aktifkan 2FA
        </button>
      ) : (
        <div className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Setup Authenticator</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            1. Buka Google Authenticator atau Authy<br />
            2. Scan kode QR ini atau masukkan secret:
          </p>
          <div className="rounded bg-gray-100 p-2 text-xs font-mono break-all dark:bg-gray-800">
            {setupData.secret}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            3. Masukkan kode 6 digit dari aplikasi:
          </p>
          <div className="flex gap-2">
            <input value={verifyToken} onChange={e => setVerifyToken(e.target.value)} placeholder="000000" maxLength={6} className="input w-32 text-center font-mono text-lg" />
            <button onClick={handleVerify} disabled={verifyLoading || verifyToken.length !== 6} className="btn-primary text-sm">
              {verifyLoading ? '...' : 'Verifikasi'}
            </button>
          </div>
          <details className="text-xs text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">Lihat backup codes</summary>
            <div className="mt-2 space-y-1">
              {setupData.backup_codes.map((code, i) => (
                <p key={i} className="font-mono">{code}</p>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

function ProfileSection() {
  const { user, token, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [bio, setBio] = useState((user?.profile?.bio as string) || '');
  const [school, setSchool] = useState((user?.profile?.school as string) || '');
  const [grade, setGrade] = useState((user?.profile?.grade as string) || '');
  const [birthDate, setBirthDate] = useState((user?.profile?.birth_date as string) || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const avatar = (user?.profile?.avatar as string) || '';

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Ukuran foto maksimal 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setAvatarError('File harus berupa gambar');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res: any = await api.post('/auth/avatar', { avatar: reader.result }, token);
        if (res.success && user) {
          setUser({ ...user, profile: res.data.profile });
          setMessage('Foto profil berhasil diupdate');
        }
      } catch (err: any) {
        setAvatarError(err.message || 'Gagal upload foto profil');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res: any = await api.post('/auth/profile', {
        full_name: fullName,
        bio,
        school,
        grade,
        birth_date: birthDate,
      }, token);
      if (res.success && user) {
        setUser({ ...user, full_name: fullName.trim(), profile: res.data.profile });
        setMessage('Profil berhasil disimpan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {message && <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</p>}

      <div className="flex items-center gap-4">
        {avatar ? (
          <img src={avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
            {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            {avatar ? 'Ganti Foto' : 'Upload Foto'}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </label>
          {avatar && (
            <button
              onClick={async () => {
                try {
                  const res: any = await api.post('/auth/avatar', { avatar: '' }, token);
                  if (res.success && user) {
                    setUser({ ...user, profile: res.data.profile });
                    setMessage('Foto profil dihapus');
                  }
                } catch {}
              }}
              className="text-left text-xs text-red-500 hover:text-red-700"
            >
              Hapus foto
            </button>
          )}
          {avatarError && <p className="text-xs text-red-500">{avatarError}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input w-full text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input type="text" value={user?.email ?? ''} readOnly className="input w-full bg-gray-50 text-sm dark:bg-gray-800/50" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input type="text" value={user?.username ?? ''} readOnly className="input w-full bg-gray-50 text-sm dark:bg-gray-800/50" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Sekolah</label>
          <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="Nama sekolah kamu" className="input w-full text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
          <input type="text" value={grade} onChange={e => setGrade(e.target.value)} placeholder="Contoh: 7A" className="input w-full text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
          <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="input w-full text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Ceritakan tentang dirimu..." className="input w-full text-sm" />
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
        {saving ? 'Menyimpan...' : 'Simpan Profil'}
      </button>
    </div>
  );
}

function RoleSection({ token }: { token: string | null }) {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRole = async (role: 'student' | 'teacher') => {
    if (!token || !user || user.role === role || user.role === 'admin') return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res: any = await api.post('/auth/role', { role }, token);
      if (res.success && user) {
        setUser({ ...user, role });
        setMessage(res.message || (role === 'teacher' ? 'Akun diubah menjadi Guru' : 'Akun diubah menjadi Siswa'));
      }
    } catch (e: any) {
      setError(e.message || 'Gagal mengubah peran');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mt-4 space-y-4">
      {message && <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</p>}

      {user.role === 'admin' ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          Kamu login sebagai Admin, peran tidak dapat diubah.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => handleRole('student')}
            disabled={saving || user.role === 'student'}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              user.role === 'student'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'
            }`}
          >
            <p className="font-semibold text-gray-900 dark:text-gray-100">👨‍🎓 Siswa</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {user.role === 'student' ? 'Peran aktif saat ini' : 'Klik untuk beralih ke peran Siswa'}
            </p>
          </button>
          <button
            onClick={() => handleRole('teacher')}
            disabled={saving || user.role === 'teacher'}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              user.role === 'teacher'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'
            }`}
          >
            <p className="font-semibold text-gray-900 dark:text-gray-100">👩‍🏫 Guru</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {user.role === 'teacher' ? 'Peran aktif saat ini' : 'Klik untuk beralih ke peran Guru'}
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
