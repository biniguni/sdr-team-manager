import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const cwd = process.cwd();
const applyMode = process.argv.includes("--apply");
const sqlMode = process.argv.includes("--sql");
const seasonName = "26시즌";
const sqlOutputPath = path.join(cwd, "data", "import", "legacy-26-season-import.sql");

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseTsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  const [headerLine, ...rows] = raw.split(/\r?\n/);
  const headers = headerLine.split("\t");

  return rows
    .filter((row) => row.trim().length > 0)
    .map((row) => {
      const values = row.split("\t");
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    });
}

function keyForMatch(matchDate, opponent) {
  return `${matchDate}|${opponent.trim()}`;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function printList(label, values) {
  console.log(`${label}: ${values.length}`);
  for (const value of values) {
    console.log(`  - ${value}`);
  }
}

function sqlValue(value) {
  if (value === null) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function valuesSql(rows, columns) {
  return rows
    .map((row) => `  (${columns.map((column) => sqlValue(row[column])).join(", ")})`)
    .join(",\n");
}

loadEnv(path.join(cwd, ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const matchRows = parseTsv(path.join(cwd, "data", "import", "legacy-26-season-matches.tsv"));
const statRows = parseTsv(path.join(cwd, "data", "import", "legacy-26-season-player-stats.tsv")).map((row) => ({
  legacy_match_id: row.legacy_match_id,
  player_name: row.player_name.trim(),
  goals: Number(row.goals),
  assists: Number(row.assists),
}));

const { data: season, error: seasonError } = await supabase
  .from("seasons")
  .select("id, name")
  .eq("name", seasonName)
  .single();

if (seasonError || !season) {
  throw new Error(`Could not find season "${seasonName}": ${seasonError?.message ?? "not found"}`);
}

const [{ data: players, error: playersError }, { data: matches, error: matchesError }, { data: squadMembers, error: squadError }] =
  await Promise.all([
    supabase.from("players").select("id, name, is_active"),
    supabase.from("matches").select("id, season_id, opponent, match_date").eq("season_id", season.id),
    supabase.from("squad_members").select("player_id").eq("season_id", season.id),
  ]);

if (playersError) throw new Error(`Failed to load players: ${playersError.message}`);
if (matchesError) throw new Error(`Failed to load matches: ${matchesError.message}`);
if (squadError) throw new Error(`Failed to load squad members: ${squadError.message}`);

const playerByName = new Map(players.map((player) => [player.name.trim(), player]));
const matchByLegacyId = new Map(matchRows.map((row) => [row.legacy_match_id, row]));
const currentMatchByKey = new Map(
  matches.map((match) => [keyForMatch(match.match_date.slice(0, 10), match.opponent), match]),
);
const currentSquadPlayerIds = new Set(squadMembers.map((member) => member.player_id));

const missingLegacyMatches = [];
const unresolvedPlayers = new Set();
const invalidStats = [];
const preparedStats = [];
const touchedPlayerIds = new Set();

for (const stat of statRows) {
  const legacyMatch = matchByLegacyId.get(stat.legacy_match_id);
  if (!legacyMatch) {
    invalidStats.push(`Unknown legacy match id ${stat.legacy_match_id} for ${stat.player_name}`);
    continue;
  }

  const currentMatch = currentMatchByKey.get(keyForMatch(legacyMatch.match_date, legacyMatch.opponent));
  if (!currentMatch) {
    missingLegacyMatches.push(`${legacyMatch.legacy_match_id} ${legacyMatch.match_date} ${legacyMatch.opponent}`);
    continue;
  }

  const player = playerByName.get(stat.player_name);
  if (!player) {
    unresolvedPlayers.add(stat.player_name);
    continue;
  }

  if (!Number.isInteger(stat.goals) || !Number.isInteger(stat.assists) || stat.goals < 0 || stat.assists < 0) {
    invalidStats.push(`Invalid stat value for ${stat.player_name} in ${stat.legacy_match_id}`);
    continue;
  }

  touchedPlayerIds.add(player.id);
  preparedStats.push({
    match_id: currentMatch.id,
    player_id: player.id,
    played: true,
    goals: stat.goals,
    assists: stat.assists,
    yellow_cards: 0,
    red_cards: 0,
    memo: `Imported from legacy match ID ${stat.legacy_match_id}`,
    minutes_played: null,
  });
}

const uniqueMissingMatches = [...new Set(missingLegacyMatches)];
if (uniqueMissingMatches.length > 0 || unresolvedPlayers.size > 0 || invalidStats.length > 0) {
  if (uniqueMissingMatches.length > 0) printList("Missing current matches", uniqueMissingMatches);
  if (unresolvedPlayers.size > 0) printList("Unknown players", [...unresolvedPlayers].sort((a, b) => a.localeCompare(b, "ko")));
  if (invalidStats.length > 0) printList("Invalid rows", invalidStats);
  process.exit(1);
}

const squadInserts = [...touchedPlayerIds]
  .filter((playerId) => !currentSquadPlayerIds.has(playerId))
  .map((playerId) => ({ season_id: season.id, player_id: playerId }));

const relevantMatchIds = [...new Set(preparedStats.map((row) => row.match_id))];
const { data: existingStats, error: existingStatsError } = await supabase
  .from("player_match_stats")
  .select("match_id, player_id, goals, assists")
  .in("match_id", relevantMatchIds);

if (existingStatsError) throw new Error(`Failed to load existing stats: ${existingStatsError.message}`);

const existingStatsByKey = new Map(
  existingStats.map((row) => [`${row.match_id}|${row.player_id}`, row]),
);

let inserts = 0;
let updates = 0;
let unchanged = 0;
for (const row of preparedStats) {
  const existing = existingStatsByKey.get(`${row.match_id}|${row.player_id}`);
  if (!existing) {
    inserts += 1;
    continue;
  }

  if (existing.goals === row.goals && existing.assists === row.assists) {
    unchanged += 1;
  } else {
    updates += 1;
  }
}

console.log(`Season: ${season.name}`);
console.log(`Legacy matches: ${matchRows.length}`);
console.log(`Legacy stat rows: ${statRows.length}`);
console.log(`Resolved stat rows: ${preparedStats.length}`);
console.log(`Players to add to squad: ${squadInserts.length}`);
console.log(`Stats to insert: ${inserts}`);
console.log(`Stats to update: ${updates}`);
console.log(`Stats already identical: ${unchanged}`);
console.log(`Mode: ${applyMode ? "apply" : sqlMode ? "sql" : "dry-run"}`);

if (sqlMode) {
  const lines = [
    "-- Generated by scripts/import-legacy-26-season.mjs",
    "-- Run this in the Supabase SQL Editor while connected as a project admin.",
    "begin;",
    "",
  ];

  if (squadInserts.length > 0) {
    lines.push(
      "insert into squad_members (season_id, player_id)",
      "values",
      valuesSql(squadInserts, ["season_id", "player_id"]),
      "on conflict (season_id, player_id) do nothing;",
      "",
    );
  }

  lines.push(
    "insert into player_match_stats (match_id, player_id, played, goals, assists, yellow_cards, red_cards, memo, minutes_played)",
    "values",
    valuesSql(preparedStats, [
      "match_id",
      "player_id",
      "played",
      "goals",
      "assists",
      "yellow_cards",
      "red_cards",
      "memo",
      "minutes_played",
    ]),
    "on conflict (match_id, player_id) do update set",
    "  played = excluded.played,",
    "  goals = excluded.goals,",
    "  assists = excluded.assists,",
    "  yellow_cards = excluded.yellow_cards,",
    "  red_cards = excluded.red_cards,",
    "  memo = excluded.memo,",
    "  minutes_played = excluded.minutes_played,",
    "  updated_at = now();",
    "",
    "commit;",
    "",
  );

  fs.writeFileSync(sqlOutputPath, `${lines.join("\n")}`, "utf8");
  console.log(`SQL file written to ${sqlOutputPath}`);
  process.exit(0);
}

if (!applyMode) {
  console.log("Dry run complete. Re-run with --apply to write squad members and player_match_stats.");
  process.exit(0);
}

if (squadInserts.length > 0) {
  for (const batch of chunk(squadInserts, 200)) {
    const { error } = await supabase.from("squad_members").upsert(batch, {
      onConflict: "season_id,player_id",
      ignoreDuplicates: true,
    });
    if (error) throw new Error(`Failed to upsert squad members: ${error.message}`);
  }
}

for (const batch of chunk(preparedStats, 200)) {
  const { error } = await supabase.from("player_match_stats").upsert(batch, {
    onConflict: "match_id,player_id",
  });
  if (error) throw new Error(`Failed to upsert player match stats: ${error.message}`);
}

console.log("Import complete.");
