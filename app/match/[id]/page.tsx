'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { leagueById, matchById, timeLabel } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const match = matchById(params?.id ?? '');
  const { togglePick, isPicked } = useStore();

  if (!match) {
    return (
      <section className="section">
        <div className="card">
          <h3>Fixture not found</h3>
          <p className="hint">That match is not on this demo board.</p>
          <Link href="/" className="tab">Back to fixtures</Link>
        </div>
      </section>
    );
  }

  const league = leagueById(match.leagueId);
  const label = `${match.home} v ${match.away}`;

  return (
    <>
      <section className="section">
        <Link href="/" style={{ fontSize: 13, color: 'var(--muted)' }}>← All fixtures</Link>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="match-meta">
            {match.live ? (
              <span className="badge-live"><i className="live-dot" style={{ width: 6, height: 6 }} />LIVE {match.minute}&apos;</span>
            ) : null}
            <span className="time">{timeLabel(match)}</span>
            <span>·</span>
            <span>{league?.name} — {league?.country}</span>
          </div>
          <h2 style={{ margin: '6px 0 0', fontSize: 21 }}>{match.home} v {match.away}</h2>
          {match.live && match.score ? (
            <p className="hint" style={{ marginTop: 6 }}>
              Current score {match.score[0]} — {match.score[1]}
            </p>
          ) : null}
        </div>

        {match.markets.map((market) => (
          <div className="card" key={market.id} style={{ marginTop: 12 }}>
            <h3>{market.label}</h3>
            <div className="odds" style={{ marginTop: 10 }}>
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
          </div>
        ))}
      </section>
    </>
  );
}
