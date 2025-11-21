'use client'

import Link from 'next/link';
import { incrementBugCount } from '@/features/dashboard/actions';

// 1. 데이터의 타입을 정의합니다 (이 부분이 있어야 log가 무엇인지 알 수 있습니다)
interface BugLog {
  id: number;
  errorSubject: string;
  tags: string | null;
  isSolved: boolean;
  occurrenceCount: number;
}

// 태그 정규화 함수
const formatTag = (tag: string) => {
  const cleaned = tag.trim().replace(/^#/, '').toLowerCase();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

// 2. 컴포넌트 props에 타입을 지정합니다 ({ logs }: { logs: BugLog[] })
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
        // 이제 TypeScript가 'log'를 BugLog 타입으로 인식합니다.
        const tags = log.tags 
          ? log.tags.split(',').map(formatTag).filter(Boolean) 
          : [];

        return (
          <div 
            key={log.id} 
            className={`relative p-4 rounded-lg border transition-all hover:shadow-md flex items-center justify-between group ${
              log.isSolved ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200'
            }`}
          >
            {/* 링크 영역 */}
            <Link href={`/logs/${log.id}`} className="absolute inset-0 z-0" />

            {/* 왼쪽: 에러 정보 */}
            <div className="flex-1 z-10 pointer-events-none">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                  log.isSolved 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {log.isSolved ? '검거 완료' : '수배 중'}
                </span>
                
                {/* 태그 뱃지들 */}
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className={`font-medium ${log.isSolved ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {log.errorSubject}
              </h3>
            </div>

            {/* 오른쪽: 카운터 버튼 */}
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