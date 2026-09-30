'use client';

import { money } from '@/lib/data';
import { useStore } from '@/lib/store';

const TOP_UPS = [500, 1000, 2500, 5000];

export default function WalletPage() {
  const { balance, deposit, bets } = useStore();

  return (
    <>
      <section className="section">
        <div className="section-head"><h2>Wallet</h2></div>

        <div className="wallet-grid">
          <div className="card">
            <h3>Available balance</h3>
            <div className="big green">KES {money(balance)}</div>
            <p className="hint">
              This is a simulated balance held in your browser. Nothing is charged, nothing can be
              withdrawn, and no payment provider is connected.
            </p>

            <div className="deposit-row">
              {TOP_UPS.map((amount) => (
                <button key={amount} onClick={() => deposit(amount)}>
                  + {amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Session</h3>
            <p className="hint" style={{ marginTop: 0 }}>
              {bets.length} bet{bets.length === 1 ? '' : 's'} placed this session. Your slip, bets and
              balance are kept in localStorage, so they stay put when you refresh and disappear if you
              clear browsing data.
            </p>
            <div className="deposit-row">
              <button
                onClick={() => {
                  window.localStorage.removeItem('drexbet:state:v1');
                  window.location.reload();
                }}
              >
                Reset the demo
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <h3>What a real site would need here</h3>
          <p className="hint" style={{ marginBottom: 0 }}>
            Real deposits, payouts and odds feeds are regulated activity. In Kenya a sportsbook needs a
            licence from the Betting Control and Licensing Board, plus a licensed payment provider and a
            documented responsible-gambling policy. None of that is present in this build, which is why
            the balance is fake and there is no sign-in.
          </p>
        </div>
      </section>
    </>
  );
}
