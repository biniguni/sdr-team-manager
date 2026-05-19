-- Security cleanup for public-read mode.
-- Run after reviewing docs/security.md.

alter table public.team_editors
  add column if not exists can_manage_match_results boolean not null default false;

-- Set the owner row manually after replacing USER_UUID_HERE.
-- update public.team_editors
-- set role = 'owner', can_manage_match_results = true
-- where user_id = 'USER_UUID_HERE';

-- Normal editors should start without match-result authority.
-- insert into public.team_editors (user_id, role, can_manage_match_results)
-- values ('EDITOR_USER_UUID_HERE', 'editor', false)
-- on conflict (user_id) do update
-- set role = excluded.role,
--     can_manage_match_results = excluded.can_manage_match_results;

-- Clear data that should not remain publicly readable. These columns may not
-- exist in newer databases, so each update is guarded.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'players' and column_name = 'birth_date'
  ) then
    update public.players set birth_date = null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'players' and column_name = 'contact'
  ) then
    update public.players set contact = null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'players' and column_name = 'memo'
  ) then
    update public.players set memo = null;
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'player_match_stats' and column_name = 'memo'
  ) then
    update public.player_match_stats set memo = null;
  end if;
end $$;
