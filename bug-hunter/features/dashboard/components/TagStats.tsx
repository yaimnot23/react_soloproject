'use client'

import { useMemo } from 'react';

const COLORS = [
  '#3b82f6', // Blue
  '#eab308', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#10b981', // Green
  '#f97316', // Orange
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

interface BugLog {
  tags: string | null;
}

export function TagStats({ logs }: { logs: BugLog[] }) {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalTags = 0;

    logs.forEach((log) => {
      if (log.tags) {
        // 1. 태그 분리 및 전처리
        const tagList = log.tags.split(',').map((t) => {
          return t
            .trim()                 // 앞뒤 공백 제거
            .replace(/^#/, '')      // '#' 제거
            .toLowerCase();         // ★ 핵심: 모두 소문자로 변환 ('React' -> 'react')
        });
        
        tagList.forEach((tag) => {
          if (!tag) return;
          counts[tag] = (counts[tag] || 0) + 1;
          totalTags++;
        });
      }
    });

    if (totalTags === 0) return [];

    // 2. 데이터 가공 (비율 계산 및 이름 포맷팅)
    return Object.entries(counts)
      .map(([name, count], index) => ({
        // ★ 화면 표시용 이름 변환: 첫 글자만 대문자로 (예: react -> React)
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        count,
        percent: (count / totalTags) * 100,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.count - a.count); // 많은 순서대로 정렬
  }, [logs]);

  if (stats.length === 0) return null;

  return (
    <div className="mb-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Technologies</h3>
      
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-100">
        {stats.map((stat) => (
          <div
            key={stat.name}
            style={{ width: `${stat.percent}%`, backgroundColor: stat.color }}
            className="h-full transition-all duration-500 hover:opacity-80"
            title={`${stat.name}: ${stat.count}건 (${stat.percent.toFixed(1)}%)`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: stat.color }}
            />
            <span className="text-xs font-medium text-gray-700">
              {stat.name}
              <span className="text-gray-500 ml-1">{stat.percent.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}