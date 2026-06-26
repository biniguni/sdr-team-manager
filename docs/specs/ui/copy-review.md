# UI Copy Review

This is a temporary working document for Korean UI copy cleanup.

Use this file to review current UI text before code changes are finalized.
Fill in `Owner change` with the final wording to apply.

## Review Rules

- This is not a word-by-word translation pass.
- Rewrite longer English subtitles, empty states, permission notices, and helper
  text in natural Korean for the team-management context.
- Keep natural football terms where they are clearer, such as `라인업`, `MOM`,
  and `스쿼드`.
- Use `기록` for entered match/player data.
- Use `통계` for aggregated summaries or future analysis screens.
- Decide whether `매치 로스터` should stay as-is or become `경기 명단`.

## Term Decisions

| Term or area | Current / draft | Suggested | Owner change |
| --- | --- | --- | --- |
| Dashboard | 대시보드 | 대시보드 | 대시보드 |
| Seasons | 시즌 | 시즌 or 시즌 관리 | 시즌 |
| Players | 선수 | 선수 or 선수 관리 | 선수 관리 |
| Formations | 포메이션 | 포메이션 or 포메이션 관리 | 포메이션 |
| Ranking | 순위 | 순위 |  |
| Match roster | 매치 로스터 | 매치 로스터 or 경기 명단 | 매치 로스터 |
| Stats, data entry | 선수 기록 | 선수 기록 | Stats |
| Stats, summaries | 통계 | 통계 | Stats |
| Read-only access | 읽기 전용 접근 | 편집 권한 필요 |  |
| Editor login | 편집자 로그인 | 편집자 로그인 | Editor login |
| Editor mode | 편집자 모드 | 편집자 모드 | Editor mode |

## Common Navigation And Account

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Desktop/mobile nav | Dashboard | 대시보드 | 대시보드 |
| Desktop/mobile nav | 라인업 | 라인업 | 라인업 |
| Desktop/mobile nav | Seasons | 시즌 | 시즌 |
| Desktop/mobile nav | Players | 선수 | 선수 |
| Desktop/mobile nav | Formations | 포메이션 | 포메이션 |
| Desktop/mobile nav | Ranking | 순위 |  |
| Account state | Editor mode | 편집자 모드 | Editor mode |
| Account state | Signed in | 로그인됨 | 로그인됨 |
| Account action | Sign out | 로그아웃 | 로그아웃 |
| Account link | Editor login | 편집자 로그인 |  |
| Mobile menu button | Menu | 메뉴 | 메뉴 |

## Login

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Login title | Operator login | 운영자 로그인 or 편집자 로그인 |  |
| Login description | Sign in with a Supabase Auth account to manage team records. | 팀 기록을 관리하려면 승인된 계정으로 로그인하세요. | 기록을 관리하려면 인증된 계정으로 로그인하길 바랍니다. |
| Form label | Email | 이메일 | 이메일 |
| Form label | Password | 비밀번호 | 비밀번호 |
| Button | Sign in | 로그인 | 로그인 |
| Pending button | Signing in... | 로그인 중... | 로그인 중... |
| Error | Email and password are required. | 이메일과 비밀번호를 입력하세요. | 이메일과 비밀번호를 입력하세요. |

