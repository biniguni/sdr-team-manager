# 구현 태스크

## 개요

개발 초보자가 단계적으로 구현할 수 있도록 Phase 단위로 구성했습니다.
각 Phase는 이전 Phase가 안정화된 후 진행합니다.

- **Phase 0**: 프로젝트 실행 확인
- **Phase 1**: 기본 CRUD (선수, 시즌, 스쿼드, 경기, Period, 포메이션)
- **Phase 2**: 단순 라인업 저장 (드롭다운 기반)
- **Phase 3**: 드래그앤드롭 라인업 보드
- **Phase 4**: 경기 후 선수 기록 입력
- **Phase 5**: 대시보드
- **Phase 6**: Auth / RLS / 배포

> **Auth/RLS 참고**: Phase 0~5 로컬 개발 중에는 Supabase RLS를 비활성화하거나 전체 허용 정책으로 단순화합니다. Phase 6에서 인증 및 보안 정책을 적용합니다.

---

## Phase 0: 프로젝트 실행 확인

- [x] 0.1 Next.js 프로젝트 생성 및 실행 확인
  - `npx create-next-app@latest` (TypeScript, Tailwind CSS, App Router 선택)
  - `npm run dev` 실행 후 `http://localhost:3000` 접속 확인
  - 요구사항: 기술 스택

- [x] 0.2 의존성 패키지 설치
  - `@supabase/supabase-js`, `@supabase/ssr`
  - `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
    - ⚠️ React 19 호환성: `npm install @dnd-kit/core --legacy-peer-deps` 플래그 사용
    - ⚠️ 드래그 시 시각적 글리치 발생 시 대안 라이브러리 고려: `@atlaskit/pragmatic-drag-and-drop` 또는 `@hello-pangea/dnd`
  - `recharts`
  - 요구사항: 기술 스택

- [x] 0.3 Supabase 프로젝트 연결
  - Supabase 대시보드에서 프로젝트 생성
  - `.env.local` 파일 생성: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `src/lib/supabase/client.ts` (브라우저용), `src/lib/supabase/server.ts` (서버용) 작성
  - Supabase 연결 테스트 (간단한 SELECT 쿼리 실행 확인)
  - 요구사항: 요구사항 11

- [x] 0.4 Tailwind CSS 디자인 토큰 설정
  - `tailwind.config.ts`에 커스텀 색상 추가
  - `bg-primary: #0b1120`, `bg-secondary: #111827`, `accent-blue: #38bdf8` 등
  - `reference/sandro_fc_dashboard.html`의 CSS 변수 참고
  - 요구사항: 대시보드 UI 레퍼런스

- [x] 0.5 공통 TypeScript 타입 정의
  - `src/types/index.ts` 파일 생성
  - `Player`, `Season`, `Match`, `Period`, `Formation`, `PositionSlot`, `PeriodLineup`, `PlayerMatchStats`, `PositionPerformance` 타입 정의
  - 요구사항: 전체

---

## Phase 1: 기본 CRUD

### 1-A. 데이터베이스 스키마 생성

- [ ] 1.1 핵심 테이블 생성
  - Supabase SQL Editor에서 실행
  - `players`: id, name, number(UNIQUE), birth_date, contact, is_active, created_at, updated_at
  - `seasons`: id, name, start_date, end_date, is_active, created_at, updated_at + CHECK(end_date >= start_date)
  - `squad_members`: id, season_id(FK), player_id(FK), created_at + UNIQUE(season_id, player_id)
  - 요구사항: 요구사항 1~3, 11

- [ ] 1.2 경기 및 Period 테이블 생성
  - `matches`: id, season_id(FK), opponent, match_date, venue, is_home, our_score, opponent_score, match_mom_player_id(FK nullable), defense_mom_player_id(FK nullable), midfield_mom_player_id(FK nullable), attack_mom_player_id(FK nullable), status(scheduled/completed), created_at, updated_at
  - Match result is calculated from `our_score` and `opponent_score`; do not store a separate result column.
  - `periods`: id, match_id(FK CASCADE), label, order_num + UNIQUE(match_id, label), UNIQUE(match_id, order_num)
  - 요구사항: 요구사항 4~5, 11

