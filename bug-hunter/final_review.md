Bug Hunter & React 프로젝트 개발 회고록 (통합본)

이 문서는 Bug Hunter 및 React 개인 프로젝트를 진행하며 겪은 기술적 문제와 해결 과정, 그리고 새롭게 학습한 핵심 개념을 기록한 개발 핸드북입니다.

1. 환경 설정 및 Prisma (Database)

1.1. 경로 및 버전 문제

문제 상황

터미널에서 명령어 실행 시 package.json을 찾지 못하는 에러 발생.

Prisma 최신 버전(v7) 설치 후 기존 설정 코드와 충돌 발생.

코드는 작성했으나 DB에 테이블이 생성되지 않음 (The table main.BugLog does not exist).

schema.prisma에 모델을 추가했으나 코드에서 prisma.user를 인식하지 못함.

해결 및 배운 점

실행 경로: 항상 프로젝트 루트 폴더(cd bug-hunter)로 이동 후 명령어를 실행해야 함.

버전 관리: 최신 버전이 불안정할 경우 npm install prisma@5와 같이 안정적인 버전으로 다운그레이드 수행.

DB 동기화 (db push): 스키마(schema.prisma)를 수정하면 반드시 npx prisma db push를 실행하여 실제 DB 파일(dev.db)에 반영해야 함.

클라이언트 생성 (generate): 스키마 변경 후 npx prisma generate를 실행해야 자바스크립트(TypeScript)가 변경된 모델을 인지함. (해결 안 될 시 VS Code 재시작)

1.2. 데이터베이스 종류와 배포 환경

문제 상황

로컬에서 사용하던 SQLite가 Vercel 배포 후 데이터가 유지되지 않고 휘발됨.

배포 환경에서 Prisma 관련 명령어 실행 시 DATABASE_URL을 찾을 수 없는 오류 발생.

해결 및 배운 점

DB 분리: 로컬 개발용은 SQLite(파일 기반), 배포용은 PostgreSQL(Vercel Postgres/Neon)을 사용하여 환경을 분리함.

Prisma 설정: schema.prisma의 provider 설정을 배포 환경에 맞게 postgresql로 변경해야 함.

환경 변수 로드 차이: Next.js(npm run dev)는 .env.local을 읽지만, Prisma CLI(npx prisma)는 .env 파일을 읽음. 따라서 Prisma 명령어를 위해서는 .env 파일에 DB URL이 있어야 함.

2. Next.js (App Router) & Routing

2.1. 페이지 이동과 링크

문제 상황

<a> 태그 사용 시 페이지 전체가 새로고침되며 Next.js 경고 발생.

해결 및 배운 점

Link 컴포넌트: 내부 페이지 이동은 반드시 import Link from 'next/link'를 사용해야 SPA(Single Page Application)처럼 부드럽게 이동하며 상태가 유지됨.

2.2. 동적 라우팅과 파라미터

문제 상황

logs/[id]/page.tsx에서 params.id에 직접 접근하려다 에러 발생.

(auth)나 [id] 같은 폴더 명명 규칙에 대한 이해 부족.

해결 및 배운 점

비동기 Params (Next.js 15+): params는 Promise 객체이므로 await params를 통해 비동기적으로 값을 받아와야 함.

폴더 규칙:

[id]: Dynamic Route. 변수처럼 변하는 주소를 처리함.

(auth): Route Group. URL 경로에는 포함되지 않으나, 프로젝트 구조 정리를 위해 사용하는 폴더.

2.3. Server Action과 Client Component

문제 상황

브라우저 API(window, alert)나 React Hook(useState) 사용 시 에러 발생.

파일 다운로드 기능 구현 시 서버 컴포넌트에서 처리하려다 실패.

해결 및 배운 점

'use client': 클라이언트 측 기능이 필요한 컴포넌트 최상단에는 반드시 'use client'를 선언해야 함.

Server Action 보안: 서버 액션은 코드를 수정해도 서버를 재시작하지 않으면 반영되지 않을 수 있음(캐시 이슈).

3. 인증 및 보안 (Auth & Security)

3.1. 데이터 격리 (Data Isolation)

문제 상황

로그인 기능은 구현했으나, 다른 계정으로 접속해도 타인의 게시글(로그)이 모두 보임.

URL을 통해 타인의 글을 삭제할 수 있는 보안 취약점 발견.

해결 및 배운 점

데이터 소유권 확인: DB 조회(Read), 수정(Update), 삭제(Delete) 등 모든 로직에 userId 필터링이 필수적임.

코드 적용:

// 조회/수정/삭제 시 반드시 현재 로그인한 유저 ID를 조건에 추가
where: {
    userId: currentUserId
}


