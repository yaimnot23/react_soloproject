'use client'

import { createBugLog } from '../actions';
import { useRef } from 'react';

export function CreateBugForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        await createBugLog(formData); // 서버 액션 실행
        formRef.current?.reset();     // 입력창 비우기
      }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"
    >
      <div className="flex gap-3">
        {/* ▼▼▼ [이 부분이 추가되어야 합니다] ▼▼▼ */}
        <select
          name="priority"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 text-sm"
          defaultValue="normal"
        >
          <option value="low">낮음</option>
          <option value="normal">보통</option>
          <option value="high">높음</option>
          <option value="critical">긴급🔥</option>
        </select>
        {/* ▲▲▲ ------------------------- ▲▲▲ */}

        {/* 에러 제목 입력 */}
        <input
          name="subject"
          type="text"
          placeholder="어떤 에러가 발생했나요? (예: NullPointerException)"
          required
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        
        {/* 태그 입력 */}
        <input
          name="tags"
          type="text"
          placeholder="#태그 (예: React)"
          className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none hidden sm:block"
        />

        {/* 등록 버튼 */}
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          등록
        </button>
      </div>
    </form>
  );
}