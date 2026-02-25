# Clinote 디자인 기획서

## 1. 프로젝트 개요

### 1.1 서비스 설명
- **이름**: Clinote
- **타겟**: 치과/한의원 원장 및 실장
- **목적**: AI 기반 리뷰 답변 및 문자 생성 자동화
- **AI 모델**: Claude Sonnet 4.5 (SSE 스트리밍)

### 1.2 플랫폼
- **모바일**: PWA, 설치 가능, 오프라인 지원
- **PC**: 반응형 웹 (≥1024px)
- **브레이크포인트**: 1024px

---

## 2. 디자인 시스템

### 2.1 컬러 팔레트

#### 라이트 테마 (기본)
```css
--accent: #111111        /* 메인 액센트 */
--accent2: #333333       /* 서브 액센트 */
--bg: #ffffff            /* 배경 */
--card: #ffffff          /* 카드 배경 */
--card2: #f7f7f7         /* 카드 서브 배경 */
--border: #e8e8e8        /* 테두리 */
--text: #111111          /* 메인 텍스트 */
--text2: #8a8a8a         /* 서브 텍스트 */
--red: #ef4444           /* 에러/경고 */
--yellow: #f59e0b        /* 주의 */
```

#### 시맨틱 컬러
- **Primary Button**: `#111111` (검은색)
- **Secondary Button**: border `#e8e8e8`, text `#333333`
- **Danger Button**: `#ef4444` (빨간색)
- **링크**: `#111111` (underline)

### 2.2 타이포그래피

#### 폰트
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
letter-spacing: -0.2px; /* 기본 */
```

#### 텍스트 스타일
| 용도 | 크기 | 굵기 | Letter-spacing |
|------|------|------|----------------|
| H1 (모바일) | 18px | 800 | -0.5px |
| H1 (PC) | 24px | 800 | -0.6px |
| H2 (Panel) | 16px | 700 | -0.3px |
| Body | 14px | 400 | -0.2px |
| Small | 13px | 400 | -0.2px |
| Caption | 12px | 400 | -0.2px |
| Tiny | 11px | 400 | -0.2px |

### 2.3 간격 시스템
```
4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 48px
```

### 2.4 라운드
```css
--radius: 8px  /* 기본 */
버튼: 8px
카드: 8px
인풋: 6px
배지: 12px
```

### 2.5 그림자
```css
--shadow: 0 1px 8px rgba(0,0,0,0.06);
```

---

## 3. 화면 구조

### 3.1 모바일 레이아웃 (<1024px)

```
┌─────────────────────────┐
│ Header (sticky top)     │
│ - Logo / Title          │
│ - Subtitle              │
│ - Gear Icon             │
├─────────────────────────┤
│                         │
│   Scroll Area           │
│   (Main Content)        │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ Bottom Nav (fixed)      │
│ ┌────┬────┬────┬────┐  │
│ │리뷰│문자│이력│병원│  │
│ └────┴────┴────┴────┘  │
└─────────────────────────┘
```

**치수:**
- 최대 너비: 480px
- Header 높이: 약 60px
- Bottom Nav 높이: 약 70px (safe-area 포함)
- Padding: 16px ~ 20px

### 3.2 PC 레이아웃 (≥1024px)

```
┌─────────────────────────────────────────────────┐
│ Sidebar (240px)   │  Main Content (max 1400px) │
│ ┌───────────────┐ │                            │
│ │ Logo (240px)  │ │  Screen Content            │
│ ├───────────────┤ │                            │
│ │ 리뷰 답변     │ │                            │
│ │ 문자·공지    │ │                            │
│ │ 이력         │ │                            │
│ │ 병원정보     │ │                            │
│ │              │ │                            │
│ │              │ │                            │
│ │              │ │                            │
│ │              │ │                            │
│ │ 환경설정     │ │                            │
│ └───────────────┘ │                            │
└─────────────────────────────────────────────────┘
```

**치수:**
- Sidebar: 240px (고정)
- Main: flex 1, max-width 1400px
- Sidebar 버튼 높이: 48px
- Sidebar 로고 영역: padding 20px

---

## 4. 화면별 상세 명세

### 4.1 로그인 화면 (`screen-login`)

#### 모바일 & PC 공통
```
┌─────────────────────────┐
│                         │
│     [Clinote Logo]      │
│                         │
│  치과 리뷰 답변 AI       │
│  네이버/카카오 리뷰를    │
│  AI가 자동 답변          │
│                         │
│  ┌───────────────────┐  │
│  │ 카카오로 로그인    │  │
│  └───────────────────┘  │
│                         │
│  이용약관 / 개인정보     │
│                         │
└─────────────────────────┘
```

**컴포넌트:**
- Logo: 중앙 정렬, 64px × auto
- 헤드라인: 20px, bold, -0.6px
- 설명: 14px, text2 색상
- 카카오 버튼:
  - 배경 `#FEE500`
  - 텍스트 `#191919`
  - 높이 52px
  - 카카오 로고 SVG 포함

