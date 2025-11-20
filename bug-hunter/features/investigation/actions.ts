'use server'

import { prisma } from '@/shared/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. 상세 정보 가져오기
export async function getBugLog(id: number) {
  const log = await prisma.bugLog.findUnique({
    where: { id },
  });
  return log;
}

// 2. 상세 내용 & 해결 방법 저장하기 (Update)
export async function updateBugLog(id: number, formData: FormData) {
  const detail = formData.get('detail') as string;
  const solution = formData.get('solution') as string;

  await prisma.bugLog.update({
    where: { id },
    data: {
      errorDetail: detail,
      solution: solution,
    },
  });

  revalidatePath(`/logs/${id}`);
}

// 3. 해결 여부 토글 (Toggle Solved)
export async function toggleSolved(id: number, currentStatus: boolean) {
  await prisma.bugLog.update({
    where: { id },
    data: { isSolved: !currentStatus }, // 현재 상태의 반대로 변경
  });

  revalidatePath(`/logs/${id}`); // 상세 페이지 갱신
  revalidatePath('/');           // 메인 페이지 리스트도 갱신
}

// 4. 삭제하기 (Delete)
export async function deleteBugLog(id: number) {
  await prisma.bugLog.delete({
    where: { id },
  });

  revalidatePath('/'); // 메인 페이지 갱신
  redirect('/');       // 메인으로 쫓아냄
}