- [ ] 1.3 포메이션 테이블 생성
  - `formations`: id, name(UNIQUE), is_default, created_at, updated_at
  - `position_slots`: id, formation_id(FK CASCADE), position_code, x, y, created_at + UNIQUE(formation_id, position_code)
  - ⚠️ 슬롯 수 최대 11개 제한은 DB CHECK가 아닌 Server Action/Form에서 처리
  - 요구사항: 요구사항 6

- [ ] 1.4 라인업 및 기록 테이블 생성
  - `period_lineups`: id, period_id(FK CASCADE), formation_id(FK), position_slot_id(FK), player_id(FK) + UNIQUE(period_id, position_slot_id), UNIQUE(period_id, player_id)
  - `player_match_stats`: id, match_id(FK CASCADE), player_id(FK), played, goals, assists, yellow_cards, red_cards, memo, minutes_played(nullable) + UNIQUE(match_id, player_id)
  - `position_performance`: id, season_id(FK CASCADE), player_id(FK CASCADE), position_code, period_count, match_count, minutes_played(nullable), goals(nullable), assists(nullable) + UNIQUE(season_id, player_id, position_code)
  - 요구사항: 요구사항 7, 9

- [ ] 1.5 기본 포메이션 시드 데이터 삽입
  - `4-4-2`: GK(50,90), LB(15,70), CB1(35,70), CB2(65,70), RB(85,70), LM(15,50), CM1(35,50), CM2(65,50), RM(85,50), ST1(35,15), ST2(65,15)
  - `4-3-3`: GK(50,90), LB(15,70), CB1(35,70), CB2(65,70), RB(85,70), CM1(25,50), CM2(50,50), CM3(75,50), LW(15,20), ST(50,10), RW(85,20)
  - `3-5-2`: GK(50,90), CB1(25,72), CB2(50,72), CB3(75,72), LWB(10,52), CM1(30,50), CM2(50,50), CM3(70,50), RWB(90,52), ST1(35,15), ST2(65,15)
  - 요구사항: 요구사항 6

### 1-B. 레이아웃 및 공통 컴포넌트

- [ ] 1.6 공통 UI 컴포넌트 구현
  - `src/components/ui/Button.tsx`, `Input.tsx`, `Badge.tsx`, `Card.tsx`, `Select.tsx`
  - 다크 테마 기반 (레퍼런스 디자인 시스템 참고)
  - 요구사항: 전체

- [ ] 1.7 사이드바 레이아웃 구현
  - `src/components/layout/Sidebar.tsx`: 로고, 네비게이션 메뉴
  - `src/components/layout/MobileNav.tsx`: 모바일 하단 네비게이션
  - `src/app/(dashboard)/layout.tsx`: 사이드바 + 메인 콘텐츠 영역
  - 요구사항: 요구사항 10

### 1-C. 선수 관리

- [ ] 1.8 선수 Server Actions 구현
  - `src/actions/players.ts`
  - `createPlayer(data)`: 이름·등번호 필수 검증, 등번호 중복 체크
  - `updatePlayer(id, data)`: 기존 기록 유지
  - `deactivatePlayer(id)`: `is_active = false`
  - 요구사항: 요구사항 1

- [ ] 1.9 선수 목록 페이지 구현
  - `src/app/(dashboard)/players/page.tsx` (RSC)
  - 선수 목록 (이름·등번호 기준 정렬), 활성/비활성 필터
  - 신규 등록 버튼
  - 요구사항: 요구사항 1

- [ ] 1.10 선수 등록/수정 폼 구현
  - `src/components/players/PlayerForm.tsx` (CSC)
  - 이름, 등번호 (필수), 생년월일, 연락처 (선택)
  - 유효성 검증 및 오류 메시지 표시
  - 요구사항: 요구사항 1

### 1-D. 시즌 및 스쿼드 관리

- [ ] 1.11 시즌 Server Actions 구현
  - `src/actions/seasons.ts`
  - `createSeason(data)`: 시작일/종료일 검증
  - `updateSeason(id, data)`: 상태 변경 포함
  - `addSquadMember(seasonId, playerId)`: 활성 선수만, 중복 체크
  - `removeSquadMember(seasonId, playerId)`: 라인업 배정 여부 체크
  - 요구사항: 요구사항 2~3

- [ ] 1.12 시즌 목록 페이지 구현
  - `src/app/(dashboard)/seasons/page.tsx` (RSC)
  - 시즌 목록 (시작일 기준 내림차순), 신규 생성 버튼
  - 요구사항: 요구사항 2

