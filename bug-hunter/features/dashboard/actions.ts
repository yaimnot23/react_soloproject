'use server'

import { prisma } from '@/shared/lib/db';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { cookies } from 'next/headers'; // [추가됨] 쿠키 가져오기
import { decrypt } from '@/features/auth/lib/session'; // [추가됨] 세션 해석기

// 1. 에러 목록 가져오기 (수정됨: 내 것만 가져오기)
export async function getBugLogs(query?: string, filter?: string) {
  try {
    // [추가됨] 1. 현재 로그인한 사용자 확인
    const cookieStore = await cookies();
    const session = await decrypt(cookieStore.get('session')?.value);

    // 로그인이 안 되어 있으면 빈 목록 반환 (보안)
    if (!session?.userId) {
      return [];
    }

    const currentUserId = parseInt(session.userId); // DB가 Int형이므로 변환

    // [추가됨] 2. 검색 조건에 '내 아이디(userId)' 추가
    const whereCondition: Prisma.BugLogWhereInput = {
      userId: currentUserId, // <--- 핵심! 내 글만 조회 조건
    };

    if (query) {
      whereCondition.AND = [ // 기존 OR를 AND 그룹으로 감싸서 내 글이면서 + 검색어 일치하도록
        {
          OR: [
            { errorSubject: { contains: query } },
            { tags: { contains: query } }
          ]
        }
      ];
    }

    if (filter === 'unsolved') {
      whereCondition.isSolved = false;
    }

    return await prisma.bugLog.findMany({
      where: whereCondition,
      orderBy: [
        { isSolved: 'asc' },
        { occurrenceCount: 'desc' }, 
        { lastOccurredAt: 'desc' }   
      ]
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}

// 2. 에러 등록하기 (수정됨: 작성자 ID 저장)
export async function createBugLog(formData: FormData) {
  // [추가됨] 세션에서 사용자 ID 가져오기
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get('session')?.value);

  if (!session?.userId) return; // 로그인 안 했으면 무시

  const subject = formData.get('subject') as string;
  const tags = formData.get('tags') as string;
  const priority = formData.get('priority') as string || 'normal';

  if (!subject) return;

  try {
    await prisma.bugLog.create({
      data: {
        errorSubject: subject,
        tags: tags || '',
        priority: priority,
        userId: parseInt(session.userId), // [핵심] 작성자 ID 같이 저장!
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating log:', error);
  }
}

// 3. 발생 횟수 증가
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