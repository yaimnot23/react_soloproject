1. 패키지 설치
   npm install

2. 환경 변수 설정
   .env.example 파일을 참고하여 .env 파일을 생성하고, 아래 두 가지 값을 반드시 입력해주세요.
   - DATABASE_URL: 본인의 PostgreSQL 데이터베이스 주소
   - SESSION_SECRET: 세션 암호화에 사용할 임의의 비밀번호

3. 데이터베이스 세팅
   npx prisma db push

4. 실행
   npm run dev

**vercel 이용해서 배포중**