---

### 4.2 리뷰 답변 화면 (`screen-reply`)

#### 모바일 (<1024px)
```
┌─────────────────────────┐
│ Header                  │
│ - Logo                  │
│ - 병원명 (subtitle)     │
│ - 체험판 Badge (조건부) │
│ - Gear Icon             │
├─────────────────────────┤
│ Scroll Area             │
│ ┌─────────────────────┐ │
│ │ 리뷰 내용           │ │
│ │ ┌─────────────────┐ │ │
│ │ │ Textarea (5줄)  │ │ │
│ │ └─────────────────┘ │ │
│ │ 0자                 │ │
│ └─────────────────────┘ │
│                         │
│ ┌───────────────────┐   │
│ │  답변 생성         │   │
│ └───────────────────┘   │
│                         │
│ ┌─────────────────────┐ │
│ │ 생성된 답변         │ │
│ │ ┌─────────────────┐ │ │
│ │ │ 답변이 여기에... │ │ │
│ │ └─────────────────┘ │ │
│ │ 0자                 │ │
│ │ [복사][재생성][초기화]│ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**컴포넌트:**
- **Input Card**:
  - Background: `var(--card)`
  - Border: 1px solid `var(--border)`
  - Padding: 20px
  - Radius: 8px

- **Textarea**:
  - Border: 1px solid `var(--border)`
  - Padding: 14px
  - Radius: 6px
  - Font: 14px

- **답변 생성 버튼**:
  - Background: `var(--accent)` (#111111)
  - Color: white
  - 높이: 52px
  - Width: 100%
  - Spinner 표시 (생성 중)

- **복사 버튼 그룹**:
  - Display: flex, gap 8px
  - 각 버튼: btn-secondary-sm

#### PC (≥1024px)
```
┌──────────────────────────────────────────────┐
│ 2-Column Grid (1fr 1fr), gap 24px           │
├──────────────────────┬───────────────────────┤
│ Left Panel           │ Right Panel           │
│ ┌──────────────────┐ │ ┌──────────────────┐ │
│ │ Panel Header     │ │ │ Panel Header     │ │
│ │ 리뷰 내용        │ │ │ 생성된 답변      │ │
│ ├──────────────────┤ │ │ [복사][재생성]   │ │
│ │ Panel Content    │ │ ├──────────────────┤ │
│ │ ┌──────────────┐ │ │ │ Panel Content    │ │
│ │ │ Textarea     │ │ │ │ ┌──────────────┐ │ │
│ │ │ (20줄, flex1)│ │ │ │ │ Reply Output │ │ │
│ │ │              │ │ │ │ │ (flex 1)     │ │ │
│ │ │              │ │ │ │ │              │ │ │
│ │ └──────────────┘ │ │ │ └──────────────┘ │ │
│ │ 0자              │ │ │ 0자              │ │
│ │ [답변 생성(100%)]│ │ │                  │ │
│ └──────────────────┘ │ └──────────────────┘ │
└──────────────────────┴───────────────────────┘
```

**PC 전용 스타일:**
- Grid: `1fr 1fr`, gap 24px
- Panel:
  - Border: 1px solid `var(--border)`
  - Radius: 8px
  - Height: calc(100vh - 60px)
- Panel Header:
  - Background: `var(--card2)`
  - Padding: 16px 20px
  - Border-bottom: 1px solid `var(--border)`
  - H2: 16px, bold
- Panel Content:
  - Padding: 20px
  - Overflow-y: auto
  - Flex: 1
- Textarea/Output:
  - Flex: 1
  - Min-height: 0 (스크롤 가능)

---

### 4.3 문자·공지 화면 (`screen-template`)

#### 탭 구조
- **개별 생성**: 템플릿 선택 → 파라미터 입력 → 생성
- **일괄 생성 (CSV)**: 파일 업로드 → 미리보기 → 일괄 생성

#### 모바일 - 개별 생성
```
┌─────────────────────────┐
│ Header                  │
├─────────────────────────┤
│ Tabs                    │
│ [개별 생성] [일괄 생성]  │
├─────────────────────────┤
│ 유형 선택               │
│ ┌───┬───┬───┐          │
│ │🏥││💊││📞│          │
│ │초진│치료│재내원│        │
│ └───┴───┴───┘          │
│ ┌───┬───┬───┐          │
│ │🚫││🏖││📸│          │
│ │노쇼│휴진│SNS│          │
│ └───┴───┴───┘          │
├─────────────────────────┤
│ 환자 정보 입력          │
│ [이름]                  │
│ [전화번호] (선택)        │
│ [추가정보]              │
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │  문자 생성         │   │
│ └───────────────────┘   │
├─────────────────────────┤
│ 생성된 문자             │
│ [문자 내용...]          │
│ [복사]                  │
└─────────────────────────┘
```

**템플릿 카드:**
- Size: grid 3열, gap 12px
- 카드:
  - Border: 1px solid `var(--border)`
  - Padding: 16px
  - Radius: 8px
  - Active: border `var(--accent)`, background `var(--card2)`
- 아이콘: 32px, center
- 이름: 13px, bold, center
- 설명: 11px, text2, center

#### PC - 일괄 생성 (CSV)
```
┌──────────────────────────────────────────────┐
│ 2-Column Grid (400px 1fr), gap 24px         │
├──────────────────────┬───────────────────────┤
│ Left: 설정 Panel     │ Right: 결과 Panel     │
│ ┌──────────────────┐ │ ┌──────────────────┐ │
│ │ 템플릿 선택      │ │ │ 생성 결과        │ │
│ │ [초진 안내 ▼]   │ │ │                  │ │
│ │                  │ │ │ Table:           │ │
│ │ CSV 업로드       │ │ │ ┌──┬────┬─────┐ │ │
│ │ [파일 선택...]   │ │ │ │번호│이름│내용│ │ │
│ │                  │ │ │ ├──┼────┼─────┤ │ │
│ │ 미리보기:        │ │ │ │1 │김OO│초진...││ │
│ │ ┌──┬────┬───┐  │ │ │ │2 │이OO│초진...││ │
│ │ │번호│이름│전화│  │ │ │ └──┴────┴─────┘ │ │
│ │ ├──┼────┼───┤  │ │ │                  │ │
│ │ │1 │김OO│010..│ │ │ │ [CSV 내보내기]   │ │
│ │ └──┴────┴───┘  │ │ │                  │ │
│ │ 총 5건           │ │ │                  │ │
│ │                  │ │ │                  │ │
│ │ [일괄 생성]      │ │ │                  │ │
│ └──────────────────┘ │ └──────────────────┘ │
└──────────────────────┴───────────────────────┘
```

---

### 4.4 이력 화면 (`screen-history`)

#### 모바일
```
┌─────────────────────────┐
│ Header                  │
│ 이력                    │
│                [⚙️]     │
├─────────────────────────┤
│ Filter Tabs             │
│ [전체][리뷰][문자]       │
├─────────────────────────┤
│ Scroll Area             │
│ ┌─────────────────────┐ │
│ │ 리뷰 답변  12/20    │ │
│ │ "친절하게..."        │ │
│ │ "감사합니다..."      │ │
│ │ [복사] [삭제]       │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 문자·공지 초진 안내 │ │
│ │ "김철수 님..."       │ │
│ │ "첫 방문을..."       │ │
│ │ [복사] [삭제]       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**History Card:**
- Background: `var(--card)`
- Border: 1px solid `var(--border)`
- Padding: 16px
- Margin-bottom: 12px
- Radius: 8px

