/**
 * Demo fixtures and odds.
 *
 * Everything here is invented sample data — no live feed is wired up, so the numbers never change
 * and no result is ever settled. Kick-off times are generated relative to the moment the page
 * loads, which keeps the board looking current instead of showing a fixed date in the past.
 */

export type Sport = { id: string; name: string; glyph: string };

export type Selection = { id: string; label: string; odd: number };
export type Market = { id: string; label: string; selections: Selection[] };

export type Match = {
  id: string;
  leagueId: string;
  sport: string;
  home: string;
  away: string;
  kickoff: number;
  live?: boolean;
  minute?: number;
  score?: [number, number];
  markets: Market[];
};

export const SPORTS: Sport[] = [
  { id: 'football', name: 'Football', glyph: '⚽' },
  { id: 'basketball', name: 'Basketball', glyph: '🏀' },
  { id: 'tennis', name: 'Tennis', glyph: '🎾' },
  { id: 'rugby', name: 'Rugby', glyph: '🏉' },
  { id: 'cricket', name: 'Cricket', glyph: '🏏' },
  { id: 'esports', name: 'eSports', glyph: '🎮' },
];

export const LEAGUES = [
  { id: 'epl', name: 'Premier League', country: 'England', sport: 'football' },
  { id: 'laliga', name: 'LaLiga', country: 'Spain', sport: 'football' },
  { id: 'seriea', name: 'Serie A', country: 'Italy', sport: 'football' },
  { id: 'bundes', name: 'Bundesliga', country: 'Germany', sport: 'football' },
  { id: 'ucl', name: 'Champions League', country: 'Europe', sport: 'football' },
  { id: 'nba', name: 'NBA', country: 'USA', sport: 'basketball' },
  { id: 'atp', name: 'ATP Tour', country: 'World', sport: 'tennis' },
] as const;

const NOW = Date.now();
const at = (minutes: number) => NOW + minutes * 60_000;

/** Three-way market: home / draw / away. */
const h2h = (h: number, d: number, a: number): Market => ({
  id: '1x2',
  label: 'Match result',
  selections: [
    { id: 'H', label: '1', odd: h },
    { id: 'D', label: 'X', odd: d },
    { id: 'A', label: '2', odd: a },
  ],
});

const totals = (over: number, under: number): Market => ({
  id: 'ou25',
  label: 'Total goals 2.5',
  selections: [
    { id: 'OVER', label: 'Over 2.5', odd: over },
    { id: 'UNDER', label: 'Under 2.5', odd: under },
  ],
});

const btts = (yes: number, no: number): Market => ({
  id: 'btts',
  label: 'Both teams to score',
  selections: [
    { id: 'YES', label: 'Yes', odd: yes },
    { id: 'NO', label: 'No', odd: no },
  ],
});

/** Basketball and tennis have no draw, so they get a two-way line instead. */
const moneyline = (h: number, a: number, hLabel: string, aLabel: string): Market => ({
  id: 'ml',
  label: 'Moneyline',
  selections: [
    { id: 'H', label: hLabel, odd: h },
    { id: 'A', label: aLabel, odd: a },
  ],
});

