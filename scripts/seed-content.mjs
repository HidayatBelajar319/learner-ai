// scripts/seed-content.mjs
// Menghasilkan migrations/0006_seed_curriculum.sql dari data kurikulum di scripts/curriculum/*.mjs
// Jalankan: node scripts/seed-content.mjs

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'curriculum');

function sqlString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

async function main() {
  const files = readdirSync(dataDir).filter((f) => f.endsWith('.mjs') && f !== 'index.mjs');
  const lessons = [];

  for (const file of files) {
    const mod = await import(pathToFileURL(join(dataDir, file)).href);
    const list = mod.default || [];
    lessons.push(...list);
  }

  const ids = new Set();
  for (const l of lessons) {
    if (ids.has(l.id)) throw new Error(`ID duplikat: ${l.id}`);
    ids.add(l.id);
  }

  const now = new Date().toISOString().slice(0, 23) + 'Z';
  const rows = lessons.map((l) => {
    const tags = JSON.stringify(l.tags || []).replace(/'/g, "''");
    const metadata = `{"tags":${tags}}`;
    const data = l.data.trim();
    return `('${sqlString(l.id)}', '${sqlString(l.title)}', '${sqlString(l.subject)}', '${sqlString(l.topic)}', '${sqlString(l.level)}', 'lesson', 'markdown', '${sqlString(data)}', '${sqlString(metadata)}', '${now}', '${now}')`;
  });

  // D1 membatasi ukuran per statement (SQLITE_TOOBIG), jadi satu INSERT per baris.
  const inserts = rows.map(
    (r) =>
      `INSERT OR REPLACE INTO content (id, title, subject, topic, level, type, format, data, metadata, created_at, updated_at) VALUES\n  ${r};`
  );

  const sql = `-- Migration: 0006_seed_curriculum.sql
-- Seed kurikulum lengkap SD-SMK untuk semua mata pelajaran
-- Dihasilkan otomatis oleh scripts/seed-content.mjs (jangan diedit manual)

${inserts.join('\n\n')}

`;

  const outPath = join(__dirname, '..', 'migrations', '0006_seed_curriculum.sql');
  writeFileSync(outPath, sql, 'utf-8');
  console.log(`OK: ${lessons.length} lesson ditulis ke ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