**Meta 영역:**
- Badge (리뷰/문자):
  - Padding: 4px 10px
  - Radius: 12px
  - Font: 11px, bold
  - Background: 유형별 색상
- 날짜: 12px, text2

#### PC - 테이블 뷰
```
┌──────────────────────────────────────────────┐
│ Page Header                                  │
│ 이력                      [CSV 내보내기]     │
├──────────────────────────────────────────────┤
│ Filter Panel                                 │
│ [검색...] [전체][리뷰][문자] [최신순 ▼]      │
├──────────────────────────────────────────────┤
│ Data Table                                   │
│ ┌────┬──────┬────────┬──────┬────┬──────┐  │
│ │유형│날짜  │원본    │결과  │글자│작업  │  │
│ ├────┼──────┼────────┼──────┼────┼──────┤  │
│ │리뷰│12/20 │친절하게│감사합│120│복사삭제│  │
│ │문자│12/19 │김철수  │첫방문│85 │복사삭제│  │
│ └────┴──────┴────────┴──────┴────┴──────┘  │
└──────────────────────────────────────────────┘
```

**PC Table 스타일:**
- Border-collapse: collapse
- Background: `var(--card)`
- TH:
  - Background: `var(--card2)`
  - Padding: 14px 16px
  - Font: 13px, bold
  - Text-align: left