- [ ] 1.13 시즌 상세 페이지 (스쿼드 관리) 구현
  - `src/app/(dashboard)/seasons/[id]/page.tsx` (RSC)
  - 시즌 정보 표시/수정, 스쿼드 선수 목록 (등번호 오름차순)
  - 선수 추가/제거 기능
  - 요구사항: 요구사항 2~3

### 1-E. 경기 및 Period 관리

- [ ] 1.14 경기 Server Actions 구현
  - `src/actions/matches.ts`
  - `createMatch(data)`: 활성 시즌 검증, 필수 필드 검증, period 일괄 생성
  - `updateMatch(id, data)`: 상태 변경 포함
  - `completeMatch(id)`: 라인업 미배정 period 경고
  - 요구사항: 요구사항 4~5

- [ ] 1.15 경기 목록 및 생성 페이지 구현
  - `src/app/(dashboard)/seasons/[id]/matches/page.tsx` (RSC)
  - 경기 목록 (경기 일시 기준 내림차순), 신규 생성 버튼
  - 경기 생성 폼: 상대팀명, 경기 일시 (필수), 경기장, 홈/원정, period 수(1~4) 및 레이블
  - 요구사항: 요구사항 4~5

- [ ] 1.16 경기 상세 페이지 구현
  - `src/app/(dashboard)/seasons/[id]/matches/[matchId]/page.tsx` (RSC)
  - 경기 정보, period 목록, 라인업/기록 탭 네비게이션
  - 경기 완료 처리 버튼
  - 요구사항: 요구사항 4~5

### 1-F. 포메이션 관리

- [ ] 1.17 포메이션 Server Actions 구현
  - `src/actions/formations.ts`
  - `createFormation(data)`: 포메이션명, 포지션 슬롯 목록 저장
  - ⚠️ 슬롯 수 11개 초과 시 Server Action에서 오류 반환 (DB CHECK 아님)
  - `deleteFormation(id)`: 라인업 사용 여부 체크 후 삭제
  - 요구사항: 요구사항 6

- [ ] 1.18 포메이션 관리 페이지 구현
  - `src/app/(dashboard)/formations/page.tsx` (RSC)
  - 포메이션 목록, 기본 포메이션 표시, 커스텀 포메이션 추가/삭제
  - 요구사항: 요구사항 6

---

## Phase 2: 단순 라인업 저장 (드롭다운 기반)

> 드래그앤드롭 구현 전에 라인업 저장 로직을 먼저 안정화합니다.

- [x] 2.1 라인업 Server Actions 구현
  - `src/actions/lineups.ts`
  - `saveLineup(periodId, formationId, entries[])`:
    - 기존 `period_lineups` 삭제 후 일괄 INSERT
    - UNIQUE 제약으로 중복 배정 방지
  - `getLineup(periodId)`: 현재 라인업 조회
  - 요구사항: 요구사항 7

- [x] 2.2 드롭다운 기반 단순 라인업 입력 UI 구현
  - `src/components/lineup/SimpleLineupForm.tsx` (CSC)
  - 포메이션 선택 드롭다운
  - 각 포지션 슬롯별 선수 선택 드롭다운 (스쿼드 선수 목록)
  - 동일 period 내 선수 중복 배정 클라이언트 측 방지
  - "저장" 버튼 → Server Action 호출
  - 요구사항: 요구사항 7

- [x] 2.3 라인업 배정 페이지 구현 (단순 버전)
  - `src/app/(dashboard)/seasons/[id]/matches/[matchId]/lineup/page.tsx`
  - period 탭 전환
  - SimpleLineupForm 연동
  - 저장 후 현재 라인업 표시 (포지션 코드 + 선수 이름)
  - 요구사항: 요구사항 7

- [x] 2.4 라인업 저장 동작 검증
  - 동일 period 내 선수 중복 배정 방지 확인
  - 다른 period에서 동일 선수 다른 포지션 배정 허용 확인
  - 포메이션 미선택 시 오류 메시지 확인
  - 요구사항: 요구사항 7

---

## Phase 3: 드래그앤드롭 라인업 보드

> Phase 2의 라인업 저장 로직을 재사용하고, UI만 드래그앤드롭으로 교체합니다.

- [x] 3.1 드래그 가능한 선수 카드 구현
  - `src/components/lineup/PlayerDraggable.tsx` (CSC)
  - dnd-kit `useDraggable` 훅 사용
  - 선수 이름, 등번호 표시
  - 요구사항: 요구사항 7