3.2. JWT와 세션 관리

문제 상황

로그인은 동기적으로 처리해야 한다고 오해.

비밀번호 저장 방식과 JWT 토큰의 필요성에 대한 의문.

HS256, encrypt, decrypt 등 암호화 용어의 이해 부족.

해결 및 배운 점

비동기 처리: 인증 과정은 DB 조회 및 암호화 연산이 필요하므로 async/await를 사용하여 서버 블로킹을 방지해야 함.

단방향 암호화 (Hash): 비밀번호는 bcrypt 등을 이용해 복구 불가능한 형태(Hash)로 저장하고, 로그인 시 입력값을 동일하게 해싱하여 비교함.

HS256 (대칭키): 서버가 가진 하나의 비밀키(SESSION_SECRET)로 토큰을 잠그고(Sign) 여는(Verify) 방식. 빠르고 설정이 간편함.

Sliding Session: 보안을 위해 토큰 유효기간(예: 7일)을 두되, 사용자가 활동 중이면 만료 시간을 연장해주는 전략 사용.

3.3. 환경 변수 보안

문제 상황

코드 내에 process.env.KEY || 'default_key' 형태로 기본값을 하드코딩함 (보안 취약점).

.env 파일이 Git에 업로드되어 비밀키가 노출될 뻔함.

해결 및 배운 점

하드코딩 제거: if (!secretKey) throw Error 처리를 통해 환경 변수가 없을 경우 앱이 실행되지 않도록 안전장치 마련.

파일 분리 전략:

.env: 키 이름만 있는 껍데기 파일 (Git 공유용).

.env.local: 실제 비밀키가 들어있는 파일 (로컬 전용, Git 제외).

4. 폼 관리 및 프론트엔드 로직

4.1. Zod & React Hook Form

문제 상황

라이브러리가 스타일링까지 해준다고 오해함.

커스텀 유효성 검사(예: 특정 단어 포함 금지) 구현의 어려움.

외부 UI 라이브러리(캘린더 등)와 register 함수의 연동 실패.

해결 및 배운 점

역할 정의:

Zod: 규칙 검사관 (Validation Schema).

React Hook Form: 데이터 배달원 (State Management).

Tailwind CSS: 디자이너 (Styling).

Controller 사용: register가 적용되지 않는 외부 컴포넌트는 Controller를 사용하여 RHF와 연결해야 함.

.refine(): Zod 기본 규칙 외에 복잡한 조건은 .refine((val) => 조건)을 사용하여 커스텀 검증 로직을 추가 가능.

4.2. UI/UX 개선 (Toast & Download)

문제 상황

기능은 작동하나 Toast 알림이 뜨지 않음.

서버를 거치지 않고 브라우저에서 바로 텍스트 파일을 생성/다운로드해야 함.

해결 및 배운 점

Provider 위치: sonner 같은 전역 UI 라이브러리는 layout.tsx 최상단에 <Toaster />가 배치되어 있어야 작동함.

Blob 객체 활용:

// 브라우저 메모리에 가상 파일 생성
const blob = new Blob([content], { type: 'text/markdown' });
const url = URL.createObjectURL(blob);
// 가상의 a 태그를 생성해 클릭 이벤트 트리거


5. 배포 및 Git 관리

5.1. Vercel 배포 트러블슈팅

문제 상황

로컬에서 삭제한 파일(prisma.config.ts)이 배포 시 계속 오류를 유발함 (좀비 파일).

배포 후 Prisma Client를 찾을 수 없다는 에러 발생.

배포된 사이트에서 과거 코드가 실행되는 현상.

해결 및 배운 점

캐시 삭제 (Redeploy): Vercel 배포 시 'Use existing Build Cache' 옵션을 해제하여 캐시를 비우고 재배포해야 함.

postinstall 스크립트: package.json에 "postinstall": "prisma generate"를 추가하여 배포(의존성 설치) 직후 Prisma Client가 생성되도록 설정.

배포의 불변성: 배포된 URL은 해당 시점의 코드 스냅샷임. DB는 공유되지만 코드는 과거 상태일 수 있음을 인지해야 함.

5.2. Git 관리

문제 상황

.db 파일이나 .env 파일이 .gitignore에 있음에도 불구하고 자꾸 변경사항으로 추적됨.

해결 및 배운 점

추적 제거: 이미 한 번 커밋된 파일은 .gitignore에 추가해도 무시되지 않음.

명령어: git rm --cached <파일명>을 사용하여 로컬 파일은 유지하되, 원격 저장소의 추적만 끊어내는 방법을 사용.