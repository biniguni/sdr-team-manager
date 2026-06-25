export type MatchResult = "Win" | "Draw" | "Loss" | "Pending";

export function calculateMatchResult(
  ourScore: number | null,
  opponentScore: number | null,
): MatchResult {
  if (ourScore === null || opponentScore === null) return "Pending";
  if (ourScore > opponentScore) return "Win";
  if (ourScore < opponentScore) return "Loss";
  return "Draw";
}

export function resultTone(result: MatchResult): "default" | "green" | "red" | "blue" {
  if (result === "Win") return "blue";
  if (result === "Loss") return "red";
  if (result === "Draw") return "default";
  return "default";
}

export function formatMatchResult(result: MatchResult) {
  if (result === "Win") return "승";
  if (result === "Draw") return "무";
  if (result === "Loss") return "패";
  return "예정";
}
