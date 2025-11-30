import { SecurityRisk } from '../types/audit';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

interface RiskCardProps {
  risk: SecurityRisk;
}

export function RiskCard({ risk }: RiskCardProps) {
  const severityConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      icon: AlertOctagon,
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
      icon: AlertTriangle,
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: AlertCircle,
    },
    low: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      icon: AlertCircle,
    },
  };

  const config = severityConfig[risk.severity];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border-l-4 ${config.border} rounded-lg p-6`}>
      <div className="flex items-start gap-4">
        <Icon className="text-red-600 flex-shrink-0 mt-1" size={24} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 break-words">
              {risk.title}
            </h3>
            <span className={`${config.badge} text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap`}>
              {risk.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">{risk.description}</p>
          <div className="bg-white bg-opacity-60 p-3 rounded border border-gray-300 mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">Affected Code:</p>
            <code className="text-xs text-gray-800 break-words block font-mono">
              {risk.affected_code_snippet}
            </code>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-xs font-semibold text-green-800 mb-1">Fix:</p>
            <p className="text-sm text-green-900 break-words">{risk.fix_suggestion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
