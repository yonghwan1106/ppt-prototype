'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface BudgetCategory {
  name: string;
  amount: number;
  pct: number;
  color: string;
}

interface MonthlyExecution {
  month: string;
  planned: number;
  actual: number | null;
}

interface CostOverrunRisk {
  currentVariancePct: number;
  label: string;
  trend: string;
}

interface BudgetData {
  categories: BudgetCategory[];
  monthlyExecution: MonthlyExecution[];
  costOverrunRisk: CostOverrunRisk;
}

interface BudgetAnalysisProps {
  budgetData: BudgetData;
}

export default function BudgetAnalysis({ budgetData }: BudgetAnalysisProps) {
  const { categories, monthlyExecution, costOverrunRisk } = budgetData;
  const variance = costOverrunRisk.currentVariancePct;
  const isUnderBudget = variance < 0;

  // Calculate total
  const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0);
  const totalTrillion = (totalAmount / 10000).toFixed(0);

  return (
    <div className="card-surface rounded-xl p-6">
      <div className="mb-6">
        <h2 className="serif-headline text-xl font-bold text-[#e8e4dc]">예산 집행 현황</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut Chart - Categories */}
        <div>
          <p className="section-label mb-4">카테고리별 예산 배분</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  dataKey="amount"
                  nameKey="name"
                  paddingAngle={2}
                  stroke="none"
                >
                  {categories.map((entry, index) => (
                    <Cell key={index} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,18,25,0.95)',
                    border: '1px solid rgba(200,160,68,0.2)',
                    borderRadius: 8,
                    color: '#e8e4dc',
                    fontSize: 12,
                    fontFamily: 'Noto Sans KR',
                  }}
                  formatter={(value, name) => [
                    `${(Number(value) / 10000).toFixed(1)}조원 (${categories.find(c => c.name === name)?.pct}%)`,
                    String(name),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="mono-number text-2xl font-bold text-[#c8a044] gold-glow">{totalTrillion}</span>
                <span className="text-xs text-[#8b8577] block">조원</span>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mt-3">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs text-[#8b8577]">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: cat.color }} />
                <span className="font-light">{cat.name}</span>
                <span className="mono-number text-[#5a5549]">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart - Monthly Execution */}
        <div>
          <p className="section-label mb-4">분기별 예산 집행 추이</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyExecution} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b8577" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#8b8577" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,160,68,0.06)" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#5a5549', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(200,160,68,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#5a5549', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,18,25,0.95)',
                  border: '1px solid rgba(200,160,68,0.2)',
                  borderRadius: 8,
                  color: '#e8e4dc',
                  fontSize: 12,
                  fontFamily: 'Noto Sans KR',
                }}
                formatter={(value) => value !== null && value !== undefined ? [`${Number(value).toLocaleString()}억원`] : ['미정']}
              />
              <Legend
                wrapperStyle={{ fontSize: 10, fontFamily: 'Noto Sans KR', color: '#8b8577' }}
              />
              <Area
                type="monotone"
                dataKey="planned"
                name="계획"
                stroke="#8b8577"
                strokeDasharray="5 5"
                fill="url(#plannedGrad)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="실적"
                stroke="#3b82f6"
                fill="url(#actualGrad)"
                strokeWidth={2}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Overrun Indicator - Premium Gauge */}
      <div className="mt-6 p-5 rounded-xl border border-[rgba(200,160,68,0.1)] gold-gradient-bg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="section-label">예산 초과/절감 위험도</p>
            <p className="text-xs text-[#8b8577] font-light mt-1">{costOverrunRisk.label}</p>
          </div>
          <span
            className="mono-number text-3xl font-bold gold-glow"
            style={{ color: isUnderBudget ? '#10b981' : '#ef4444' }}
          >
            {variance > 0 ? '+' : ''}{variance}%
          </span>
        </div>

        {/* Premium gauge bar */}
        <div className="relative">
          <div className="h-6 bg-[rgba(200,160,68,0.04)] rounded-lg overflow-hidden relative">
            {/* Center marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[rgba(200,160,68,0.3)] z-10" />
            <div
              className="h-full rounded-lg transition-all duration-700"
              style={{
                width: `${50 + variance * 3}%`,
                background: isUnderBudget
                  ? 'linear-gradient(90deg, rgba(16,185,129,0.15), #10b981)'
                  : 'linear-gradient(90deg, rgba(239,68,68,0.15), #ef4444)',
              }}
            />
          </div>
          {/* Tick marks */}
          <div className="flex justify-between mt-1.5 px-0.5">
            {[-15, -10, -5, 0, 5, 10, 15].map((v) => (
              <div key={v} className="flex flex-col items-center">
                <div className="w-px h-1 bg-[rgba(200,160,68,0.15)]" />
                <span className="mono-number text-[8px] text-[#5a5549]">{v > 0 ? '+' : ''}{v}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[10px] mt-2">
          <span className="text-[#10b981]">절감</span>
          <span className="text-[#8b8577]">계획 대비</span>
          <span className="text-[#ef4444]">초과</span>
        </div>
      </div>
    </div>
  );
}
