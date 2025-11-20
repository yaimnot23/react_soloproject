'use server'

import { prisma } from '@/shared/lib/db';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// 1. 에러 목록 가져오기 (검색 + 필터 기능)
export async function getBugLogs(query?: string, filter?: string) {
  try {
    // DB 검색 조건 만들기
    const whereCondition: Prisma.BugLogWhereInput = {};

    // A. 검색어가 있으면 제목이나 태그에서 찾기
    if (query) {
      whereCondition.OR = [
        { errorSubject: { contains: query } },
        { tags: { contains: query } }
      ];
    }

    // B. '미해결만' 필터가 있으면 isSolved가 false인 것만 찾기
    if (filter === 'unsolved') {
      whereCondition.isSolved = false;
    }

    return await prisma.bugLog.findMany({
      where: whereCondition,
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