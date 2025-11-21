1. 패키지 설치
Bash

npm install

2. 환경 변수 채우기 (중요!)
이미 있는 .env 파일을 열어서 비어있는 SESSION_SECRET 값을 채워줘야 합니다. (이게 비어 있으면 로그인 기능 등에서 보안 에러가 날 수 있습니다.)

Bash

# .env 파일을 열어서 값을 입력
SESSION_SECRET="임의의_긴_비밀번호_입력"


3. 데이터베이스 생성
로컬 DB 파일(dev.db)은 없으므로 생성해줘야 합니다.

Bash

npx prisma db push

4. 실행

Bash

npm run dev
