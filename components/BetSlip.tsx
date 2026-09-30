'use client';

import { useState } from 'react';
import { money } from '@/lib/data';
import { useStore } from '@/lib/store';

const QUICK = [100, 200, 500, 1000];

export default function BetSlip() {
  const {
    picks, removePick, clearSlip, stake, setStake,
    totalOdds, potential, place, balance, slipOpen, setSlipOpen,
  } = useStore();
  const [message, setMessage] = useState('');

  // Open whenever there is something in it, so a pick is never hidden behind a tap.
  const expanded = slipOpen || picks.length > 0;

  return (
    <aside className={`slip ${expanded ? '' : 'collapsed'}`} aria-label="Bet slip">
      <div
        className="slip-head"
        role="button"
        tabIndex={0}
        onClick={() => setSlipOpen(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSlipOpen(!expanded); }}
      >
        <h3>Bet Slip</h3>
        <span className="count">{picks.length}</span>
        <span className="spacer" />
        {picks.length > 0 ? (
          <button className="ghost" onClick={(e) => { e.stopPropagation(); clearSlip(); setMessage(''); }}>
            Clear
          </button>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{expanded ? 'Hide' : 'Show'}</span>
        )}
      </div>

      <div className="slip-body">
        {picks.length === 0 ? (
          <p className="empty">
            No selections yet.<br />
            Tap any odd to add it — combine two or more for an accumulator.
          </p>
        ) : (
          picks.map((pick) => (
            <div className="slip-pick" key={pick.key}>
              <span className="pick-label">{pick.selectionLabel}</span>
              <span className="pick-odd">{pick.odd.toFixed(2)}</span>
              <span className="pick-market">{pick.matchLabel} · {pick.marketLabel}</span>
              <button onClick={() => removePick(pick.key)}>Remove</button>
            </div>
          ))
        )}
      </div>

      <div className="slip-footer">
        <div className="quick">
          {QUICK.map((amount) => (
            <button key={amount} onClick={() => setStake(amount)}>{amount}</button>
          ))}
        </div>

        <div className="stake-row">
          <label htmlFor="stake">Stake</label>
          <input
            id="stake"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="0"
            value={stake || ''}
            onChange={(e) => setStake(Number(e.target.value))}
          />
        </div>

        <div className="totals">
          <span>Total odds</span>
          <b>{picks.length ? totalOdds.toFixed(2) : '—'}</b>
        </div>
        <div className="totals win">
          <span>Potential return</span>
          <b>{stake > 0 && picks.length ? money(potential) : '—'}</b>
        </div>

        <button
          className="place"
          disabled={!picks.length || stake <= 0}
          onClick={() => {
            const result = place();
            setMessage(result.message);
          }}
        >
          Place bet
        </button>

        <p className="slip-note">
          {message || `Demo balance KES ${money(balance)}`}
        </p>
      </div>
    </aside>
  );
}
