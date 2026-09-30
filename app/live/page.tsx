'use client';

import { useMemo, useState } from 'react';
import { MATCHES } from '@/lib/data';
import MatchCard from '@/components/MatchCard';
import SportChips from '@/components/SportChips';

export default function LivePage() {
  const [sport, setSport] = useState('all');

  const live = useMemo(
    () => MATCHES.filter((m) => m.live && (sport === 'all' || m.sport === sport)),
    [sport],
  );

  return (
    <>
      <SportChips value={sport} onChange={setSport} />

      <section className="section">
        <div className="section-head">
          <i className="live-dot" />
          <h2>In play</h2>
        </div>
        {live.length ? (
          <div className="grid two">
            {live.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <p className="empty" style={{ padding: '40px 0' }}>
            Nothing in play for this sport right now.
          </p>
        )}
      </section>
    </>
  );
}
