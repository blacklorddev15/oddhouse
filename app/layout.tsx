import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import BetSlip from '@/components/BetSlip';

export const metadata: Metadata = {
  title: 'OddHouse — Sports Betting Demo',
  description: 'A demonstration sportsbook: fixtures, odds and a bet slip. No real money involved.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div className="demo-strip">
            Demonstration site — sample odds, simulated balance, no real money involved.
          </div>
          <div className="shell">
            <Header />
            <main className="wrap">{children}</main>
            <footer className="wrap footer">
              <div><span className="under-age">18</span><b>Strictly for adults.</b> Betting should be entertainment, never a way to make money.</div>
              <div style={{ marginTop: 8 }}>
                OddHouse is a demonstration build. Fixtures, odds and results are invented, the balance is
                simulated, and no deposits, withdrawals or payouts are processed. Operating a real
                sportsbook requires a licence from your regulator — for example the Betting Control and
                Licensing Board in Kenya.
              </div>
            </footer>
            <BetSlip />
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