## Dashboard

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Empty title | SANDRO FC Dashboard | SANDRO FC 대시보드 | SANDRO FC 대시보드 |
| Empty description | Create a season first to view dashboard metrics. | 대시보드를 보려면 시즌을 먼저 생성하세요. | 대시보드를 보려면 시즌을 먼저 생성하세요. |
| Page title | SANDRO FC Season Dashboard | SANDRO FC 시즌 대시보드 or 시즌 대시보드 | SANDRO FC 시즌 현황 |
| Page subtitle | `{season} performance summary` | `{season} 성과 요약` or `{season} 시즌 요약` | `{season} 시즌 요약` |
| Season filter | Season | 시즌 | 시즌 |
| Summary stat | Win rate | 승률 | 승률 |
| Summary stat | Goals | 득실 | 득실 |
| Summary stat | Diff | 득실차 | 득실차 |
| Recent label | Recent | 최근 경기 | 최근 경기 |
| Empty recent | No scored matches yet. | 점수가 입력된 경기가 없습니다. | 진행된 경기가 없습니다. |
| Stat card | Top scorer | 득점 1위 | 득점 1위 |
| Stat card | Top assister | 도움 1위 | 도움 1위 |
| Stat card | Attack points | 공격포인트 1위 | 공격포인트 1위 |
| Stat card | Most played | 최다 출전 | 최다 출전 |
| Empty card | No data yet | 아직 데이터가 없습니다 | 데이터가 없습니다. |
| Match panel title | Match History | 경기 기록 or 경기 내역 | 경기 기록 |
| Empty matches | No matches found for this season. | 이 시즌에 등록된 경기가 없습니다. | 등록된 경기가 없습니다. |

## Players

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Page title | Players | 선수 or 선수 관리 | 선수 관리 |
| Page subtitle | Register players once, then reuse them across seasons, squads, lineups, and match records. | 선수를 한 번 등록하면 시즌 스쿼드, 라인업, 경기 기록에서 계속 사용할 수 있습니다. | 선수 등록 시 스쿼드, 라인업, 경기 기록에서 계속 확인 가능합니다. |
| Form title | Add player | 선수 추가 | 선수 추가 |
| Button | Add player | 선수 추가 | 선수 추가 |
| Read-only title | Read-only access | 편집 권한 필요 | 편집 권한 필요 |
| Read-only description | Sign in with an approved editor account to add or update players. | 선수를 추가하거나 수정하려면 승인된 편집자 계정으로 로그인하세요. |  |
| List title | Player list | 선수 목록 | 선수 목록 |
| Filter | Active | 활성 | 활동 중 |
| Filter | All | 전체 | 전체 |
| Filter | Inactive | 비활성 | 휴식 중 |
| Badge | Active | 활성 | 활동 중 |
| Badge | Inactive | 비활성 | 휴식 중 |
| Player type | Member | 정규 선수 | 선수 |
| Button | Save changes | 변경사항 저장 | 변경사항 저장 |
| Button | Deactivate | 비활성화 | 비활성화 |
| Empty state | No players found. | 조건에 맞는 선수가 없습니다. | 조건에 맞는 선수가 없습니다. |
| Input placeholder | Player name | 선수 이름 | 선수명 |
| Input placeholder | Number | 등번호 | 등번호 |
| Field label | Left foot | 왼발 | 왼발 |
| Field label | Right foot | 오른발 | 오른발 |
| Checkbox | Active | 활성 상태 | 활동여부 |

## Seasons

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Page title | Seasons | 시즌 or 시즌 관리 | 시즌 관리 |
| Page subtitle | A season groups the squad and matches for one operating period. | 시즌은 특정 기간의 스쿼드와 경기를 함께 관리하는 단위입니다. | 특정 기간의 스쿼드와 경기를 함께 관리합니다. |
| Form title | Create season | 시즌 생성 | 시즌 생성 |
| Input placeholder | Season name | 시즌 이름 | 시즌명 |
| Button | Create season | 시즌 생성 | 시즌 생성 |
| Read-only title | Read-only access | 편집 권한 필요 | 편집 권한 필요 |
| Read-only description | Sign in with an approved editor account to create seasons. | 시즌을 생성하려면 승인된 편집자 계정으로 로그인하세요. | 시즌을 생성하려면 승인된 계정으로 로그인하세요. |
| List title | Season list | 시즌 목록 | 시즌 목록 |
| Date separator | to | ~ | ~ |
| Badge | Active | 활성 |  |
| Badge | Closed | 종료 |  |
| Empty state | No seasons found. | 등록된 시즌이 없습니다. | 등록된 시즌이 없습니다. |

