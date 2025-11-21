import Link from 'next/link';
import { getBugLogs } from '@/features/dashboard/actions';
import { CreateBugForm } from '@/features/dashboard/components/CreateBugForm';
import { BugList } from '@/features/dashboard/components/BugList';
import { SearchBar } from '@/features/dashboard/components/SearchBar';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { TagStats } from '@/features/dashboard/components/TagStats';

interface PageProps {
  searchParams: Promise<{ q?: string; filter?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const filter = params.filter || 'all';

  const logs = await getBugLogs(query, filter);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* 헤더 영역 */}
        <div className="relative text-center mb-10">
          <div className="absolute right-0 top-0">
            <LogoutButton />
          </div>

          {/* [수정됨] 제목을 Link로 감싸서 홈으로 이동 기능 추가 */}
          {/* group 클래스를 사용해 hover 시 h1 색상이 변하도록 설정 */}
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors cursor-pointer">
               Bug Hunter
            </h1>
          </Link>
          
          <p className="text-lg text-gray-600">
            나만의 에러 현상수배소
          </p>
        </div>

        <CreateBugForm />
        
        <SearchBar />

        {/* 태그 통계 그래프 */}
        <TagStats logs={logs} />

        <div className="flex items-center justify-between mb-4 text-sm px-1">
          <span className="text-gray-500">
            {filter === 'unsolved' ? ' 수배 중인 에러 ' : ' 전체 기록 '}
            <strong>{logs.length}</strong> 건
          </span>
          
          <div className="flex gap-4">
            <Link 
              href={`/?q=${query}`}
              className={`font-medium transition-colors ${filter !== 'unsolved' ? 'text-indigo-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              전체 보기
            </Link>
            <Link 
              href={`/?q=${query}&filter=unsolved`} 
              className={`font-medium transition-colors ${filter === 'unsolved' ? 'text-indigo-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              미해결만
            </Link>
          </div>
        </div>

        <BugList logs={logs} />
      </div>
    </main>
  );
}