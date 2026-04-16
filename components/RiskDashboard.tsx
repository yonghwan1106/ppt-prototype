'use client';

interface Risk {
  id: number;
  category: string;
  name: string;
  description: string;
  severity: string;
  likelihood: string;
  impact: string;
  mitigation: string;
  detectedAt: string;
}

interface RiskDashboardProps {
  risks: Risk[];
  tensionIndex: number;
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'high': return '높음';
    case 'medium': return '중간';
    case 'low': return '낮음';
    default: return severity;
  }
}

export default function RiskDashboard({ risks, tensionIndex }: RiskDashboardProps) {
  const tensionPct = Math.round(tensionIndex * 100);
  const tensionColor = tensionIndex >= 0.7 ? '#ef4444' : tensionIndex >= 0.4 ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 flex flex-col">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">위험 관리</p>
        <h2 className="text-lg font-semibold text-white">리스크 대시보드</h2>
      </div>

      {/* Tension Gauge */}
      <div className="mb-5 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">이해관계자 갈등 지수</p>
          <span className="font-mono text-2xl font-bold" style={{ color: tensionColor }}>
            {tensionIndex.toFixed(2)}
          </span>
        </div>
        {/* SVG Semicircle Gauge */}
        <div className="flex justify-center">
          <svg width="200" height="110" viewBox="0 0 200 110">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#374151"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Value arc */}
            <path
              d={`M 20 100 A 80 80 0 0 1 ${20 + 160 * tensionIndex} ${100 - Math.sin(Math.acos(1 - tensionIndex)) * 80 * (tensionIndex <= 0.5 ? 1 : 1)}`}
              fill="none"
              stroke={tensionColor}
              strokeWidth="12"
              strokeLinecap="round"
              style={{
                strokeDasharray: `${tensionIndex * 251.2} 251.2`,
              }}
            />
            {/* Simpler approach: just use dasharray on the background arc path */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={tensionColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${tensionPct * 2.512} 251.2`}
            />
            <text x="100" y="85" textAnchor="middle" fill="#e5e7eb" fontSize="13" fontWeight="600">
              {tensionPct}%
            </text>
            <text x="20" y="108" textAnchor="middle" fill="#6b7280" fontSize="10">0</text>
            <text x="180" y="108" textAnchor="middle" fill="#6b7280" fontSize="10">1.0</text>
          </svg>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {risks.map((risk) => {
          const color = getSeverityColor(risk.severity);
          return (
            <div
              key={risk.id}
              className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30 card-hover"
              style={{ borderLeftWidth: 3, borderLeftColor: color }}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {getSeverityLabel(risk.severity)}
                  </span>
                  <span className="text-[10px] text-gray-500">{risk.category}</span>
                </div>
                <span className="text-[10px] text-gray-500">{risk.detectedAt}</span>
              </div>
              <p className="text-sm font-medium text-gray-200 mb-1">{risk.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {risk.description.length > 80 ? risk.description.slice(0, 80) + '...' : risk.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
