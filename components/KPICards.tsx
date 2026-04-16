'use client';

interface KPICardProps {
  label: string;
  value: string;
  unit: string;
  icon: string;
  accentColor: string;
}

function KPICard({ label, value, unit, icon, accentColor }: KPICardProps) {
  return (
    <div className="card-hover bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-bold text-white">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
    </div>
  );
}

export default function KPICards() {
  const cards: KPICardProps[] = [
    { label: '추적 프로젝트', value: '8', unit: '건', icon: '📊', accentColor: '#3b82f6' },
    { label: '총 사업규모', value: '156.3', unit: '조원', icon: '💰', accentColor: '#10b981' },
    { label: '이번 주 신규 문서', value: '23', unit: '건', icon: '📄', accentColor: '#8b5cf6' },
    { label: '고위험 알림', value: '3', unit: '건', icon: '⚠️', accentColor: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
