import { Hono } from 'hono';
import indexHtml from './asset-index';
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env);
    }

    return new Response(indexHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};
