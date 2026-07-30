import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, '..', 'dist', 'index.html');
const outPath = resolve(__dirname, '..', 'src', 'asset-index.ts');

let html;
try {
  html = readFileSync(htmlPath, 'utf-8');
} catch {
  html = '<!DOCTYPE html><html><head><title>Learner AI</title></head><body><div id="root"></div></body></html>';
}

const escaped = html.replace(/`/g, '\\`').replace(/\$/g, '\\$');
writeFileSync(outPath, `const indexHtml = \`${escaped}\`;\nexport default indexHtml;\n`);
