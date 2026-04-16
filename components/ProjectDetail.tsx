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
    case 'completed': return '#10b981';
    case 'in_progress': return '#3b82f6';
    case 'started': return '#f59e0b';
    case 'pending':
    case 'planning':
    default: return '#374151';
  }
}

function getRiskColor(level: string): string {
  switch (level) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
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

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">프로젝트 상세</p>
        <h2 className="text-lg font-semibold text-white">{project.shortName}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WBS Progress Chart */}
        <div>
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">WBS 공정률</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontSize: 12 }}
                formatter={(value, _name, props) => {
                  const payload = (props as { payload?: { fullName?: string; statusLabel?: string } }).payload;
                  return [
                    `${value}% (${payload?.statusLabel ?? ''})`,
                    payload?.fullName ?? String(_name),
                  ];
                }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={16}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Metadata */}
        <div className="flex flex-col gap-4">
          {/* Big Progress */}
          <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">전체 진행률</p>
            <p className="font-mono text-5xl font-bold text-white">{project.progressPct}
              <span className="text-lg text-gray-400">%</span>
            </p>
            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${project.progressPct}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                }}
              />
            </div>
          </div>

          {/* Info Items */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '총 사업비', value: `${project.totalBudgetTrillion}조원` },
              { label: '예산 집행률', value: `${project.budgetCommittedPct}%` },
              { label: '시행사', value: project.primaryInvestor },
              { label: '관할', value: project.localGovt },
            ].map((item) => (
              <div key={item.label} className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-200 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Status + Risk */}
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {project.statusLabel}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold border"
              style={{
                backgroundColor: `${getRiskColor(project.riskLevel)}20`,
                color: getRiskColor(project.riskLevel),
                borderColor: `${getRiskColor(project.riskLevel)}40`,
              }}
            >
              위험도: {project.riskLevel === 'high' ? '높음' : project.riskLevel === 'medium' ? '중간' : '낮음'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
