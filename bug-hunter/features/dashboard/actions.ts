'use server'

import { prisma } from '@/shared/lib/db';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// 1. 에러 목록 가져오기
export async function getBugLogs(query?: string, filter?: string) {
  try {
    const whereCondition: Prisma.BugLogWhereInput = {};

    if (query) {
      whereCondition.OR = [
        { errorSubject: { contains: query } },
        { tags: { contains: query } }
      ];
    }

    if (filter === 'unsolved') {
      whereCondition.isSolved = false;
    }

    return await prisma.bugLog.findMany({
      where: whereCondition,
      orderBy: [
        // 정렬 우선순위: 해결 여부 -> 중요도(긴급한거 위로?) -> 빈도 -> 최신순
        // 중요도 정렬은 문자열이라 복잡하니 일단 기존 로직 유지
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

// 2. 에러 등록하기 (수정됨: priority 추가)
export async function createBugLog(formData: FormData) {
  const subject = formData.get('subject') as string;
  const tags = formData.get('tags') as string;
  const priority = formData.get('priority') as string || 'normal'; // 기본값 설정

  if (!subject) return;

  try {
    await prisma.bugLog.create({
      data: {
        errorSubject: subject,
        tags: tags || '',
        priority: priority, // DB 저장
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