'use client';

import Link from 'next/link';
import { money } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function MyBetsPage() {
  const { bets, balance } = useStore();

  const staked = bets.reduce((sum, b) => sum + b.stake, 0);
  const potential = bets.reduce((sum, b) => sum + b.potential, 0);

  return (
    <>
      <section className="section">
        <div className="section-head"><h2>My bets</h2></div>

        {bets.length === 0 ? (
          <div className="card">
            <p className="hint" style={{ margin: 0 }}>
              Nothing placed yet. Pick some odds and your bets will be listed here — they are stored in
              this browser only, so they survive a refresh but not a different device.
            </p>
            <div className="deposit-row">
              <Link href="/" className="tab" style={{ textAlign: 'center' }}>Browse fixtures</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="wallet-grid" style={{ marginBottom: 14 }}>
              <div className="card">
                <h3>Open stakes</h3>
                <div className="big">{money(staked)}</div>
                <p className="hint">Across {bets.length} bet{bets.length === 1 ? '' : 's'}. None of these settle — this is a demo.</p>
              </div>
              <div className="card">
                <h3>Balance left</h3>
                <div className="big green">{money(balance)}</div>
                <p className="hint">Potential return if everything won: {money(potential)}</p>
              </div>
            </div>

            {bets.map((bet) => (
              <article className="bet-card" key={bet.id}>
                <div className="top">
                  <span>#{bet.id.slice(1)}</span>
                  <span>·</span>
                  <span>{new Date(bet.placedAt).toLocaleString()}</span>
                  <span className="status">OPEN</span>
                </div>
                <ul>
                  {bet.picks.map((pick) => (
                    <li key={pick.key}>
                      <b style={{ margin: 0 }}>{pick.selectionLabel}</b>
                      <span>{pick.matchLabel} · {pick.marketLabel}</span>
                      <b>{pick.odd.toFixed(2)}</b>
                    </li>
                  ))}
                </ul>
                <div className="bottom">
                  <span>Stake <b>{money(bet.stake)}</b></span>
                  <span>Odds <b>{bet.odds.toFixed(2)}</b></span>
                  <span className="ret">To return <b>{money(bet.potential)}</b></span>
                </div>
              </article>
            ))}
          </>
        )}
      </section>
    </>
  );
}
