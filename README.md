# 주식투자 교육 프로젝트

이 프로젝트는 학생 교육용 주식투자 시뮬레이션을 위한 웹 애플리케이션입니다. 기존 Google 시트 웹앱에서 Node.js/Express 백엔드로 마이그레이션하여 성능을 개선했습니다.

## 기술 스택

- **프론트엔드**: HTML, CSS, JavaScript
- **백엔드**: Node.js, Express
- **데이터베이스**: MongoDB

## 프로젝트 구조

```
stockforgooglesheet/
├── public/                 # 정적 파일 디렉토리
│   └── index.html          # 프론트엔드 HTML 파일
├── utils/                  # 유틸리티 스크립트
│   └── dataMigration.js    # 데이터 마이그레이션 스크립트
├── googlesheetpj/          # 원본 Google Apps Script 프로젝트 파일
│   ├── Code.gs             # 원본 Google Apps Script 백엔드
│   └── Index.html          # 원본 HTML 프론트엔드
├── .env                    # 환경 변수 설정 파일
├── package.json            # 프로젝트 의존성 관리 파일
├── server.js               # Express 서버 메인 파일
└── README.md               # 프로젝트 문서
```

## 설치 방법

### 사전 요구사항

- [Node.js](https://nodejs.org/) (v14 이상)
- [MongoDB](https://www.mongodb.com/try/download/community)

### 설치 단계

1. 저장소를 클론하거나 다운로드합니다.

2. 프로젝트 디렉토리로 이동합니다:
   ```
   cd stockforgooglesheet
   ```

3. 필요한 패키지를 설치합니다:
   ```
   npm install
   ```

4. MongoDB를 설치하고 실행합니다.

5. `.env` 파일을 확인하고 필요한 경우 설정을 변경합니다:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/stockInvestment
   ```

## 데이터 마이그레이션

Google 시트에서 MongoDB로 데이터를 마이그레이션하려면:

1. Google 시트에서 주식정보와 학생투자 데이터를 CSV로 내보냅니다.
2. CSV 파일을 `utils` 디렉토리에 `stocks.csv`와 `students.csv`로 저장합니다.
3. 다음 명령어를 실행합니다:
   ```
   node utils/dataMigration.js
   ```

## 실행 방법

1. 개발 모드로 실행 (자동 재시작):
   ```
   npm run dev
   ```

2. 프로덕션 모드로 실행:
   ```
   npm start
   ```

3. 웹 브라우저에서 다음 주소로 접속합니다:
   ```
   http://localhost:3000
   ```

## 기능

- 학생 계정 관리
- 주식 목록 조회
- 주식 매수 및 매도
- 포트폴리오 평가 및 조회

## Google Apps Script에서 마이그레이션

이 프로젝트는 기존 Google Apps Script 기반 웹앱에서 다음과 같은 이유로 마이그레이션되었습니다:

1. **성능 향상**: Node.js와 MongoDB는 Google Apps Script보다 빠른 응답 시간을 제공합니다.
2. **확장성**: Express 프레임워크를 사용하여 더 많은 기능을 쉽게 추가할 수 있습니다.
3. **유연성**: 다양한 데이터베이스 옵션과 호스팅 서비스를 선택할 수 있습니다.

## 추가 개선 가능성

- 사용자 인증 시스템 강화
- 실시간 주식 가격 업데이트
- 차트 및 그래프를 통한 시각화
- 모바일 반응형 디자인 개선
