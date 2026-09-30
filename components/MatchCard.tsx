'use client';

import Link from 'next/link';
import { leagueById, timeLabel, type Match } from '@/lib/data';
import { useStore } from '@/lib/store';

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z .]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export default function MatchCard({ match }: { match: Match }) {
  const { togglePick, isPicked } = useStore();
  const league = leagueById(match.leagueId);
  const market = match.markets[0];
  const label = `${match.home} v ${match.away}`;

  return (
    <article className="match">
      <div>
        <div className="match-meta">
          {match.live ? (
            <span className="badge-live"><i className="live-dot" style={{ width: 6, height: 6 }} />LIVE</span>
          ) : null}
          <span className="time">{timeLabel(match)}</span>
          <span>·</span>
          <span>{league?.name}</span>
        </div>

        <div className="teams">
          <div className="team">
            <span className="badge">{initials(match.home)}</span>
            <span>{match.home}</span>
            {match.live && match.score ? <span className="score">{match.score[0]}</span> : null}
          </div>
          <div className="team">
            <span className="badge">{initials(match.away)}</span>
            <span>{match.away}</span>
            {match.live && match.score ? <span className="score">{match.score[1]}</span> : null}
          </div>
        </div>

        <div style={{ marginTop: 9 }}>
          <Link href={`/match/${match.id}`} style={{ fontSize: 12.5, color: 'var(--accent)' }}>
            All markets ({match.markets.length}) →
          </Link>
        </div>
      </div>

      <div className="odds" role="group" aria-label={`${market.label} odds`}>
        {market.selections.map((selection) => {
          const on = isPicked(match.id, market.id, selection.id);
          return (
            <button
              key={selection.id}
              className={`odd ${on ? 'on' : ''}`}
              aria-pressed={on}
              onClick={() =>
                togglePick({
                  matchId: match.id,
                  matchLabel: label,
                  marketId: market.id,
                  marketLabel: market.label,
                  selectionId: selection.id,
                  selectionLabel: selection.label,
                  odd: selection.odd,
                })
              }
            >
              <span className="lbl">{selection.label}</span>
              <span className="val">{selection.odd.toFixed(2)}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
