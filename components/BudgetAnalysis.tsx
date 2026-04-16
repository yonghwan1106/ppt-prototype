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

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">재정 분석</p>
        <h2 className="text-lg font-semibold text-white">예산 집행 현황</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart - Categories */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">카테고리별 예산 배분</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="amount"
                nameKey="name"
                paddingAngle={2}
                stroke="none"
              >
                {categories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: 8,
                  color: '#e5e7eb',
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  `${(Number(value) / 10000).toFixed(1)}조원 (${categories.find(c => c.name === name)?.pct}%)`,
                  String(name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                <span>{cat.name}</span>
                <span className="font-mono text-gray-500">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart - Monthly Execution */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">분기별 예산 집행 추이 (억원)</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyExecution} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: 8,
                  color: '#e5e7eb',
                  fontSize: 12,
                }}
                formatter={(value) => value !== null && value !== undefined ? [`${Number(value).toLocaleString()}억원`] : ['미정']}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#9ca3af' }}
              />
              <Area
                type="monotone"
                dataKey="planned"
                name="계획"
                stroke="#6b7280"
                strokeDasharray="5 5"
                fill="none"
                strokeWidth={2}
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

      {/* Cost Overrun Indicator */}
      <div className="mt-5 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">예산 초과/절감 위험도</p>
            <p className="text-sm text-gray-300 mt-0.5">{costOverrunRisk.label}</p>
          </div>
          <span
            className="font-mono text-2xl font-bold"
            style={{ color: isUnderBudget ? '#10b981' : '#ef4444' }}
          >
            {variance > 0 ? '+' : ''}{variance}%
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden relative">
          {/* Center marker */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-500 z-10" />
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${50 + variance * 3}%`,
              background: isUnderBudget
                ? 'linear-gradient(90deg, #10b981, #059669)'
                : 'linear-gradient(90deg, #ef4444, #dc2626)',
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>절감</span>
          <span>계획 대비</span>
          <span>초과</span>
        </div>
      </div>
    </div>
  );
}
