import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface Deck {
  id: string;
  title: string;
  subject: string;
  description: string;
  card_count: number;
  icon: string;
}

interface Card {
  id: string;
  front: string;
  back: string;
  topic: string;
  tags: string;
  difficulty: number;
  is_favorite: number;
  deck_id: string | null;
}

interface CardForm {
  front: string;
  back: string;
  topic: string;
  tags: string;
  difficulty: number;
}

const subjects = [
  { value: 'mathematics', label: 'Matematika' },
  { value: 'bahasa-indonesia', label: 'Bahasa Indonesia' },
  { value: 'bahasa-inggris', label: 'Bahasa Inggris' },
  { value: 'ipa', label: 'IPA' },
  { value: 'ips', label: 'IPS' },
  { value: 'pemrograman', label: 'Pemrograman' },
  { value: 'pendidikan-agama', label: 'Pendidikan Agama dan Budi Pekerti' },
  { value: 'pancasila', label: 'Pendidikan Pancasila' },
  { value: 'pjok', label: 'PJOK' },
  { value: 'informatika', label: 'Informatika' },
  { value: 'seni-budaya', label: 'Seni dan Budaya' },
  { value: 'prakarya', label: 'Prakarya' },
  { value: 'sejarah', label: 'Sejarah' },
  { value: 'kewirausahaan', label: 'Kreatif dan Kewirausahaan' },
];

const deckIcons = ['🃏', '📚', '🧮', '🔬', '🌍', '💻', '✏️', '🎨', '🎵', '🏆', '🚀', '🧠', '📝', '⭐'];

function subjectLabel(value: string): string {
  return subjects.find(s => s.value === value)?.label ?? value;
}

const emptyCardForm: CardForm = { front: '', back: '', topic: '', tags: '', difficulty: 1 };

