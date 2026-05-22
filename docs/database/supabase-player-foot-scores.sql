alter table public.players
  add column if not exists left_foot_score integer not null default 3,
  add column if not exists right_foot_score integer not null default 3;

update public.players
set left_foot_score = 3
where left_foot_score is null;

update public.players
set right_foot_score = 3
where right_foot_score is null;

alter table public.players
  alter column left_foot_score set default 3,
  alter column right_foot_score set default 3,
  alter column left_foot_score set not null,
  alter column right_foot_score set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'players_left_foot_score_check') then
    alter table public.players add constraint players_left_foot_score_check
      check (left_foot_score between 1 and 5);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'players_right_foot_score_check') then
    alter table public.players add constraint players_right_foot_score_check
      check (right_foot_score between 1 and 5);
  end if;
end $$;
