create table if not exists public.team_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor',
  created_at timestamptz not null default now()
);

alter table public.team_editors enable row level security;
alter table public.players enable row level security;
alter table public.seasons enable row level security;
alter table public.squad_members enable row level security;
alter table public.matches enable row level security;
alter table public.periods enable row level security;
alter table public.formations enable row level security;
alter table public.position_slots enable row level security;
alter table public.period_lineups enable row level security;
alter table public.player_match_stats enable row level security;
alter table public.position_performance enable row level security;

drop policy if exists "editors can read team_editors" on public.team_editors;
create policy "editors can read team_editors"
  on public.team_editors
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "public read players" on public.players;
drop policy if exists "authenticated write players" on public.players;
drop policy if exists "editors write players" on public.players;
create policy "public read players" on public.players for select using (true);
create policy "editors write players" on public.players for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read seasons" on public.seasons;
drop policy if exists "authenticated write seasons" on public.seasons;
drop policy if exists "editors write seasons" on public.seasons;
create policy "public read seasons" on public.seasons for select using (true);
create policy "editors write seasons" on public.seasons for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read squad_members" on public.squad_members;
drop policy if exists "authenticated write squad_members" on public.squad_members;
drop policy if exists "editors write squad_members" on public.squad_members;
create policy "public read squad_members" on public.squad_members for select using (true);
create policy "editors write squad_members" on public.squad_members for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read matches" on public.matches;
drop policy if exists "authenticated write matches" on public.matches;
drop policy if exists "editors write matches" on public.matches;
create policy "public read matches" on public.matches for select using (true);
create policy "editors write matches" on public.matches for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read periods" on public.periods;
drop policy if exists "authenticated write periods" on public.periods;
drop policy if exists "editors write periods" on public.periods;
create policy "public read periods" on public.periods for select using (true);
create policy "editors write periods" on public.periods for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read formations" on public.formations;
drop policy if exists "authenticated write formations" on public.formations;
drop policy if exists "editors write formations" on public.formations;
create policy "public read formations" on public.formations for select using (true);
create policy "editors write formations" on public.formations for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read position_slots" on public.position_slots;
drop policy if exists "authenticated write position_slots" on public.position_slots;
drop policy if exists "editors write position_slots" on public.position_slots;
create policy "public read position_slots" on public.position_slots for select using (true);
create policy "editors write position_slots" on public.position_slots for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read period_lineups" on public.period_lineups;
drop policy if exists "authenticated write period_lineups" on public.period_lineups;
drop policy if exists "editors write period_lineups" on public.period_lineups;
create policy "public read period_lineups" on public.period_lineups for select using (true);
create policy "editors write period_lineups" on public.period_lineups for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read player_match_stats" on public.player_match_stats;
drop policy if exists "authenticated write player_match_stats" on public.player_match_stats;
drop policy if exists "editors write player_match_stats" on public.player_match_stats;
create policy "public read player_match_stats" on public.player_match_stats for select using (true);
create policy "editors write player_match_stats" on public.player_match_stats for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));

drop policy if exists "public read position_performance" on public.position_performance;
drop policy if exists "authenticated write position_performance" on public.position_performance;
drop policy if exists "editors write position_performance" on public.position_performance;
create policy "public read position_performance" on public.position_performance for select using (true);
create policy "editors write position_performance" on public.position_performance for all to authenticated
  using (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()))
  with check (exists (select 1 from public.team_editors editor where editor.user_id = auth.uid()));
