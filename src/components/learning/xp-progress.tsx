import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/contexts/auth-store';

interface StatsData {
  xp: { total_xp: number; level: number };
  streak: { current: number; longest: number };
  sessions: { total: number; completed: number };
  total_duration_seconds: number;
}

interface StatsResponse {
  success: boolean;
  data: StatsData;
}

export default function XpProgress({ compact = false }: { compact?: boolean }) {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get<StatsResponse>('/learning/stats', token).then((res) => {
      setStats(res.data);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [token]);

  if (loading || !stats) return null;

  const { xp, streak } = stats;
  const xpInLevel = xp.total_xp % 100;
  const xpPercent = Math.min((xpInLevel / 100) * 100, 100);

  if (compact) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 p-3 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">Lv {xp.level}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{xp.total_xp} XP</span>
          </div>
          <span className="text-xs text-orange-500">🔥 {streak.current} hari</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="mt-1 text-right text-[10px] text-gray-400 dark:text-gray-500">
          {xpInLevel}/100 ke Lv {xp.level + 1}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Level {xp.level}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400">{xp.total_xp} Total XP</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>🔥 {streak.current} hari</span>
        </div>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-500"
          style={{ width: `${xpPercent}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-gray-400 dark:text-gray-500">
        {xpInLevel}/100 XP ke Level {xp.level + 1}
      </p>
    </div>
  );
}
