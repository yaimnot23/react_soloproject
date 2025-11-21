'use client'

import { useState } from 'react';
import { toast } from 'sonner';

interface BugLogData {
  errorSubject: string;
  errorDetail: string | null;
  solution: string | null;
  tags: string | null;
  occurrenceCount: number;
}

export function MarkdownExport({ log }: { log: BugLogData }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    // 1. 블로그 포맷팅 (템플릿 리터럴 사용)
    const markdownText = `
# [Trouble Shooting] ${log.errorSubject}

## 1. 문제 상황
${log.errorDetail || '작성된 내용이 없습니다.'}

## 2. 해결 방법
${log.solution || '작성된 해결 방법이 없습니다.'}

> Bug Hunter에 의해 ${log.occurrenceCount}번 발생했던 에러입니다. ${log.tags ? `#${log.tags}` : ''}
    `.trim();

    // 2. 클립보드에 복사
    try {
      await navigator.clipboard.writeText(markdownText);
      
      // 3. 성공 피드백 (버튼 글씨 바꾸기 + 토스트 메시지)
      setIsCopied(true);
      
      toast.success('클립보드에 Markdown 형식으로 복사되었습니다!'); 

      setTimeout(() => setIsCopied(false), 2000); // 2초 뒤 버튼 상태 원상복구
    } catch (err) {
      console.error('복사 실패:', err);
      // 실패 시 alert 대신 에러 토스트 띄우기
      toast.error('복사에 실패했습니다. 권한을 확인해주세요.');
    }
  };

  return (
    <button
      type="button" // form 안에 있어도 submit 되지 않도록
      onClick={handleCopy}
      className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
        isCopied
          ? 'bg-green-600 text-white border-transparent'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {isCopied ? '복사완료!' : '블로그용 복사'}
    </button>
  );
}