- [x] 3.2 드롭 가능한 포지션 슬롯 구현
  - `src/components/lineup/PositionSlotDroppable.tsx` (CSC)
  - dnd-kit `useDroppable` 훅 사용
  - 포지션 코드 표시, 배정된 선수 이름/등번호 표시
  - x, y 좌표 기반 절대 위치 배치 (포메이션 다이어그램 위)
  - 요구사항: 요구사항 7

- [x] 3.3 드래그앤드롭 라인업 보드 구현
  - `src/components/lineup/LineupBoard.tsx` (CSC, dnd-kit DndContext)
  - 왼쪽 패널: 스쿼드 선수 목록 (미배정 선수)
  - 오른쪽 패널: 포메이션 다이어그램 (포지션 슬롯)
  - 선수 → 슬롯 드래그앤드롭
  - 슬롯 간 이동, 슬롯 → 미배정 목록 이동 지원
  - 동일 period 내 중복 배정 클라이언트 측 방지
  - ⚠️ Phase 3 시작 전 dnd-kit의 React 19 호환성 최신 상태 재확인
  - ⚠️ 필요 시 LineupBoard를 추상화하여 대안 라이브러리로 전환 가능하도록 설계
  - 요구사항: 요구사항 7

- [x] 3.4 라인업 배정 페이지 업그레이드 (드래그앤드롭 버전)
  - Phase 2의 SimpleLineupForm을 LineupBoard로 교체
  - "저장" 버튼 → Phase 2에서 구현한 Server Action 재사용
  - 낙관적 업데이트(optimistic update) 적용
  - 요구사항: 요구사항 7

- [x] 3.5 position_performance 재계산 로직 추가
  - `src/actions/lineups.ts` 확장
  - `saveLineup()` 완료 후 `position_performance` UPSERT:
    - `period_count`: 해당 시즌 내 해당 포지션 출전 period 수 재집계
    - `match_count`: 해당 시즌 내 해당 포지션 출전 경기 수 재집계
  - 라인업 수정/삭제 시 역갱신 로직:
    - 변경 전 라인업 데이터 기준으로 영향받는 (season_id, player_id, position_code) 조합 추출
    - 해당 시즌 전체 period_lineups를 재집계하여 position_performance 갱신
    - 더 이상 출전 기록이 없는 포지션은 period_count=0, match_count=0으로 갱신 또는 레코드 삭제
  - 요구사항: 요구사항 7 (포지션별 출전 추적)

---

## Phase 4: 경기 후 선수 기록 입력

- [x] 4.1 선수 기록 Server Actions 구현
  - `src/actions/stats.ts`
  - `savePlayerMatchStats(matchId, playerId, data)`:
    - UPSERT `player_match_stats`
    - 유효성 검증: `goals`, `assists`, `yellow_cards`, `red_cards` >= 0
    - ⚠️ `minutes_played`는 MVP 핵심 입력값에서 제외 (nullable, 입력 폼에 표시 안 함)
  - `getMatchStats(matchId)`: 경기별 전체 선수 기록 조회
  - 요구사항: 요구사항 9

- [x] 4.2 선수 기록 입력 폼 구현
  - `src/components/stats/PlayerStatsForm.tsx` (CSC)
  - 입력 필드: `played` (출전 여부 체크박스), `goals`, `assists`, `yellow_cards`, `red_cards`, `memo`
  - ⚠️ `minutes_played` 입력 필드 제외 (향후 확장 컬럼)
  - 유효성 검증 및 오류 메시지
  - 요구사항: 요구사항 9

- [x] 4.3 경기 후 선수 기록 페이지 구현
  - `src/app/(dashboard)/seasons/[id]/matches/[matchId]/stats/page.tsx` (RSC)
  - 시즌 스쿼드 선수 목록 표시
  - `period_lineups` 배정 선수: 기록 입력 가능
  - `player_match_stats` 없는 선수: "미입력" 배지 표시
  - 각 선수별 PlayerStatsForm 인라인 표시
  - 요구사항: 요구사항 9

---

## Phase 5: 대시보드

- [x] 5.1 시즌 선택 필터 구현
  - `src/components/dashboard/SeasonFilter.tsx` (CSC)
  - 시즌 드롭다운 (기본값: 최근 활성 시즌)
  - URL 쿼리 파라미터로 시즌 상태 관리
  - 요구사항: 요구사항 10

