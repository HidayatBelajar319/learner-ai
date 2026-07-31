import { useEffect, useRef, useState } from 'react';

let mermaidPromise: Promise<typeof import('mermaid')> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid');
  }
  return mermaidPromise;
}

export default function DiagramViewer({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const isDark = document.documentElement.classList.contains('dark');

    loadMermaid()
      .then(async ({ default: mermaid }) => {
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: isDark ? 'dark' : 'default',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const temp = document.createElement('div');
        temp.id = id;
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        document.body.appendChild(temp);
        try {
          const { svg } = await mermaid.render(id, code);
          if (cancelled || !containerRef.current) return;
          containerRef.current.innerHTML = svg;
        } catch (e: any) {
          if (!cancelled) setError(String(e?.message || e));
        } finally {
          temp.remove();
        }
      })
      .catch(() => {
        if (!cancelled) setError('Gagal memuat library diagram.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        Menyiapkan diagram...
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          Gagal merender diagram: {error}
        </div>
      )}
      <div
        ref={containerRef}
        className="max-h-[480px] overflow-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 [&_svg]:mx-auto"
      />
    </div>
  );
}
