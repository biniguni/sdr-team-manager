# 요구사항 문서

## 소개

아마추어 축구팀 관리 웹 애플리케이션은 팀 운영자가 선수, 시즌, 스쿼드, 경기, 경기 period(전반/후반/쿼터), 포메이션, 라인업, 경기 이벤트를 통합적으로 관리할 수 있는 시스템입니다.

핵심 특징은 **period별 포지션 추적**입니다. 한 선수가 같은 경기 내에서 period마다 다른 포지션을 맡을 수 있으며, 시스템은 이를 각각 기록하고 보존합니다. 골·도움 등의 이벤트는 해당 선수가 그 period에서 뛰고 있던 포지션에 귀속되어, 선수별·포지션별 성과 분석이 가능합니다.

데이터베이스는 PostgreSQL/Supabase에 적합한 관계형 구조로 설계됩니다.

---

## 용어 정의 (Glossary)

- **System**: 아마추어 축구팀 관리 웹 애플리케이션 전체
- **Operator**: 팀 운영자. 시스템의 유일한 사용자 역할로, 모든 데이터를 생성·수정·삭제할 수 있음
- **Player**: 팀에 등록된 선수
- **Season**: 특정 기간 동안 진행되는 시즌 (예: 2024 봄 리그)
- **Squad**: 특정 시즌에 참가하는 선수 그룹
- **Match**: 특정 시즌에 속하는 단일 경기
- **Period**: 경기를 구성하는 시간 단위 (전반, 후반, 1쿼터, 2쿼터 등). 경기 생성 시 period 수와 유형을 정의함
- **Formation**: 포메이션 템플릿 (예: 4-3-3, 4-4-2). 포지션 슬롯의 집합으로 구성됨
- **Position_Slot**: 포메이션 내의 특정 포지션 (예: LW, CB, GK)
- **Lineup**: 특정 period에서 각 Position_Slot에 배정된 선수의 집합
- **Lineup_Entry**: Lineup을 구성하는 단일 레코드. (period, position_slot, player)의 조합
- **Match_Event**: 경기 중 발생한 이벤트 (골, 도움, 경고, 퇴장, 실점)
- **Player_Match_Stats**: 경기 종료 후 선수별로 입력하는 총합 기록. 출전 여부, 출전 시간, 골, 도움, 경고, 퇴장 수를 포함하며 특정 period나 포지션에 귀속되지 않음
- **Dashboard**: 팀 성과, 선수 랭킹, 포지션별 성과, 시즌 요약을 표시하는 화면

---

## 요구사항

### 요구사항 1: 선수 관리

**사용자 스토리:** 팀 운영자로서, 선수를 등록·수정·조회·비활성화할 수 있어야 합니다. 그래야 팀 구성원을 체계적으로 관리할 수 있습니다.

#### 인수 기준

1. THE System SHALL 선수 등록 시 이름, 등번호, 생년월일(선택), 연락처(선택) 필드를 저장한다.
2. WHEN Operator가 이미 사용 중인 등번호로 선수를 등록하려 할 때, THE System SHALL 중복 등번호 오류 메시지를 반환한다.
3. WHEN Operator가 선수 정보를 수정할 때, THE System SHALL 변경된 정보를 즉시 반영하고 기존 경기 기록은 유지한다.
4. WHEN Operator가 선수를 비활성화할 때, THE System SHALL 해당 선수를 신규 스쿼드 배정 및 라인업 배정 목록에서 제외한다.
5. WHILE 선수가 비활성화 상태일 때, THE System SHALL 해당 선수의 기존 경기 기록과 통계를 보존한다.
6. THE System SHALL 선수 목록을 이름, 등번호 기준으로 정렬하여 표시한다.
7. IF 필수 필드(이름, 등번호)가 누락된 채 선수 등록이 요청되면, THEN THE System SHALL 누락된 필드를 명시한 오류 메시지를 반환한다.

---

### 요구사항 2: 시즌 관리

**사용자 스토리:** 팀 운영자로서, 시즌을 생성·수정·조회할 수 있어야 합니다. 그래야 연도별·대회별로 팀 활동을 구분하여 관리할 수 있습니다.

#### 인수 기준

