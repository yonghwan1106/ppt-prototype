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

          {/* Right: Registration badge */}
          <div className="flex items-center">
            <span className="px-3 py-1.5 rounded-full text-[11px] mono-number font-medium text-[#c8a044] border border-[rgba(200,160,68,0.3)] bg-[rgba(200,160,68,0.05)]">
              경기, 아54671
            </span>
          </div>
        </div>
      </header>

      {/* Thin separator */}
      <div className="separator-gold" />

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* KPI Cards */}
        <KPICards />

        {/* Map Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#c8a044] rounded-full" />
            <span className="section-label">Geographic Intelligence</span>
          </div>
          <ProjectMap projects={projectsData} onProjectSelect={setSelectedProject} />
        </section>

        {/* Project Detail + Risk Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProjectDetail project={selectedProject} wbsData={wbsData} />
          <RiskDashboard risks={risksData} tensionIndex={selectedProject.stakeholderTensionIndex} />
        </div>

        {/* Article Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#c8a044] rounded-full" />
            <span className="section-label">Editorial Intelligence</span>
          </div>
          <ArticleTimeline articles={articlesData} />
        </section>

        {/* Budget Analysis */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#c8a044] rounded-full" />
            <span className="section-label">Financial Intelligence</span>
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
            <p className="text-[9px] text-[#3a3530] mt-1">Built with Claude Code</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