- TD:
  - Padding: 16px
  - Border-bottom: 1px solid `var(--border)`
- TR:hover:
  - Background: `var(--card2)`

**Type Badge (Table):**
```css
.type-badge.review {
  background: #e0f2fe;
  color: #0369a1;
}
.type-badge.template {
  background: #fef3c7;
  color: #92400e;
}
```

---

### 4.5 병원정보 화면 (`screen-clinic`)

#### 공통 레이아웃
```
┌─────────────────────────┐
│ Header                  │
│ 병원정보         [⚙️]   │
├─────────────────────────┤
│ Scroll Area             │
│ 병원 이름               │
│ [강남 연세 치과]        │
│                         │
│ 전문 분야               │
│ [치과 ▼]                │
│                         │
│ 주소                    │
│ [서울시...]             │
│                         │
│ 전화번호                │
│ [02-1234-5678]          │
│                         │
│ 영업시간                │
│ [09:00 - 18:00]         │
│                         │
│ 특징 (선택)             │
│ [무통 마취, 디지털...]  │
│                         │
│ ┌───────────────────┐   │
│ │  저장              │   │
│ └───────────────────┘   │
└─────────────────────────┘
```

**Input 스타일:**
- Border: 1px solid `var(--border)`
- Padding: 14px
- Radius: 6px
- Font: 14px
- Width: 100%

**Select 스타일:**
- 동일하게 14px padding, 6px radius
- Arrow icon 우측

---

## 5. 공통 컴포넌트

### 5.1 Button

#### Primary
```css
background: var(--accent) #111111
color: white
height: 52px (default), 44px (medium), 36px (sm)
padding: 0 24px
border-radius: 8px
font-size: 15px
font-weight: 600
```

#### Secondary
```css
background: transparent
border: 1px solid var(--border)
color: var(--text)
[동일 사이즈]
```

#### Danger
```css
background: var(--red) #ef4444
color: white
[동일 사이즈]
```

#### Small (btn-sm)
```css
height: 36px
padding: 0 16px
font-size: 13px
```

### 5.2 Header

#### 모바일
```css
height: auto (min 60px)
padding: 16px 20px
border-bottom: 1px solid var(--border)
display: flex
align-items: center
gap: 8px
background: var(--bg)
position: sticky
top: 0
z-index: 10
```

**구조:**
```
[Logo/H1] [Spacer/Subtitle] [Badge] [Gear]
```

#### PC (숨김)
```css
display: none  /* 사이드바가 대체 */
```

### 5.3 Bottom Navigation (모바일 전용)

