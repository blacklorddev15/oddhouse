'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { money } from '@/lib/data';

const NAV = [
  { href: '/', label: 'Sports' },
  { href: '/live', label: 'Live' },
  { href: '/my-bets', label: 'My Bets' },
  { href: '/wallet', label: 'Wallet' },
];

export default function Header() {
  const { balance } = useStore();
  const path = usePathname();

  return (
    <header className="app-header">
      <div className="wrap inner">
        <Link href="/" className="logo">
          <span className="mark">O</span>
          <span>Odd<em>House</em></span>
        </Link>

        <nav className="main-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={path === item.href ? 'on' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <span className="balance-chip">
            <span style={{ color: 'var(--muted)' }}>KES</span>
            <b>{money(balance)}</b>
          </span>
          <Link href="/wallet" className="deposit-btn">Deposit</Link>
        </div>
      </div>
    </header>
  );
}
