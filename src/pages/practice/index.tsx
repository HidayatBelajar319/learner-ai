import { useNavigate } from 'react-router-dom';

const practiceModules = [
  { id: 'matematika', title: 'Latihan Matematika', icon: '📐', description: 'Aljabar, Geometri, dan lainnya', questions: 50 },
  { id: 'bahasa', title: 'Latihan Bahasa', icon: '📝', description: 'Tata Bahasa, Kosakata', questions: 40 },
  { id: 'ipa', title: 'Latihan IPA', icon: '🔬', description: 'Fisika, Kimia, Biologi', questions: 45 },
  { id: 'coding', title: 'Latihan Coding', icon: '💻', description: 'Python, JavaScript, HTML', questions: 30 },
];

export default function Practice() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Latihan</h1>
        <p className="mt-1 text-gray-500">Asah kemampuanmu dengan latihan soal</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {practiceModules.map((module) => (
          <div key={module.id} className="card">
            <span className="text-3xl">{module.icon}</span>
            <h3 className="mt-3 font-semibold text-gray-900">{module.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{module.description}</p>
            <p className="mt-2 text-xs text-gray-400">{module.questions} soal tersedia</p>
            <button
              onClick={() => navigate('/quiz')}
              className="btn-primary mt-4 w-full"
            >
              Mulai Latihan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
