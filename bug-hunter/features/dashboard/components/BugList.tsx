'use client'

import Link from 'next/link';
import { incrementBugCount } from '@/features/dashboard/actions';
interface BugLog {
  id: number;
  errorSubject: string;
  tags: string | null;
  isSolved: boolean;
  occurrenceCount: number;
  priority: string; // [필수]
}

const formatTag = (tag: string) => {
  const cleaned = tag.trim().replace(/^#/, '').toLowerCase();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

// 중요도별 색상 스타일 정의
const priorityStyles: Record<string, string> = {
  low: 'border-l-4 border-l-blue-400',
  normal: 'border-l-4 border-l-gray-300',
  high: 'border-l-4 border-l-orange-400',
  critical: 'border-l-4 border-l-red-500 bg-red-50/30',
};

export function BugList({ logs }: { logs: BugLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        아직 등록된 에러가 없습니다. 첫 번째 에러를 기록해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const tags = log.tags 
          ? log.tags.split(',').map(formatTag).filter(Boolean) 
          : [];
        
        // 해당 에러의 중요도 스타일 가져오기
        const borderStyle = priorityStyles[log.priority] || priorityStyles.normal;

        return (
          <div 
            key={log.id} 
            // borderStyle 클래스 적용 (테두리 색상 표시)
            className={`relative p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md flex items-center justify-between group ${borderStyle} ${
              log.isSolved ? 'opacity-75 bg-gray-50' : 'bg-white'
            }`}
          >
            <Link href={`/logs/${log.id}`} className="absolute inset-0 z-0" />

            <div className="flex-1 z-10 pointer-events-none">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                  log.isSolved 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {log.isSolved ? '검거 완료' : '수배 중'}
                </span>

                {/* 긴급일 경우 텍스트 추가 표시 */}
                {log.priority === 'critical' && (
                  <span className="text-xs font-bold text-red-600 animate-pulse">
                    🔥 긴급
                  </span>
                )}
                
                {tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/?q=${tag}`}
                    className="relative z-20 pointer-events-auto px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <h3 className={`font-medium ${log.isSolved ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {log.errorSubject}
              </h3>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                incrementBugCount(log.id);
              }}
              className="z-20 flex flex-col items-center justify-center w-16 h-14 ml-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all group-hover:border-gray-300 cursor-pointer"
            >
              <span className="text-xs font-bold text-gray-400 mb-0.5">COUNT</span>
              <span className="text-lg font-extrabold">{log.occurrenceCount}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}