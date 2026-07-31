import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api';
import { useAuthStore } from '@/contexts/auth-store';interface Subject {
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
  format: string;
  metadata: string;
}

interface ContentItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  level: string;
  type: string;
  format: string;
  data: string;
  metadata: string;
}

export default function Learn() {
  const { subjectId, contentId } = useParams();
  const { token } = useAuthStore();

  if (contentId) return <LessonViewer contentId={contentId} token={token} />;
  if (subjectId) return <TopicList subjectId={subjectId} token={token} />;
  return <SubjectList token={token} />;
}

function SubjectList({ token }: { token: string | null }) {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: Subject[] }>('/content/subjects', token)
      .then((res) => setSubjects(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Belajar</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Pilih mata pelajaran yang ingin kamu pelajari</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => navigate(`/learn/${subject.id}`)}
            className="card text-left transition-shadow hover:shadow-md dark:hover:shadow-gray-900"
          >
            <span className="text-3xl">{subject.icon}</span>
            <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{subject.name}</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subject.description}</p>
            <p className="mt-2 text-xs font-medium text-primary-500">{subject.topics_count} topik</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopicList({ subjectId, token }: { subjectId: string; token: string | null }) {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    api.get<{ success: boolean; data: Subject[] }>('/content/subjects', token).then((res) => {
      const s = res.data.find((x) => x.id === subjectId);
      setSubjectName(s?.name ?? subjectId);
    });
    api.get<{ success: boolean; data: TopicItem[] }>(`/content/subjects/${subjectId}/topics`, token)
      .then((res) => setTopics(res.data))
      .finally(() => setLoading(false));
  }, [subjectId, token]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate('/learn')} className="mb-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          &larr; Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{subjectName}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Pilih materi untuk mulai belajar</p>
      </div>

      <div className="space-y-3">
        {topics.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Belum ada materi untuk pelajaran ini.</p>
          </div>
        )}
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/learn/${subjectId}/${topic.id}`}
            className="card flex items-center justify-between transition-shadow hover:shadow-md"
          >
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{topic.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {topic.topic} &middot; {topic.type}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              {topic.level}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LessonViewer({ contentId, token }: { contentId: string; token: string | null }) {
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: ContentItem }>(`/content/${contentId}`, token)
      .then((res) => {
        setContent(res.data);
        if (token) {
          api.post('/learning/history', { activity_type: 'material', content_id: contentId }, token).catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [contentId, token]);

  if (loading) return <Spinner />;
  if (!content) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Materi tidak ditemukan</h2>
        <button onClick={() => navigate('/learn')} className="btn-primary mt-4">Kembali</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button onClick={() => navigate(`/learn/${content.subject}`)} className="mb-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          &larr; Kembali ke {content.topic}
        </button>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
            {content.level}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{content.topic}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">{content.title}</h1>
      </div>

      <div className="card prose prose-sm sm:prose-base dark:prose-invert prose-headings:text-gray-900 prose-p:text-gray-600 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-400 prose-pre:bg-gray-900 prose-pre:text-gray-100 max-w-none dark:bg-gray-900/50">
        <ReactMarkdown>{content.data || ''}</ReactMarkdown>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">Selesai membaca?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Lanjut kerjakan quiz untuk menguji pemahamanmu</p>
        </div>
        <button
          onClick={() => navigate('/quiz', { state: { subject: content.subject, topic: content.topic, level: content.level } })}
          className="btn-primary"
        >
          Kerjakan Quiz
        </button>
      </div>
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
