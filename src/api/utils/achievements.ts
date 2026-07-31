import { generateId, now } from '@/api/utils/helpers';

export const ACHIEVEMENT_DEFS: Record<string, { title: string; description: string; icon: string }> = {
  first_lesson: { title: 'Langkah Pertama', description: 'Selesaikan materi pertamamu', icon: '🌱' },
  first_quiz: { title: 'Uji Coba', description: 'Kerjakan quiz pertamamu', icon: '📝' },
  quiz_10: { title: 'Kuis Cepat', description: 'Kerjakan 10 quiz', icon: '⚡' },
  xp_100: { title: 'Pencari Pengetahuan', description: 'Kumpulkan 100 XP', icon: '💡' },
  xp_500: { title: 'Serba Tahu', description: 'Kumpulkan 500 XP', icon: '🧠' },
  xp_1000: { title: 'Master Learner', description: 'Kumpulkan 1.000 XP', icon: '🏆' },
  streak_3: { title: 'Rajin', description: 'Streak 3 hari berturut-turut', icon: '🔥' },
  streak_7: { title: 'Konsisten', description: 'Streak 7 hari berturut-turut', icon: '⭐' },
  flashcard_10: { title: 'Pembuat Kartu', description: 'Buat 10 flashcard', icon: '🃏' },
  first_certificate: { title: 'Pencetak Prestasi', description: 'Raih sertifikat pertamamu', icon: '🎖️' },
};

export async function awardAchievement(db: D1Database, userId: string, type: string): Promise<boolean> {
  const def = ACHIEVEMENT_DEFS[type];
  if (!def) return false;

  const existing = await db
    .prepare('SELECT id FROM achievements WHERE user_id = ? AND type = ?')
    .bind(userId, type)
    .first();

  if (existing) return false;

  await db
    .prepare('INSERT INTO achievements (id, user_id, type, title, description, earned_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(generateId(), userId, type, def.title, def.description, now())
    .run();

  return true;
}

export async function bumpStreak(db: D1Database, userId: string): Promise<{ current: number; longest: number }> {
  const row = await db
    .prepare('SELECT current_streak, longest_streak, last_login FROM user_streaks WHERE user_id = ?')
    .bind(userId)
    .first<{ current_streak: number; longest_streak: number; last_login: string }>();

  const today = await db.prepare("SELECT date('now') as d").first<{ d: string }>();
  const yesterday = await db.prepare("SELECT date('now','-1 day') as d").first<{ d: string }>();

  let current = row?.current_streak ?? 0;
  const longest = row?.longest_streak ?? 0;
  const last = row?.last_login ? row.last_login.slice(0, 10) : '';

  if (last === today?.d) {
    // sudah dihitung hari ini
  } else if (last === yesterday?.d) {
    current += 1;
  } else {
    current = 1;
  }

  const newLongest = Math.max(longest, current);

  await db
    .prepare('UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_login = ? WHERE user_id = ?')
    .bind(current, newLongest, now(), userId)
    .run();

  return { current, longest: newLongest };
}

export async function checkXpAchievements(db: D1Database, userId: string, totalXp: number): Promise<void> {
  if (totalXp >= 100) await awardAchievement(db, userId, 'xp_100');
  if (totalXp >= 500) await awardAchievement(db, userId, 'xp_500');
  if (totalXp >= 1000) await awardAchievement(db, userId, 'xp_1000');
}

export async function checkStreakAchievements(db: D1Database, userId: string, streak: number): Promise<void> {
  if (streak >= 3) await awardAchievement(db, userId, 'streak_3');
  if (streak >= 7) await awardAchievement(db, userId, 'streak_7');
}