```css
position: fixed
bottom: 0
left: 0
right: 0
width: 100%
max-width: 480px
margin: 0 auto
background: var(--bg)
border-top: 1px solid var(--border)
padding: 8px 0 max(8px, env(safe-area-inset-bottom))
z-index: 100
display: flex (4개 균등 배분)
```

**Nav Button:**
```css
flex: 1
display: flex
flex-direction: column
align-items: center
gap: 3px
padding: 6px 0
color: var(--text2)
font-size: 10px

.active {
  color: var(--text) #111111
}
```

**Icon:**
- Size: 20px × 20px
- Stroke: currentColor

### 5.4 Sidebar (PC 전용)

```css
width: 240px
background: var(--card)
border-right: 1px solid var(--border)
position: sticky
top: 0
height: 100vh
display: flex
flex-direction: column
```

**Sidebar Button:**
```css
display: flex
align-items: center
gap: 12px
padding: 12px 16px
background: transparent
border: none
color: var(--text)
font-size: 14px
cursor: pointer
transition: background 0.2s

&:hover {
  background: var(--card2)
}

&.active {
  background: var(--accent) #111111
  color: white
}
```

**Icon:**
- Size: 20px × 20px

### 5.5 Input Card (모바일)

```css
background: var(--card)
border: 1px solid var(--border)
border-radius: 8px
padding: 20px
margin-bottom: 16px
```

**Label:**
```css
font-size: 14px
font-weight: 600
margin-bottom: 8px
color: var(--text)
```

### 5.6 Toast

```css
position: fixed
bottom: 100px (모바일)
bottom: 32px (PC)
left: 50%
transform: translateX(-50%)
background: rgba(0, 0, 0, 0.85)
color: white
padding: 12px 20px
border-radius: 24px
font-size: 14px
z-index: 9999
animation: fadeInOut 2s
```

### 5.7 Spinner

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  display: inline-block
  width: 16px
  height: 16px
  border: 2px solid currentColor
  border-right-color: transparent
  border-radius: 50%
  animation: spin 0.6s linear infinite
}
```

### 5.8 Filter Tabs

```css
display: flex
gap: 8px
padding: 12px 20px
background: var(--bg)
overflow-x: auto
```

**Tab Button:**
```css
padding: 8px 16px
border-radius: 20px
background: transparent
border: 1px solid var(--border)
font-size: 13px
color: var(--text2)
white-space: nowrap

&.active {
  background: var(--accent) #111111
  color: white
  border-color: var(--accent)
}
```

---

## 6. 인터랙션 & 애니메이션

### 6.1 화면 전환
```css
.screen {
  display: none;
}
.screen.active {
  display: flex;
}
```
- 즉시 전환 (no animation)

### 6.2 버튼 피드백
```css
button:active {
  opacity: 0.6;
  transition: opacity 0.1s;
}
```

### 6.3 SSE 스트리밍 (리뷰/문자 생성)
1. 버튼 클릭 → 버튼 disabled
2. Spinner 표시
3. Output 영역 clear
4. 스트림 수신하며 실시간 텍스트 추가
5. 완료 시:
   - Spinner 숨김
   - 버튼 활성화
   - 복사 버튼 표시
   - 글자수 표시

### 6.4 로딩 상태
- **버튼 Spinner**: 생성 중
- **Empty State**: "이력이 없습니다" (회색 텍스트)

---

## 7. 반응형 규칙

### 7.1 Breakpoint

```css
@media (min-width: 1024px) {
  /* PC 스타일 */
}
```

### 7.2 PC 전환 시 변경사항

| 컴포넌트 | 모바일 | PC |
|---------|--------|-----|
| 네비게이션 | Bottom Nav | Sidebar |
| 헤더 | 표시 | 숨김 |
| 리뷰 답변 | 세로 | 2컬럼 |
| 이력 | 카드 리스트 | 테이블 |
| CSV 일괄 | 세로 | 2컬럼 |
| Max Width | 480px | 1400px |

---

## 8. 플로우

### 8.1 리뷰 답변 생성 플로우

```
로그인
  ↓
리뷰 답변 화면
  ↓