## Season Detail

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Not found title | Season not found | 시즌을 찾을 수 없습니다 | 시즌을 찾을 수 없습니다 |
| Not found description | The selected season record does not exist. | 선택한 시즌 기록이 없습니다. | 선택한 시즌 기록이 없습니다. |
| Page subtitle | Manage season details and the season squad. | 시즌 정보와 스쿼드를 관리합니다. | 시즌 정보와 스쿼드 관리 |
| Link | Open matches | 경기 열기 or 경기 관리 | 경기 관리 |
| Panel title | Season details | 시즌 정보 | 시즌 정보 |
| Checkbox | Active | 활성 시즌 |  |
| Button | Save season | 시즌 저장 |  |
| Read-only label | Name | 이름 | 선수명 |
| Read-only label | Period | 기간 |  |
| Read-only label | Status | 상태 | 상태 |
| Status | Active | 활성 | 활동 |
| Status | Closed | 종료 |  |
| Panel title | Squad | 스쿼드 | 스쿼드 |
| Badge | `{n} players` | 선수 `{n}`명 | 선수 `{n}`명 |
| Select placeholder | Choose active player | 추가할 활성 선수 선택 |  |
| Button | Add | 추가 | 추가 |
| Button | Remove | 제거 | 삭제 |
| Empty state | No squad players yet. | 아직 스쿼드에 선수가 없습니다. | 스쿼드에 선수가 없습니다. |

## Matches List

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Page title | `{season} matches` | `{season} 경기` | `{season} 경기` |
| Page subtitle | Create matches and define the periods used for lineups. | 경기를 만들고 라인업에 사용할 쿼터를 설정합니다. | 경기 생성 및 쿼터 지정 |
| Link | Back to season | 시즌으로 돌아가기 | 돌아가기 |
| Form title | Create match | 경기 생성 | 매치 생성 |
| Input placeholder | Opponent | 상대팀 | 상대팀 |
| Input placeholder | Venue | 경기장 | 경기장 |
| Checkbox | Home match | 홈 경기 | 홈 경기 |
| Field label | Period mode | 경기 구분 |  |
| Select option | 4쿼터: 1Q / 2Q / 3Q / 4Q | 4쿼터: 1Q / 2Q / 3Q / 4Q | 4쿼터: 1Q / 2Q / 3Q / 4Q |
| Select option | 전후반: 전반 / 후반 | 전후반: 전반 / 후반 | 전후반: 전반 / 후반 |
| Textarea placeholder | Optional custom periods, one per line | 직접 입력할 쿼터명, 한 줄에 하나씩 |  |
| Button | Create match | 경기 생성 | 매치 생성 |
| Read-only title | Read-only access | 편집 권한 필요 | 편집 권한 필요 |
| Read-only description | Sign in with an approved editor account to create matches. | 경기를 생성하려면 승인된 편집자 계정으로 로그인하세요. | 경기를 생성하려면 승인된 계정으로 로그인하세요. |
| List title | Match list | 경기 목록 | 경기 목록 |
| Status | scheduled | 예정 | 다가올 경기 |
| Status | completed | 완료 | 종료 |
| Empty state | No matches found. | 등록된 경기가 없습니다. | 등록된 경기가 없습니다. |

