import type { Player, PlayerMatchStats, Season } from "@/types";
import type { PlayerAggregate } from "@/components/dashboard/StatCards";

export type PlayerStatsRow = PlayerMatchStats & {
  players: Player | null;
};

export function selectDefaultSeason(seasons: Season[], selectedSeasonId?: string) {
  return (
    seasons.find((season) => season.id === selectedSeasonId) ??
    seasons.find((season) => season.is_active) ??
    seasons[0] ??
    null
  );
}

export function aggregatePlayers(stats: PlayerStatsRow[]): PlayerAggregate[] {
  const groups = new Map<string, PlayerAggregate>();

  for (const row of stats) {
    if (!row.players) continue;

    const current = groups.get(row.player_id) ?? {
      player: row.players,
      goals: 0,
      assists: 0,
      match_count: 0,
      points: 0,
    };

    current.goals += row.goals;
    current.assists += row.assists;
    current.match_count += row.played ? 1 : 0;
    current.points = current.goals + current.assists;
    groups.set(row.player_id, current);
  }

  return [...groups.values()].sort((a, b) => b.goals - a.goals || b.points - a.points);
}

export function buildPlayersById(players: Player[]) {
  const map = new Map<string, Player>();
  for (const player of players) {
    map.set(player.id, player);
  }
  return map;
}
