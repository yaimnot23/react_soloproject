'use server'

import { prisma } from '@/shared/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getBugLog(id: number) {
  const log = await prisma.bugLog.findUnique({
    where: { id },
  });
  return log;
}

// 상세 내용 & 중요도 수정하기 (수정됨)
export async function updateBugLog(id: number, formData: FormData) {
  const detail = formData.get('detail') as string;
  const solution = formData.get('solution') as string;
  const priority = formData.get('priority') as string; // 중요도 값 가져오기

  await prisma.bugLog.update({
    where: { id },
    data: {
      errorDetail: detail,
      solution: solution,
      priority: priority, // DB 업데이트
    },
  });

  revalidatePath(`/logs/${id}`);
}

export async function toggleSolved(id: number, currentStatus: boolean) {
  await prisma.bugLog.update({
    where: { id },
    data: { isSolved: !currentStatus },
  });

  revalidatePath(`/logs/${id}`);
  revalidatePath('/');
}

export async function deleteBugLog(id: number) {
  await prisma.bugLog.delete({
    where: { id },
  });

  revalidatePath('/');
  redirect('/');
}