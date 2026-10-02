#!/usr/bin/env node
// Scrapes the club ICBad page and writes the upcoming home fixtures to
// _data/interclubs.yml. Run at build time: ICBad sends no CORS headers, so the
// browser cannot query it directly.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const INSTANCE_URL = "https://icbad.ffbad.org/instance/REC35";
const CLUB_PATTERN = /\(\d{2}-REC-\d+\)/;
const OUTPUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "_data",
  "interclubs.yml",
);
const USER_AGENT =
  "recbadminton.fr build script (+https://recbadminton.fr)";

async function fetchText(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`GET ${url} -> HTTP ${response.status}`);
  }
  return response.text();
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// The sidebar holds short pool names ("Régional 2 Poule 2") keyed by table id,
// while the section headings carry the verbose federation wording.
function parsePoolLabels(html) {
  const labels = new Map();
  const re = /<a[^>]*class="scrollTo"[^>]*href="#tableau(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
  for (const [, id, text] of html.matchAll(re)) {
    labels.set(id, stripTags(text));
  }
  return labels;
}

function parseCompetitions(html) {
  const labels = parsePoolLabels(html);
  const competitions = [];
  const re =
    /<h2 id="tableau(\d+)">([\s\S]*?)<\/h2>[\s\S]*?href="(https:\/\/icbad\.ffbad\.org\/competition\/\d+\/tableau\/\d+)"/g;
  for (const [, id, heading, url] of html.matchAll(re)) {
    competitions.push({
      id,
      label: labels.get(id) || stripTags(heading),
      url,
    });
  }
  return competitions;
}

// ICBad prints "Le 19/09 à 16:00" without a year, so the season has to be
// rebuilt from the month: August onwards is the opening year.
function resolveDate(day, month, seasonStartYear) {
  const year = month >= 8 ? seasonStartYear : seasonStartYear + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseMatches(html, competition, seasonStartYear) {
  const section = html.slice(html.indexOf("Toutes les rencontres"));
  const matches = [];
  let journee = null;

  // Desktop rows only: the markup repeats every match in a mobile variant.
  const re =
    /<th colspan="7"[^>]*>([\s\S]*?)<\/th>|<tr class="uk-visible@m clickable-row">([\s\S]*?)<\/tr>/g;

  for (const [, header, row] of section.matchAll(re)) {
    if (header !== undefined) {
      journee = stripTags(header);
      continue;
    }

    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
      stripTags(m[1]),
    );
    if (cells.length < 5) continue;

    const [when, venue, home, score, away] = cells;
    // Fixtures are published before their kickoff time is set.
    const stamp = when.match(/(\d{2})\/(\d{2})(?:\s*à\s*(\d{2}:\d{2}))?/);
    if (!stamp) continue;

    const link = row.match(/href="(https:\/\/icbad\.ffbad\.org\/rencontre\/\d+)"/);
    matches.push({
      journee: journee ? journee.replace(/^J0*/, "J") : null,
      date: resolveDate(Number(stamp[1]), Number(stamp[2]), seasonStartYear),
      time: stamp[3] || "",
      competition: competition.label,
      home,
      away,
      score,
      played: score !== "0 - 0",
      venue,
      url: link ? link[1] : competition.url,
    });
  }

  return matches;
}

function parseStandings(html) {
  const start = html.indexOf("classement-poule");
  if (start === -1) return [];
  const table = html.slice(start, html.indexOf("</table>", start));
  const standings = [];

  for (const [, row] of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
      stripTags(m[1]),
    );
    if (cells.length < 11) continue;
    standings.push({
      rank: cells[0],
      team: cells[2],
      played: cells[3],
      won: cells[4],
      drawn: cells[5],
      lost: cells[6],
      points: cells[10],
      is_rec: CLUB_PATTERN.test(cells[2]),
    });
  }

  return standings;
}

// "REC Badminton (35-REC-1)" -> "REC 1"
function shortTeamName(fullName) {
  return fullName
    .match(CLUB_PATTERN)[0]
    .replace(/[()]/g, "")
    .replace(/^\d{2}-/, "")
    .replace("-", " ");
}

function buildTeams(competition, standings, matches) {
  return standings
    .filter((entry) => entry.is_rec)
    .map((entry) => {
      const fullName = entry.team;
      return {
        name: shortTeamName(fullName),
        competition: competition.label,
        url: competition.url,
        rank: entry.rank,
        points: entry.points,
        standings,
        matches: matches
          .filter((match) => match.home === fullName || match.away === fullName)
          .map((match) => ({
            ...match,
            at_home: match.home === fullName,
            opponent: match.home === fullName ? match.away : match.home,
          })),
      };
    });
}

function toYaml(value, indent = 0) {
  const pad = " ".repeat(indent);

  if (Array.isArray(value)) {
    return value
      .map((item) => `${pad}- ${toYaml(item, indent + 2).trimStart()}`)
      .join("\n");
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, item], index) => {
        const prefix = index === 0 ? "" : pad;
        if (Array.isArray(item)) {
          return item.length === 0
            ? `${prefix}${key}: []`
            : `${prefix}${key}:\n${toYaml(item, indent + 2)}`;
        }
        if (item && typeof item === "object") {
          return `${prefix}${key}:\n${pad}  ${toYaml(item, indent + 2).trimStart()}`;
        }
        return `${prefix}${key}: ${JSON.stringify(item)}`;
      })
      .join("\n");
  }

  return JSON.stringify(value);
}

async function main() {
  const today = new Date();
  const seasonStartYear =
    today.getUTCMonth() + 1 >= 8 ? today.getUTCFullYear() : today.getUTCFullYear() - 1;
  const todayStamp = today.toISOString().slice(0, 10);

  const instance = await fetchText(INSTANCE_URL);
  const competitions = parseCompetitions(instance);
  if (competitions.length === 0) {
    throw new Error(`No competition found on ${INSTANCE_URL} - markup changed?`);
  }

  const teams = [];
  for (const competition of competitions) {
    const page = await fetchText(competition.url);
    const matches = parseMatches(page, competition, seasonStartYear);
    teams.push(...buildTeams(competition, parseStandings(page), matches));
  }

  const upcomingHome = teams
    .flatMap((team) =>
      team.matches
        .filter((match) => match.at_home && match.date >= todayStamp)
        .map((match) => ({
          journee: match.journee,
          date: match.date,
          time: match.time,
          competition: match.competition,
          team: team.name,
          opponent: match.opponent,
          venue: match.venue,
          url: match.url,
        })),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const payload = {
    generated_at: today.toISOString(),
    source_url: INSTANCE_URL,
    teams,
    home_matches: upcomingHome,
  };

  await writeFile(
    OUTPUT,
    `# Generated by scripts/fetch-interclubs.mjs - do not edit by hand.\n${toYaml(payload)}\n`,
    "utf8",
  );

  console.log(
    `${competitions.length} competitions, ${teams.length} teams, ${upcomingHome.length} upcoming home fixtures -> ${OUTPUT}`,
  );
}

main().catch((error) => {
  console.error(`Interclubs scraping failed: ${error.message}`);
  console.error("Keeping the previously generated _data/interclubs.yml.");
  process.exit(1);
});
