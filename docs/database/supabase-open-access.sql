-- Legacy no-login mode.
-- This disables Row Level Security so the deployed app can create, update,
-- and delete records with the public Supabase anon key.

alter table players disable row level security;
alter table seasons disable row level security;
alter table squad_members disable row level security;
alter table matches disable row level security;
alter table periods disable row level security;
alter table formations disable row level security;
alter table position_slots disable row level security;
alter table period_lineups disable row level security;
alter table player_match_stats disable row level security;
alter table position_performance disable row level security;
