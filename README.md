# ES5 프로젝트

ES5 환경에서 동작하는 웹 프로젝트입니다.

## 주요 기능

- SCSS 컴파일 및 PostCSS 처리
- HTML 템플릿 처리 (Underscore.js 사용)
- JavaScript 번들링 (Browserify)
- 개발 서버 (Live Reload 지원)
- 프록시 서버 설정
- 프로덕션 빌드 최적화

## 기술 스택

- Node.js
- Grunt
- SCSS
- PostCSS
- Browserify
- Underscore.js
- jQuery
- DataTables

## 시작하기

### 필수 조건

- Node.js 14.x 이상
- npm 6.x 이상

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 환경
npm run dev

# 스테이징 환경
npm run stg

# 프로덕션 환경
npm run prod
```

### 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build

# 스테이징 빌드
npm run build:stg
```

## 프로젝트 구조

```
.
├── src/
│   ├── assets/        # 이미지, 폰트 등 정적 파일
│   ├── pages/         # HTML 페이지 파일
│   ├── partials/      # HTML 템플릿 파일
│   ├── styles/        # SCSS 파일
│   └── index.js       # 메인 JavaScript 파일
├── dist/              # 빌드 결과물
├── Gruntfile.js       # Grunt 설정 파일
└── package.json       # 프로젝트 설정 파일
```

## 개발 가이드

### HTML 템플릿 작성

- `src/partials/layout.html`: 기본 레이아웃 템플릿
- `src/pages/*.html`: 페이지별 HTML 파일
- Underscore.js 템플릿 문법 사용

### 스타일 작성

- `src/styles/style.scss`: 메인 스타일 파일
- SCSS 문법 사용
- PostCSS 플러그인으로 자동 접두사 처리

### JavaScript 작성

- `src/index.js`: 메인 JavaScript 파일
- ES5 문법 사용
- Browserify로 모듈 번들링

## 빌드 프로세스

1. SCSS 컴파일
2. PostCSS 처리
3. JavaScript 번들링
4. HTML 템플릿 처리
5. CSS 파일 병합
6. CSS/JavaScript 압축
7. 이미지 최적화
8. 폰트 파일 복사

## 라이선스

ISC