1. THE System SHALL 시즌 생성 시 시즌명, 시작일, 종료일 필드를 저장한다.
2. IF 시작일이 종료일보다 늦은 시즌 생성이 요청되면, THEN THE System SHALL 날짜 범위 오류 메시지를 반환한다.
3. THE System SHALL 시즌 목록을 시작일 기준 내림차순으로 표시한다.
4. WHEN Operator가 시즌을 종료 상태로 변경할 때, THE System SHALL 해당 시즌에 신규 경기를 추가할 수 없도록 한다.
5. WHILE 시즌이 활성 상태일 때, THE System SHALL 해당 시즌에 경기를 추가할 수 있도록 한다.

---

### 요구사항 3: 스쿼드 관리

**사용자 스토리:** 팀 운영자로서, 시즌별 스쿼드에 선수를 배정·제거할 수 있어야 합니다. 그래야 시즌마다 참가 선수를 유연하게 구성할 수 있습니다.

#### 인수 기준

1. THE System SHALL 특정 시즌의 스쿼드에 활성 상태의 선수만 추가할 수 있도록 한다.
2. WHEN Operator가 스쿼드에 선수를 추가할 때, THE System SHALL 해당 선수가 이미 동일 시즌 스쿼드에 포함되어 있으면 중복 추가 오류 메시지를 반환한다.
3. THE System SHALL 특정 시즌의 스쿼드 선수 목록을 등번호 기준 오름차순으로 표시한다.
4. WHEN Operator가 스쿼드에서 선수를 제거할 때, THE System SHALL 해당 선수가 해당 시즌의 경기 라인업에 배정된 경우 제거 불가 오류 메시지를 반환한다.
5. THE System SHALL 한 선수가 여러 시즌의 스쿼드에 동시에 포함될 수 있도록 한다.

---

### 요구사항 4: 경기 관리

**사용자 스토리:** 팀 운영자로서, 시즌에 속하는 경기를 생성·수정·조회할 수 있어야 합니다. 그래야 경기 일정과 결과를 체계적으로 기록할 수 있습니다.

#### 인수 기준

1. THE System SHALL 경기 생성 시 시즌, 상대팀명, 경기 일시, 경기장(선택), 홈/원정 구분 필드를 저장한다.
2. WHEN Operator가 경기를 생성할 때, THE System SHALL 해당 시즌이 활성 상태인 경우에만 경기 생성을 허용한다.
3. THE System SHALL 경기 목록을 경기 일시 기준 내림차순으로 표시한다.
4. WHEN Operator가 경기 상태를 '완료'로 변경할 때, THE System SHALL 해당 경기의 모든 period에 라인업이 배정되어 있는지 확인하고, 미배정 period가 있으면 경고 메시지를 표시한다.
5. IF 필수 필드(시즌, 상대팀명, 경기 일시)가 누락된 채 경기 생성이 요청되면, THEN THE System SHALL 누락된 필드를 명시한 오류 메시지를 반환한다.

---

### 요구사항 5: 경기 Period 관리

**사용자 스토리:** 팀 운영자로서, 경기별로 period(전반/후반/쿼터 등)를 정의할 수 있어야 합니다. 그래야 경기 구조에 맞게 라인업과 이벤트를 period 단위로 기록할 수 있습니다.

#### 인수 기준

1. THE System SHALL 경기 생성 시 period 수(1~4)와 각 period의 레이블(예: "전반", "후반", "1쿼터")을 함께 정의할 수 있도록 한다.
2. THE System SHALL 각 period에 순서 번호(1부터 시작)를 부여하여 저장한다.
3. WHEN Operator가 period를 추가할 때, THE System SHALL 해당 경기가 '완료' 상태이면 추가를 거부하고 오류 메시지를 반환한다.
4. THE System SHALL period 목록을 순서 번호 기준 오름차순으로 표시한다.
5. IF 동일한 경기 내에서 중복된 period 레이블로 생성이 요청되면, THEN THE System SHALL 중복 레이블 오류 메시지를 반환한다.

---

### 요구사항 6: 포메이션 관리

**사용자 스토리:** 팀 운영자로서, 포메이션 템플릿을 등록하고 각 포메이션의 포지션 슬롯을 정의할 수 있어야 합니다. 그래야 period별 라인업 배정 시 포메이션을 선택하여 사용할 수 있습니다.