- [x] 5.2 시즌 요약 카드 구현
  - `src/components/dashboard/SeasonSummaryCard.tsx` (RSC)
  - 승/무/패 기록, 득점/실점 합계, 득실차
  - 최근 전적 폼 (W/D/L 도트)
  - 레퍼런스 `record-card` 스타일 적용
  - 요구사항: 요구사항 10

- [x] 5.3 통계 카드 (2×2 그리드) 구현
  - `src/components/dashboard/StatCards.tsx` (RSC)
  - 득점왕, 도움왕, 공격포인트 1위, 최다출전 선수
  - `player_match_stats` 집계 기반
  - 레퍼런스 `stat-grid-2x2` 스타일 적용
  - 요구사항: 요구사항 10

- [x] 5.4 전체 경기 기록 패널 구현
  - `src/components/dashboard/MatchHistoryPanel.tsx` (RSC)
  - 경기 카드 목록 (스크롤), 경기 일시, 상대팀, 스코어, 승/무/패 배지
  - 레퍼런스 `match-panel` 스타일 적용
  - 요구사항: 요구사항 10

- [x] 5.5 공격포인트 랭킹 테이블 구현
  - `src/components/dashboard/TopScorersTable.tsx` (CSC)
  - 순위, 선수, 등번호, 경기수, 득점, 도움, 공격포인트 컬럼
  - 컬럼 클릭 정렬 기능
  - 레퍼런스 `table-wrap` 스타일 적용
  - 요구사항: 요구사항 10

- [x] 5.6 대시보드 메인 페이지 구현
  - `src/app/(dashboard)/page.tsx` (RSC)
  - 2단 레이아웃: 좌측 (SeasonSummaryCard + StatCards), 우측 (MatchHistoryPanel)
  - `Promise.all`로 병렬 데이터 조회
  - SeasonFilter 연동
  - 요구사항: 요구사항 10

- [x] 5.7 공격포인트 랭킹 페이지 구현
  - `src/app/(dashboard)/ranking/page.tsx` (RSC + CSC)
  - TopScorersTable 전체 선수 표시, 시즌 필터 연동
  - 요구사항: 요구사항 10

---

## Phase 6: Auth / RLS / 배포

> Phase 0~5 기능 구현 완료 후 적용합니다.

- [x] 6.1 Supabase Auth 로그인 페이지 구현
  - `/login` 페이지 추가
  - 이메일/비밀번호 로그인 폼
  - 요구사항: 11

- [ ] 6.2 인증 미들웨어 설정
  - `src/proxy.ts`: 현재는 비활성화 상태
  - 나중에 비인증 사용자 `/login` 리다이렉트로 전환
  - 요구사항: 11

- [ ] 6.3 RLS 정책 적용
  - 모든 테이블에 RLS 활성화
  - SELECT: 전체 허용 (`USING (true)`)
  - INSERT/UPDATE/DELETE: `auth.uid() IS NOT NULL` 조건
  - 요구사항: 11

- [ ] 6.4 반응형 레이아웃 최종 검증
  - 모바일: 사이드바 접힘, 하단 네비게이션 표시
  - 데스크톱: 사이드바 고정 표시
  - 요구사항: 10

- [ ] 6.5 Vercel 배포 준비
  - Vercel 프로젝트 연결, 환경변수 설정, 배포 확인
  - `VERCEL.md`에 배포 체크리스트 정리
  - 프로덕션 빌드 검증 (`next build`)

---

## 구현 요약

```text
Phase 0  프로젝트 실행 확인
  ↓
Phase 1  기본 CRUD
  ↓
Phase 2  단순 라인업 저장(드롭다운)
  ↓
Phase 3  드래그앤드롭 라인업 보드
  ↓
Phase 4  경기 후 선수별 기록 입력
  ↓
Phase 5  대시보드
  ↓
Phase 6  Auth / RLS / 배포
```
## Guest Player Support

- [x] Add `players.player_type` with `member` and `guest` values, defaulting to `member`.
- [x] Add optional `players.memo` for guest context and general player notes.
- [x] Add a lineup-screen `+ 용병 추가` flow for approved editors.
- [x] Auto-assign 9000-range temporary numbers when a guest number is not provided.
- [x] Insert newly created guests into the current season squad immediately.
- [x] Preserve `player_id` storage for `period_lineups` and `player_match_stats`.
- [x] Show a `용병` badge where regular players and guests appear together.
