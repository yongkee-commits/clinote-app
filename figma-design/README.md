# Clinote - AI 리뷰 답변 & 문자 생성

치과 및 한의원 전용 AI 기반 리뷰 답변 및 문자 생성 서비스입니다.

## 주요 기능

### 🤖 AI 리뷰 답변
- 네이버, 카카오 리뷰를 입력하면 AI가 자동으로 답변 생성
- SSE 스트리밍으로 실시간 답변 생성 과정 확인
- 답변 재생성 및 복사 기능

### 💬 문자 자동 생성
- 6가지 템플릿 제공 (lucide-react 아이콘 사용)
  - 🏥 초진 안내 (Hospital)
  - 💊 치료 후 주의사항 (Pill)
  - 📞 재내원 유도 (Phone)
  - 🚫 노쇼 방지 리마인더 (XCircle)
  - 📅 휴진 공지 (CalendarOff)
  - 📷 SNS 캡션 (Camera)
- 환자 정보 입력으로 맞춤형 문자 생성
- CSV 업로드로 일괄 생성 (PC 전용)

### 📊 이력 관리
- 생성한 모든 리뷰 답변과 문자 이력 관리
- 필터링 및 검색 기능
- CSV 내보내기 (PC 전용)
- 일관된 아이콘 시스템

### 🏥 병원정보 관리
- 병원명, 전문분야, 주소, 전화번호 등록
- AI 답변 생성 시 병원 정보 자동 반영

## 기술 스택

- **Frontend**: React 18, TypeScript
- **Routing**: React Router v7 (Data mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React (일관된 아이콘 세트)
- **State Management**: React Hooks
- **UI Components**: Radix UI
- **Toast**: Sonner
- **PWA**: Manifest, Service Worker 지원

## 반응형 디자인

### 모바일 (< 1024px)
- 최대 너비: 480px
- Bottom Navigation
- Sticky Header
- 세로 스크롤 레이아웃

### PC (≥ 1024px)
- Sidebar Navigation
- 2컬럼 그리드 레이아웃 (리뷰 답변, 문자 생성)
- 테이블 뷰 (이력)
- 최대 너비: 1400px

## 디자인 시스템

### 컬러
- Primary: `#111111` (검은색)
- Background: `#ffffff` (흰색)
- Border: `#e8e8e8` (밝은 회색)
- Text: `#111111` / `#8a8a8a` (메인/서브)
- Accent: `#ef4444` (빨간색), `#f59e0b` (노란색)

### 타이포그래피
- Font: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- Letter-spacing: -0.2px ~ -0.6px
- H1: 18px (모바일) / 24px (PC)
- Body: 14px

### Spacing
- 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 48px

### Border Radius
- 6px (Input)
- 8px (Button, Card)
- 12px (Badge)

## 프로젝트 구조

```
/src
  /app
    /components
      - Onboarding.tsx          # 온보딩 화면
      - Login.tsx               # 로그인 화면
      - ReplyScreen.tsx         # 리뷰 답변 화면
      - TemplateScreen.tsx      # 문자 생성 화면
      - HistoryScreen.tsx       # 이력 화면
      - ClinicScreen.tsx        # 병원정보 화면
      - SettingsScreen.tsx      # 설정 화면
      - MobileLayout.tsx        # 모바일 레이아웃
      - DesktopLayout.tsx       # PC 레이아웃
      - ProtectedRoute.tsx      # 인증 보호 라우트
      - Root.tsx                # 루트 컴포넌트
    - App.tsx                   # 앱 진입점
    - routes.tsx                # 라우트 설정
  /styles
    - theme.css                 # 테마 변수
    - index.css                 # 글로벌 스타일
/public
  - manifest.json               # PWA Manifest
  - favicon.svg                 # 파비콘
```

## 시작하기

### 설치
```bash
npm install
# or
pnpm install
```

### 개발 서버 실행
```bash
npm run dev
# or
pnpm dev
```

### 빌드
```bash
npm run build
# or
pnpm build
```

## PWA 기능

- 오프라인 지원
- 홈 화면 설치 가능
- 스플래시 스크린
- Safe Area 지원 (iOS)

## 브라우저 지원

- Chrome (최신 2개 버전)
- Safari (최신 2개 버전)
- Firefox (최신 2개 버전)
- Edge (최신 2개 버전)

## 라이선스

MIT

## 개발자

Figma Make