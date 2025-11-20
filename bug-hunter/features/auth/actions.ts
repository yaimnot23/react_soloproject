'use server'

import { prisma } from '@/shared/lib/db'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { createSession } from '@/features/auth/lib/session'
import { deleteSession } from '@/features/auth/lib/session'

type ActionState = {
  message: string
} | null

export async function signup(prevState: ActionState, formData: FormData) {
  // 데이터 꺼내기
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 중복 검사
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { message: '이미 사용 중인 이메일입니다.' }
  }

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10)

  // DB에 저장
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // 세션 생성 (로그인 처리)
  await createSession(user.id.toString())

  // 메인으로 이동
  redirect('/')
}

export async function login(prevState: ActionState, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. 이메일로 사용자 찾기
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { message: '가입되지 않은 이메일입니다.' }
  }

  // 2. 비밀번호 확인 (암호화된 것끼리 비교)
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return { message: '비밀번호가 일치하지 않습니다.' }
  }

  // 3. 로그인 성공! (세션 생성)
  await createSession(user.id.toString())

  // 4. 메인으로 이동
  redirect('/')
}

export async function logout() {
  await deleteSession() // 쿠키 삭제
  redirect('/login')    // 로그인 페이지로 쫓아내기
}