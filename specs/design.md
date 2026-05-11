# 설계 문서

## 개요

아마추어 축구팀 관리 웹 애플리케이션의 기술 설계 문서입니다. Next.js + Supabase 기반의 풀스택 웹 앱으로, 선수 관리, 시즌/스쿼드 관리, 경기 관리, period별 포메이션 라인업 배정, 경기 후 선수 기록 입력, 대시보드 기능을 제공합니다.

대시보드 UI는 `reference/sandro_fc_dashboard.html`을 기준으로 하되, 정적 DATA 객체를 제거하고 Supabase PostgreSQL 기반 동적 데이터로 재설계합니다.

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 3.x |
| 데이터베이스 | Supabase PostgreSQL | - |
| ORM/클라이언트 | Supabase JS Client | 2.x |
| 드래그앤드롭 | dnd-kit | 6.x |
| 차트 | Recharts | 2.x |
| 배포 | Vercel | - |

---

## 환경 변수

`.env.local`은 프로젝트 최상위 폴더에 생성합니다. 이 위치는 `AGENTS.md`,
`specs/`, `skills-lock.json`과 같은 층입니다.

```
sdr-team-manager/
├── .env.local
├── AGENTS.md
├── specs/
└── skills-lock.json
```

Supabase 연결에 필요한 값은 아래처럼 저장합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon public key
```

`.env.local`은 개인 환경 설정 파일이므로 Git에 커밋하지 않습니다.

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    Vercel (CDN)                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           Next.js App (App Router)           │    │
│  │                                              │    │
│  │  ┌──────────────┐  ┌──────────────────────┐ │    │
│  │  │  Page Layer  │  │   Server Actions /   │ │    │
│  │  │  (RSC + CSC) │  │   Route Handlers     │ │    │
│  │  └──────┬───────┘  └──────────┬───────────┘ │    │
│  │         │                     │              │    │
│  │  ┌──────▼─────────────────────▼───────────┐ │    │
│  │  │         Supabase JS Client             │ │    │
│  │  └──────────────────┬─────────────────────┘ │    │
│  └─────────────────────│─────────────────────── ┘    │
└────────────────────────│────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                  Supabase                            │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  PostgreSQL  │  │   Auth   │  │  Row Level    │  │
│  │  (Tables +  │  │ (Email/  │  │  Security     │  │
│  │   Views)    │  │  Magic)  │  │  (RLS)        │  │
│  └──────────────┘  └──────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 렌더링 전략

- **Server Components (RSC)**: 초기 데이터 로딩이 필요한 페이지 (경기 목록, 선수 목록, 대시보드)
- **Client Components (CSC)**: 인터랙션이 필요한 컴포넌트 (드래그앤드롭 라인업 보드, 폼, 필터)
- **Server Actions**: 데이터 변경 작업 (선수 등록, 경기 생성, 기록 저장)

---

## 데이터베이스 스키마

### ERD 관계 요약

```
players
  └── squad_members (N:M) ── seasons
        └── matches ── periods ── period_lineups ── position_slots
                   └── player_match_stats
                   └── position_performance (저장 테이블, period_lineups 기반 갱신)

formations ── position_slots