리뷰 내용 입력 (5자 이상)
  ↓
[답변 생성] 클릭
  ↓
병원정보 확인
  ├─ 없으면 → 병원정보 화면으로 이동
  └─ 있으면 → API 호출 (/api/review/generate)
       ↓
    SSE 스트리밍 수신
       ↓
    실시간 텍스트 출력
       ↓
    완료
       ↓
    [복사] / [재생성] / [초기화]
```

### 8.2 CSV 일괄 생성 플로우

```
문자·공지 화면
  ↓
[일괄 생성 (CSV)] 탭 클릭
  ↓
템플릿 선택
  ↓
CSV 파일 업로드
  ↓
미리보기 표시 (처음 5행)
  ↓
[일괄 생성하기] 클릭
  ↓
API 호출 (/api/template/batch-generate)
  ↓
결과 테이블 표시 (PC)
결과 카드 표시 (모바일)
  ↓
개별 복사 가능
```

---

## 9. API 엔드포인트

### 9.1 인증
- `GET /api/auth/kakao` - 카카오 로그인
- `GET /api/auth/kakao/callback` - 콜백
- `POST /api/auth/logout` - 로그아웃
- `GET /api/me` - 현재 사용자 정보

### 9.2 리뷰
- `POST /api/review/generate` - 답변 생성 (SSE)
  - Body: `{ original_text: string }`
  - Response: SSE stream

### 9.3 템플릿
- `POST /api/template/generate` - 문자 생성 (SSE)
  - Body: `{ template_type: string, params: object }`
- `POST /api/template/batch-generate` - 일괄 생성
  - Body: FormData (file, template_type)
  - Response: `{ results: [{ name, phone, message }] }`

### 9.4 이력
- `GET /api/review/list` - 리뷰 이력
- `DELETE /api/review/{id}` - 삭제
- `GET /api/template/list` - 템플릿 이력
- `DELETE /api/template/{id}` - 삭제

### 9.5 병원정보
- `GET /api/clinic` - 병원정보 조회
- `POST /api/clinic` - 병원정보 저장
  - Body: `{ name, specialty, address, phone, hours, features }`

### 9.6 구독
- `GET /api/subscription/status` - 구독 상태
  - Response: `{ plan, daily_count, daily_limit, is_unlimited }`

---

## 10. 데이터베이스 스키마

### 10.1 clinic (병원정보)
```sql
CREATE TABLE clinic (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  specialty TEXT DEFAULT '치과',
  address TEXT,
  phone TEXT,
  hours TEXT,
  features TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.2 reviews (리뷰 이력)
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_text TEXT,
  reply_text TEXT,
  rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.3 templates (문자 이력)
```sql
CREATE TABLE templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_type TEXT,
  params TEXT,  -- JSON
  output_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 11. PWA 명세

### 11.1 Manifest (manifest.json)
```json
{
  "name": "Clinote",
  "short_name": "Clinote",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    {
      "src": "/static/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/static/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 11.2 Service Worker (sw.js)
- Cache Strategy: Network-first, fallback to cache
- API 요청은 캐시하지 않음 (`/api/` 경로)
- Static 리소스: manifest.json만 캐시

---

## 12. 템플릿 유형

### 12.1 지원 템플릿

| 유형 | 아이콘 | 이름 | 설명 |
|------|-------|------|------|
| `first_visit` | 🏥 | 초진 안내 문자 | 첫 방문 환자 안내 |
| `after_care` | 💊 | 치료 후 주의사항 | 시술 후 주의사항 |
| `recall` | 📞 | 재내원 유도 문자 | 정기 검진 안내 |
| `noshow` | 🚫 | 노쇼 방지 리마인더 | 예약 전 리마인드 |
| `holiday` | 🏖 | 휴진 공지 | 휴무일 안내 |
| `sns` | 📸 | SNS 캡션 | SNS 게시물 문구 |

### 12.2 파라미터 예시

**초진 안내:**
```json
{
  "name": "김철수",
  "phone": "010-1234-5678",
  "appointment_date": "12월 25일",
  "appointment_time": "오후 2시"
}
```

**치료 후 주의사항:**
```json
{
  "name": "이영희",
  "treatment": "임플란트"
}
```

---

## 13. 에러 처리

### 13.1 Toast 메시지

| 상황 | 메시지 |
|-----|--------|
| 복사 성공 | "복사되었습니다 ✓" |
| 답변 복사 | "답변이 복사되었습니다 ✓" |
| 로그인 필요 | "로그인이 필요합니다" |
| 병원정보 필요 | "먼저 병원정보를 설정해주세요" |
| API 오류 | "오류: [에러 메시지]" |
| 구독 제한 | "일일 생성 한도를 초과했습니다" |

### 13.2 Empty States

**이력 없음:**
```
┌─────────────────────┐
│                     │
│        📋          │
│   이력이 없습니다    │
│                     │
└─────────────────────┘
```

**답변 대기:**
```
답변이 여기에 표시됩니다
```

---

## 14. 특수 기능

### 14.1 체험판 Badge
```css
background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)
color: white
padding: 4px 10px
border-radius: 12px
font-size: 11px
font-weight: 700
display: flex
align-items: center
gap: 4px
```

**조건:**
- plan === 'trial'
- 표시: `⚡ 체험판 (N/20)`

### 14.2 Char Count
```css
font-size: 12px
color: var(--text2)
margin-top: 6px

&.warn {
  color: var(--red)  /* 500자 초과 */
}
```

### 14.3 Platform Badge (이력)
```css
.platform-badge {
  display: inline-block
  padding: 3px 8px
  border-radius: 4px
  font-size: 11px
  font-weight: 600
  background: var(--chip-bg)
  color: var(--chip-text)
}
```

---

## 15. Figma 디자인 체크리스트

### 15.1 필수 화면 (모바일)
- [ ] 로그인
- [ ] 리뷰 답변 (입력 → 생성 → 결과)
- [ ] 문자·공지 - 개별 생성 (템플릿 선택 → 입력 → 생성)
- [ ] 문자·공지 - 일괄 생성 (CSV 업로드 → 결과)
- [ ] 이력 (카드 리스트)
- [ ] 병원정보

### 15.2 필수 화면 (PC)
- [ ] 리뷰 답변 (2컬럼)
- [ ] 문자·공지 - 일괄 생성 (2컬럼: 설정 + 결과)
- [ ] 이력 (테이블 뷰)
- [ ] 사이드바 네비게이션

### 15.3 컴포넌트
- [ ] Button (Primary, Secondary, Danger, Small)
- [ ] Input / Textarea
- [ ] Select
- [ ] Header (모바일)
- [ ] Bottom Nav (모바일)
- [ ] Sidebar (PC)
- [ ] Filter Tabs
- [ ] Template Card
- [ ] History Card
- [ ] Data Table
- [ ] Panel (PC)
- [ ] Toast
- [ ] Badge
- [ ] Type Badge

### 15.4 상태별 화면
- [ ] Loading (Spinner)
- [ ] Empty State
- [ ] Error State
- [ ] Active/Inactive Button
- [ ] Active/Inactive Tab

---

## 16. 기술 스택

- **Frontend**: Vanilla JS, Single HTML
- **Backend**: Python FastAPI, Uvicorn
- **Database**: SQLite
- **AI**: Claude Sonnet 4.5 (Anthropic API)
- **Auth**: 자체 Bearer Token (30일 만료)
- **Deploy**: Local (port 8003)

---

## 17. 참고사항

### 17.1 모바일 우선
- 모든 화면은 모바일 먼저 디자인
- PC는 확장/최적화 버전

### 17.2 접근성
- 모든 버튼에 명확한 라벨
- SVG 아이콘에 aria-label 권장
- Color contrast 준수

### 17.3 성능
- 이미지 최적화 (SVG 우선)
- Lazy loading 고려
- Service Worker 캐싱

---

이 기획서를 바탕으로 Figma에서 디자인을 진행하시면 됩니다.
모든 컴포넌트, 색상, 간격, 인터랙션이 명세되어 있으므로 디자인 시스템을 먼저 구축하신 후 각 화면을 작업하시는 것을 권장합니다.
