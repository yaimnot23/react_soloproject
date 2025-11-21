import 'server-only'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'

// 1. 환경 변수 체크 및 키 인코딩 -> 마스터키
const secretKey = process.env.SESSION_SECRET
const key = new TextEncoder().encode(secretKey)

// 개발 환경이 아닌데 키가 없으면 서버 시작 시점에 에러
if (!secretKey && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET environment variable is not set.')
}

// 2. 상수 관리 (유지보수성 향상)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7일
const JWT_EXPIRATION = '7d' // JWT 만료 시간 문자열

// 3. Payload 타입 정의 (jose의 JWTPayload 확장)
interface SessionPayload extends JWTPayload {
  userId: string
  expiresAt: Date
}

// 4. 토큰 생성 (암호화)
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(key)
}

// 5. 토큰 검증 (복호화)
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    // payload가 우리가 정의한 타입인지 단언
    return payload as SessionPayload
  } catch (error) {
    // 토큰이 만료되었거나 위변조되었을 경우 null 반환
    return null
  }
}

// 6. 로그인 성공 시 쿠키 굽기
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  
  // 토큰 생성
  const session = await encrypt({ userId, expiresAt })

  // 쿠키 저장 (await cookies()는 Next.js 15/App Router 최신 스펙)
  const cookieStore = await cookies()
  
  cookieStore.set('session', session, {
    httpOnly: true, // 자바스크립트에서 접근 불가 (XSS 방지)
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
    expires: expiresAt,
    sameSite: 'lax', // CSRF 방지 (기본적인 보호)
    path: '/',
  })
}

// 7. 세션 갱신 (선택 사항: 미들웨어에서 활동 시 만료 시간 연장용)
export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  // 만료 기간을 다시 7일 뒤로 연장
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

// 8. 로그아웃
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

// 비밀번호 준비: .env.local에 본인만만의 마스터키를 숨겨둠.

// 로그인 (createSession):

// 마스터키로 도장 쾅 찍은 **7일짜리 출입증(JWT)**을 발급.

// 손님 주머니(쿠키)에 안전하게(httpOnly) 넣어줌.

// 활동 중 (updateSession):

// 반납일을 뒤로 미뤄줌.

// 검사 (decrypt):

// 마스터키로 검사함.

// 로그아웃 (deleteSession):

// 출입증을 즉시 폐기함.