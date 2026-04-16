'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface WBSItem {
  id: string;
  name: string;
  parent: string;
  progressPct: number;
  status: string;
  statusLabel: string;
  plannedEnd: string;
}

interface Project {
  id: number;
  name: string;
  shortName: string;
  totalBudgetTrillion: number;
  progressPct: number;
  budgetCommittedPct: number;
  statusLabel: string;
  primaryInvestor: string;
  localGovt: string;
  governmentLead: string;
  riskLevel: string;
}

interface ProjectDetailProps {
  project: Project;
  wbsData: WBSItem[];
}

function getBarColor(status: string): string {
  switch (status) {
    case 'completed': return '#c8a044';
    case 'in_progress': return '#3b82f6';
    case 'started': return 'rgba(200,160,68,0.4)';
    case 'pending':
    case 'planning':
    default: return 'rgba(139,133,119,0.2)';
  }
}

function getRiskColor(level: string): string {
  switch (level) {
    case 'high': return '#ef4444';
    case 'medium': return '#c8a044';
    case 'low': return '#10b981';
    default: return '#8b8577';
  }
}

export default function ProjectDetail({ project, wbsData }: ProjectDetailProps) {
  const chartData = wbsData.map((item) => ({
    name: item.name.length > 12 ? item.name.slice(0, 12) + '...' : item.name,
    fullName: item.name,
    progress: item.progressPct,
    status: item.status,
    statusLabel: item.statusLabel,
    plannedEnd: item.plannedEnd,
  }));

  const progressWhole = Math.floor(project.progressPct);
  const progressDecimal = (project.progressPct % 1).toFixed(1).slice(1);

  return (
    <div className="card-surface rounded-xl p-6">
      <div className="mb-5">
        <span className="section-label">Project Detail</span>
        <h2 className="serif-headline text-2xl font-bold text-[#e8e4dc] mt-2">{project.shortName}</h2>
      </div>

      {/* Big Progress Display */}
      <div className="mb-6 p-5 rounded-xl border border-[rgba(200,160,68,0.1)] gold-gradient-bg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="pulse-dot w-2 h-2 rounded-full bg-[#c8a044]" />
            <span className="text-[10px] mono-number tracking-wider text-[#8b8577] uppercase">전체 진행률</span>
          </div>
          <div className="flex gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-medium border"
              style={{
                color: '#3b82f6',
                borderColor: 'rgba(59,130,246,0.3)',
                background: 'rgba(59,130,246,0.05)',
              }}
            >
              {project.statusLabel}
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-medium border"
              style={{
                color: getRiskColor(project.riskLevel),
                borderColor: `${getRiskColor(project.riskLevel)}40`,
                background: `${getRiskColor(project.riskLevel)}08`,
              }}
            >
              위험도 {project.riskLevel === 'high' ? '높음' : project.riskLevel === 'medium' ? '중간' : '낮음'}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-0">
          <span className="mono-number text-5xl md:text-7xl lg:text-8xl font-bold text-[#c8a044] gold-glow leading-none">
            {progressWhole}
          </span>
          <span className="mono-number text-4xl font-bold text-[#c8a044] gold-glow leading-none">
            {progressDecimal}
          </span>
          <span className="mono-number text-2xl text-[#8b8577] ml-1 leading-none">%</span>
        </div>
        <div className="mt-4 h-2 bg-[rgba(200,160,68,0.08)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${project.progressPct}%`,
              background: 'linear-gradient(90deg, #c8a044, #d4b156)',
              boxShadow: '0 0 12px rgba(200,160,68,0.4)',
            }}
          />
        </div>
      </div>

      {/* Metadata grid with dividers */}
      <div className="grid grid-cols-2 mb-6">
        <div className="p-3 border-r border-b border-[rgba(200,160,68,0.08)]">
          <p className="text-[10px] text-[#5a5549] uppercase mono-number tracking-wider">총 사업비</p>
          <p className="mono-number text-lg font-bold text-[#e8e4dc] mt-1">{project.totalBudgetTrillion}<span className="text-xs text-[#8b8577] ml-0.5">조원</span></p>
        </div>
        <div className="p-3 border-b border-[rgba(200,160,68,0.08)]">
          <p className="text-[10px] text-[#5a5549] uppercase mono-number tracking-wider">예산 집행률</p>
          <p className="mono-number text-lg font-bold text-[#e8e4dc] mt-1">{project.budgetCommittedPct}<span className="text-xs text-[#8b8577] ml-0.5">%</span></p>
        </div>
        <div className="p-3 border-r border-[rgba(200,160,68,0.08)]">
          <p className="text-[10px] text-[#5a5549] uppercase mono-number tracking-wider">시행사</p>
          <p className="text-sm text-[#e8e4dc] mt-1 font-normal">{project.primaryInvestor}</p>
        </div>
        <div className="p-3">
          <p className="text-[10px] text-[#5a5549] uppercase mono-number tracking-wider">관할</p>
          <p className="text-sm text-[#e8e4dc] mt-1 font-normal">{project.localGovt}</p>
        </div>
      </div>

      {/* WBS Progress Chart */}
      <div>
        <p className="section-label mb-3">WBS 공정률</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#5a5549', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: '#8b8577', fontSize: 11, fontFamily: 'Noto Sans KR' }}
              axisLine={false}
              tickLine={false}
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
              formatter={(value, _name, props) => {
                const payload = (props as { payload?: { fullName?: string; statusLabel?: string } }).payload;
                return [
                  `${value}% (${payload?.statusLabel ?? ''})`,
                  payload?.fullName ?? String(_name),
                ];
              }}
              cursor={{ fill: 'rgba(200,160,68,0.03)' }}
            />
            <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={14}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
