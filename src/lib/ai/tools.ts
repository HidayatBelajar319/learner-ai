import { Env } from '@/types';

export interface ToolParameter {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  description?: string;
  enum?: string[];
  required?: boolean;
  items?: ToolParameter;
  properties?: Record<string, ToolParameter>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  execute: (args: Record<string, any>, ctx: ToolContext) => Promise<any>;
}

export interface ToolContext {
  env: Env;
  userId: string;
  email: string;
}

export const TOOLS: ToolDefinition[] = [
  {
    name: 'get_subjects',
    description: 'Mendapatkan daftar semua mata pelajaran yang tersedia di Learner AI',
    parameters: {},
    async execute(_args, ctx) {
      const rows = await ctx.env.LEARNER_DB
        .prepare('SELECT DISTINCT subject FROM content ORDER BY subject')
        .all();
      const subjects = rows.results.map((r: any) => r.subject);
      if (subjects.length === 0) {
        return {
          default: ['mathematics', 'bahasa-indonesia', 'bahasa-inggris', 'ipa', 'ips', 'pemrograman', 'bahasa-asing', 'keterampilan', 'pendidikan-agama', 'pancasila', 'pjok', 'informatika', 'seni-budaya', 'prakarya', 'sejarah', 'kewirausahaan'],
        };
      }
      return { subjects };
    },
  },
  {
    name: 'get_topics',
    description: 'Mendapatkan daftar topik dari suatu mata pelajaran. Parameter subject adalah id mata pelajaran (contoh: mathematics, ipa, pemrograman).',
    parameters: {
      subject: { type: 'string', description: 'Id mata pelajaran', required: true },
      level: { type: 'string', description: 'Level (opsional): SD, SMP, SMA, Pemula, Menengah, Mahir', required: false },
    },
    async execute(args, ctx) {
      const { subject, level } = args;
      let sql = 'SELECT id, title, topic, level, type FROM content WHERE subject = ?';
      const params: string[] = [subject];
      if (level) {
        sql += ' AND level = ?';
        params.push(level);
      }
      sql += ' ORDER BY level, title LIMIT 30';
      const rows = await ctx.env.LEARNER_DB.prepare(sql).bind(...params).all();
      return { topics: rows.results };
    },
  },
  {
    name: 'get_content',
    description: 'Mendapatkan materi pembelajaran lengkap berdasarkan id konten',
    parameters: {
      content_id: { type: 'string', description: 'Id konten', required: true },
    },
    async execute(args, ctx) {
      const item = await ctx.env.LEARNER_DB
        .prepare('SELECT id, title, subject, topic, level, type, format, data, metadata FROM content WHERE id = ?')
        .bind(args.content_id)
        .first();
      if (!item) return { error: 'Konten tidak ditemukan' };
      return item;
    },
  },
  {
    name: 'search_content',
    description: 'Mencari materi pembelajaran berdasarkan kata kunci',
    parameters: {
      query: { type: 'string', description: 'Kata kunci pencarian', required: true },
      subject: { type: 'string', description: 'Filter mata pelajaran (opsional)', required: false },
    },
    async execute(args, ctx) {
      const keyword = `%${args.query}%`;
      let sql = 'SELECT id, title, subject, topic, level, type FROM content WHERE (title LIKE ? OR topic LIKE ?)';
      const params: string[] = [keyword, keyword];
      if (args.subject) {
        sql += ' AND subject = ?';
        params.push(args.subject);
      }
      sql += ' LIMIT 15';
      const rows = await ctx.env.LEARNER_DB.prepare(sql).bind(...params).all();
      return { results: rows.results };
    },
  },
  {
    name: 'get_user_stats',
    description: 'Mendapatkan statistik belajar user: XP, level, streak, jumlah sesi',
    parameters: {},
    async execute(_args, ctx) {
      const xp = await ctx.env.LEARNER_DB
        .prepare('SELECT total_xp, level FROM user_xp WHERE user_id = ?')
        .bind(ctx.userId)
        .first();
      const streak = await ctx.env.LEARNER_DB
        .prepare('SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = ?')
        .bind(ctx.userId)
        .first();
      const sessions = await ctx.env.LEARNER_DB
        .prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as completed FROM learning_sessions WHERE user_id = ?')
        .bind('completed', ctx.userId)
        .first();
      return {
        xp: xp ?? { total_xp: 0, level: 1 },
        streak: streak ?? { current_streak: 0, longest_streak: 0 },
        sessions: sessions ?? { total: 0, completed: 0 },
      };
    },
  },
  {
    name: 'get_learning_history',
    description: 'Mendapatkan riwayat belajar user (quiz, materi yang dipelajari)',
    parameters: {
      limit: { type: 'integer', description: 'Jumlah maksimal (default 10)', required: false },
    },
    async execute(args, ctx) {
      const limit = Math.min(Number(args.limit) || 10, 50);
      const rows = await ctx.env.LEARNER_DB
        .prepare('SELECT activity_type, content_id, score, duration, completed_at FROM learning_history WHERE user_id = ? ORDER BY completed_at DESC LIMIT ?')
        .bind(ctx.userId, limit)
        .all();
      return { history: rows.results };
    },
  },
  {
    name: 'suggest_study_plan',
    description: 'Membuat rencana belajar harian berdasarkan topik yang ingin dipelajari',
    parameters: {
      subject: { type: 'string', description: 'Mata pelajaran', required: true },
      topic: { type: 'string', description: 'Topik yang ingin dipelajari', required: true },
      minutes: { type: 'integer', description: 'Durasi belajar per hari (default 30)', required: false },
    },
    async execute(args) {
      return {
        plan: {
          subject: args.subject,
          topic: args.topic,
          daily_minutes: Number(args.minutes) || 30,
          steps: [
            `Pelajari konsep dasar ${args.topic}`,
            `Kerjakan 5 soal latihan tentang ${args.topic}`,
            `Review ulang bagian yang belum paham`,
            `Kerjakan quiz tentang ${args.topic} untuk mengukur pemahaman`,
          ],
        },
      };
    },
  },
];

export function getTool(name: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.name === name);
}

export function toolSchemas() {
  return TOOLS.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(t.parameters).map(([k, v]) => {
            const { required, ...rest } = v;
            return [k, rest];
          }),
        ),
        required: Object.entries(t.parameters)
          .filter(([, v]) => v.required)
          .map(([k]) => k),
      },
    },
  }));
}
