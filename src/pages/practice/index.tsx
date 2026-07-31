import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/contexts/auth-store';

interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  levels: string[];
  topics_count: number;
}

interface TopicItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  level: string;
  type: string;
}

export default function Practice() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    api.get<{ success: boolean; data: Subject[] }>('/content/subjects', token)
      .then((res) => setSubjects(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  const selectSubject = async (subject: Subject) => {
    setSelected(subject);
    setLoadingTopics(true);
    try {
      const res = await api.get<{ success: boolean; data: TopicItem[] }>(`/content/subjects/${subject.id}/topics`, token);
      setTopics(res.data);
    } finally {
      setLoadingTopics(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Latihan</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Pilih topik, lalu langsung kerjakan quiz</p>
      </div>

      {!selected ? (
        <>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Pilih Mata Pelajaran</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => selectSubject(subject)}
                  className="card text-left transition-shadow hover:shadow-md"
                >
                  <span className="text-3xl">{subject.icon}</span>
                  <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{subject.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subject.description}</p>
                  <p className="mt-2 text-xs font-medium text-primary-500">{subject.topics_count} topik</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Quiz Cepat</h2>
            <div className="card">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mau langsung ditantang? Buat quiz custom dari topik pilihanmu.
              </p>
              <button onClick={() => navigate('/quiz')} className="btn-primary mt-4">
                Buat Quiz Sendiri
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <button
              onClick={() => setSelected(null)}
              className="mb-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              &larr; Ganti Pelajaran
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {selected.icon} {selected.name}
            </h2>
          </div>

          {loadingTopics && <Spinner />}

          {!loadingTopics && topics.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Belum ada topik untuk pelajaran ini.</p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map((topic) => (
              <div key={topic.id} className="card">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{topic.title}</h3>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                    {topic.level}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{topic.topic}</p>
                <div className="mt-4 flex gap-2">
                  <Link to={`/learn/${selected.id}/${topic.id}`} className="btn-secondary flex-1 text-center">
                    Baca Materi
                  </Link>
                  <button
                    onClick={() => navigate('/quiz', { state: { subject: selected.id, topic: topic.topic, level: topic.level } })}
                    className="btn-primary flex-1"
                  >
                    Kerjakan Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center pt-16">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 dark:border-primary-800 dark:border-t-primary-400" />
    </div>
  );
}