## Match Detail

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Not found title | Match not found | 경기를 찾을 수 없습니다 |  |
| Page subtitle | Update match details, score, result, and MOM records. | 경기 정보, 점수, 결과, MOM을 관리합니다. | 경기 정보, 점수, 결과, MOM 관리 |
| Link | Back | 뒤로 | 뒤로 |
| Link | Lineup | 라인업 | 라인업 |
| Link | Stats | 선수 기록 | 선수 기록 |
| Panel title | Match details | 경기 정보 | 경기 상세 |
| Input placeholder | Venue | 경기장 | 경기장 |
| Checkbox | Home match | 홈 경기 | 홈 경기 |
| Input placeholder | Sandro score | 산드로 점수 | 산드로 점수 |
| Input placeholder | Opponent score | 상대 점수 | 상대 점수 |
| MOM option | Not selected | 선택 안 함 | 선택 안 함 |
| MOM label | Match MOM | 경기 MOM | 경기 MOM |
| MOM label | Defense MOM | 수비 MOM | 수비 MOM |
| MOM label | Midfield MOM | 미드필드 MOM | 미드필드 MOM |
| MOM label | Attack MOM | 공격 MOM | 공격 MOM |
| Status option | Scheduled | 예정 | 다가올 경기 |
| Status option | Completed | 완료 | 종료 |
| Permission notice | Match result permission is required to edit score, status, or MOM. | 점수, 경기 상태, MOM을 수정하려면 경기 결과 관리 권한이 필요합니다. | 점수, 경기 상태, MOM을 수정하기 위해서는 관리 권한이 필요합니다. |
| Button | Save match | 경기 저장 | 매치 저장 |
| Button | Complete with lineup check | 라인업 확인 후 경기 완료 |  |
| Read-only label | Date | 일시 | 일시 |
| Read-only label | Venue | 경기장 | 경기장 |
| Read-only label | Home/Away | 홈/원정 | 홈/원정 |
| Read-only value | Home | 홈 | 홈 |
| Read-only value | Away | 원정 | 원정 |
| Read-only label | Score | 점수 | 점수 |
| Panel title | Periods | 쿼터 | 쿼터 |
| Empty state | No periods found. | 등록된 쿼터가 없습니다. | 등록된 쿼터가 없습니다. |

