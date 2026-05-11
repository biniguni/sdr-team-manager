-- Adds guest-player support to an existing Supabase database.
-- Run this once in the Supabase SQL Editor before deploying the app change.

alter table public.players add column if not exists player_type text not null default 'member';
alter table public.players add column if not exists memo text;
alter table public.players alter column player_type set default 'member';
update public.players
set player_type = 'member'
where player_type is null;
alter table public.players alter column player_type set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'players_player_type_check') then
    alter table public.players add constraint players_player_type_check
      check (player_type in ('member', 'guest'));
  end if;
end $$;
