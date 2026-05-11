export type UUID = string;

export interface Player {
  id: UUID;
  name: string;
  number: number;
  birth_date: string | null;
  contact: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: UUID;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SquadMember {
  id: UUID;
  season_id: UUID;
  player_id: UUID;
  created_at: string;
}

export type MatchStatus = "scheduled" | "completed";

export interface ActionResult {
  ok: boolean;
  message: string;
}

export interface Match {
  id: UUID;
  season_id: UUID;
  opponent: string;
  match_date: string;
  venue: string | null;
  is_home: boolean;
  our_score: number | null;
  opponent_score: number | null;
  match_mom_player_id: UUID | null;
  defense_mom_player_id: UUID | null;
  midfield_mom_player_id: UUID | null;
  attack_mom_player_id: UUID | null;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
}

export interface Period {
  id: UUID;
  match_id: UUID;
  label: string;
  order_num: number;
  created_at: string;
}

export interface Formation {
  id: UUID;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PositionSlot {
  id: UUID;
  formation_id: UUID;
  position_code: string;
  x: number;
  y: number;
  created_at: string;
}

export interface PeriodLineup {
  id: UUID;
  period_id: UUID;
  formation_id: UUID;
  position_slot_id: UUID;
  player_id: UUID;
  created_at: string;
  updated_at: string;
}

export interface PlayerMatchStats {
  id: UUID;
  match_id: UUID;
  player_id: UUID;
  played: boolean;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  memo: string | null;
  minutes_played: number | null;
  created_at: string;
  updated_at: string;
}

export interface PositionPerformance {
  id: UUID;
  season_id: UUID;
  player_id: UUID;
  position_code: string;
  period_count: number;
  match_count: number;
  minutes_played: number | null;
  goals: number | null;
  assists: number | null;
  created_at: string;
  updated_at: string;
}
