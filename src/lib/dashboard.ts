import type { Match, Player, PlayerMatchStats, Season } from "@/types";
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

export function aggregatePlayers(stats: PlayerStatsRow[], matches: Match[] = [], players: Player[] = []): PlayerAggregate[] {
  const groups = new Map<string, PlayerAggregate>();

  for (const player of players) {
    if (player.player_type !== "member") continue;
    groups.set(player.id, {
      player,
      goals: 0,
      assists: 0,
      match_count: 0,
      points: 0,
      mom_count: 0,
    });
  }

  for (const row of stats) {
    if (!row.players) continue;
    if (row.players.player_type !== "member") continue;

    const current = groups.get(row.player_id) ?? {
      player: row.players,
      goals: 0,
      assists: 0,
      match_count: 0,
      points: 0,
      mom_count: 0,
    };

    current.goals += row.goals;
    current.assists += row.assists;
    current.match_count += row.played ? 1 : 0;
    current.points = current.goals + current.assists;
    groups.set(row.player_id, current);
  }

  for (const match of matches) {
    if (!match.match_mom_player_id) continue;
    const current = groups.get(match.match_mom_player_id);
    if (current) current.mom_count += 1;
  }

  return [...groups.values()].sort((a, b) => b.goals - a.goals || b.points - a.points || b.mom_count - a.mom_count);
}

export function buildPlayersById(players: Player[]) {
  const map = new Map<string, Player>();
  for (const player of players) {
    map.set(player.id, player);
  }
  return map;
}
