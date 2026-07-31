import { useState, useEffect } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface Deck {
  id: string;
  title: string;
  subject: string;
  description: string;
  card_count: number;
}

interface Card {
  id: string;
  front: string;
  back: string;
  subject: string;
  topic: string;
  difficulty: number;
}

const subjects = [
  { value: 'mathematics', label: 'Matematika' },
  { value: 'bahasa-indonesia', label: 'Bahasa Indonesia' },
  { value: 'bahasa-inggris', label: 'Bahasa Inggris' },
  { value: 'ipa', label: 'IPA' },
  { value: 'ips', label: 'IPS' },
  { value: 'pemrograman', label: 'Pemrograman' },
];

export default function Flashcards() {
  const { token } = useAuthStore();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [newDeck, setNewDeck] = useState({ title: '', subject: 'mathematics', description: '' });
  const [newCard, setNewCard] = useState({ front: '', back: '', topic: '' });
  const [showAddCard, setShowAddCard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get('/learning/flashcards/decks', token).then((res: any) => {
      if (res.success) setDecks(res.data);
    }).finally(() => setLoading(false));
  }, [token]);

  const selectDeck = async (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentIdx(0);
    setFlipped(false);
    const res: any = await api.get(`/learning/flashcards/decks/${deck.id}`, token);
    if (res.success) setCards(res.data.cards || []);
  };

  const createDeck = async () => {
    if (!newDeck.title.trim()) return;
    const res: any = await api.post('/learning/flashcards/decks', newDeck, token);
    if (res.success) {
      const updated: any = await api.get('/learning/flashcards/decks', token);
      if (updated.success) setDecks(updated.data);
      setShowCreateDeck(false);
      setNewDeck({ title: '', subject: 'mathematics', description: '' });
    }
  };

  const addCard = async () => {
    if (!newCard.front.trim() || !newCard.back.trim() || !newCard.topic.trim() || !selectedDeck) return;
    const res: any = await api.post('/learning/flashcards', {
      ...newCard, subject: selectedDeck.subject,
    }, token);
    if (res.success) {
      const updated: any = await api.get(`/learning/flashcards/decks/${selectedDeck.id}`, token);
      if (updated.success) setCards(updated.data.cards || []);
      setNewCard({ front: '', back: '', topic: '' });
      setShowAddCard(false);
    }
  };

  const nextCard = () => {
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      setFlipped(false);
    }
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
    if (!currentCard) {
      return (
        <div className="mx-auto max-w-2xl space-y-6 px-4">
          <button onClick={() => { setSelectedDeck(null); setCards([]); }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">&larr; Kembali ke deck</button>
          <div className="text-center pt-12">
            <span className="text-5xl">🃏</span>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Belum ada kartu</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Tambahkan kartu flashcard ke deck ini</p>
            <button onClick={() => setShowAddCard(true)} className="btn-primary mt-6">Tambah Kartu</button>
          </div>

          {showAddCard && (
            <div className="card space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Kartu Baru</h3>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pertanyaan (Depan)</label>
                <textarea value={newCard.front} onChange={e => setNewCard(p => ({...p, front: e.target.value}))} className="input min-h-[60px]" placeholder="Tulis pertanyaan..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Jawaban (Belakang)</label>
                <textarea value={newCard.back} onChange={e => setNewCard(p => ({...p, back: e.target.value}))} className="input min-h-[60px]" placeholder="Tulis jawaban..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Topik</label>
                <input value={newCard.topic} onChange={e => setNewCard(p => ({...p, topic: e.target.value}))} className="input" placeholder="Contoh: Aljabar" />
              </div>
              <div className="flex gap-2">
                <button onClick={addCard} className="btn-primary flex-1">Simpan</button>
                <button onClick={() => setShowAddCard(false)} className="btn-secondary">Batal</button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedDeck(null); setCards([]); }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">&larr; Kembali</button>
          <span className="text-sm text-gray-500">{currentIdx + 1} / {cards.length}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{selectedDeck.title}</span>
          <span>&middot;</span>
          <span>{currentCard.topic}</span>
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
          <button onClick={prevCard} disabled={currentIdx === 0} className="btn-secondary disabled:opacity-30">Sebelumnya</button>
          <button onClick={nextCard} disabled={currentIdx === cards.length - 1} className="btn-primary">Selanjutnya</button>
        </div>

        <div className="text-center">
          <button onClick={() => setShowAddCard(!showAddCard)} className="text-sm text-primary-500 hover:text-primary-600">
            + Tambah Kartu
          </button>
        </div>

        {showAddCard && (
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Kartu Baru</h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pertanyaan (Depan)</label>
              <textarea value={newCard.front} onChange={e => setNewCard(p => ({...p, front: e.target.value}))} className="input min-h-[60px]" placeholder="Tulis pertanyaan..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Jawaban (Belakang)</label>
              <textarea value={newCard.back} onChange={e => setNewCard(p => ({...p, back: e.target.value}))} className="input min-h-[60px]" placeholder="Tulis jawaban..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Topik</label>
              <input value={newCard.topic} onChange={e => setNewCard(p => ({...p, topic: e.target.value}))} className="input" placeholder="Contoh: Aljabar" />
            </div>
            <div className="flex gap-2">
              <button onClick={addCard} className="btn-primary flex-1">Simpan</button>
              <button onClick={() => setShowAddCard(false)} className="btn-secondary">Batal</button>
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

      {showCreateDeck && (
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Deck Baru</h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
            <input value={newDeck.title} onChange={e => setNewDeck(p => ({...p, title: e.target.value}))} className="input" placeholder="Contoh: Aljabar Dasar" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mata Pelajaran</label>
            <select value={newDeck.subject} onChange={e => setNewDeck(p => ({...p, subject: e.target.value}))} className="input">
              {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (opsional)</label>
            <textarea value={newDeck.description} onChange={e => setNewDeck(p => ({...p, description: e.target.value}))} className="input min-h-[60px]" placeholder="Deskripsi deck..." />
          </div>
          <div className="flex gap-2">
            <button onClick={createDeck} className="btn-primary flex-1">Buat Deck</button>
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
            <button key={deck.id} onClick={() => selectDeck(deck)} className="card text-left transition-shadow hover:shadow-md dark:hover:shadow-gray-900">
              <span className="text-3xl">🃏</span>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{deck.title}</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{deck.description}</p>
              <p className="mt-2 text-xs font-medium text-primary-500">{deck.card_count || 0} kartu</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
