'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signup } from '../actions' 
import { useActionState } from 'react' // (Next.js 15 / React 19 최신 훅)

// 1. 유효성 검사 규칙 정의 (블로그 내용 참고)
const signupSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다.'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
  passwordConfirm: z.string().min(6, '비밀번호 확인을 입력해주세요.')
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordConfirm"],
})

// 폼 데이터 타입 자동 추론
type SignupFormData = z.infer<typeof signupSchema>

export function SignUpForm() {
  // 서버 액션 상태 관리 (에러 메시지 표시용)
  const [state, formAction, isPending] = useActionState(signup, null)

  const {
    register,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // 입력하고 포커스 뺄 때 검사
  })

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

      {/* 서버 에러 메시지 (예: 중복 이메일) */}
      {state?.message && (
        <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">
          {state.message}
        </div>
      )}

      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* 이메일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* 비밀번호 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
        <input
          {...register('passwordConfirm')}
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isPending ? '가입 중...' : '가입하기'}
      </button>
    </form>
  )
}