#### 인수 기준

1. THE System SHALL 포메이션 생성 시 포메이션명(예: "4-3-3")과 포지션 슬롯 목록(포지션 코드, 좌표 x, 좌표 y)을 저장한다.
2. THE System SHALL 포메이션당 포지션 슬롯 수를 최소 1개, 최대 11개로 제한한다.
3. IF 동일한 포메이션 내에서 중복된 포지션 코드로 슬롯 생성이 요청되면, THEN THE System SHALL 중복 포지션 코드 오류 메시지를 반환한다.
4. THE System SHALL 기본 제공 포메이션(4-4-2, 4-3-3, 3-5-2)을 시스템 초기화 시 자동으로 생성한다.
5. WHEN Operator가 포메이션을 삭제하려 할 때, THE System SHALL 해당 포메이션이 기존 라인업에서 사용 중이면 삭제를 거부하고 오류 메시지를 반환한다.

---

### 요구사항 7: Period별 라인업 배정

**사용자 스토리:** 팀 운영자로서, 각 period마다 포메이션을 선택하고 포지션 슬롯에 선수를 배정할 수 있어야 합니다. 그래야 period별 선수 포지션 기록을 보존하고 이후 분석에 활용할 수 있습니다.

#### 인수 기준

1. WHEN Operator가 period에 라인업을 배정할 때, THE System SHALL 해당 경기가 속한 시즌의 스쿼드에 포함된 선수만 배정 가능하도록 한다.
2. THE System SHALL 동일한 period 내에서 한 선수를 두 개 이상의 포지션 슬롯에 중복 배정하는 것을 거부하고 오류 메시지를 반환한다.
3. THE System SHALL 서로 다른 period에서 동일한 선수가 서로 다른 포지션 슬롯에 배정되는 것을 허용한다.
4. WHEN Operator가 period의 라인업을 저장할 때, THE System SHALL 각 Lineup_Entry를 (period_id, position_slot_id, player_id)의 조합으로 저장한다.
5. THE System SHALL period별 라인업 화면에서 포메이션 다이어그램 위에 선수 이름과 등번호를 포지션 슬롯 좌표에 맞게 표시한다.
6. WHEN Operator가 기존 라인업의 포지션 슬롯 배정을 변경할 때, THE System SHALL 해당 period에 이미 기록된 Match_Event의 포지션 귀속 정보를 함께 업데이트한다. **(Phase 2에서 구현 — MVP에서는 match_events 테이블이 없음)**
7. IF 포메이션이 선택되지 않은 상태에서 라인업 저장이 요청되면, THEN THE System SHALL 포메이션 미선택 오류 메시지를 반환한다.

---

### 요구사항 8: 경기 이벤트 기록 (MVP 제외 — Phase 2)

> **MVP 범위 외**: 경기 중 이벤트 타임라인("1쿼터 12분 고건 골" 등)은 Phase 2에서 구현합니다. MVP에서는 경기 후 선수별 총합 기록(요구사항 9)으로 대체합니다.

---

### 요구사항 9: 경기 후 선수 기록 입력

**사용자 스토리:** 팀 운영자로서, 경기 종료 후 선수별 총합 기록을 입력할 수 있어야 합니다. 그래야 실시간 이벤트 기록 없이도 선수별 성과를 관리할 수 있습니다.

#### 인수 기준

1. THE System SHALL 경기별 선수 기록 입력 시 match_id, player_id, played, minutes_played, goals, assists, yellow_cards, red_cards, memo 필드를 저장한다.
2. THE System SHALL 해당 경기의 시즌 스쿼드에 포함된 선수만 기록 입력 대상으로 표시한다.
3. THE System SHALL goals, assists, yellow_cards, red_cards가 0 이상의 정수인지 검증하며, 조건을 만족하지 않으면 오류 메시지를 반환한다.
4. THE System SHALL 한 경기에서 한 선수에 대해 하나의 player_match_stats 레코드만 허용하며, 중복 입력 시 오류 메시지를 반환한다.
5. THE System SHALL player_match_stats의 골/도움 기록을 특정 period 또는 position_slot에 자동 귀속하지 않는다.
6. WHEN 선수가 period_lineups에 배정되어 있으나 player_match_stats가 없는 경우, THE System SHALL 해당 선수를 기록 미입력 상태로 표시한다.

