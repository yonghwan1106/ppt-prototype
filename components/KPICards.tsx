'use client';

import { useState, useEffect } from 'react';

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return count;
}

interface KPICardProps {
  label: string;
  target: number;
  unit: string;
  trend: string;
  trendUp: boolean;
  delay: number;
  isDecimal?: boolean;
}

function KPICard({ label, target, unit, trend, trendUp, delay, isDecimal }: KPICardProps) {
  const count = useCountUp(target);
  const displayValue = isDecimal ? count.toFixed(1) : Math.round(count).toString();

  return (
    <div
      className={`animate-in animate-in-delay-${delay} card-hover card-surface rounded-xl p-5 flex flex-col gap-3 gold-border-left gold-gradient-bg`}
    >
      <div className="flex items-center justify-between">
        <span className="mono-number text-[10px] tracking-[0.2em] uppercase text-[#8b8577]">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="mono-number text-3xl sm:text-4xl lg:text-5xl font-bold text-[#c8a044] gold-glow leading-none">{displayValue}</span>
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

interface KPICardsProps {
  projectCount: number;
  totalBudget: number;
  highRiskCount: number;
  newDocsCount: number;
}

export default function KPICards({ projectCount, totalBudget, highRiskCount, newDocsCount }: KPICardsProps) {
  const cards: KPICardProps[] = [
    { label: '추적 프로젝트', target: projectCount, unit: '건', trend: '+2', trendUp: true, delay: 1 },
    { label: '총 사업규모', target: totalBudget, unit: '조원', trend: '+3.2조', trendUp: true, delay: 2, isDecimal: true },
    { label: '이번 주 신규 문서', target: newDocsCount, unit: '건', trend: '+8', trendUp: true, delay: 3 },
    { label: '고위험 알림', target: highRiskCount, unit: '건', trend: '-1', trendUp: false, delay: 4 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
