create table if not exists public.match_roster (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (match_id, player_id)
);

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
