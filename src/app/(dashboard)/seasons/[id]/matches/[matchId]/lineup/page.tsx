import { redirect } from "next/navigation";

export default async function LegacyLineupPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  redirect(`/lineup?matchId=${matchId}`);
}
