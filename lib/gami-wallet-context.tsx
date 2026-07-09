'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Address, Hash } from 'viem';
import { createGamiWalletInstance, GamiWallet } from '@/lib/gami-chain/wallet';
import { buildSwapQuote } from '@/lib/gami-chain/swap';
import type { SwapQuote, TokenBalance, UserStats } from '@/lib/gami-chain/types';
import type { TokenSymbol } from '@/lib/gami-chain/config';
import { useAuth } from '@/lib/auth-context';

const STORAGE_KEY = 'gami-wallet-address';

interface GamiWalletContextValue {
  wallet: GamiWallet | null;
  address: Address | null;
  isConnecting: boolean;
  error: string | null;
  balances: TokenBalance[];
  stats: UserStats | null;
  connect: (mode?: 'wallet' | 'social') => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  refreshStats: () => Promise<void>;
  sendTransfer: (to: Address, amount: string, token: TokenSymbol) => Promise<Hash>;
  getSwapQuote: (from: TokenSymbol, to: TokenSymbol, amount: string) => Promise<SwapQuote>;
  executeSwap: (quote: SwapQuote) => Promise<Hash>;
  pendingTx: Hash | null;
}

const GamiWalletContext = createContext<GamiWalletContextValue | null>(null);

export function GamiWalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const walletRef = useRef<GamiWallet | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pendingTx, setPendingTx] = useState<Hash | null>(null);

  const getWallet = useCallback(() => {
    if (!walletRef.current) {
      walletRef.current = createGamiWalletInstance();
    }
    return walletRef.current;
  }, []);

  const refreshBalances = useCallback(async () => {
    const w = walletRef.current;
    if (!w?.getAddress()) return;
    try {
      const b = await w.getAllBalances();
      setBalances(b);
    } catch {
      /* chain may be offline in dev */
    }
  }, []);

  const refreshStats = useCallback(async () => {
    const w = walletRef.current;
    if (!w?.getAddress()) return;
    try {
      const s = await w.checkMyLevel();
      setStats(s);
    } catch {
      setStats(null);
    }
  }, []);

  const connect = useCallback(
    async (mode: 'wallet' | 'social' = 'wallet') => {
      setIsConnecting(true);
      setError(null);
      try {
        const w = getWallet();
        let addr: Address;

        if (mode === 'social' && user?.email) {
          addr = await w.connectViaAA(user.email);
        } else {
          addr = await w.connect();
        }

        setAddress(addr);
        localStorage.setItem(STORAGE_KEY, addr);
        await Promise.all([refreshBalances(), refreshStats()]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Connection failed');
      } finally {
        setIsConnecting(false);
      }
    },
    [getWallet, user?.email, refreshBalances, refreshStats]
  );

  const disconnect = useCallback(() => {
    walletRef.current?.disconnect();
    walletRef.current = null;
    setAddress(null);
    setBalances([]);
    setStats(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendTransfer = useCallback(
    async (to: Address, amount: string, token: TokenSymbol) => {
      const w = getWallet();
      setPendingTx(null);
      setError(null);
      const hash = await w.sendTransfer(to, amount, token);
      setPendingTx(hash);
      await w.waitForTransaction(hash).catch(() => null);
      await refreshBalances();
      return hash;
    },
    [getWallet, refreshBalances]
  );

  const getSwapQuote = useCallback(
    async (from: TokenSymbol, to: TokenSymbol, amount: string) => {
      let mcpRate = 2.0;
      try {
        const res = await fetch('/api/chain/swap/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromToken: from, toToken: to, fromAmount: amount }),
        });
        if (res.ok) {
          const data = await res.json();
          return data as SwapQuote;
        }
      } catch {
        /* fallback below */
      }
      return buildSwapQuote(from, to, amount, mcpRate);
    },
    []
  );

  const executeSwap = useCallback(
    async (quote: SwapQuote) => {
      const res = await fetch('/api/chain/swap/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Swap preparation failed');
      }
      const { recipient, amount, token } = await res.json();

      const w = getWallet();
      const hash = await w.sendTransfer(recipient as Address, amount, token as TokenSymbol);
      setPendingTx(hash);
      await w.waitForTransaction(hash).catch(() => null);
      await refreshBalances();
      return hash;
    },
    [getWallet, refreshBalances]
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Address | null;
    if (saved && !address) {
      const w = getWallet();
      w.connectReadOnly(saved).then(() => {
        setAddress(saved);
        refreshBalances();
        refreshStats();
      });
    }
  }, [address, getWallet, refreshBalances, refreshStats]);

  const value = useMemo(
    () => ({
      wallet: walletRef.current,
      address,
      isConnecting,
      error,
      balances,
      stats,
      connect,
      disconnect,
      refreshBalances,
      refreshStats,
      sendTransfer,
      getSwapQuote,
      executeSwap,
      pendingTx,
    }),
    [
      address,
      isConnecting,
      error,
      balances,
      stats,
      connect,
      disconnect,
      refreshBalances,
      refreshStats,
      sendTransfer,
      getSwapQuote,
      executeSwap,
      pendingTx,
    ]
  );

  return <GamiWalletContext.Provider value={value}>{children}</GamiWalletContext.Provider>;
}

export function useGamiWallet() {
  const ctx = useContext(GamiWalletContext);
  if (!ctx) throw new Error('useGamiWallet must be used within GamiWalletProvider');
  return ctx;
}
