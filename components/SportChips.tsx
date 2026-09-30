'use client';

import { SPORTS } from '@/lib/data';

export default function SportChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="rail">
      <button className={`chip ${value === 'all' ? 'on' : ''}`} onClick={() => onChange('all')}>
        <span>🏆</span> All sports
      </button>
      {SPORTS.map((sport) => (
        <button
          key={sport.id}
          className={`chip ${value === sport.id ? 'on' : ''}`}
          onClick={() => onChange(sport.id)}
        >
          <span>{sport.glyph}</span> {sport.name}
        </button>
      ))}
    </div>
  );
}
