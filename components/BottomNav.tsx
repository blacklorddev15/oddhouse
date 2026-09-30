'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/', label: 'Sports', ico: '⚽' },
  { href: '/live', label: 'Live', ico: '🔴' },
  { href: '/my-bets', label: 'My Bets', ico: '🧾' },
  { href: '/wallet', label: 'Wallet', ico: '👛' },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="tabbar">
      {ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className={path === item.href ? 'on' : ''}>
          <span className="ico">{item.ico}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
