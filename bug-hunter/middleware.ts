import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/features/auth/lib/session'
import { cookies } from 'next/headers'

// 1. 보호할 경로 (로그인해야 갈 수 있음)
const protectedRoutes = ['/', '/logs']
// 2. 공개 경로 (로그인했으면 갈 필요 없음)
const publicRoutes = ['/login', '/signup']

export default async function middleware(req: NextRequest) {
  // 1. 현재 이동하려는 경로 확인
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/logs/')
  const isPublicRoute = publicRoutes.includes(path)

  // 2. 쿠키에서 암호화된 세션 꺼내서 복호화(검사)
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // 3. 시나리오별 처리

  // 시나리오 A: [보호된 구역]에 가려는데, [출입증]이 없다? -> 로그인 페이지로 강제 이동
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 시나리오 B: [로그인/가입] 페이지에 가려는데, 이미 [출입증]이 있다? -> 메인으로 보냄 (굳이 또 로그인할 필요 없으니)
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

// 4. 미들웨어가 검사할 파일들 설정 (이미지나 시스템 파일은 제외)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}