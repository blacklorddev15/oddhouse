'use client';

/**
 * Bet slip and wallet state.
 *
 * Everything is held in the browser. There is no server, no account and no payment provider behind
 * this, which is the point: the site is a demonstration, so placing a bet only moves a number that
 * lives in localStorage. Persisting it means a refresh doesn't wipe the slip, which is what makes
 * it feel like the real thing.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';

export type Pick = {
  key: string;
  matchId: string;
  matchLabel: string;
  marketId: string;
  marketLabel: string;
  selectionId: string;
  selectionLabel: string;
  odd: number;
};

export type PlacedBet = {
  id: string;
  picks: Pick[];
  stake: number;
  odds: number;
  potential: number;
  placedAt: number;
};

type Store = {
  picks: Pick[];
  togglePick: (pick: Omit<Pick, 'key'>) => void;
  isPicked: (matchId: string, marketId: string, selectionId: string) => boolean;
  removePick: (key: string) => void;
  clearSlip: () => void;
  stake: number;
  setStake: (value: number) => void;
  totalOdds: number;
  potential: number;
  bets: PlacedBet[];
  balance: number;
  place: () => { ok: boolean; message: string };
  deposit: (amount: number) => void;
  slipOpen: boolean;
  setSlipOpen: (open: boolean) => void;
};

const StoreContext = createContext<Store | null>(null);

const STORAGE_KEY = 'drexbet:state:v1';
const START_BALANCE = 5000;

const pickKey = (matchId: string, marketId: string, selectionId: string) =>
  `${matchId}:${marketId}:${selectionId}`;

type Persisted = { picks: Pick[]; stake: number; bets: PlacedBet[]; balance: number };

function load(): Persisted {
  if (typeof window === 'undefined') {
    return { picks: [], stake: 0, bets: [], balance: START_BALANCE };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { picks: [], stake: 0, bets: [], balance: START_BALANCE };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      picks: Array.isArray(parsed.picks) ? parsed.picks : [],
      stake: typeof parsed.stake === 'number' ? parsed.stake : 0,
      bets: Array.isArray(parsed.bets) ? parsed.bets : [],
      balance: typeof parsed.balance === 'number' ? parsed.balance : START_BALANCE,
    };
  } catch {
    return { picks: [], stake: 0, bets: [], balance: START_BALANCE };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [stake, setStakeState] = useState(0);
  const [bets, setBets] = useState<PlacedBet[]>([]);
  const [balance, setBalance] = useState(START_BALANCE);
  const [slipOpen, setSlipOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Read once on mount. Doing it in an effect rather than during render keeps the server-rendered
  // markup and the first client render identical, which is what avoids a hydration mismatch.
  useEffect(() => {
    const restored = load();
    setPicks(restored.picks);
    setStakeState(restored.stake);
    setBets(restored.bets);
    setBalance(restored.balance);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ picks, stake, bets, balance }));
    } catch {
      /* storage disabled — the slip still works for this visit */
    }
  }, [picks, stake, bets, balance, ready]);

  const isPicked = useCallback(
    (matchId: string, marketId: string, selectionId: string) =>
      picks.some((p) => p.key === pickKey(matchId, marketId, selectionId)),
    [picks],
  );

  const togglePick = useCallback((incoming: Omit<Pick, 'key'>) => {
    const key = pickKey(incoming.matchId, incoming.marketId, incoming.selectionId);
    setPicks((current) => {
      if (current.some((p) => p.key === key)) return current.filter((p) => p.key !== key);
      // One selection per market: the new one replaces whatever was there for that market.
      const without = current.filter(
        (p) => !(p.matchId === incoming.matchId && p.marketId === incoming.marketId),
      );
      return [...without, { ...incoming, key }];
    });
    setSlipOpen(true);
  }, []);

  const removePick = useCallback((key: string) => {
    setPicks((current) => current.filter((p) => p.key !== key));
  }, []);

  const clearSlip = useCallback(() => {
    setPicks([]);
    setStakeState(0);
  }, []);

  const setStake = useCallback((value: number) => {
    setStakeState(Number.isFinite(value) && value > 0 ? value : 0);
  }, []);

  const totalOdds = useMemo(
    () => picks.reduce((acc, p) => acc * p.odd, 1),
    [picks],
  );

  const potential = useMemo(() => stake * totalOdds, [stake, totalOdds]);

  const place = useCallback((): { ok: boolean; message: string } => {
    if (!picks.length) return { ok: false, message: 'Add at least one selection.' };
    if (stake <= 0) return { ok: false, message: 'Enter a stake.' };
    if (stake > balance) return { ok: false, message: 'Stake is more than your demo balance.' };

    setBets((current) => [
      {
        id: `b${Date.now()}`,
        picks,
        stake,
        odds: totalOdds,
        potential,
        placedAt: Date.now(),
      },
      ...current,
    ]);
    setBalance((b) => Math.round((b - stake) * 100) / 100);
    setPicks([]);
    setStakeState(0);
    setSlipOpen(false);
    return { ok: true, message: 'Bet placed (demo).' };
  }, [picks, stake, balance, totalOdds, potential]);

  const deposit = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setBalance((b) => Math.round((b + amount) * 100) / 100);
  }, []);

  const value: Store = {
    picks, togglePick, isPicked, removePick, clearSlip,
    stake, setStake, totalOdds, potential,
    bets, balance, place, deposit,
    slipOpen, setSlipOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
