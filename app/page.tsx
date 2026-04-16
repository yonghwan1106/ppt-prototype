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

const ProjectMap = dynamic(() => import('../components/ProjectMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-900/60 rounded-xl flex items-center justify-center">
      <div className="text-gray-600 animate-pulse">지도 로딩 중...</div>
    </div>
  )
});

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);

  const handleProjectSelect = (project: typeof projectsData[0]) => {
    setSelectedProject(project);
    document.getElementById('project-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Dynamic KPI values
  const totalBudget = projectsData.reduce((sum, p) => sum + p.totalBudgetTrillion, 0);
  const highRiskCount = (risksData as Array<{ severity: string }>).filter(r => r.severity === 'high').length;
  const newDocsCount = articlesData.length;

  // Filter data by selected project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredWbs = (wbsData as any[]).filter((w: any) => w.projectId === selectedProject.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredRisks = (risksData as any[]).filter((r: any) => r.projectId === selectedProject.id);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top gold gradient bar */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #c8a044, rgba(200,160,68,0.3), transparent)' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#08090d]/90 backdrop-blur-xl border-b border-[rgba(200,160,68,0.1)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="serif-headline text-lg font-bold text-[#e8e4dc] tracking-wide">경인블루저널</span>
              <div className="h-[1.5px] w-full mt-0.5" style={{ background: 'linear-gradient(90deg, #c8a044, transparent)' }} />
            </div>
          </div>

          {/* Center: Title */}
          <div className="hidden md:flex items-center">
            <span className="mono-number text-[11px] font-medium tracking-[0.4em] text-[#8b8577] uppercase">
              Public Project Tracker
            </span>
          </div>

          {/* Right: Registration badge + live sync */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full text-[11px] mono-number font-medium text-[#c8a044] border border-[rgba(200,160,68,0.3)] bg-[rgba(200,160,68,0.05)]">
              경기, 아54671
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-mono">Last Sync: 2026-04-16 09:00 KST</span>
            </div>
          </div>
        </div>
      </header>

      {/* Thin separator */}
      <div className="separator-gold" />

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* KPI Cards */}
        <KPICards
          projectCount={projectsData.length}
          totalBudget={totalBudget}
          highRiskCount={highRiskCount}
          newDocsCount={newDocsCount}
        />

        {/* Map Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#c8a044] rounded-full" />
            <span className="section-label">지리 정보 시스템 · GEOGRAPHIC INTELLIGENCE</span>
          </div>
          <ProjectMap
            projects={projectsData}
            onProjectSelect={handleProjectSelect}
            selectedProjectId={selectedProject.id}
          />
        </section>

        {/* Project Detail + Risk Dashboard */}
        <div id="project-detail" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProjectDetail project={selectedProject} wbsData={filteredWbs} />
          <RiskDashboard risks={filteredRisks} tensionIndex={selectedProject.stakeholderTensionIndex} />
        </div>

        {/* Article Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#c8a044] rounded-full" />
            <span className="section-label">AI 에이전트 산출물 · EDITORIAL INTELLIGENCE</span>
          </div>
          <ArticleTimeline articles={articlesData} />
        </section>

        {/* Budget Analysis */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#c8a044] rounded-full" />
            <span className="section-label">재정 분석 · FINANCIAL INTELLIGENCE</span>
          </div>
          <BudgetAnalysis budgetData={budgetData} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(200,160,68,0.15)]">
        <div className="separator-gold" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="mono-number text-[11px] tracking-[0.2em] text-[#8b8577]">
              Powered by PPT · Public Project Tracker
            </p>
            <p className="text-xs text-[#8b8577] font-light">
              경인블루저널 · 인터넷신문 등록번호 경기, 아54671 · bluejournal.co.kr
            </p>
            <p className="text-[10px] text-[#5a5549]">
              © 2026 Gyeongin Blue Journal. AI-Powered Public Project Intelligence.
            </p>
            <p className="text-[9px] text-[#3a3530] mt-1">© 2026 Gyeongin Blue Journal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
