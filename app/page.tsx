'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import projectsData from '../data/projects.json';
import wbsData from '../data/wbs.json';
import articlesData from '../data/articles.json';
import risksData from '../data/risks.json';
import budgetData from '../data/budget.json';

import KPICards from '../components/KPICards';
import ProjectDetail from '../components/ProjectDetail';
import RiskDashboard from '../components/RiskDashboard';
import ArticleTimeline from '../components/ArticleTimeline';
import BudgetAnalysis from '../components/BudgetAnalysis';

const ProjectMap = dynamic(() => import('../components/ProjectMap'), { ssr: false });

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              BJ
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">경인블루저널</span>
              <span className="hidden sm:inline text-gray-600">|</span>
              <span className="hidden sm:inline text-sm text-gray-400">PPT · Public Project Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden md:inline">경기남부 반도체 클러스터</span>
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
              경기, 아54671
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* KPI Cards */}
        <KPICards />

        {/* Map */}
        <ProjectMap projects={projectsData} onProjectSelect={setSelectedProject} />

        {/* Project Detail + Risk Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectDetail project={selectedProject} wbsData={wbsData} />
          <RiskDashboard risks={risksData} tensionIndex={selectedProject.stakeholderTensionIndex} />
        </div>

        {/* Article Timeline */}
        <ArticleTimeline articles={articlesData} />

        {/* Budget Analysis */}
        <BudgetAnalysis budgetData={budgetData} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-gray-900/40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                BJ
              </div>
              <div>
                <p className="text-xs text-gray-400">경인블루저널 · PPT Public Project Tracker</p>
                <p className="text-[10px] text-gray-600 mt-0.5">AI 에이전트 기반 공공 프로젝트 추적 · 분석 플랫폼</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-gray-600">
              <span>데이터 기준: 2026.04.16</span>
              <span>|</span>
              <span>Powered by PPT AI Agent</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
