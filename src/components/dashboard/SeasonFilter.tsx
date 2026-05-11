"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import type { Season } from "@/types";

export function SeasonFilter({ seasons, selectedSeasonId }: { seasons: Season[]; selectedSeasonId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changeSeason(seasonId: string) {
    const params = new URLSearchParams(searchParams);
    params.set("seasonId", seasonId);
    router.push(`?${params.toString()}`);
  }

  return (
    <label className="grid min-w-56 gap-1 text-sm text-slate-300">
      Season
      <Select value={selectedSeasonId} onChange={(event) => changeSeason(event.target.value)}>
        {seasons.map((season) => (
          <option key={season.id} value={season.id}>
            {season.name}
          </option>
        ))}
      </Select>
    </label>
  );
}
