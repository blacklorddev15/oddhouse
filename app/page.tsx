'use client';

import { useMemo, useState } from 'react';
import { MATCHES, kickoffSoon, type Match } from '@/lib/data';
import MatchCard from '@/components/MatchCard';
import SportChips from '@/components/SportChips';

export default function HomePage() {
  const [sport, setSport] = useState('all');

  const { live, soon, later } = useMemo(() => {
    const inSport = (m: Match) => sport === 'all' || m.sport === sport;
    const matches = MATCHES.filter(inSport);
    return {
      live: matches.filter((m) => m.live),
      soon: matches.filter((m) => !m.live && kickoffSoon(m)).sort((a, b) => a.kickoff - b.kickoff),
      later: matches.filter((m) => !m.live && !kickoffSoon(m)).sort((a, b) => a.kickoff - b.kickoff),
    };
  }, [sport]);

  const nothing = live.length + soon.length + later.length === 0;

  return (
    <>
      <SportChips value={sport} onChange={setSport} />

      {live.length > 0 && (
        <section className="section">
          <div className="section-head">
            <i className="live-dot" />
            <h2>Live now</h2>
          </div>
          <div className="grid two">
            {live.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {soon.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Starting soon</h2></div>
          <div className="grid two">
            {soon.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {later.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Upcoming</h2></div>
          <div className="grid two">
            {later.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {nothing && (
        <p className="empty" style={{ padding: '48px 0' }}>
          No fixtures listed for this sport yet.
        </p>
      )}
    </>
  );
}
