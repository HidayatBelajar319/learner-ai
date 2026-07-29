import { useState } from 'react';

const sampleQuestions = [
  {
    id: 1,
    question: 'Berapa hasil dari 7 + 8?',
    options: ['14', '15', '16', '17'],
    correct: 1,
  },
  {
    id: 2,
    question: 'Apa ibu kota Indonesia?',
    options: ['Surabaya', 'Bandung', 'Jakarta', 'Yogyakarta'],
    correct: 2,
  },
  {
    id: 3,
    question: 'Siapa penemu lampu pijar?',
    options: ['Albert Einstein', 'Thomas Edison', 'Nikola Tesla', 'Isaac Newton'],
    correct: 1,
  },
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = sampleQuestions[currentQ];
  const isLast = currentQ === sampleQuestions.length - 1;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (showResult) {
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="w-full max-w-md text-center">
          <span className="text-6xl">🎉</span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Quiz Selesai!</h1>
          <p className="mt-2 text-gray-500">
            Kamu mendapat skor {score} dari {sampleQuestions.length}
          </p>
          <div className="mt-6 text-5xl font-bold text-primary-500">
            {Math.round((score / sampleQuestions.length) * 100)}%
          </div>
          <button
            onClick={() => {
              setCurrentQ(0);
              setScore(0);
              setShowResult(false);
              setSelected(null);
              setAnswered(false);
            }}
            className="btn-primary mt-8"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Pertanyaan {currentQ + 1} dari {sampleQuestions.length}</span>
          <span>Skor: {score}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-primary-500 transition-all"
            style={{ width: `${((currentQ + 1) / sampleQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900">{question.question}</h2>

        <div className="mt-6 space-y-3">
          {question.options.map((opt, idx) => {
            let optionClass = 'w-full rounded-lg border p-3 text-left text-sm transition-colors';

            if (answered) {
              if (idx === question.correct) {
                optionClass += ' border-emerald-500 bg-emerald-50 text-emerald-700';
              } else if (idx === selected) {
                optionClass += ' border-red-500 bg-red-50 text-red-700';
              } else {
                optionClass += ' border-gray-200 text-gray-500';
              }
            } else {
              optionClass += ' border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50';
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={optionClass}
                disabled={answered}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <button onClick={handleNext} className="btn-primary mt-6 w-full">
            {isLast ? 'Lihat Hasil' : 'Selanjutnya'}
          </button>
        )}
      </div>
    </div>
  );
}
