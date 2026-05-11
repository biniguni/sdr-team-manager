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
  if (result === "Win") return "green";
  if (result === "Loss") return "red";
  if (result === "Draw") return "blue";
  return "default";
}
