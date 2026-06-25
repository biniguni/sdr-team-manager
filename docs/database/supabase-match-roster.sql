create table if not exists public.match_roster (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid references public.players(id) on delete restrict,
  guest_name text,
  guest_number integer check (guest_number is null or guest_number >= 0),
  created_at timestamptz not null default now(),
  constraint match_roster_member_or_guest check (
    (player_id is not null and guest_name is null) or
    (player_id is null and guest_name is not null)
  ),
  unique (match_id, player_id)
);

alter table public.match_roster add column if not exists guest_name text;
alter table public.match_roster add column if not exists guest_number integer;
alter table public.match_roster alter column player_id drop not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'match_roster_guest_number_check') then
    alter table public.match_roster add constraint match_roster_guest_number_check
      check (guest_number is null or guest_number >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'match_roster_member_or_guest') then
    alter table public.match_roster add constraint match_roster_member_or_guest
      check (
        (player_id is not null and guest_name is null) or
        (player_id is null and guest_name is not null)
      );
  end if;

  if not exists (select 1 from pg_constraint where conname = 'match_roster_match_id_player_id_key') then
    drop index if exists public.match_roster_match_id_player_id_key;
    alter table public.match_roster add constraint match_roster_match_id_player_id_key
      unique (match_id, player_id);
  end if;
end $$;

alter table public.period_lineups add column if not exists match_roster_id uuid;
alter table public.period_lineups alter column player_id drop not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'period_lineups_match_roster_id_fkey') then
    alter table public.period_lineups add constraint period_lineups_match_roster_id_fkey
      foreign key (match_roster_id) references public.match_roster(id) on delete restrict;
  end if;

  if exists (select 1 from pg_constraint where conname = 'period_lineups_period_id_player_id_key') then
    alter table public.period_lineups drop constraint period_lineups_period_id_player_id_key;
  end if;
end $$;

create unique index if not exists period_lineups_period_id_match_roster_id_key
  on public.period_lineups(period_id, match_roster_id)
  where match_roster_id is not null;

alter table public.match_roster enable row level security;

drop policy if exists "public read match_roster" on public.match_roster;
drop policy if exists "editors write match_roster" on public.match_roster;

create policy "public read match_roster"
  on public.match_roster
  for select
  using (true);

create policy "editors write match_roster"
  on public.match_roster
  for all
  to authenticated
  using (exists (
    select 1
    from public.team_editors editor
    where editor.user_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.team_editors editor
    where editor.user_id = auth.uid()
  ));

insert into public.formations (name, is_default)
values ('4-2-3-1', true)
on conflict (name) do update set is_default = excluded.is_default;

with formation as (select id from public.formations where name = '4-2-3-1')
insert into public.position_slots (formation_id, position_code, x, y)
select formation.id, slot.position_code, slot.x, slot.y
from formation
cross join (values
  ('GK', 50, 90),
  ('LB', 15, 70),
  ('CB1', 35, 70),
  ('CB2', 65, 70),
  ('RB', 85, 70),
  ('DM1', 35, 52),
  ('DM2', 65, 52),
  ('LAM', 25, 32),
  ('CAM', 50, 28),
  ('RAM', 75, 32),
  ('ST', 50, 12)
) as slot(position_code, x, y)
on conflict (formation_id, position_code) do update
set x = excluded.x,
    y = excluded.y;
