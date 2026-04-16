'use client';

interface Article {
  id: number;
  type: string;
  typeLabel: string;
  title: string;
  summary: string;
  citation: string;
  publishedAt: string;
  author: string;
}

interface ArticleTimelineProps {
  articles: Article[];
}

function getTypeStyle(type: string): { color: string; label: string } {
  switch (type) {
    case 'briefing': return { color: '#3b82f6', label: '일일 브리핑' };
    case 'alert': return { color: '#ef4444', label: '위험 알림' };
    case 'report': return { color: '#c8a044', label: '심층 리포트' };
    default: return { color: '#8b8577', label: type };
  }
}

function getRelativeDate(dateStr: string): string {
  const now = new Date('2026-04-16T12:00:00Z');
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return `${Math.floor(diffDays / 30)}개월 전`;
}

export default function ArticleTimeline({ articles }: ArticleTimelineProps) {
  return (
    <div className="card-surface rounded-xl p-6">
      <div className="mb-6">
        <h2 className="serif-headline text-xl font-bold text-[#e8e4dc]">기사 타임라인</h2>
        <p className="text-xs text-[#5a5549] mt-1 mono-number tracking-wider">AI GENERATED · EDITOR VERIFIED</p>
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px timeline-line" />

        <div className="flex flex-col gap-5">
          {articles.map((article) => {
            const typeStyle = getTypeStyle(article.type);
            return (
              <div key={article.id} className="flex gap-5 group">
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 bg-[#08090d] z-10 transition-all group-hover:scale-125"
                    style={{ borderColor: typeStyle.color }}
                  />
                </div>

                {/* Content card */}
                <div
                  className="flex-1 rounded-lg p-5 card-hover"
                  style={{
                    background: 'rgba(15,18,25,0.6)',
                    borderLeft: `3px solid ${typeStyle.color}`,
                    border: `1px solid rgba(200,160,68,0.06)`,
                    borderLeftWidth: 3,
                    borderLeftColor: typeStyle.color,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-full mono-number text-[10px] font-medium tracking-wider border"
                      style={{
                        color: typeStyle.color,
                        borderColor: `${typeStyle.color}40`,
                        background: 'transparent',
                      }}
                    >
                      {article.typeLabel}
                    </span>
                    <span className="mono-number text-[10px] text-[#5a5549]">{getRelativeDate(article.publishedAt)}</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="text-[10px] text-[#8b8577]">{article.author}</span>
                      <span className="text-[8px] mono-number px-1.5 py-0.5 rounded border border-[rgba(200,160,68,0.15)] text-[#5a5549] tracking-wider">AI</span>
                    </div>
                  </div>
                  <h3 className="serif-headline text-base font-bold text-[#e8e4dc] mb-2 leading-snug">{article.title}</h3>
                  <p className="text-xs text-[#8b8577] font-light leading-relaxed mb-3">{article.summary}</p>
                  <div className="border-t border-[rgba(200,160,68,0.08)] pt-2">
                    <p className="text-[10px] text-[#5a5549] italic font-light">{article.citation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
