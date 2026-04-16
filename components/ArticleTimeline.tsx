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

function getTypeColor(type: string): string {
  switch (type) {
    case 'briefing': return '#3b82f6';
    case 'alert': return '#ef4444';
    case 'report': return '#8b5cf6';
    default: return '#6b7280';
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
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">AI 에이전트 산출물</p>
        <h2 className="text-lg font-semibold text-white">기사 타임라인</h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-700/50" />

        <div className="flex flex-col gap-4">
          {articles.map((article) => {
            const color = getTypeColor(article.type);
            return (
              <div key={article.id} className="flex gap-4 group">
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 bg-gray-900 z-10 transition-all group-hover:scale-125"
                    style={{ borderColor: color }}
                  />
                </div>

                {/* Content card */}
                <div className="flex-1 bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 card-hover"
                  style={{ borderLeftWidth: 3, borderLeftColor: color }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {article.typeLabel}
                    </span>
                    <span className="text-xs text-gray-500">{getRelativeDate(article.publishedAt)}</span>
                    <span className="text-[10px] text-gray-600 ml-auto">{article.author}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-100 mb-1.5 leading-snug">{article.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">{article.summary}</p>
                  <p className="text-[10px] text-gray-500 italic">{article.citation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
