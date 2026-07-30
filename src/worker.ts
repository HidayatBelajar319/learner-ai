import { Hono } from 'hono';
import manifest from '__STATIC_CONTENT_MANIFEST';
import { Env } from '@/types';
import { getCorsHeaders } from '@/api/utils/helpers';
import auth from '@/api/auth';
import content from '@/api/content';
import learning from '@/api/learning';

const app = new Hono<{ Bindings: Env }>();

app.use('/api/*', async (c, next) => {
  const corsHeaders = getCorsHeaders(c.env);
  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  await next();
  Object.entries(corsHeaders).forEach(([key, val]) => c.res.headers.set(key, val));
});

app.route('/api/auth', auth);
app.route('/api/content', content);
app.route('/api/learning', learning);

app.get('/api/health', (c) =>
  c.json({ success: true, message: 'Learner AI API berjalan', version: '0.1.0' }),
);

app.notFound((c) => c.json({ success: false, message: 'Endpoint tidak ditemukan' }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, message: 'Terjadi kesalahan server' }, 500);
});

const MIME: Record<string, string> = {
  html: 'text/html', css: 'text/css', js: 'application/javascript',
  json: 'application/json', svg: 'image/svg+xml', png: 'image/png',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', ico: 'image/x-icon', txt: 'text/plain',
  xml: 'application/xml', wasm: 'application/wasm', map: 'application/json',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env);
    }

    try {
      const assetPath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      const hashedKey = manifest[assetPath];

      if (hashedKey) {
        const content = await env.__STATIC_CONTENT.get(hashedKey, 'arrayBuffer');
        if (content !== null) {
          const ext = assetPath.split('.').pop() || '';
          return new Response(content, {
            headers: { 'Content-Type': MIME[ext] || 'application/octet-stream' },
          });
        }
      }

      const indexKey = manifest['index.html'];
      if (indexKey) {
        const html = await env.__STATIC_CONTENT.get(indexKey, 'text');
        if (html !== null) {
          return new Response(html, {
            headers: { 'Content-Type': 'text/html' },
          });
        }
      }

      return new Response('Not Found', { status: 404 });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
};
