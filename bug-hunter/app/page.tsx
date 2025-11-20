import { getBugLogs } from '@/features/dashboard/actions';
import { CreateBugForm } from '@/features/dashboard/components/CreateBugForm';
import { BugList } from '@/features/dashboard/components/BugList';
import { SearchBar } from '@/features/dashboard/components/SearchBar'; // 추가됨

// URL에 있는 파라미터(?q=...)를 받아옵니다.
interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  // 1. 검색어 꺼내기
  const params = await searchParams;
  const query = params.q || '';

  // 2. 검색어를 넣어서 데이터 가져오기
  const logs = await getBugLogs(query);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
             Bug Hunter
          </h1>
          <p className="text-lg text-gray-600">
            나만의 에러 현상수배소
          </p>
        </div>

        {/* 등록 폼 */}
        <CreateBugForm />

        {/* 검색창 추가! */}
        <SearchBar />

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500 px-1">
          {/* 검색 결과 개수 표시 */}
          <span>
            {query ? `'${query}' 검색 결과: ` : 'Total '} 
            <strong>{logs.length}</strong> bugs found
          </span>
          
          {/* 필터 버튼은 기능 구현 안 함 (디자인용) */}
          <div className="flex gap-4">
            <button className="font-bold text-indigo-600">전체 보기</button>
            <button className="hover:text-gray-900">미해결만</button>
          </div>
        </div>

        <BugList logs={logs} />
      </div>
    </main>
  );
}