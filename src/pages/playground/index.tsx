import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface File {
  id: string;
  name: string;
  language: string;
  content: string;
}

const LANGUAGES: Record<string, string> = {
  js: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  py: 'Python',
  ts: 'TypeScript',
  json: 'JSON',
};

function detectLang(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return LANGUAGES[ext] || 'JavaScript';
}

let fileCounter = 0;

function createFile(name: string, content = ''): File {
  fileCounter++;
  return { id: `f${fileCounter}`, name, language: detectLang(name), content };
}

export default function Playground() {
  const { token } = useAuthStore();
  const [files, setFiles] = useState<File[]>([
    createFile('index.html', '<h1>Hello Learner!</h1>\n<p>Mulai coding di sini.</p>'),
    createFile('style.css', 'body {\n  font-family: sans-serif;\n  padding: 20px;\n}'),
    createFile('script.js', 'console.log("Hello dari Learner AI!");'),
  ]);
  const [activeId, setActiveId] = useState(files[0]?.id || '');
  const [output, setOutput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [availableKeys, setAvailableKeys] = useState<{ provider: string; model: string | null }[]>([]);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!token) return;
    api.get<{ success: boolean; data: any[] }>('/ai/keys', token).then((res) => {
      if (res.success) setAvailableKeys(res.data.filter((k) => k.is_active === 1));
    }).catch(() => {});
  }, [token]);

  const activeFile = files.find(f => f.id === activeId) || files[0];

  const updateContent = useCallback((content: string) => {
    setFiles(prev => prev.map(f => f.id === activeId ? { ...f, content } : f));
  }, [activeId]);

  const addFile = () => {
    if (!newFileName.trim()) return;
    setFiles(prev => [...prev, createFile(newFileName.trim())]);
    setNewFileName('');
    setShowNewFile(false);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(f => f.id !== id);
      if (activeId === id && next.length > 0) setActiveId(next[0].id);
      return next;
    });
  };

  const startRename = (id: string, currentName: string) => {
    setRenaming(id);
    setRenameValue(currentName);
  };

  const doRename = (id: string) => {
    if (!renameValue.trim()) return;
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: renameValue.trim(), language: detectLang(renameValue.trim()) } : f));
    setRenaming(null);
    setRenameValue('');
  };

  const runCode = () => {
    try {
      const consoleLines: string[] = [];
      const mockConsole = {
        log: (...args: unknown[]) => consoleLines.push(args.map(a => String(a)).join(' ')),
        error: (...args: unknown[]) => consoleLines.push('❌ ' + args.map(a => String(a)).join(' ')),
      };

      if (activeFile.language === 'JavaScript' || activeFile.language === 'TypeScript') {
        const fn = new Function('console', activeFile.content);
        fn(mockConsole);
        setOutput(consoleLines.join('\n') || '✅ Kode berjalan tanpa output.');
      } else if (activeFile.language === 'HTML') {
        const blob = new Blob([activeFile.content], { type: 'text/html' });
        setOutput(`🔗 ${URL.createObjectURL(blob)}`);
      } else {
        setOutput('⚠️ Eksekusi hanya untuk JavaScript/HTML.');
      }
    } catch (err) {
      setOutput(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim() || !token) return;
    setAiLoading(true);
    try {
      const firstKey = availableKeys[0];
      const res: any = await api.post('/ai/chat', {
        messages: [
          { role: 'system', content: 'Kamu adalah asisten coding. Berikan kode yang bisa langsung dijalankan. Jawab dengan kode saja tanpa penjelasan berlebihan. Gunakan markdown code blocks.' },
          { role: 'user', content: aiPrompt },
        ],
        ...(firstKey ? { provider: firstKey.provider, model: firstKey.model || undefined, use_tools: false } : {}),
      }, token);
      const reply = res.data?.content || res.data?.reply || 'Gagal mendapatkan respons.';
      const match = reply.match(/```[\w]*\n([\s\S]*?)```/);
      if (match) {
        updateContent(match[1].trim());
      } else {
        updateContent(reply);
      }
      setAiPrompt('');
    } catch {
      setOutput('❌ Gagal menghubungi AI.');
    } finally {
      setAiLoading(false);
    }
  };

  const active = files.find(f => f.id === activeId) || files[0];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 sm:h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">💻</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">Playground</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAi(!showAi)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30">
            🤖 AI
          </button>
          <button onClick={runCode} className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600">
            ▶ Run
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-48 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Files</span>
            <button onClick={() => setShowNewFile(true)} className="text-xs text-primary-500 hover:text-primary-600">+</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {showNewFile && (
              <div className="mb-2 flex gap-1">
                <input value={newFileName} onChange={e => setNewFileName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFile()} placeholder="nama.ext" className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" autoFocus />
                <button onClick={addFile} className="text-xs text-primary-500">ok</button>
              </div>
            )}
            {files.map(f => (
              <div key={f.id} className={`group mb-0.5 flex items-center rounded px-2 py-1 text-xs cursor-pointer ${f.id === activeId ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                onClick={() => { setActiveId(f.id); }}>
                {renaming === f.id ? (
                  <input value={renameValue} onChange={e => setRenameValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') doRename(f.id); if (e.key === 'Escape') setRenaming(null); }} onBlur={() => doRename(f.id)} className="min-w-0 flex-1 rounded border border-gray-300 px-1 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" autoFocus onClick={e => e.stopPropagation()} />
                ) : (
                  <span className="flex-1 truncate" onDoubleClick={() => startRename(f.id, f.name)}>{f.name}</span>
                )}
                {renaming !== f.id && (
                  <div className="hidden gap-1 group-hover:flex">
                    <button onClick={e => { e.stopPropagation(); startRename(f.id, f.name); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✎</button>
                    <button onClick={e => { e.stopPropagation(); deleteFile(f.id); }} className="text-gray-400 hover:text-red-500">×</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-1.5 dark:border-gray-700 dark:bg-gray-800/30">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{active.name}</span>
            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">{active.language}</span>
          </div>
          <textarea
            ref={editorRef}
            value={active.content}
            onChange={e => updateContent(e.target.value)}
            className="flex-1 resize-none border-0 bg-gray-900 p-4 font-mono text-sm leading-relaxed text-green-400 outline-none placeholder-gray-600"
            spellCheck={false}
            placeholder="// Tulis kode di sini..."
          />
        </div>

        {showAi && (
          <div className="flex w-72 flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">🤖 AI Code</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Jelaskan kode yang kamu mau..." className="input min-h-[80px] resize-none text-sm" />
              <button onClick={generateWithAI} disabled={aiLoading || !aiPrompt.trim()} className="btn-primary mt-2 w-full text-xs">
                {aiLoading ? 'Memproses...' : 'Generate'}
              </button>
            </div>
          </div>
        )}
      </div>

      {output && (
        <div className="border-t border-gray-200 bg-gray-900 p-3 dark:border-gray-700">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Output</span>
            <button onClick={() => setOutput('')} className="text-xs text-gray-500 hover:text-gray-300">×</button>
          </div>
          <pre className="overflow-x-auto text-sm text-green-400">{output}</pre>
        </div>
      )}
    </div>
  );
}