export const MATCHES: Match[] = [
  // ── live ──────────────────────────────────────────────────────────────────
  {
    id: 'm1', leagueId: 'epl', sport: 'football', home: 'Arsenal', away: 'Newcastle',
    kickoff: at(-63), live: true, minute: 63, score: [2, 1],
    markets: [h2h(1.42, 4.75, 8.5), totals(1.55, 2.4), btts(1.22, 4.2)],
  },
  {
    id: 'm2', leagueId: 'laliga', sport: 'football', home: 'Sevilla', away: 'Valencia',
    kickoff: at(-38), live: true, minute: 38, score: [0, 0],
    markets: [h2h(2.05, 3.2, 3.9), totals(1.85, 1.95), btts(1.7, 2.1)],
  },
  {
    id: 'm3', leagueId: 'nba', sport: 'basketball', home: 'Boston Celtics', away: 'Miami Heat',
    kickoff: at(-52), live: true, minute: 52, score: [78, 71],
    markets: [moneyline(1.28, 3.7, 'Celtics', 'Heat')],
  },
  {
    id: 'm4', leagueId: 'atp', sport: 'tennis', home: 'C. Alcaraz', away: 'A. Zverev',
    kickoff: at(-74), live: true, minute: 74, score: [1, 1],
    markets: [moneyline(1.55, 2.4, 'Alcaraz', 'Zverev')],
  },
  {
    id: 'm5', leagueId: 'seriea', sport: 'football', home: 'Inter', away: 'Lazio',
    kickoff: at(-21), live: true, minute: 21, score: [1, 0],
    markets: [h2h(1.6, 3.9, 5.6), totals(1.9, 1.9), btts(1.85, 1.95)],
  },

  // ── later today ───────────────────────────────────────────────────────────
  {
    id: 'm6', leagueId: 'epl', sport: 'football', home: 'Liverpool', away: 'Everton',
    kickoff: at(95),
    markets: [h2h(1.55, 4.1, 5.8), totals(1.65, 2.2), btts(1.75, 2.05)],
  },
  {
    id: 'm7', leagueId: 'epl', sport: 'football', home: 'Man City', away: 'Brighton',
    kickoff: at(150),
    markets: [h2h(1.33, 5.4, 9.0), totals(1.4, 2.9), btts(1.85, 1.95)],
  },
  {
    id: 'm8', leagueId: 'bundes', sport: 'football', home: 'Bayern Munich', away: 'Freiburg',
    kickoff: at(180),
    markets: [h2h(1.25, 6.2, 11.0), totals(1.35, 3.1), btts(2.0, 1.8)],
  },
  {
    id: 'm9', leagueId: 'laliga', sport: 'football', home: 'Real Madrid', away: 'Getafe',
    kickoff: at(215),
    markets: [h2h(1.36, 4.9, 8.4), totals(1.5, 2.5), btts(2.1, 1.7)],
  },
  {
    id: 'm10', leagueId: 'nba', sport: 'basketball', home: 'Denver Nuggets', away: 'Phoenix Suns',
    kickoff: at(245),
    markets: [moneyline(1.62, 2.3, 'Nuggets', 'Suns')],
  },
  {
    id: 'm11', leagueId: 'atp', sport: 'tennis', home: 'J. Sinner', away: 'D. Medvedev',
    kickoff: at(280),
    markets: [moneyline(1.7, 2.12, 'Sinner', 'Medvedev')],
  },

  // ── later this week ───────────────────────────────────────────────────────
  {
    id: 'm12', leagueId: 'ucl', sport: 'football', home: 'Barcelona', away: 'Dortmund',
    kickoff: at(1450),
    markets: [h2h(1.75, 3.75, 4.5), totals(1.72, 2.1), btts(1.62, 2.3)],
  },
  {
    id: 'm13', leagueId: 'ucl', sport: 'football', home: 'PSG', away: 'Benfica',
    kickoff: at(1520),
    markets: [h2h(1.5, 4.2, 6.4), totals(1.6, 2.3), btts(1.8, 2.0)],
  },
  {
    id: 'm14', leagueId: 'seriea', sport: 'football', home: 'Juventus', away: 'Napoli',
    kickoff: at(2890),
    markets: [h2h(2.3, 3.15, 3.3), totals(1.95, 1.88), btts(1.68, 2.18)],
  },
  {
    id: 'm15', leagueId: 'epl', sport: 'football', home: 'Chelsea', away: 'Aston Villa',
    kickoff: at(2960),
    markets: [h2h(1.95, 3.55, 3.85), totals(1.8, 2.0), btts(1.58, 2.35)],
  },
  {
    id: 'm16', leagueId: 'bundes', sport: 'football', home: 'Leverkusen', away: 'Stuttgart',
    kickoff: at(3040),
    markets: [h2h(1.85, 3.8, 4.0), totals(1.68, 2.15), btts(1.6, 2.3)],
  },
  {
    id: 'm17', leagueId: 'laliga', sport: 'football', home: 'Atletico Madrid', away: 'Real Betis',
    kickoff: at(3120),
    markets: [h2h(1.68, 3.7, 5.2), totals(2.05, 1.78), btts(1.78, 2.02)],
  },
  {
    id: 'm18', leagueId: 'nba', sport: 'basketball', home: 'LA Lakers', away: 'Golden State',
    kickoff: at(3200),
    markets: [moneyline(2.05, 1.8, 'Lakers', 'Warriors')],
  },
  {
    id: 'm19', leagueId: 'atp', sport: 'tennis', home: 'N. Djokovic', away: 'A. Rublev',
    kickoff: at(3300),
    markets: [moneyline(1.44, 2.85, 'Djokovic', 'Rublev')],
  },
  {
    id: 'm20', leagueId: 'epl', sport: 'football', home: 'Tottenham', away: 'Man United',
    kickoff: at(3400),
    markets: [h2h(2.25, 3.6, 3.1), totals(1.62, 2.25), btts(1.5, 2.5)],
  },
];

export const leagueById = (id: string) => LEAGUES.find((l) => l.id === id);
export const matchById = (id: string) => MATCHES.find((m) => m.id === id);

export const liveMatches = () => MATCHES.filter((m) => m.live);
export const upcomingMatches = () => MATCHES.filter((m) => !m.live).sort((a, b) => a.kickoff - b.kickoff);

/** "63'" while in play, otherwise a clock time today or a weekday later in the week. */
export function timeLabel(match: Match): string {
  if (match.live) return `${match.minute}'`;
  const d = new Date(match.kickoff);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  if (sameDay) return `Today ${time}`;
  const day = d.toLocaleDateString([], { weekday: 'short' });
  return `${day} ${time}`;
}

export function kickoffSoon(match: Match): boolean {
  return !match.live && match.kickoff - Date.now() < 3 * 60 * 60 * 1000;
}

export const money = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
