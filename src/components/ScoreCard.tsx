import { Scores } from '../types/audit';

interface ScoreCardProps {
  scores: Scores;
}

function ScoreGauge({ label, score }: { label: string; score: number }) {
  const getColor = (s: number): [string, string] => {
    if (s >= 70) return ['#16a34a', '#059669']; // green
    if (s >= 50) return ['#f59e0b', '#d97706']; // yellow
    if (s >= 30) return ['#fb923c', '#f97316']; // orange
    return ['#ef4444', '#dc2626']; // red
  };

  const getTextColor = (s: number) => {
    if (s >= 70) return 'text-green-400';
    if (s >= 50) return 'text-yellow-300';
    if (s >= 30) return 'text-orange-300';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            stroke="url(#gradient)"
            strokeDasharray={`${(score / 100) * 282.7} 282.7`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={getColor(score)[0]} />
              <stop offset="100%" stopColor={getColor(score)[1]} />
            </linearGradient>
          </defs>
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${getTextColor(score)}`}>
          {score}
        </div>
      </div>
      <p className="font-semibold text-gray-700 text-center">{label}</p>
    </div>
  );
}

export function ScoreCard({ scores }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Security Scores</h2>
      <div className="grid grid-cols-3 gap-8">
        <ScoreGauge label="Security" score={scores.security} />
        <ScoreGauge label="Privacy" score={scores.privacy} />
        <ScoreGauge label="UTxO Logic" score={scores.utxo_logic} />
      </div>
    </div>
  );
}

 
