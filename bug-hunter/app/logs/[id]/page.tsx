import Link from 'next/link'; // 1. Link 컴포넌트 가져오기
import { notFound } from 'next/navigation';
import { getBugLog } from '@/features/investigation/actions';
import { BugDetailView } from '@/features/investigation/components/BugDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LogDetailPage({ params }: PageProps) {

  const resolvedParams = await params;
  const bugId = parseInt(resolvedParams.id);
  
  const log = await getBugLog(bugId);

  if (!log) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        {/* 2. <a> 태그를 <Link> 태그로 변경 */}
        <Link 
          href="/" 
          className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
      
      <BugDetailView log={log} />
    </div>
  );
}