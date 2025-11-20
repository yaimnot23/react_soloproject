import 'server-only'
import { SignJWT, jwtVerify, JWTPayload } from 'jose' // JWTPayload 타입 추가
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET || 'default_secret_key_1234'
const encodedKey = new TextEncoder().encode(secretKey)

// 1. Payload 타입 정의 (any 대신 사용할 타입)
type SessionPayload = {
  userId: string
  expiresAt: Date
}

// 2. 토큰 생성 (암호화) -> payload 타입을 SessionPayload로 변경
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7일간 유효
    .sign(encodedKey)
}

// 3. 토큰 검증 (복호화)
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null // 토큰이 이상하면 실패 처리
  }
}

// 4. 로그인 성공 시 쿠키 굽기 (세션 생성)
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7일 뒤
  const session = await encrypt({ userId, expiresAt }) // 토큰 만들기

  const cookieStore = await cookies()
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

// 5. 로그아웃 (쿠키 삭제)
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}