---

### 요구사항 10: 대시보드

**사용자 스토리:** 팀 운영자로서, 팀 성과, 선수 랭킹, 포지션별 성과, 시즌 요약을 한눈에 볼 수 있어야 합니다. 그래야 팀 운영 현황을 빠르게 파악하고 의사결정에 활용할 수 있습니다.

#### 인수 기준

1. THE System SHALL 대시보드에 현재 활성 시즌의 승·무·패 기록과 득점·실점 합계를 표시한다.
2. THE System SHALL 대시보드에 현재 활성 시즌 기준 골 수 상위 5명의 선수 랭킹을 표시한다 (player_match_stats 기반).
3. THE System SHALL 대시보드에 선수별 성과 섹션을 제공하며, 특정 선수 선택 시 해당 선수의 시즌 누적 출전 횟수, 출전 시간, 골, 도움 을 표시한다.
4. THE System SHALL 대시보드에 포메이션별 성과 섹션을 제공하며, 포메이션별 사용 횟수를 표시한다. **(MVP에서는 포메이션 사용 period의 팀 득점 합계 대신, 해당 포메이션이 사용된 경기의 our_score 합계로 대체)**
5. THE System SHALL 대시보드에 시즌 선택 필터를 제공하여 특정 시즌의 요약 데이터를 조회할 수 있도록 한다.
6. WHEN Operator가 대시보드를 열 때, THE System SHALL 가장 최근 활성 시즌의 데이터를 기본값으로 표시한다.
7. THE System SHALL 대시보드 데이터를 player_match_stats 저장 후 5초 이내에 반영한다.

---

### 요구사항 11: 데이터 무결성 및 관계형 구조

**사용자 스토리:** 팀 운영자로서, 데이터가 항상 일관성 있게 유지되어야 합니다. 그래야 잘못된 데이터로 인한 분석 오류를 방지할 수 있습니다.

#### 인수 기준

1. THE System SHALL PostgreSQL 외래 키 제약 조건을 사용하여 Player, Season, Squad, Match, Period, Formation, Lineup_Entry, Match_Event 간의 참조 무결성을 보장한다.
2. WHEN 상위 레코드(예: 경기)가 삭제될 때, THE System SHALL 연관된 하위 레코드(period, 라인업, 이벤트)를 CASCADE 방식으로 함께 삭제한다.
3. THE System SHALL 모든 테이블에 생성 일시(created_at)와 수정 일시(updated_at) 컬럼을 포함한다.
4. THE System SHALL Supabase Row Level Security(RLS) 정책을 적용하여 인증된 Operator만 데이터를 수정할 수 있도록 한다.
5. IF 외래 키 참조가 존재하지 않는 레코드를 가리키는 데이터 삽입이 시도되면, THEN THE System SHALL 참조 무결성 오류 메시지를 반환한다.

---

## Phase 1 Match Data Addendum

- The system shall calculate match result from `our_score` and `opponent_score` instead of storing a separate result column, preventing conflicts between score and result.
- The system shall store four optional MOM selections on each match: overall match MOM, defense MOM, midfield MOM, and attack MOM.
- Each MOM value shall reference a player record and may be empty for older or incomplete match records.

## Guest Player Addendum

- The system shall distinguish regular members and guest players with `players.player_type`, using `member` for regular players and `guest` for guest players.
- The system shall default new player records to `member` unless the operator explicitly creates a guest player.
- The system shall store guest players in `players` and shall continue to save lineups, MOM selections, and match stats by `player_id`, not by free-text guest names.
- The lineup screen shall provide a `+ 용병 추가` action for approved editors.
- When an approved editor adds a guest from the lineup screen, the system shall create a `players` row with `player_type = 'guest'` and immediately add that player to the current season's `squad_members`.
- If the editor does not provide a number for a guest player, the system shall automatically assign the next available 9000-range temporary number.
- Guest players assigned to a period lineup shall be draggable into formation slots like regular players and shall be eligible for `player_match_stats` entry.
- Guest players shall be visually marked with a `용병` badge in operational screens where regular and guest players appear together.
- The system may store an optional player memo for guest context, such as referral, role, or first participation note.