export default function Flashcards() {
  const { token } = useAuthStore();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  // filter deck list
  const [deckQ, setDeckQ] = useState('');
  const [deckSubject, setDeckSubject] = useState('');

  // deck detail
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [deckLoading, setDeckLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'study' | 'list'>('study');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardQ, setCardQ] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // modals
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [newDeck, setNewDeck] = useState({ title: '', subject: 'mathematics', description: '', icon: '🃏' });
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [cardForm, setCardForm] = useState<CardForm>(emptyCardForm);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMsg, setImportMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadDecks = useCallback(async () => {
    if (!token) return;
    const params = new URLSearchParams();
    if (deckQ.trim()) params.set('q', deckQ.trim());
    if (deckSubject) params.set('subject', deckSubject);
    const qs = params.toString();
    const res: any = await api.get(`/learning/flashcards/decks${qs ? `?${qs}` : ''}`, token);
    if (res.success) setDecks(res.data);
  }, [token, deckQ, deckSubject]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.get('/learning/flashcards/decks', token)
      .then((res: any) => { if (res.success) setDecks(res.data); })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!selectedDeck) return;
    const t = setTimeout(() => loadDecks(), 400);
    return () => clearTimeout(t);
  }, [deckQ, deckSubject, loadDecks, selectedDeck]);

  const loadDeckCards = useCallback(async () => {
    if (!token || !selectedDeck) return;
    setDeckLoading(true);
    const params = new URLSearchParams();
    if (cardQ.trim()) params.set('q', cardQ.trim());
    if (favoriteOnly) params.set('favorite', '1');
    const qs = params.toString();
    try {
      const res: any = await api.get(`/learning/flashcards/decks/${selectedDeck.id}${qs ? `?${qs}` : ''}`, token);
      if (res.success) {
        setCards(res.data.cards || []);
        setSelectedDeck(res.data.deck);
        setCurrentIdx(0);
        setFlipped(false);
      }
    } finally {
      setDeckLoading(false);
    }
  }, [token, selectedDeck, cardQ, favoriteOnly]);

  useEffect(() => {
    if (!selectedDeck) return;
    const t = setTimeout(() => loadDeckCards(), 350);
    return () => clearTimeout(t);
  }, [selectedDeck, cardQ, favoriteOnly, loadDeckCards]);

  const openDeck = async (deck: Deck) => {
    setSelectedDeck(deck);
    setViewMode('study');
    setCards([]);
    setCardQ('');
    setFavoriteOnly(false);
    setCurrentIdx(0);
    setFlipped(false);
    setShowCardForm(false);
    setEditingCard(null);
  };

  const closeDeck = () => {
    setSelectedDeck(null);
    setCards([]);
    setCurrentIdx(0);
    setFlipped(false);
    loadDecks();
  };

  const createDeck = async () => {
    if (!newDeck.title.trim()) return;
    setBusy(true);
    setError('');
    try {
      const res: any = await api.post('/learning/flashcards/decks', newDeck, token);
      if (res.success) {
        setShowCreateDeck(false);
        setNewDeck({ title: '', subject: 'mathematics', description: '', icon: '🃏' });
        await loadDecks();
      } else if (res.message) setError(res.message);
    } catch (e: any) {
      setError(e?.message || 'Gagal membuat deck');
    } finally {
      setBusy(false);
    }
  };

  const saveCard = async () => {
    if (!selectedDeck) return;
    if (!cardForm.front.trim() || !cardForm.back.trim() || !cardForm.topic.trim()) {
      setError('Front, back, dan topik wajib diisi');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (editingCard) {
        const res: any = await api.put(`/learning/flashcards/${editingCard.id}`, cardForm, token);
        if (!res.success) { setError(res.message); return; }
      } else {
        const res: any = await api.post('/learning/flashcards', { ...cardForm, deck_id: selectedDeck.id }, token);
        if (!res.success) { setError(res.message); return; }
      }
      setShowCardForm(false);
      setEditingCard(null);
      setCardForm(emptyCardForm);
      await loadDeckCards();
      loadDecks();
    } catch (e: any) {
      setError(e?.message || 'Gagal menyimpan kartu');
    } finally {
      setBusy(false);
    }
  };

  const openEdit = (card: Card) => {
    setEditingCard(card);
    setCardForm({ front: card.front, back: card.back, topic: card.topic, tags: card.tags || '', difficulty: card.difficulty || 1 });
    setShowCardForm(true);
  };

  const duplicateCard = async (card: Card) => {
    setBusy(true);
    try {
      const res: any = await api.post(`/learning/flashcards/${card.id}/duplicate`, {}, token);
      if (res.success) {
        await loadDeckCards();
        loadDecks();
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal menggandakan kartu');
    } finally {
      setBusy(false);
    }
  };

  const deleteCard = async (card: Card) => {
    if (!window.confirm('Hapus kartu ini?')) return;
    setBusy(true);
    try {
      const res: any = await api.delete(`/learning/flashcards/${card.id}`, token);
      if (res.success) {
        await loadDeckCards();
        loadDecks();
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal menghapus kartu');
    } finally {
      setBusy(false);
    }
  };

  const toggleFavorite = async (card: Card) => {
    try {
      await api.put(`/learning/flashcards/${card.id}`, { is_favorite: card.is_favorite ? 0 : 1 }, token);
      await loadDeckCards();
    } catch (e: any) {
      setError(e?.message || 'Gagal mengubah favorit');
    }
  };

  const deleteDeck = async () => {
    if (!selectedDeck) return;
    if (!window.confirm(`Hapus deck "${selectedDeck.title}" beserta ${selectedDeck.card_count} kartunya?`)) return;
    setBusy(true);
    setError('');
    try {
      const res: any = await api.delete(`/learning/flashcards/decks/${selectedDeck.id}`, token);
      if (!res.success) { setError(res.message); return; }
      setSelectedDeck(null);
      setCards([]);
      await loadDecks();
    } catch (e: any) {
      setError(e?.message || 'Gagal menghapus deck');
    } finally {
      setBusy(false);
    }
  };

  const exportDeck = async () => {    if (!selectedDeck) return;
    setBusy(true);
    try {
      const res: any = await api.get(`/learning/flashcards/decks/${selectedDeck.id}/export`, token);
      if (!res.success) { setError(res.message); return; }
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDeck.title.replace(/[^\w\d\- ]+/g, '').trim().replace(/\s+/g, '-') || 'flashcards'}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || 'Gagal mengekspor');
    } finally {
      setBusy(false);
    }
  };

  const importDeck = async () => {
    if (!selectedDeck) return;
    if (!importText.trim()) { setImportMsg('Tempel JSON kartu terlebih dahulu.'); return; }
    setBusy(true);
    setImportMsg('');
    try {
      const parsed = JSON.parse(importText);
      const cardsList = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.cards) ? parsed.cards : null;
      if (!cardsList) { setImportMsg('Format tidak valid. Gunakan array kartu: [{ "front": "...", "back": "..." }]'); return; }
      const res: any = await api.post('/learning/flashcards/import', { deck_id: selectedDeck.id, cards: cardsList }, token);
      if (res.success) {
        setImportMsg(res.message);
        setImportText('');
        await loadDeckCards();
        loadDecks();
      } else {
        setImportMsg(res.message || 'Gagal mengimpor');
      }
    } catch (e: any) {
      setImportMsg(e?.message || 'JSON tidak valid');
    } finally {
      setBusy(false);
    }
  };

  const handleImportFile = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setImportText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  if (selectedDeck) {
    const currentCard = cards[currentIdx];

    return (
      <div className="mx-auto max-w-3xl space-y-5 px-4">
        {/* Header deck */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={closeDeck} className="btn-secondary px-3">&larr;</button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedDeck.icon || '🃏'}</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedDeck.title}</h1>
              </div>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {subjectLabel(selectedDeck.subject)} &middot; {selectedDeck.card_count} kartu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowImport(true); setImportMsg(''); }} className="btn-secondary">Impor</button>
            <button onClick={exportDeck} disabled={busy} className="btn-secondary">Ekspor</button>
            <button onClick={() => { setEditingCard(null); setCardForm(emptyCardForm); setShowCardForm(true); }} className="btn-primary">+ Kartu</button>
            <button onClick={deleteDeck} disabled={busy} className="btn-secondary border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30" title="Hapus deck">🗑️</button>
          </div>
        </div>

        {/* Tab mode */}
        <div className="flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
          {(['study', 'list'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => { setViewMode(mode); setFlipped(false); }}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                viewMode === mode
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {mode === 'study' ? 'Belajar' : 'Semua Kartu'}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {deckLoading && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500" />
          </div>
        )}

        {viewMode === 'study' && !deckLoading && (
          <>
            {!currentCard ? (
              <div className="text-center pt-10">
                <span className="text-5xl">🃏</span>
                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Belum ada kartu</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {favoriteOnly || cardQ ? 'Tidak ada kartu yang cocok dengan filter' : 'Tambahkan kartu flashcard ke deck ini'}
                </p>
                {!favoriteOnly && !cardQ && (
                  <button onClick={() => { setEditingCard(null); setCardForm(emptyCardForm); setShowCardForm(true); }} className="btn-primary mt-6">Tambah Kartu</button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{currentIdx + 1} / {cards.length}</span>
                  <button
                    onClick={() => toggleFavorite(currentCard)}
                    className={`text-lg transition-colors ${currentCard.is_favorite ? 'text-amber-400' : 'text-gray-300 hover:text-gray-400 dark:text-gray-600'}`}
                    title={currentCard.is_favorite ? 'Hapus dari favorit' : 'Tandai favorit'}
                  >
                    {currentCard.is_favorite ? '★' : '☆'}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{currentCard.topic}</span>
                  {currentCard.tags ? <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">{currentCard.tags}</span> : null}
                  <span className="text-amber-500">{'★'.repeat(Math.min(currentCard.difficulty, 5))}{'☆'.repeat(Math.max(0, 5 - Math.min(currentCard.difficulty, 5)))}</span>
                </div>

                <div className="cursor-pointer" onClick={() => setFlipped(!flipped)}>
                  <div className="card min-h-[250px] flex flex-col items-center justify-center text-center">
                    {!flipped ? (
                      <>
                        <span className="text-4xl mb-4">❓</span>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{currentCard.front}</p>
                        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Klik untuk lihat jawaban</p>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl mb-4">💡</span>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{currentCard.back}</p>
                        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Klik untuk kembali</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => { if (currentIdx > 0) { setCurrentIdx(i => i - 1); setFlipped(false); } }} disabled={currentIdx === 0} className="btn-secondary disabled:opacity-30">Sebelumnya</button>
                  <button onClick={() => { if (currentIdx < cards.length - 1) { setCurrentIdx(i => i + 1); setFlipped(false); } }} disabled={currentIdx === cards.length - 1} className="btn-primary">Selanjutnya</button>
                </div>
              </>
            )}
          </>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={cardQ}
                onChange={e => setCardQ(e.target.value)}
                className="input flex-1 min-w-[180px]"
                placeholder="Cari kartu..."
              />
              <button
                onClick={() => setFavoriteOnly(f => !f)}
                className={`btn-secondary ${favoriteOnly ? 'border-amber-400 text-amber-500' : ''}`}
              >
                {favoriteOnly ? '★ Favorit' : '☆ Favorit'}
              </button>
            </div>

            {!deckLoading && cards.length === 0 ? (
              <div className="text-center pt-8">
                <p className="text-gray-500 dark:text-gray-400">Tidak ada kartu{cardQ || favoriteOnly ? ' yang cocok' : ''}.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cards.map(card => (
                  <div key={card.id} className="card flex items-start gap-3 !p-4">
                    <button
                      onClick={() => toggleFavorite(card)}
                      className={`mt-0.5 text-lg ${card.is_favorite ? 'text-amber-400' : 'text-gray-300 hover:text-gray-400 dark:text-gray-600'}`}
                      title={card.is_favorite ? 'Hapus dari favorit' : 'Tandai favorit'}
                    >
                      {card.is_favorite ? '★' : '☆'}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{card.front}</p>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{card.back}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        {card.topic ? <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">{card.topic}</span> : null}
                        {card.tags ? <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">{card.tags}</span> : null}
                        <span className="text-amber-500">{'★'.repeat(Math.min(card.difficulty, 5))}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => openEdit(card)} className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Edit">✏️</button>
                      <button onClick={() => duplicateCard(card)} className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Duplikasi">📋</button>
                      <button onClick={() => deleteCard(card)} className="rounded px-2 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" title="Hapus">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form kartu (tambah/edit) */}
        {showCardForm && (
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{editingCard ? 'Edit Kartu' : 'Kartu Baru'}</h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pertanyaan (Depan)</label>
              <textarea value={cardForm.front} onChange={e => setCardForm(p => ({ ...p, front: e.target.value }))} className="input min-h-[60px]" placeholder="Tulis pertanyaan..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Jawaban (Belakang)</label>
              <textarea value={cardForm.back} onChange={e => setCardForm(p => ({ ...p, back: e.target.value }))} className="input min-h-[60px]" placeholder="Tulis jawaban..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Topik</label>
                <input value={cardForm.topic} onChange={e => setCardForm(p => ({ ...p, topic: e.target.value }))} className="input" placeholder="Contoh: Aljabar" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tag (opsional)</label>
                <input value={cardForm.tags} onChange={e => setCardForm(p => ({ ...p, tags: e.target.value }))} className="input" placeholder="Contoh: rumus, bab1" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Kesulitan: {cardForm.difficulty}/5</label>
              <input type="range" min={1} max={5} value={cardForm.difficulty} onChange={e => setCardForm(p => ({ ...p, difficulty: Number(e.target.value) }))} className="w-full accent-primary-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={saveCard} disabled={busy} className="btn-primary flex-1">Simpan</button>
              <button onClick={() => { setShowCardForm(false); setEditingCard(null); setCardForm(emptyCardForm); }} className="btn-secondary">Batal</button>
            </div>
          </div>
        )}

        {/* Modal impor */}
        {showImport && (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Impor Kartu (JSON)</h3>
              <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih file .json</span>
              <input type="file" accept=".json,application/json" onChange={e => handleImportFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-600" />
            </label>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Atau tempel JSON</label>
              <textarea value={importText} onChange={e => setImportText(e.target.value)} className="input min-h-[120px] font-mono text-xs" placeholder='[{ "front": "1 + 1 = ?", "back": "2", "topic": "Aljabar" }]' />
            </div>
            {importMsg && <p className="text-sm text-gray-600 dark:text-gray-400">{importMsg}</p>}
            <div className="flex gap-2">
              <button onClick={importDeck} disabled={busy} className="btn-primary flex-1">Impor</button>
              <button onClick={() => setShowImport(false)} className="btn-secondary">Tutup</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Flashcards</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Belajar dengan kartu kilat</p>
        </div>
        <button onClick={() => setShowCreateDeck(true)} className="btn-primary">+ Deck Baru</button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input value={deckQ} onChange={e => setDeckQ(e.target.value)} className="input flex-1 min-w-[180px]" placeholder="Cari deck..." />
        <select value={deckSubject} onChange={e => setDeckSubject(e.target.value)} className="input w-auto">
          <option value="">Semua Kategori</option>
          {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {showCreateDeck && (
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Deck Baru</h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ikon / Logo</label>
            <div className="flex flex-wrap gap-2">
              {deckIcons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewDeck(p => ({ ...p, icon }))}
                  className={`rounded-lg border p-2 text-xl transition-colors ${newDeck.icon === icon ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
            <input value={newDeck.title} onChange={e => setNewDeck(p => ({ ...p, title: e.target.value }))} className="input" placeholder="Contoh: Aljabar Dasar" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mata Pelajaran</label>
            <select value={newDeck.subject} onChange={e => setNewDeck(p => ({ ...p, subject: e.target.value }))} className="input">
              {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (opsional)</label>
            <textarea value={newDeck.description} onChange={e => setNewDeck(p => ({ ...p, description: e.target.value }))} className="input min-h-[60px]" placeholder="Deskripsi deck..." />
          </div>
          <div className="flex gap-2">
            <button onClick={createDeck} disabled={busy} className="btn-primary flex-1">Buat Deck</button>
            <button onClick={() => setShowCreateDeck(false)} className="btn-secondary">Batal</button>
          </div>
        </div>
      )}

      {decks.length === 0 ? (
        <div className="text-center pt-12">
          <span className="text-5xl">🃏</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Belum ada deck</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Buat deck flashcard pertamamu</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {decks.map(deck => (
            <button key={deck.id} onClick={() => openDeck(deck)} className="card text-left transition-shadow hover:shadow-md dark:hover:shadow-gray-900">
              <span className="text-3xl">{deck.icon || '🃏'}</span>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{deck.title}</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{deck.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-medium text-primary-500">{deck.card_count || 0} kartu</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{subjectLabel(deck.subject)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
