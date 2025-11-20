'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에 있는 검색어를 초기값으로 가져옴
  const [term, setTerm] = useState(searchParams.get('q') || '');

  // 디바운스 (Debounce): 타자를 칠 때마다 요청 보내면 너무 느리니까, 0.3초 멈췄을 때 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      if (term) {
        router.push(`/?q=${term}`);
      } else {
        router.push('/');
      }
    }, 300); // 0.3초 대기

    return () => clearTimeout(timer);
  }, [term, router]);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/* 돋보기 아이콘 (Lucide React가 없어도 SVG로 직접 그림) */}
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder="에러 제목이나 태그로 검색..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
}