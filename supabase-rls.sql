alter table players enable row level security;
alter table seasons enable row level security;
alter table squad_members enable row level security;
alter table matches enable row level security;
alter table periods enable row level security;
alter table formations enable row level security;
alter table position_slots enable row level security;
alter table period_lineups enable row level security;
alter table player_match_stats enable row level security;
alter table position_performance enable row level security;

drop policy if exists "public read players" on players;
drop policy if exists "authenticated write players" on players;
create policy "public read players" on players for select using (true);
create policy "authenticated write players" on players for all to authenticated using (true) with check (true);

drop policy if exists "public read seasons" on seasons;
drop policy if exists "authenticated write seasons" on seasons;
create policy "public read seasons" on seasons for select using (true);
create policy "authenticated write seasons" on seasons for all to authenticated using (true) with check (true);

drop policy if exists "public read squad_members" on squad_members;
drop policy if exists "authenticated write squad_members" on squad_members;
create policy "public read squad_members" on squad_members for select using (true);
create policy "authenticated write squad_members" on squad_members for all to authenticated using (true) with check (true);

drop policy if exists "public read matches" on matches;
drop policy if exists "authenticated write matches" on matches;
create policy "public read matches" on matches for select using (true);
create policy "authenticated write matches" on matches for all to authenticated using (true) with check (true);

drop policy if exists "public read periods" on periods;
drop policy if exists "authenticated write periods" on periods;
create policy "public read periods" on periods for select using (true);
create policy "authenticated write periods" on periods for all to authenticated using (true) with check (true);

drop policy if exists "public read formations" on formations;
drop policy if exists "authenticated write formations" on formations;
create policy "public read formations" on formations for select using (true);
create policy "authenticated write formations" on formations for all to authenticated using (true) with check (true);

drop policy if exists "public read position_slots" on position_slots;
drop policy if exists "authenticated write position_slots" on position_slots;
create policy "public read position_slots" on position_slots for select using (true);
create policy "authenticated write position_slots" on position_slots for all to authenticated using (true) with check (true);

drop policy if exists "public read period_lineups" on period_lineups;
drop policy if exists "authenticated write period_lineups" on period_lineups;
create policy "public read period_lineups" on period_lineups for select using (true);
create policy "authenticated write period_lineups" on period_lineups for all to authenticated using (true) with check (true);

drop policy if exists "public read player_match_stats" on player_match_stats;
drop policy if exists "authenticated write player_match_stats" on player_match_stats;
create policy "public read player_match_stats" on player_match_stats for select using (true);
create policy "authenticated write player_match_stats" on player_match_stats for all to authenticated using (true) with check (true);

drop policy if exists "public read position_performance" on position_performance;
drop policy if exists "authenticated write position_performance" on position_performance;
create policy "public read position_performance" on position_performance for select using (true);
create policy "authenticated write position_performance" on position_performance for all to authenticated using (true) with check (true);
