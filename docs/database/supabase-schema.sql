create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  number integer not null unique,
  left_foot_score integer not null default 3 check (left_foot_score between 1 and 5),
  right_foot_score integer not null default 3 check (right_foot_score between 1 and 5),
  player_type text not null default 'member' check (player_type in ('member', 'guest')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table players add column if not exists player_type text not null default 'member';
alter table players add column if not exists left_foot_score integer not null default 3;
alter table players add column if not exists right_foot_score integer not null default 3;
alter table players alter column player_type set default 'member';
alter table players alter column left_foot_score set default 3;
alter table players alter column right_foot_score set default 3;
update players set player_type = 'member' where player_type is null;
update players set left_foot_score = 3 where left_foot_score is null;
update players set right_foot_score = 3 where right_foot_score is null;
alter table players alter column player_type set not null;
alter table players alter column left_foot_score set not null;
alter table players alter column right_foot_score set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'players_player_type_check') then
    alter table players add constraint players_player_type_check
      check (player_type in ('member', 'guest'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'players_left_foot_score_check') then
    alter table players add constraint players_left_foot_score_check
      check (left_foot_score between 1 and 5);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'players_right_foot_score_check') then
    alter table players add constraint players_right_foot_score_check
      check (right_foot_score between 1 and 5);
  end if;
end $$;

create table if not exists seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_season_dates check (end_date >= start_date)
);

create table if not exists squad_members (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (season_id, player_id)
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  opponent text not null,
  match_date timestamptz not null,
  venue text,
  is_home boolean not null default true,
  our_score integer,
  opponent_score integer,
  match_mom_player_id uuid references players(id) on delete set null,
  defense_mom_player_id uuid references players(id) on delete set null,
  midfield_mom_player_id uuid references players(id) on delete set null,
  attack_mom_player_id uuid references players(id) on delete set null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table matches add column if not exists match_mom_player_id uuid;
alter table matches add column if not exists defense_mom_player_id uuid;
alter table matches add column if not exists midfield_mom_player_id uuid;
alter table matches add column if not exists attack_mom_player_id uuid;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'matches_match_mom_player_id_fkey') then
    alter table matches add constraint matches_match_mom_player_id_fkey
      foreign key (match_mom_player_id) references players(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'matches_defense_mom_player_id_fkey') then
    alter table matches add constraint matches_defense_mom_player_id_fkey
      foreign key (defense_mom_player_id) references players(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'matches_midfield_mom_player_id_fkey') then
    alter table matches add constraint matches_midfield_mom_player_id_fkey
      foreign key (midfield_mom_player_id) references players(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'matches_attack_mom_player_id_fkey') then
    alter table matches add constraint matches_attack_mom_player_id_fkey
      foreign key (attack_mom_player_id) references players(id) on delete set null;
  end if;
end $$;

create table if not exists periods (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  label text not null,
  order_num integer not null,
  created_at timestamptz not null default now(),
  unique (match_id, label),
  unique (match_id, order_num)
);