## Lineup

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Page title | 라인업 | 라인업 | 라인업 |
| Page subtitle | `{season}의 경기 전 라인업을 쿼터별로 준비합니다.` | `{season}의 경기 전 라인업을 쿼터별로 준비합니다.` | 경기 전 라인업 쿼터별로 준비 |
| Link | 경기 관리 | 경기 관리 |  |
| Section title | 경기 선택 | 경기 선택 |  |
| Count | `{n} matches` | `{n}경기` | `{n}경기` |
| Selected match link | 경기 상세 | 경기 상세 | 경기 상세 |
| Selected match link | 결과 입력 | 결과 입력 | 결과 입력 |
| Selected match link | 결과 입력 권한 필요 | 결과 입력 권한 필요 | 권한 필요 |
| Selected match link | 선수 기록 | 선수 기록 | 선수 기록 |
| Selected match link | 선수 기록 권한 필요 | 선수 기록 권한 필요 | 권한 필요 |
| Field label | Formation | 포메이션 | 포메이션 |
| Save status | 저장되지 않은 변경사항 | 저장되지 않은 변경사항 | 저장되지 않은 변경사항 |
| Save status | `{period} 저장됨` | `{period} 저장됨 | `{period} 저장됨 |
| Save status | Period 없음 | 쿼터 없음 |  |
| Button | 되돌리기 | 되돌리기 | 되돌리기 |
| Button | Save lineup | 라인업 저장 | 라인업 저장 |
| Pending button | Saving... | 저장 중... | 저장 중... |
| Board title | Pitch | 피치 | 필드 |
| Count | `{n}/{total} assigned` | `{n}/{total} 배정` | `{n}/{total} 등록` |
| Panel title | Positions | 포지션 | 포지션 |
| Count | `{n} unassigned` | 미배정 `{n}`명 | 미배정 `{n}`명 |
| Button | Add guest | 용병 추가 | 용병 추가 |
| Panel title | Match roster | 매치 로스터 or 경기 명단 | 선발 명단 |
| Helper text | Only these players can be assigned to this match lineup. | 이 경기에 추가된 선수만 라인업에 배정할 수 있습니다. | 경기에 추가된 선수만 라인업에 등록할 수 있습니다. |
| Count | `{n} players` | `{n}`명 | `{n}`명 |
| Select placeholder | Add player to match | 경기에 추가할 선수 선택 | 경기에 추가할 선수 선택 |
| Button | Add | 추가 | 추가 |
| Button | Remove | 제거 | 제거 |
| Empty roster | Add players before assigning positions. | 포지션을 배정하기 전에 선수를 먼저 추가하세요. | 포지션을 배정하기 전에 선수를 먼저 추가하세요. |
| Empty slot | Empty | 비어 있음 | 비어 있음 |
| Section title | Unassigned | 미배정 선수 | 미출전 선수 |
| Empty unassigned | All selected players are on the board. | 선택된 선수가 모두 피치에 배정되었습니다. | 선택된 선수가 모두 필드에 있습니다. |
| Error | Create match periods before saving a lineup. | 라인업을 저장하려면 경기 쿼터를 먼저 생성하세요. | 라인업을 저장하려면 쿼터를 먼저 생성하세요. |
| Error | Create at least one formation before saving a lineup. | 라인업을 저장하려면 포메이션을 하나 이상 생성하세요. | 라인업을 저장하려면 포메이션을 하나 이상 생성하세요. |
| Error | Add players to this season squad before saving a lineup. | 라인업을 저장하려면 시즌 스쿼드에 선수를 먼저 추가하세요. | 라인업을 저장하려면 스쿼드에 선수를 먼저 추가하세요. |
| Error | Add players to this match roster before saving a lineup. | 라인업을 저장하려면 매치 로스터에 선수를 먼저 추가하세요. | 라인업을 저장하려면 선발 명단에 선수를 먼저 추가하세요. |
| Permission notice | Sign in with an approved editor account to update the lineup. | 라인업을 수정하려면 승인된 편집자 계정으로 로그인하세요. | 라인업을 수정하려면 승인된 계정으로 로그인하세요. |
| Guest modal title | Add guest | 용병 추가 | 용병 추가 |
| Guest modal helper | The guest will be added to this season squad. | 이 경기 라인업에서만 사용할 임시 선수를 추가합니다. | 이 경기 라인업에서만 사용할 임시 선수를 추가합니다. |
| Button | Close | 닫기 | 닫기 |
| Field label | Name | 이름 | 이름 |
| Placeholder | Guest name | 용병 이름 | 용병 이름 |
| Field label | Number | 등번호 | 등번호 |
| Placeholder | Leave blank for an automatic 9000-range number | 비워도 됩니다 | 비워도 됩니다 |
| Pending button | Adding... | 추가 중... | 추가 중...  |
| Picker empty | No player assigned | 배정된 선수가 없습니다 | 배정된 선수가 없습니다. |
| Picker action | Clear position | 포지션 비우기 | 포지션 비우기 |
| Picker status | assigned | 배정됨 | 등록됨 |
| Picker empty | Add players to the match roster first. | 매치 로스터에 선수를 먼저 추가하세요. | 선수 명단에 선수를 먼저 추가하세요. |

