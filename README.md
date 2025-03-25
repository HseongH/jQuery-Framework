# ES5 프로젝트

ES5 환경에서 실행되는 웹 프로젝트입니다.

## 개발 환경 설정

### Node.js 버전

- Node.js 18.20.7 이상

### 주요 의존성

- Grunt: 빌드 도구
- SASS: CSS 전처리기
- PostCSS: CSS 후처리기
- ESLint: 코드 린터

## 설치 방법

```bash
npm install
```

## 실행 방법

### 개발 서버 실행

```bash
npm run dev
```

### 스테이징 서버 실행

```bash
npm run stg
```

### 프로덕션 서버 실행

```bash
npm run prod
```

## 빌드 방법

### 프로덕션 빌드

```bash
npm run build
```

### 스테이징 빌드

```bash
npm run build:stg
```

## 코드 품질 관리

### 린트 검사

```bash
npm run lint
```

### 린트 자동 수정

```bash
npm run lint:fix
```

### 코드 포맷팅

```bash
npm run format
```

## 프로젝트 구조

```
├── src/
│   ├── styles/          # SCSS 파일
│   ├── pages/           # EJS 템플릿
│   └── assets/          # 이미지, 폰트 등
├── dist/                # 빌드 결과물
├── Gruntfile.js         # Grunt 설정
└── package.json         # 프로젝트 설정
```

## 주요 기능

- SCSS 파일 자동 컴파일
- 실시간 브라우저 새로고침
- 프록시 서버 설정
- 코드 린팅 및 포맷팅
- 프로덕션/스테이징 환경 분리
