/**
 * UIPatcher - Capture & Analisis UI Real-Time
 *
 * Mengekspor screenshot halaman website ke file PNG menggunakan Puppeteer.
 * Dipakai sebagai "mata" AI untuk mendeteksi error visual/UI pada LearnerAI.
 *
 * Usage:
 *   node capture.mjs [url] [output] [--full]
 *
 * Contoh:
 *   node capture.mjs http://localhost:5173 screenshot.png
 *   node capture.mjs http://localhost:5173/dashboard dash.png --full
 */

import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const url     = args[0] || 'http://localhost:5173';
const outArg  = args[1] || 'screenshot.png';
const full    = args.includes('--full');
const outPath = resolve(__dirname, 'output', outArg);

mkdirSync(dirname(outPath), { recursive: true });

console.log(`[UIPatcher] Menangkap UI dari: ${url}`);
console.log(`[UIPatcher] Output: ${outPath}`);
console.log(`[UIPatcher] Mode: ${full ? 'halaman penuh' : 'viewport'}`);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

try {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({
    path: outPath,
    fullPage: full,
  });

  console.log(`[UIPatcher] Screenshot berhasil disimpan: ${outPath}`);
} catch (err) {
  console.error(`[UIPatcher] Gagal menangkap UI: ${err.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