## Player Match Records

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Not found title | Match not found | 경기를 찾을 수 없습니다 | 경기를 찾을 수 없습니다. |
| Not found description | The selected match record does not exist. | 선택한 경기 기록이 없습니다. | 선택한 경기 기록이 없습니다. |
| Page title | `{opponent} stats` | `{opponent} 선수 기록` |  |
| Page subtitle | Enter post-match player totals for lineup-assigned squad players. | 라인업에 배정된 선수의 경기 후 기록을 입력합니다. | 라인업에 배정된 선수의 경기 후 기록을 입력합니다. |
| Link | Back to match | 경기로 돌아가기 |  |
| Link | Lineup | 라인업 | 라인업 |
| Section title | Player records | 선수 기록 | 선수 기록 |
| Helper text | Players assigned in any period lineup can receive match stats. Unassigned squad players are shown for context. | 한 쿼터라도 라인업에 배정된 선수만 기록을 입력할 수 있습니다. 미배정 선수는 확인용으로 표시됩니다. |  |
| Badge | Lineup assigned | 라인업 배정 | 라인업 등록 |
| Badge | Not in lineup | 라인업 미배정 | 라인업 미등록 |
| Badge | Not entered | 미입력 | 미입력 |
| Badge | Entered | 입력 완료 | 입력 완료 |
| Checkbox | Played | 출전 | 출전 |
| Field label | Goals | 득점 | 득점 |
| Field label | Assists | 도움 | 도움 |
| Field label | Yellow | 경고 | 경고 |
| Field label | Red | 퇴장 | 퇴장 |
| Button | Save stats | 선수 기록 저장 | 선수 기록 저장 |
| Permission notice | Match result permission is required to update stats. | 선수 기록을 수정하려면 경기 결과 관리 권한이 필요합니다. | 선수 기록을 수정하려면 권한이 필요합니다. |
| Empty state | No squad players found for this season. | 이 시즌의 스쿼드 선수가 없습니다. | 해당 시즌의 스쿼드 선수가 없습니다. |

## Ranking

| Screen | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Empty state | Create a season first to view rankings. | 순위를 보려면 시즌을 먼저 생성하세요. | 개인 기록 순위를 보려면 시즌을 먼저 생성하세요. |
| Page title | Personal Ranking | 개인 기록 순위 | 개인 기록 순위 |
| Page subtitle | Appearances, goals, assists, clean sheets, and MOM for `{season}` | `{season}의 출전, 득점, 도움, 무실점, MOM을 확인합니다. | `{season}의 출전, 득점, 도움, 무실점, MOM을 확인합니다. |
| Table header | Rank | 순위 | 순위 |
| Table header | Player | 선수 | 선수 |
| Table header | No. | 등번호 | 등번호 |
| Table header | Matches | 출전 | 출전 |
| Table header | Goals | 득점 | 득점 |
| Table header | Assists | 도움 | 도움 |
| Table header | MOM | MOM | MOM |
| Player detail title | Personal record | 개인 기록 | 개인 기록 |
| Detail card | Appearances | 출전 | 출전 |
| Detail card | Win rate | 승률 | 승률 |
| Detail card | Clean sheets | 무실점 | 무실점 |
| Detail chart tab | Appearance trend | 출전수 | 출전수 |
| Detail chart tab | Goals trend | 득점 | 득점 |
| Detail chart tab | Assists trend | 도움 | 도움 |
| Detail section | Position analysis | 포지션 분석 | 포지션 분석 |
| Detail section | Opponent records | 상대팀 성적 | 상대팀 성적 |
| Button | Close detail | 닫기 | 닫기 |
| Empty table | No player stats yet. | 아직 선수 기록이 없습니다. | 선수 기록이 없습니다. |

## Server Action Messages

These messages may appear after form submissions or failed permission checks.

