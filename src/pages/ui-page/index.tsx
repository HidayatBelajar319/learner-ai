import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export default function UiPageView() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !id) return;
    let alive = true;
    setLoading(true);
    api.get<{ success: boolean; data: any }>(`/ui/pages/${id}`, token)
      .then((res) => { if (alive) setPage(res.data); })
      .catch((e: any) => { if (alive) setError(e?.message || 'Halaman tidak ditemukan'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="mx-auto max-w-2xl px-4 text-center">
        <p className="text-gray-500">{error || 'Halaman tidak ditemukan'}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">← Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          <span>{page.icon}</span> {page.title}
        </h1>
        <Link to="/ui-editor" className="text-xs font-medium text-primary-600 hover:underline">Edit lewat AI UI</Link>
      </div>
      <div className="card">
        <article className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:list-disc dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300">
          <ReactMarkdown>{page.content || '_Halaman kosong._'}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