create table if not exists match_roster (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create table if not exists formations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists position_slots (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references formations(id) on delete cascade,
  position_code text not null,
  x numeric(5,2) not null check (x >= 0 and x <= 100),
  y numeric(5,2) not null check (y >= 0 and y <= 100),
  created_at timestamptz not null default now(),
  unique (formation_id, position_code)
);

create table if not exists period_lineups (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references periods(id) on delete cascade,
  formation_id uuid not null references formations(id) on delete restrict,
  position_slot_id uuid not null references position_slots(id) on delete restrict,
  player_id uuid not null references players(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (period_id, position_slot_id),
  unique (period_id, player_id)
);

create table if not exists player_match_stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  played boolean not null default false,
  goals integer not null default 0 check (goals >= 0),
  assists integer not null default 0 check (assists >= 0),
  yellow_cards integer not null default 0 check (yellow_cards >= 0),
  red_cards integer not null default 0 check (red_cards >= 0),
  minutes_played integer check (minutes_played is null or minutes_played >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create table if not exists position_performance (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  position_code text not null,
  period_count integer not null default 0 check (period_count >= 0),
  match_count integer not null default 0 check (match_count >= 0),
  minutes_played integer check (minutes_played is null or minutes_played >= 0),
  goals integer,
  assists integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, player_id, position_code)
);

drop trigger if exists trg_players_updated_at on players;
create trigger trg_players_updated_at before update on players
for each row execute function set_updated_at();

drop trigger if exists trg_seasons_updated_at on seasons;
create trigger trg_seasons_updated_at before update on seasons
for each row execute function set_updated_at();

drop trigger if exists trg_matches_updated_at on matches;
create trigger trg_matches_updated_at before update on matches
for each row execute function set_updated_at();

drop trigger if exists trg_formations_updated_at on formations;
create trigger trg_formations_updated_at before update on formations
for each row execute function set_updated_at();

drop trigger if exists trg_period_lineups_updated_at on period_lineups;
create trigger trg_period_lineups_updated_at before update on period_lineups
for each row execute function set_updated_at();

drop trigger if exists trg_player_match_stats_updated_at on player_match_stats;
create trigger trg_player_match_stats_updated_at before update on player_match_stats
for each row execute function set_updated_at();

drop trigger if exists trg_position_performance_updated_at on position_performance;
create trigger trg_position_performance_updated_at before update on position_performance
for each row execute function set_updated_at();

insert into formations (name, is_default)
values ('4-4-2', true), ('4-3-3', true), ('3-5-2', true), ('4-2-3-1', true)
on conflict (name) do update set is_default = excluded.is_default;

with formation as (select id from formations where name = '4-4-2')
insert into position_slots (formation_id, position_code, x, y)
select formation.id, slot.position_code, slot.x, slot.y
from formation
cross join (values
  ('GK', 50, 90), ('LB', 15, 70), ('CB1', 35, 70), ('CB2', 65, 70),
  ('RB', 85, 70), ('LM', 15, 50), ('CM1', 35, 50), ('CM2', 65, 50),
  ('RM', 85, 50), ('ST1', 35, 15), ('ST2', 65, 15)
) as slot(position_code, x, y)
on conflict (formation_id, position_code) do update set x = excluded.x, y = excluded.y;

with formation as (select id from formations where name = '4-3-3')
insert into position_slots (formation_id, position_code, x, y)
select formation.id, slot.position_code, slot.x, slot.y
from formation
cross join (values
  ('GK', 50, 90), ('LB', 15, 70), ('CB1', 35, 70), ('CB2', 65, 70),
  ('RB', 85, 70), ('CM1', 25, 50), ('CM2', 50, 50), ('CM3', 75, 50),
  ('LW', 15, 20), ('ST', 50, 10), ('RW', 85, 20)
) as slot(position_code, x, y)
on conflict (formation_id, position_code) do update set x = excluded.x, y = excluded.y;

with formation as (select id from formations where name = '3-5-2')
insert into position_slots (formation_id, position_code, x, y)
select formation.id, slot.position_code, slot.x, slot.y
from formation
cross join (values
  ('GK', 50, 90), ('CB1', 25, 72), ('CB2', 50, 72), ('CB3', 75, 72),
  ('LWB', 10, 52), ('CM1', 30, 50), ('CM2', 50, 50), ('CM3', 70, 50),
  ('RWB', 90, 52), ('ST1', 35, 15), ('ST2', 65, 15)
) as slot(position_code, x, y)
on conflict (formation_id, position_code) do update set x = excluded.x, y = excluded.y;

with formation as (select id from formations where name = '4-2-3-1')
insert into position_slots (formation_id, position_code, x, y)
select formation.id, slot.position_code, slot.x, slot.y
from formation
cross join (values
  ('GK', 50, 90), ('LB', 15, 70), ('CB1', 35, 70), ('CB2', 65, 70),
  ('RB', 85, 70), ('DM1', 35, 52), ('DM2', 65, 52), ('LAM', 25, 32),
  ('CAM', 50, 28), ('RAM', 75, 32), ('ST', 50, 12)
) as slot(position_code, x, y)
on conflict (formation_id, position_code) do update set x = excluded.x, y = excluded.y;
