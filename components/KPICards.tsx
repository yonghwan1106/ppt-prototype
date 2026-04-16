'use client';

interface KPICardProps {
  label: string;
  value: string;
  unit: string;
  trend: string;
  trendUp: boolean;
  delay: number;
}

function KPICard({ label, value, unit, trend, trendUp, delay }: KPICardProps) {
  return (
    <div
      className={`animate-in animate-in-delay-${delay} card-hover card-surface rounded-xl p-5 flex flex-col gap-3 gold-border-left gold-gradient-bg`}
    >
      <div className="flex items-center justify-between">
        <span className="mono-number text-[10px] tracking-[0.2em] uppercase text-[#8b8577]">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="mono-number text-5xl font-bold text-[#c8a044] gold-glow leading-none">{value}</span>
        <span className="text-sm text-[#8b8577] font-light">{unit}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-xs ${trendUp ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
          {trendUp ? '▲' : '▼'} {trend}
        </span>
        <span className="text-[10px] text-[#5a5549]">vs 지난주</span>
      </div>
    </div>
  );
}

export default function KPICards() {
  const cards: KPICardProps[] = [
    { label: '추적 프로젝트', value: '8', unit: '건', trend: '+2', trendUp: true, delay: 1 },
    { label: '총 사업규모', value: '156.3', unit: '조원', trend: '+3.2조', trendUp: true, delay: 2 },
    { label: '이번 주 신규 문서', value: '23', unit: '건', trend: '+8', trendUp: true, delay: 3 },
    { label: '고위험 알림', value: '3', unit: '건', trend: '-1', trendUp: false, delay: 4 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
