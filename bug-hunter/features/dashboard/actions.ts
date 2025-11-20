'use server'

import { prisma } from '@/shared/lib/db';
import { revalidatePath } from 'next/cache';

// 1. 에러 목록 가져오기 (검색 기능 추가됨)
export async function getBugLogs(query?: string) {
  try {
    return await prisma.bugLog.findMany({
      where: {
        // query가 있으면 제목(errorSubject)이나 태그(tags)에서 찾기
        OR: query ? [
          { errorSubject: { contains: query } },
          { tags: { contains: query } }
        ] : undefined
      },
      orderBy: [
        { isSolved: 'asc' },         // 미해결 먼저
        { occurrenceCount: 'desc' }, // 많이 발생한 순
        { lastOccurredAt: 'desc' }   // 최근 발생한 순
      ]
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}

// 2. 에러 등록하기
export async function createBugLog(formData: FormData) {
  const subject = formData.get('subject') as string;
  const tags = formData.get('tags') as string;

  if (!subject) return;

  try {
    await prisma.bugLog.create({
      data: {
        errorSubject: subject,
        tags: tags || '',
      },
    });
    // 데이터가 추가됐으니 메인 페이지를 새로고침합니다.
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating log:', error);
  }
}

// 3. 발생 횟수 증가 (+1)
export async function incrementBugCount(id: number) {
  try {
    await prisma.bugLog.update({
      where: { id },
      data: {
        occurrenceCount: { increment: 1 },
        lastOccurredAt: new Date(),
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error incrementing count:', error);
  }
}