import { useParams, useNavigate } from 'react-router-dom';

const subjectsData: Record<string, { name: string; icon: string; topics: { title: string; level: string; lessons: number }[] }> = {
  mathematics: {
    name: 'Matematika',
    icon: '📐',
    topics: [
      { title: 'Aljabar Dasar', level: 'Dasar', lessons: 8 },
      { title: 'Geometri', level: 'Dasar', lessons: 6 },
      { title: 'Statistika', level: 'Menengah', lessons: 5 },
      { title: 'Kalkulus', level: 'Mahir', lessons: 10 },
    ],
  },
  'bahasa-indonesia': {
    name: 'Bahasa Indonesia',
    icon: '📝',
    topics: [
      { title: 'Tata Bahasa Dasar', level: 'Dasar', lessons: 8 },
      { title: 'Menulis Karangan', level: 'Menengah', lessons: 6 },
      { title: 'Sastra Indonesia', level: 'Mahir', lessons: 5 },
    ],
  },
  'bahasa-inggris': {
    name: 'Bahasa Inggris',
    icon: '🇬🇧',
    topics: [
      { title: 'Basic Grammar', level: 'Pemula', lessons: 10 },
      { title: 'Vocabulary Building', level: 'Pemula', lessons: 8 },
      { title: 'English Conversation', level: 'Menengah', lessons: 6 },
    ],
  },
  ipa: {
    name: 'IPA',
    icon: '🔬',
    topics: [
      { title: 'Fisika Dasar', level: 'Dasar', lessons: 8 },
      { title: 'Kimia Dasar', level: 'Dasar', lessons: 6 },
      { title: 'Biologi Sel', level: 'Menengah', lessons: 5 },
    ],
  },
  ips: {
    name: 'IPS',
    icon: '🌍',
    topics: [
      { title: 'Sejarah Indonesia', level: 'Dasar', lessons: 8 },
      { title: 'Geografi Dunia', level: 'Menengah', lessons: 6 },
      { title: 'Ekonomi Dasar', level: 'Dasar', lessons: 5 },
    ],
  },
  pemrograman: {
    name: 'Pemrograman',
    icon: '💻',
    topics: [
      { title: 'HTML & CSS', level: 'Pemula', lessons: 10 },
      { title: 'JavaScript Dasar', level: 'Pemula', lessons: 12 },
      { title: 'Python Dasar', level: 'Pemula', lessons: 10 },
      { title: 'React & TypeScript', level: 'Menengah', lessons: 8 },
    ],
  },
  'bahasa-asing': {
    name: 'Bahasa Asing',
    icon: '🌐',
    topics: [
      { title: 'Bahasa Arab Dasar', level: 'Pemula', lessons: 8 },
      { title: 'Bahasa Mandarin', level: 'Pemula', lessons: 8 },
      { title: 'Bahasa Jepang', level: 'Pemula', lessons: 8 },
    ],
  },
  keterampilan: {
    name: 'Keterampilan',
    icon: '🎯',
    topics: [
      { title: 'Public Speaking', level: 'Pemula', lessons: 5 },
      { title: 'Desain Grafis', level: 'Pemula', lessons: 6 },
      { title: 'Manajemen Waktu', level: 'Pemula', lessons: 4 },
    ],
  },
};

export default function Learn() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const allSubjects = Object.entries(subjectsData);

  if (subjectId) {
    const subject = subjectsData[subjectId];
    if (!subject) {
      return (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Mata pelajaran tidak ditemukan</h2>
          <p className="mt-2 text-gray-500">Coba pilih mata pelajaran lain.</p>
          <button onClick={() => navigate('/learn')} className="btn-primary mt-4">
            Kembali
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <button onClick={() => navigate('/learn')} className="mb-2 text-sm text-gray-500 hover:text-gray-700">
            &larr; Kembali
          </button>
          <span className="text-4xl">{subject.icon}</span>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{subject.name}</h1>
        </div>

        <div className="space-y-3">
          {subject.topics.map((topic, i) => (
            <div key={i} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                <p className="text-sm text-gray-500">
                  {topic.level} &middot; {topic.lessons} pelajaran
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                {topic.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Belajar</h1>
        <p className="mt-1 text-gray-500">Pilih mata pelajaran yang ingin kamu pelajari</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {allSubjects.map(([id, subject]) => (
          <button
            key={id}
            onClick={() => navigate(`/learn/${id}`)}
            className="card text-left transition-shadow hover:shadow-md"
          >
            <span className="text-3xl">{subject.icon}</span>
            <h3 className="mt-3 font-semibold text-gray-900">{subject.name}</h3>
            <p className="mt-1 text-xs text-gray-500">
              {subject.topics.length} topik
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
