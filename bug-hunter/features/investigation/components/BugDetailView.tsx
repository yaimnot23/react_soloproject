'use client'

import { useState } from 'react';
import { updateBugLog, toggleSolved, deleteBugLog } from '../actions';
import { useRouter } from 'next/navigation';
import { Badge } from '@/shared/ui/Badge'; // 아까 만든 뱃지 재사용
// Badge import가 @ 때문에 안 되면 상대 경로로: '../../../shared/ui/Badge'

interface BugLogProps {
  log: {
    id: number;
    errorSubject: string;
    errorDetail: string | null;
    solution: string | null;
    tags: string | null;
    isSolved: boolean;
    createdAt: Date;
  };
}

export function BugDetailView({ log }: BugLogProps) {
  // 낙관적 업데이트를 위해 로컬 상태 사용 (화면이 즉시 바뀌게)
  const [isSolved, setIsSolved] = useState(log.isSolved);
  const router = useRouter();

  // 해결 상태 토글 핸들러
  const handleToggleSolved = async () => {
    const newState = !isSolved;
    setIsSolved(newState); // 1. 화면 먼저 바꾸고 (빠른 반응)
    await toggleSolved(log.id, isSolved); // 2. 서버에 요청
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까? 복구할 수 없습니다.')) {
      await deleteBugLog(log.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 상단 헤더: 제목, 뱃지, 삭제버튼 */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge color={isSolved ? 'green' : 'red'}>
              {isSolved ? '검거 완료' : '수배 중'}
            </Badge>
            {log.tags && <Badge color="gray">#{log.tags}</Badge>}
            <span className="text-sm text-gray-500">
              {new Date(log.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{log.errorSubject}</h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleToggleSolved}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
              isSolved
                ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                : 'bg-green-600 text-white border-transparent hover:bg-green-700'
            }`}
          >
            {isSolved ? '다시 수배하기' : '검거 완료 처리'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-md text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠: 수정 폼 */}
      <form action={async (formData) => {
          await updateBugLog(log.id, formData);
          alert('저장되었습니다!');
      }}>
        <div className="grid gap-8">
          {/* 에러 상세 내용 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. 문제 상황 (Error Detail)</h2>
            <textarea
              name="detail"
              defaultValue={log.errorDetail || ''}
              placeholder="에러 로그나 발생 상황을 자세히 적어주세요..."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </section>

          {/* 해결 방법 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. 해결 방법 (Solution)</h2>
            <textarea
              name="solution"
              defaultValue={log.solution || ''}
              placeholder="어떻게 해결했나요? 나중을 위해 기록해두세요!"
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-indigo-50/30"
            />
          </section>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-transform active:scale-95 shadow-sm"
            >
              변경사항 저장하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}