-- MVP 제외 (Phase 2)
-- match_events: 경기 중 이벤트 타임라인 ("1쿼터 12분 고건 골" 등)
```

### 테이블 정의

#### players
```sql
CREATE TABLE players (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  number        INTEGER NOT NULL UNIQUE,
  birth_date    DATE,
  contact       TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### seasons
```sql
CREATE TABLE seasons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_season_dates CHECK (end_date >= start_date)
);
```

#### squad_members
```sql
CREATE TABLE squad_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id     UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  player_id     UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (season_id, player_id)
);
```

#### matches
```sql
CREATE TABLE matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id       UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  opponent        TEXT NOT NULL,
  match_date      TIMESTAMPTZ NOT NULL,
  venue           TEXT,
  is_home         BOOLEAN NOT NULL DEFAULT true,
  our_score       INTEGER,
  opponent_score  INTEGER,
  match_mom_player_id     UUID REFERENCES players(id) ON DELETE SET NULL,
  defense_mom_player_id   UUID REFERENCES players(id) ON DELETE SET NULL,
  midfield_mom_player_id  UUID REFERENCES players(id) ON DELETE SET NULL,
  attack_mom_player_id    UUID REFERENCES players(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('scheduled', 'completed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Match result is not stored as a separate column. The application derives it from
`our_score` and `opponent_score` so score and result cannot conflict:
`Win` when `our_score > opponent_score`, `Draw` when equal, `Loss` when lower,
and `Pending` when either score is missing.

The four MOM fields preserve the prior spreadsheet workflow:
overall match MOM, defense MOM, midfield MOM, and attack MOM. Each points to a
player record and is nullable because older or incomplete match records may not
have MOM selections yet.

#### periods
```sql
CREATE TABLE periods (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id      UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  label         TEXT NOT NULL,           -- '전반', '후반', '1쿼터' 등
  order_num     INTEGER NOT NULL,        -- 1부터 시작
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (match_id, label),
  UNIQUE (match_id, order_num)
);
```

#### formations
```sql
CREATE TABLE formations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,    -- '4-3-3', '4-4-2' 등
  is_default    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### position_slots
```sql
CREATE TABLE position_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id    UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  position_code   TEXT NOT NULL,         -- 'GK', 'CB', 'LW' 등
  x               NUMERIC(5,2) NOT NULL, -- 0~100 (%) 좌우 좌표
  y               NUMERIC(5,2) NOT NULL, -- 0~100 (%) 상하 좌표
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (formation_id, position_code)
  -- 포메이션당 최대 11개 슬롯 제한은 Server Action에서 검증
);
```

#### period_lineups
```sql
CREATE TABLE period_lineups (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id         UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
  formation_id      UUID NOT NULL REFERENCES formations(id) ON DELETE RESTRICT,
  position_slot_id  UUID NOT NULL REFERENCES position_slots(id) ON DELETE RESTRICT,
  player_id         UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (period_id, position_slot_id),
  UNIQUE (period_id, player_id)           -- 동일 period 내 선수 중복 배정 방지
);
```

#### match_events (MVP 제외 — Phase 2)
경기 중 발생한 이벤트 타임라인 ("1쿼터 12분 고건 골" 등). MVP에서는 구현하지 않으며, Phase 2에서 포지션별 골/도움 귀속 분석과 함께 도입합니다.

```sql
-- Phase 2에서 생성 예정
-- CREATE TABLE match_events (
--   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   match_id      UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
--   period_id     UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
--   player_id     UUID REFERENCES players(id) ON DELETE RESTRICT,
--   event_type    TEXT NOT NULL CHECK (event_type IN ('goal', 'assist', 'yellow_card', 'red_card')),
--   minute        INTEGER NOT NULL CHECK (minute >= 0),
--   created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
```

#### player_match_stats
경기 종료 후 선수별 총합 기록. 골/도움/카드는 경기 단위 총합이며 특정 period나 position_code에 귀속하지 않습니다. `minutes_played`는 MVP에서 핵심 지표가 아니므로 nullable 확장 컬럼으로만 예약합니다.

```sql
CREATE TABLE player_match_stats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  played          BOOLEAN NOT NULL DEFAULT false,
  goals           INTEGER NOT NULL DEFAULT 0 CHECK (goals >= 0),
  assists         INTEGER NOT NULL DEFAULT 0 CHECK (assists >= 0),
  yellow_cards    INTEGER NOT NULL DEFAULT 0 CHECK (yellow_cards >= 0),
  red_cards       INTEGER NOT NULL DEFAULT 0 CHECK (red_cards >= 0),
  memo            TEXT,
  -- MVP 제외: nullable 확장 컬럼으로만 예약
  minutes_played  INTEGER CHECK (minutes_played IS NULL OR minutes_played >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (match_id, player_id)
);
```

### 저장 테이블: position_performance

선수별·시즌별·포지션별 출전 통계를 저장하는 물리 테이블입니다. `period_lineups` 저장 시 애플리케이션 레이어에서 UPSERT로 갱신합니다.

MVP에서는 `period_count`, `match_count`만 집계합니다. `minutes_played`는 MVP 핵심 지표가 아니므로 nullable 확장 컬럼으로만 예약합니다. 골/도움은 포지션 귀속이 없으므로 MVP에서 제외하고, Phase 2 확장을 위해 nullable 컬럼으로만 예약합니다.

```sql
CREATE TABLE position_performance (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id       UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  position_code   TEXT NOT NULL,           -- 'GK', 'CB', 'LW' 등
  period_count    INTEGER NOT NULL DEFAULT 0 CHECK (period_count >= 0),
                                           -- 해당 포지션으로 출전한 period 수
  match_count     INTEGER NOT NULL DEFAULT 0 CHECK (match_count >= 0),
                                           -- 해당 포지션으로 출전한 경기 수
  -- MVP 제외: nullable 확장 컬럼으로만 예약
  minutes_played  INTEGER CHECK (minutes_played IS NULL OR minutes_played >= 0),
  -- Phase 2 확장용 nullable 컬럼 (포지션별 골/도움 귀속 — match_events 도입 후)
  goals           INTEGER,
  assists         INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (season_id, player_id, position_code)
);
```

#### 갱신 시점

`period_lineups` 저장(라인업 배정) 시, 애플리케이션 레이어에서 아래 로직으로 UPSERT합니다.

```
라인업 저장 시:
  1. 해당 period의 (season_id, player_id, position_code) 조합 추출
  2. position_performance UPSERT:
     - period_count = 해당 시즌 내 해당 포지션 출전 period 수 재집계
     - match_count  = 해당 시즌 내 해당 포지션 출전 경기 수 재집계

라인업 수정/삭제 시:
  1. 변경 전 라인업 데이터 기준으로 영향받는 (season_id, player_id, position_code) 조합 추출
  2. 해당 시즌 전체 period_lineups를 재집계하여 position_performance 갱신
  3. 더 이상 출전 기록이 없는 포지션은 period_count=0, match_count=0으로 갱신 또는 레코드 삭제
```

### 기본 데이터 시드 (Seed)

시스템 초기화 시 아래 포메이션을 자동 생성합니다.

```sql
-- 4-4-2
INSERT INTO formations (name, is_default) VALUES ('4-4-2', true);
-- position_slots: GK(50,90), LB(15,70), CB1(35,70), CB2(65,70), RB(85,70),
--                 LM(15,50), CM1(35,50), CM2(65,50), RM(85,50),
--                 ST1(35,15), ST2(65,15)

-- 4-3-3
INSERT INTO formations (name, is_default) VALUES ('4-3-3', true);
-- position_slots: GK(50,90), LB(15,70), CB1(35,70), CB2(65,70), RB(85,70),
--                 CM1(25,50), CM2(50,50), CM3(75,50),
--                 LW(15,20), ST(50,10), RW(85,20)

-- 3-5-2
INSERT INTO formations (name, is_default) VALUES ('3-5-2', true);
-- position_slots: GK(50,90), CB1(25,72), CB2(50,72), CB3(75,72),
--                 LWB(10,52), CM1(30,50), CM2(50,50), CM3(70,50), RWB(90,52),
--                 ST1(35,15), ST2(65,15)
```

---

## 페이지 및 컴포넌트 구조

### 디렉토리 구조

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # 사이드바 포함 레이아웃
│   │   ├── page.tsx                # 대시보드 (/)
│   │   ├── players/
│   │   │   ├── page.tsx            # 선수 목록
│   │   │   └── [id]/
│   │   │       └── page.tsx        # 선수 상세/수정
│   │   ├── seasons/
│   │   │   ├── page.tsx            # 시즌 목록
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # 시즌 상세 (스쿼드 관리)
│   │   │       └── matches/
│   │   │           ├── page.tsx    # 경기 목록
│   │   │           └── [matchId]/
│   │   │               ├── page.tsx        # 경기 상세
│   │   │               ├── lineup/
│   │   │               │   └── page.tsx    # period별 라인업 배정
│   │   │               └── stats/
│   │   │                   └── page.tsx    # 경기 후 선수 기록 입력
│   │   └── formations/
│   │       └── page.tsx            # 포메이션 관리
│   └── api/
│       └── [...]/                  # 필요 시 Route Handlers
├── components/
│   ├── ui/                         # 공통 UI (Button, Input, Badge 등)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── players/
│   │   ├── PlayerList.tsx
│   │   └── PlayerForm.tsx
│   ├── seasons/
│   │   ├── SeasonList.tsx
│   │   └── SquadManager.tsx
│   ├── matches/
│   │   ├── MatchList.tsx
│   │   ├── MatchForm.tsx
│   │   └── MatchCard.tsx
│   ├── lineup/
│   │   ├── LineupBoard.tsx         # dnd-kit 드래그앤드롭 보드 (CSC)
│   │   ├── FormationSelector.tsx
│   │   ├── PlayerDraggable.tsx     # 드래그 가능한 선수 카드
│   │   └── PositionSlotDroppable.tsx # 드롭 가능한 포지션 슬롯
│   ├── stats/
│   │   ├── PlayerStatsForm.tsx     # 경기 후 선수 기록 입력 폼
│   │   └── StatsTable.tsx
│   └── dashboard/
│       ├── SeasonSummaryCard.tsx   # 승/무/패, 득실 요약
│       ├── TopScorersTable.tsx     # 득점 랭킹
│       ├── PlayerStatsSection.tsx  # 선수별 성과
│       ├── FormationStatsSection.tsx
│       ├── MatchHistoryPanel.tsx   # 전체 경기 기록 패널
│       └── SeasonFilter.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # 브라우저용 Supabase 클라이언트
│   │   └── server.ts               # 서버용 Supabase 클라이언트
│   └── utils.ts
├── actions/                        # Server Actions
│   ├── players.ts
│   ├── seasons.ts
│   ├── matches.ts
│   ├── lineups.ts
│   └── stats.ts
└── types/
    └── index.ts                    # 공통 TypeScript 타입 정의
```

---

## 주요 데이터 흐름

### 1. Period별 라인업 배정 흐름

```
[경기 상세 페이지]
  → period 탭 선택
  → FormationSelector: 포메이션 선택
  → LineupBoard (CSC, dnd-kit):
      - 왼쪽: 스쿼드 선수 목록 (DraggablePlayerCard)
      - 오른쪽: 포메이션 다이어그램 (DroppablePositionSlot × N)
      - 선수를 포지션 슬롯으로 드래그앤드롭
  → "저장" 버튼 클릭
  → Server Action: saveLineup(periodId, formationId, entries[])
      - 기존 period_lineups 삭제 (해당 period)
      - 새 Lineup_Entry 일괄 INSERT
      - UNIQUE 제약으로 중복 배정 방지
  → 저장 완료 → UI 갱신
```

### 2. 경기 후 선수 기록 입력 흐름

```
[경기 상세 > 선수 기록 탭]
  → 해당 경기 시즌 스쿼드 선수 목록 표시
  → period_lineups에 배정된 선수: 기록 입력 가능
  → player_match_stats 없는 선수: "미입력" 배지 표시
  → PlayerStatsForm: played, goals, assists, yellow_cards, red_cards, memo 입력
      (minutes_played는 MVP에서 표시하지 않음)
  → Server Action: savePlayerMatchStats(matchId, playerId, data)
      - UPSERT (match_id, player_id) UNIQUE 제약 활용
      - 유효성 검증: 숫자 필드 >= 0
      - 저장 후 position_performance UPSERT 트리거
  → 저장 완료 → 대시보드 데이터 자동 반영
```

### 3. 대시보드 데이터 조회 흐름

```
[대시보드 페이지 (RSC)]
  → SeasonFilter: 시즌 선택 (기본값: 최근 활성 시즌)
  → 병렬 데이터 조회 (Promise.all):
      1. 시즌 요약: matches WHERE season_id → 승/무/패 집계
      2. 득점 랭킹: player_match_stats JOIN players → goals 합산 TOP 5
      3. 선수별 성과: player_match_stats GROUP BY player_id
      4. 포메이션별 성과: period_lineups JOIN formations → 사용 횟수
      5. 전체 경기 기록: matches WHERE season_id ORDER BY match_date DESC
  → 각 컴포넌트에 props로 전달
  → Recharts: 차트 렌더링 (CSC)
```

---

## 라인업 보드 컴포넌트 설계 (dnd-kit)

```tsx
// LineupBoard.tsx (Client Component)
// dnd-kit DndContext 사용

interface LineupBoardProps {
  periodId: string
  formation: Formation
  squadPlayers: Player[]
  existingLineup: LineupEntry[]
}

// 상태 구조
type LineupState = {
  // 포지션 슬롯 ID → 배정된 선수 (null이면 미배정)
  slots: Record<string, Player | null>
  // 아직 배정되지 않은 선수 목록
  unassigned: Player[]
}

// 드래그 이벤트
// - onDragEnd: 선수를 슬롯에 드롭 → slots 상태 업데이트
// - 슬롯 간 이동, 슬롯 → 미배정 목록 이동 지원
// - 동일 period 내 중복 배정 클라이언트 측 방지

// 저장
// - "저장" 버튼 → Server Action 호출
// - 낙관적 업데이트(optimistic update) 적용
```

---

## 대시보드 설계

레퍼런스(`reference/sandro_fc_dashboard.html`)의 레이아웃과 디자인 시스템을 기반으로 Supabase 동적 데이터로 재설계합니다.

### 레이아웃 구조

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (240px 고정)                                │
│  - SANDRO FC 로고                                    │
│  - 네비게이션: 대시보드, 공격포인트, 선수관리, 경기관리 │
│  - 시즌 선택 필터                                     │
└─────────────────────────────────────────────────────┘

대시보드 페이지 (2단 레이아웃):
┌──────────────────┬──────────────────────────────────┐
│  Left Column     │  Right Panel                     │
│                  │                                  │
│  SeasonSummary   │  MatchHistoryPanel               │
│  (승/무/패,      │  (전체 경기 기록 스크롤)           │
│   득실, 최근전적) │                                  │
│                  │                                  │
│  StatCards 2×2   │                                  │
│  (득점왕, 도움왕, │                                  │
│   공격P 1위,     │                                  │
│   최다출전)      │                                  │
└──────────────────┴──────────────────────────────────┘

공격포인트 페이지:
┌─────────────────────────────────────────────────────┐
│  TopScorersTable                                    │
│  (순위, 선수, 등번호, 경기수, 득점, 도움, 공격P)      │
│  - 컬럼 클릭으로 정렬                                │
└─────────────────────────────────────────────────────┘
```

### 데이터 소스 매핑

| 레퍼런스 DATA 필드 | Supabase 쿼리 |
|-------------------|---------------|
| `summary.wins/draws/losses` | `matches` WHERE `season_id` GROUP BY `our_score vs opponent_score` |
| `summary.goals_for/against` | `matches` WHERE `season_id` SUM `our_score`, `opponent_score` |
| `players[].total_goals` | `player_match_stats` GROUP BY `player_id` SUM `goals` |
| `players[].total_assists` | `player_match_stats` GROUP BY `player_id` SUM `assists` |
| `players[].match_count` | `player_match_stats` WHERE `played = true` COUNT |
| `matches[].result` | `matches.our_score vs opponent_score` 비교 |
| `matches[].match_mom_player_id` | `matches` FK to `players.id` |
| `matches[].defense_mom_player_id` | `matches` FK to `players.id` |
| `matches[].midfield_mom_player_id` | `matches` FK to `players.id` |
| `matches[].attack_mom_player_id` | `matches` FK to `players.id` |

### 디자인 토큰 (Tailwind 커스텀)

레퍼런스의 CSS 변수를 Tailwind 설정으로 이식합니다.

```js
// tailwind.config.ts
colors: {
  'bg-primary': '#0b1120',
  'bg-secondary': '#111827',
  'accent-blue': '#38bdf8',
  'accent-purple': '#a78bfa',
  'accent-green': '#34d399',
  'accent-yellow': '#fbbf24',
  'accent-red': '#f87171',
  'accent-orange': '#fb923c',
}
```

---

## 인증 설계

- Supabase Auth (이메일/패스워드 또는 Magic Link) 사용
- 단일 Operator 역할: 인증된 사용자만 데이터 수정 가능
- RLS 정책: 모든 테이블에 `auth.uid() IS NOT NULL` 조건 적용
- 미인증 사용자: 대시보드 읽기 전용 접근 허용 (선택적)

```sql
-- 예시 RLS 정책 (players 테이블)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- 읽기 정책
CREATE POLICY "authenticated users can read players"
  ON players FOR SELECT USING (true);

-- 쓰기 정책 (INSERT/UPDATE/DELETE 분리)
CREATE POLICY "authenticated users can insert players"
  ON players FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated users can update players"
  ON players FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete players"
  ON players FOR DELETE TO authenticated USING (true);
```

---

## 향후 확장 방향

### Phase 2: 경기 이벤트 타임라인 및 포지션별 골/도움 분석
- `match_events` 테이블 생성 ("1쿼터 12분 고건 골" 등 이벤트 타임라인)
- `period_lineups`와 조인하여 포지션 귀속 자동화
- `position_performance`의 `goals`, `assists` nullable 컬럼 활성화
- 대시보드에 포지션별 성과 히트맵 추가

### Phase 4: 추가 기능
- 선수 사진 업로드 (Supabase Storage)
- 경기 리포트 PDF 내보내기
- 모바일 앱 (React Native + Supabase)
- 팀 간 대결 통계 비교