| Area | Current / original | Suggested draft | Owner change |
| --- | --- | --- | --- |
| Auth | Email and password are required. | 이메일과 비밀번호를 입력하세요. | 이메일과 비밀번호를 입력하세요. |
| Permission | Approved editor access is required. | 승인된 편집자 권한이 필요합니다. | 승인된 편집자 권한이 필요합니다. |
| Permission | Match result permission is required. | 경기 결과 관리 권한이 필요합니다. | 경기 결과 관리 권한이 필요합니다. |
| Player | Player name is required. | 선수명을 입력하세요. | 선수명을 입력하세요. |
| Player | Player number is required. | 등번호를 입력하세요. | 등번호를 입력하세요. |
| Player | Foot scores must be between 1 and 5. | 왼발/오른발 점수는 1부터 5까지 입력하세요. | 왼발/오른발 점수는 1부터 5까지 입력하세요. |
| Player | That player number is already in use. | 이미 사용 중인 등번호입니다. | 이미 사용 중인 등번호입니다. |
| Player | Player id is missing. | 선수 정보가 없습니다. | 선수 정보가 없습니다. |
| Season | Season name, start date, and end date are required. | 시즌 이름, 시작일, 종료일을 입력하세요. | 시즌 이름, 시작일, 종료일을 입력하세요. |
| Season | Season end date must be on or after the start date. | 시즌 종료일은 시작일과 같거나 이후여야 합니다. | 시즌 종료일은 시작일과 같거나 이후여야 합니다. |
| Season | Season id is missing. | 시즌 정보가 없습니다. | 시즌 정보가 없습니다. |
| Squad | Choose an active player to add. | 추가할 활성 선수를 선택하세요. | 등록할 선수를 선택하세요. |
| Squad | Only active players can be added to a squad. | 활성 선수만 스쿼드에 추가할 수 있습니다. | 등록 선수만 스쿼드에 추가할 수 있습니다. |
| Squad | That player is already in this squad. | 이미 이 스쿼드에 포함된 선수입니다. | 이미 스쿼드에 포함된 선수입니다. |
| Squad | Squad member is missing. | 스쿼드 선수 정보가 없습니다. | 선수 정보가 없습니다. |
| Squad | This player is already used in a lineup for this season and cannot be removed. | 이 시즌 라인업에 사용된 선수라 스쿼드에서 제거할 수 없습니다. |  |
| Match | Season, opponent, and match date are required. | 시즌, 상대팀, 경기 일시를 입력하세요. | 시즌, 상대팀, 경기 일자를 입력하세요. |
| Match | Matches can only be added to active seasons. | 활성 시즌에만 경기를 추가할 수 있습니다. | 진행하는 시즌에만 경기를 추가할 수 있습니다. |
| Match | Match could not be created. | 경기를 생성하지 못했습니다. |  |
| Match | Match id, opponent, and match date are required. | 경기 정보, 상대팀, 경기 일시를 입력하세요. | 경기 정보, 상대팀, 경기 일자를 입력하세요. |
| Match | Match id is missing. | 경기 정보가 없습니다. | 경기 정보가 없습니다. |
| Match | Some periods do not have lineups yet. The match can still be saved, but completion is blocked. | 라인업이 없는 쿼터가 있어 경기를 완료할 수 없습니다. 경기 정보 저장은 가능합니다. | 라인업이 없는 쿼터가 있어 완료할 수 없습니다. 경기 정보 저장은 가능합니다. |
| Formation | A formation needs between 1 and 11 position slots. | 포메이션에는 포지션이 1개 이상 11개 이하로 필요합니다. |  |
| Formation | Each slot must use the format POSITION,x,y. | 각 줄은 포지션코드,x좌표,y좌표 형식으로 입력하세요. |  |
| Formation | Slot coordinates must be between 0 and 100. | 포지션 좌표는 0부터 100 사이여야 합니다. |  |
| Formation | Position codes must be unique within a formation. | 포메이션 안에서 포지션 코드는 중복될 수 없습니다. |  |
| Formation | Formation name is required. | 포메이션 이름을 입력하세요. | 포메이션 이름을 입력하세요. |
| Formation | That formation name already exists. | 이미 사용 중인 포메이션 이름입니다. | 이미 사용 중인 포메이션 이름입니다. |
| Formation | Formation could not be created. | 포메이션을 생성하지 못했습니다. | 포메이션을 생성하지 못했습니다. |
| Formation | Formation id is missing. | 포메이션 정보가 없습니다. | 포메이션 정보가 없습니다. |
| Formation | This formation is already used in a lineup and cannot be deleted. | 이미 라인업에 사용된 포메이션이라 삭제할 수 없습니다. |  |
| Lineup | Choose a period before saving the lineup. | 라인업을 저장하기 전에 쿼터를 선택하세요. | 라인업을 저장하기 전에 쿼터를 선택하세요. |
| Lineup | Choose a formation before saving the lineup. | 라인업을 저장하기 전에 포메이션을 선택하세요. | 라인업을 저장하기 전에 포메이션을 선택하세요. |
| Lineup | Match context is missing. | 경기 정보가 없습니다. | 경기 정보가 없습니다. |
| Lineup | Assign at least one player before saving. | 한 명 이상 배정한 뒤 저장하세요. | 한 명 이상 등록한 뒤 저장하세요. |
| Lineup | The same player cannot be assigned more than once in the same period. | 같은 쿼터에 같은 선수를 두 번 배정할 수 없습니다. | 동일한 쿼터에 같은 선수를 중복 등록할 수 없습니다. |
| Lineup | One or more selected positions do not belong to the chosen formation. | 선택한 포지션 중 현재 포메이션에 없는 항목이 있습니다. |  |
| Lineup | Only players added to this match roster can be assigned. | 매치 로스터에 추가된 선수만 배정할 수 있습니다. | 경기 명단에 추가된 선수만 배정할 수 있습니다. |
| Lineup | A player or position was assigned more than once in this period. | 같은 쿼터에서 선수 또는 포지션이 중복 배정되었습니다. | 같은 쿼터에서 선수 또는 포지션이 중복 배정되었습니다. |
| Lineup | Lineup saved. | 라인업을 저장했습니다. | 라인업을 저장했습니다. |
| Match roster | Choose a player to add to this match. | 이 경기에 추가할 선수를 선택하세요. | 이 경기 명단에 등록할 선수를 선택하세요. |
| Match roster | Only players in this season squad can be added to the match roster. | 이 시즌 스쿼드에 포함된 선수만 매치 로스터에 추가할 수 있습니다. | 이 시즌 스쿼드에 포함된 선수만 경기 명단에 추가할 수 있습니다. |
| Match roster | Player added to this match. | 선수를 이 경기에 추가했습니다. | 선수를 이 경기에 추가했습니다. |
| Match roster | Match roster context is missing. | 매치 로스터 정보가 없습니다. | 경기 명단이 없습니다. |
| Match roster | Remove this player from the period lineup before removing them from the match roster. | 매치 로스터에서 제거하기 전에 쿼터 라인업에서 먼저 제외하세요. |  |
| Match roster | Player removed from this match. | 선수를 이 경기에서 제거했습니다. |  |
| Guest | Guest name is required. | 용병 이름을 입력하세요. |  |
| Guest | Guest number must be zero or greater. | 용병 등번호는 0 이상이어야 합니다. |  |
| Guest | Guest player added: `#{number} {name}` | 용병을 추가했습니다: `#{number} {name}` |  |
| Guest | Could not assign a temporary guest number. Try entering a number manually. | 임시 등번호를 배정하지 못했습니다. 등번호를 직접 입력하세요. |  |
| Stats | Match or player context is missing. | 경기 또는 선수 정보가 없습니다. |  |
| Stats | Goals, assists, yellow cards, and red cards must be zero or greater. | 득점, 도움, 경고, 퇴장은 0 이상이어야 합니다. | 득점, 도움, 경고, 퇴장은 0 이상이어야 합니다. |
| Stats | Only players assigned to this match lineup can receive match stats. | 이 경기 라인업에 배정된 선수만 기록을 입력할 수 있습니다. |  |
| Stats | Stats saved. | 선수 기록을 저장했습니다. | 선수 기록을 저장했습니다. |

## Remaining English To Recheck

- Result labels from `calculateMatchResult`: `Win`, `Draw`, `Loss`, and any
  fallback labels should be reviewed.
- Database enum values such as `scheduled`, `completed`, `member`, and `guest`
  should stay in code/data, but visible labels should be Korean.
- Technical placeholders in formation slot examples, such as `GK,50,90`, should
  stay as-is because they are input format examples.
- Brand text such as `SANDRO FC`, `SDR Team Manager`, and `SDR Team` should be
  reviewed separately if the owner wants Korean branding.
