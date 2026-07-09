'use client';

import { useState } from 'react';
import { isAddress, type Address } from 'viem';
import { useGamiWallet } from '@/lib/gami-wallet-context';
import { SUPPORTED_TOKENS, type TokenSymbol } from '@/lib/gami-chain/config';
import { shortenAddress } from '@/lib/gami-chain/transfer';

export function WalletConnect() {
  const { address, isConnecting, error, connect, disconnect } = useGamiWallet();
  const [mode, setMode] = useState<'wallet' | 'social'>('wallet');

  if (address) {
    return (
      <div className="bg-gami-panel neo-border p-4 shadow-brutal">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase text-gami-accent mb-1">Connected</p>
            <p className="font-mono text-sm">{shortenAddress(address, 6)}</p>
          </div>
          <button
            onClick={disconnect}
            className="px-4 py-2 border-2 border-white/20 text-xs font-display font-bold uppercase hover:bg-red-500/20 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gami-panel neo-border p-6 shadow-brutal space-y-4">
      <h2 className="font-display font-bold text-xl uppercase">Connect Wallet</h2>
      <p className="text-sm text-gray-400">
        Link your wallet for on-chain transfers, token swaps, and XP tracking on Gami L1.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('wallet')}
          className={`py-3 text-xs font-display font-bold uppercase border-2 ${
            mode === 'wallet' ? 'bg-gami-purple border-black' : 'border-white/20'
          }`}
        >
          Web3 Wallet
        </button>
        <button
          onClick={() => setMode('social')}
          className={`py-3 text-xs font-display font-bold uppercase border-2 ${
            mode === 'social' ? 'bg-gami-purple border-black' : 'border-white/20'
          }`}
        >
          Social Login
        </button>
      </div>

      <button
        onClick={() => connect(mode)}
        disabled={isConnecting}
        className="w-full py-4 gami-gradient neo-border shadow-brutal font-display font-bold uppercase disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : mode === 'wallet' ? 'Connect MetaMask' : 'Connect via Email'}
      </button>

      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
    </div>
  );
}

export function BalanceList() {
  const { balances, address, refreshBalances } = useGamiWallet();

  if (!address) return null;

  return (
    <div className="bg-gami-panel neo-border p-4 shadow-brutal">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-bold uppercase text-sm">Balances</h3>
        <button onClick={refreshBalances} className="text-gami-accent text-xs font-mono uppercase">
          Refresh
        </button>
      </div>
      <div className="space-y-2">
        {balances.map((b) => (
          <div key={b.symbol} className="flex justify-between items-center p-3 bg-black/40 border border-white/10">
            <div>
              <p className="font-display font-bold">{b.symbol}</p>
              <p className="text-xs text-gray-500">{b.name}</p>
            </div>
            <p className="font-mono text-sm">{parseFloat(b.balance).toFixed(4)}</p>
          </div>
        ))}
        {balances.length === 0 && (
          <p className="text-gray-500 text-sm font-mono text-center py-4">Loading balances...</p>
        )}
      </div>
    </div>
  );
}

export function XPStats() {
  const { stats, address, refreshStats } = useGamiWallet();

  if (!address) return null;

  return (
    <div className="bg-gami-panel neo-border p-4 shadow-brutal-purple">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display font-bold uppercase text-sm text-gami-accent">On-Chain XP</h3>
        <button onClick={refreshStats} className="text-gami-accent text-xs font-mono uppercase">
          Sync
        </button>
      </div>
      {stats ? (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-black/40">
            <p className="font-display font-bold text-2xl text-gami-purple">{stats.level.toString()}</p>
            <p className="text-[10px] font-mono uppercase text-gray-500">Level</p>
          </div>
          <div className="p-2 bg-black/40">
            <p className="font-display font-bold text-lg">{stats.totalXP.toString()}</p>
            <p className="text-[10px] font-mono uppercase text-gray-500">Total XP</p>
          </div>
          <div className="p-2 bg-black/40">
            <p className="font-display font-bold text-lg">{stats.xpToNextLevel.toString()}</p>
            <p className="text-[10px] font-mono uppercase text-gray-500">To Next</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm font-mono">Connect to Gami L1 to view XP precompile data</p>
      )}
    </div>
  );
}
