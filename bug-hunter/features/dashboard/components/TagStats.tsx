'use client'

import { useMemo } from 'react';
import Link from 'next/link'; // [추가됨] 링크 이동을 위해 import

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
        const tagList = log.tags.split(',').map((t) => {
          return t
            .trim()
            .replace(/^#/, '')
            .toLowerCase();
        });
        
        tagList.forEach((tag) => {
          if (!tag) return;
          counts[tag] = (counts[tag] || 0) + 1;
          totalTags++;
        });
      }
    });

    if (totalTags === 0) return [];

    return Object.entries(counts)
      .map(([name, count], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        count,
        percent: (count / totalTags) * 100,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [logs]);

  if (stats.length === 0) return null;

  return (
    <div className="mb-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Technologies</h3>
      
      {/* 게이지 바 */}
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-100 mb-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            style={{ width: `${stat.percent}%`, backgroundColor: stat.color }}
            className="h-full transition-all duration-500 hover:opacity-80"
            title={`${stat.name}: ${stat.count}건 (${stat.percent.toFixed(1)}%)`}
          />
        ))}
      </div>

      {/* 범례 (Legend) - 클릭 시 검색 필터링 적용 */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={`/?q=${stat.name}`} // 클릭 시 해당 태그로 검색
            className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors"
          >
            <span
              className="w-2.5 h-2.5 rounded-full ring-1 ring-transparent group-hover:ring-gray-200"
              style={{ backgroundColor: stat.color }}
            />
            <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
              {stat.name}
              <span className="text-gray-500 ml-1 group-hover:text-gray-700">
                {stat.percent.toFixed(1)}%
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}