import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/contexts/auth-store';
import { api } from '@/lib/api';

interface PublicUser {
  id: string;
  username: string;
  full_name: string;
  avatar: string | null;
  total_xp: number;
  level: number;
  current_streak: number;
}

interface Friend extends PublicUser {
  friendship_id: string;
  last_message: string | null;
  unread_count: number;
}

interface FriendRequest {
  id: string;
  user: PublicUser;
  created_at: string;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface LeaderEntry extends PublicUser {
  rank: number;
  is_me: boolean;
}

function Avatar({ user, size = 40 }: { user: { full_name: string; avatar: string | null }; size?: number }) {
  if (user.avatar) {
    return <img src={user.avatar} alt={user.full_name} className="rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
      style={{ width: size, height: size }}
    >
      {user.full_name?.charAt(0)?.toUpperCase()}
    </div>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

type Tab = 'friends' | 'requests' | 'search' | 'leaderboard';

export default function Social() {
  const { token, user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }>({ incoming: [], outgoing: [] });
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<Array<PublicUser & { status: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const [chatFriend, setChatFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const loadOverview = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: { pending_requests: number; unread_count: number } }>('/social/overview', token);
      if (res.success) {
        setPendingCount(res.data.pending_requests);
        setUnreadCount(res.data.unread_count);
      }
    } catch { /* abaikan */ }
  };

  const loadFriends = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: Friend[] }>('/social/friends', token);
      if (res.success) setFriends(res.data);
    } catch { /* abaikan */ }
  };

  const loadRequests = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: { incoming: FriendRequest[]; outgoing: FriendRequest[] } }>('/social/requests', token);
      if (res.success) setRequests(res.data);
    } catch { /* abaikan */ }
  };

  const loadLeaderboard = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: LeaderEntry[] }>('/social/leaderboard?limit=20', token);
      if (res.success) setLeaderboard(res.data);
    } catch { /* abaikan */ }
  };

  const refreshAll = async () => {
    await Promise.all([loadOverview(), loadFriends(), loadRequests(), loadLeaderboard()]);
  };

  useEffect(() => {
    refreshAll();
    const timer = setInterval(loadOverview, 15000);
    return () => clearInterval(timer);
  }, [token]);

  useEffect(() => {
    if (!chatFriend || !token) return;
    loadMessages();
    const timer = setInterval(loadMessages, 5000);
    return () => clearInterval(timer);
  }, [chatFriend?.id, token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const loadMessages = async () => {
    if (!token || !chatFriend) return;
    try {
      const res = await api.get<{ success: boolean; data: ChatMessage[] }>(`/social/messages/${chatFriend.id}?limit=100`, token);
      if (res.success) setMessages(res.data);
    } catch { /* abaikan */ }
  };

  const openChat = (f: Friend) => {
    setChatFriend(f);
    setError('');
    setMessage('');
    setUnreadCount((u) => Math.max(0, u - f.unread_count));
  };

  const sendMessage = async () => {
    const content = msgInput.trim();
    if (!token || !chatFriend || !content) return;
    setSendingMsg(true);
    setError('');
    try {
      const res = await api.post<{ success: boolean; data: ChatMessage }>('/social/messages', { recipient_id: chatFriend.id, content }, token);
      if (res.success) {
        setMessages((m) => [...m, res.data]);
        setMsgInput('');
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal mengirim pesan');
    } finally {
      setSendingMsg(false);
    }
  };

  const sendRequest = async (addresseeId: string) => {
    if (!token) return;
    setError('');
    setMessage('');
    try {
      const res = await api.post<{ success: boolean; message: string }>('/social/requests', { addressee_id: addresseeId }, token);
      if (res.success) {
        setMessage(res.message);
        await Promise.all([loadRequests(), doSearch(searchQ), loadOverview()]);
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal mengirim permintaan');
    }
  };

  const respondRequest = async (id: string, action: 'accept' | 'reject') => {
    if (!token) return;
    setError('');
    try {
      const res = await api.post<{ success: boolean; message: string }>(`/social/requests/${id}/${action}`, {}, token);
      if (res.success) setMessage(res.message);
      await Promise.all([loadRequests(), loadFriends(), loadOverview()]);
    } catch (e: any) {
      setError(e?.message || 'Gagal memproses permintaan');
    }
  };

  const cancelRequest = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/social/requests/${id}`, token);
      setMessage('Permintaan dibatalkan.');
      await Promise.all([loadRequests(), loadOverview()]);
    } catch (e: any) {
      setError(e?.message || 'Gagal membatalkan');
    }
  };

  const deleteFriend = async (f: Friend) => {
    if (!token) return;
    if (!window.confirm(`Hapus ${f.full_name} dari daftar teman?`)) return;
    try {
      await api.delete(`/social/friends/${f.id}`, token);
      setMessage('Teman dihapus.');
      if (chatFriend?.id === f.id) setChatFriend(null);
      await Promise.all([loadFriends(), loadOverview()]);
    } catch (e: any) {
      setError(e?.message || 'Gagal menghapus teman');
    }
  };

  const doSearch = async (q?: string) => {
    const query = (q ?? searchQ).trim();
    if (!token || !query) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await api.get<{ success: boolean; data: Array<PublicUser & { status: string }> }>(`/social/search?q=${encodeURIComponent(query)}`, token);
      if (res.success) setSearchResults(res.data);
    } catch (e: any) {
      setError(e?.message || 'Gagal mencari');
    } finally {
      setSearching(false);
    }
  };

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'friends', label: `👥 Teman (${friends.length})` },
    { key: 'requests', label: `📨 Permintaan${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { key: 'search', label: '🔍 Cari Teman' },
    { key: 'leaderboard', label: '🏅 Peringkat' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sistem Sosial</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tambah teman, chat bareng, dan lihat peringkat belajar.
          {unreadCount > 0 && <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{unreadCount} pesan belum dibaca</span>}
        </p>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px shrink-0 rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-primary-500 text-primary-700 dark:text-primary-300'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'friends' && (
        <div className="grid gap-4 md:grid-cols-2">
          {friends.length === 0 && (
            <div className="card rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400 md:col-span-2">
              Belum ada teman. Cari teman di tab <button onClick={() => setTab('search')} className="font-semibold text-primary-600 underline dark:text-primary-400">Cari Teman</button>.
            </div>
          )}
          {friends.map((f) => (
            <div key={f.id} className="card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Avatar user={f} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-gray-100">{f.full_name}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    @{f.username} · Level {f.level} · {f.total_xp} XP
                    {f.last_message && <span className="text-gray-400 dark:text-gray-500"> · {f.last_message.slice(0, 30)}</span>}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {f.unread_count > 0 && (
                    <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold text-white">{f.unread_count}</span>
                  )}
                  <button onClick={() => openChat(f)} className="btn-primary text-sm">
                    💬 Chat
                  </button>
                  <button onClick={() => deleteFriend(f)} className="text-xs text-red-500 hover:underline dark:text-red-400">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Permintaan Masuk</h2>
            {requests.incoming.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">Tidak ada permintaan masuk.</p>}
            {requests.incoming.map((r) => (
              <div key={r.id} className="card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar user={r.user} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">{r.user.full_name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">@{r.user.username} · Level {r.user.level}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => respondRequest(r.id, 'accept')} className="btn-primary text-sm">Terima</button>
                    <button onClick={() => respondRequest(r.id, 'reject')} className="btn-secondary text-sm">Tolak</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Permintaan Terkirim</h2>
            {requests.outgoing.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada permintaan terkirim.</p>}
            {requests.outgoing.map((r) => (
              <div key={r.id} className="card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar user={r.user} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">{r.user.full_name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">@{r.user.username} · Menunggu respons</p>
                  </div>
                  <button onClick={() => cancelRequest(r.id)} className="btn-secondary text-sm">Batalkan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              className="input w-full"
              placeholder="Cari nama, username, atau email..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            />
            <button onClick={() => doSearch()} disabled={searching} className="btn-primary shrink-0">
              {searching ? '...' : 'Cari'}
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {searchResults.length === 0 && searchQ.trim() && !searching && (
              <p className="text-sm text-gray-400 dark:text-gray-500 md:col-span-2">Tidak ada pengguna ditemukan.</p>
            )}
            {searchResults.map((r) => (
              <div key={r.id} className="card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar user={r} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">{r.full_name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">@{r.username} · Level {r.level} · {r.total_xp} XP</p>
                  </div>
                  {r.status === 'none' && (
                    <button onClick={() => sendRequest(r.id)} className="btn-primary shrink-0 text-sm">+ Teman</button>
                  )}
                  {r.status === 'pending_out' && <span className="shrink-0 text-xs font-medium text-amber-600 dark:text-amber-400">Menunggu</span>}
                  {r.status === 'pending_in' && <span className="shrink-0 text-xs font-medium text-blue-600 dark:text-blue-400">Minta konfirmasi</span>}
                  {r.status === 'friends' && <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400">Teman</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="card overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Pengguna</th>
                  <th className="px-4 py-3 text-right">Level</th>
                  <th className="px-4 py-3 text-right">XP</th>
                  <th className="px-4 py-3 text-right">Streak</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((e) => (
                  <tr key={e.id} className={`border-b border-gray-50 dark:border-gray-800/50 ${e.is_me ? 'bg-primary-50/60 dark:bg-primary-900/20' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-gray-700 dark:text-gray-300">
                      {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : e.rank}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar user={e} size={28} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {e.full_name} {e.is_me && <span className="text-xs text-primary-600 dark:text-primary-400">(kamu)</span>}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{e.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">{e.level}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900 dark:text-gray-100">{e.total_xp.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">🔥 {e.current_streak}</td>
                  </tr>
                ))}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                      Belum ada data peringkat. Ayo raih XP dengan belajar!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {chatFriend && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={() => setChatFriend(null)}>
          <div
            className="flex h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl dark:bg-gray-900 sm:h-[70vh] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <Avatar user={chatFriend} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{chatFriend.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">@{chatFriend.username} · Level {chatFriend.level}</p>
              </div>
              <button onClick={() => setChatFriend(null)} className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-950/50">
              {messages.length === 0 && (
                <p className="mt-10 text-center text-sm text-gray-400 dark:text-gray-500">Belum ada pesan. Kirim sapaan pertama!</p>
              )}
              {messages.map((m) => {
                const mine = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        mine
                          ? 'rounded-br-sm bg-primary-500 text-white'
                          : 'rounded-bl-sm bg-white text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      <p className={`mt-1 text-right text-[10px] ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                        {formatTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 p-3 dark:border-gray-800">
              <input
                className="input w-full"
                placeholder="Tulis pesan..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                maxLength={1000}
              />
              <button onClick={sendMessage} disabled={sendingMsg || !msgInput.trim()} className="btn-primary shrink-0">
                {sendingMsg ? '...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
