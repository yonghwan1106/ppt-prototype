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
    case 'medium': return '#c8a044';
    case 'low': return '#10b981';
    default: return '#8b8577';
  }
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'high': return 'HIGH';
    case 'medium': return 'MED';
    case 'low': return 'LOW';
    default: return severity;
  }
}

export default function RiskDashboard({ risks, tensionIndex }: RiskDashboardProps) {
  const tensionPct = Math.round(tensionIndex * 100);

  // Gradient stops for the tension bar
  const barGradient = tensionIndex >= 0.7
    ? 'linear-gradient(90deg, #10b981 0%, #c8a044 40%, #ef4444 70%, #ef4444 100%)'
    : tensionIndex >= 0.4
    ? 'linear-gradient(90deg, #10b981 0%, #c8a044 60%, #c8a044 100%)'
    : 'linear-gradient(90deg, #10b981 0%, #10b981 100%)';

  return (
    <div className="card-surface rounded-xl p-6 flex flex-col">
      <div className="mb-5">
        <span className="section-label">Risk Assessment</span>
        <h2 className="serif-headline text-2xl font-bold text-[#e8e4dc] mt-2">리스크 대시보드</h2>
      </div>

      {/* Horizontal Tension Bar */}
      <div className="mb-6 p-5 rounded-xl border border-[rgba(200,160,68,0.1)] gold-gradient-bg">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] mono-number tracking-wider text-[#8b8577] uppercase">이해관계자 갈등 지수</p>
          <span className="mono-number text-3xl font-bold text-[#c8a044] gold-glow">
            {tensionIndex.toFixed(2)}
          </span>
        </div>

        {/* Full-width horizontal bar */}
        <div className="relative">
          {/* Background */}
          <div className="h-8 rounded-lg overflow-hidden" style={{ background: 'rgba(200,160,68,0.06)' }}>
            {/* Filled portion with gradient */}
            <div
              className="h-full rounded-lg transition-all duration-700 relative"
              style={{
                width: `${tensionPct}%`,
                background: barGradient,
                boxShadow: tensionIndex >= 0.7 ? '0 0 20px rgba(239,68,68,0.3)' : '0 0 20px rgba(200,160,68,0.2)',
              }}
            >
              {/* Percentage overlay inside bar */}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 mono-number text-xs font-bold text-white/90">
                {tensionPct}%
              </span>
            </div>
          </div>

          {/* Tick marks */}
          <div className="flex justify-between mt-1.5 px-0.5">
            {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
              <div key={v} className="flex flex-col items-center">
                <div className="w-px h-1.5 bg-[rgba(200,160,68,0.2)]" />
                <span className="mono-number text-[9px] text-[#5a5549] mt-0.5">{v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-[#10b981]">안정</span>
          <span className="text-[10px] text-[#c8a044]">주의</span>
          <span className="text-[10px] text-[#ef4444]">위험</span>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
        {risks.map((risk) => {
          const color = getSeverityColor(risk.severity);
          const isHigh = risk.severity === 'high';
          return (
            <div
              key={risk.id}
              className={`rounded-lg p-4 border border-[rgba(200,160,68,0.06)] card-hover ${isHigh ? 'pulse-border-high' : ''}`}
              style={{
                borderLeftWidth: 3,
                borderLeftColor: color,
                background: 'rgba(15,18,25,0.6)',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded mono-number text-[9px] font-bold tracking-wider border"
                    style={{
                      color,
                      borderColor: `${color}40`,
                      background: `${color}08`,
                    }}
                  >
                    {getSeverityLabel(risk.severity)}
                  </span>
                  <span className="text-[10px] text-[#5a5549] mono-number">{risk.category}</span>
                </div>
                <span className="text-[10px] text-[#5a5549] mono-number">{risk.detectedAt}</span>
              </div>
              <p className="text-sm font-normal text-[#e8e4dc] mb-1.5">{risk.name}</p>
              <p className="text-xs text-[#8b8577] font-light leading-relaxed">
                {risk.description.length > 100 ? risk.description.slice(0, 100) + '...' : risk.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
