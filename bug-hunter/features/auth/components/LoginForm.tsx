'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '../actions' // 방금 만든 login 함수 가져오기
import { useActionState } from 'react'
import Link from 'next/link'

// 유효성 검사 규칙
const loginSchema = z.object({
  email: z.string().email('이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

      {/* 에러 메시지 표시 */}
      {state?.message && (
        <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md text-center">
          {state.message}
        </div>
      )}

      {/* 이메일 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
      >
        {isPending ? '로그인 중...' : '로그인'}
      </button>

      {/* 회원가입 링크 */}
      <div className="text-center text-sm text-gray-600 mt-4">
        아직 계정이 없으신가요?{' '}
        <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
          회원가입 하러가기
        </Link>
      </div>
    </form>
  )
}