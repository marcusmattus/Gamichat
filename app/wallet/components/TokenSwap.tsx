'use client';

import { useState } from 'react';
import { useGamiWallet } from '@/lib/gami-wallet-context';
import { SUPPORTED_TOKENS, type TokenSymbol } from '@/lib/gami-chain/config';
import type { SwapQuote } from '@/lib/gami-chain/types';

export function TokenSwap() {
  const { address, getSwapQuote, sendTransfer, pendingTx } = useGamiWallet();
  const [fromToken, setFromToken] = useState<TokenSymbol>('GAMI');
  const [toToken, setToToken] = useState<TokenSymbol>('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [status, setStatus] = useState<'idle' | 'quoting' | 'swapping' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!address) return null;

  const tokens = Object.keys(SUPPORTED_TOKENS) as TokenSymbol[];

  const handleQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Enter an amount to swap');
      return;
    }
    setStatus('quoting');
    setError(null);
    try {
      const q = await getSwapQuote(fromToken, toToken, fromAmount);
      setQuote(q);
      setStatus('idle');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Quote failed');
      setStatus('error');
    }
  };

  const handleSwap = async () => {
    if (!quote) return;
    setStatus('swapping');
    setError(null);
    try {
      const res = await fetch('/api/chain/swap/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...quote, sender: address }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Swap failed');
      }
      const prep = await res.json();
      const hash = await sendTransfer(prep.recipient, prep.amount, prep.token);
      setTxHash(hash);
      setStatus('success');
      setFromAmount('');
      setQuote(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Swap failed');
      setStatus('error');
    }
  };

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setQuote(null);
  };

  return (
    <div className="bg-gami-panel neo-border p-4 shadow-brutal space-y-4">
      <h3 className="font-display font-bold uppercase text-sm">Swap Tokens</h3>

      <div className="space-y-2">
        <label className="font-mono text-[10px] uppercase text-gray-500">From</label>
        <div className="flex gap-2">
          <select
            value={fromToken}
            onChange={(e) => { setFromToken(e.target.value as TokenSymbol); setQuote(null); }}
            className="bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple"
          >
            {tokens.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            value={fromAmount}
            onChange={(e) => { setFromAmount(e.target.value); setQuote(null); }}
            placeholder="0.00"
            type="number"
            min="0"
            step="any"
            className="flex-1 bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple"
          />
        </div>
      </div>

      <button
        onClick={flipTokens}
        className="w-full py-2 border border-white/20 text-xs font-mono uppercase hover:border-gami-accent transition-colors"
      >
        ↕ Flip Pair
      </button>

      <div className="space-y-2">
        <label className="font-mono text-[10px] uppercase text-gray-500">To</label>
        <select
          value={toToken}
          onChange={(e) => { setToToken(e.target.value as TokenSymbol); setQuote(null); }}
          className="w-full bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple"
        >
          {tokens.filter((t) => t !== fromToken).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {quote && (
        <div className="p-3 bg-gami-purple/10 border border-gami-purple/30 space-y-1">
          <p className="font-mono text-sm">
            You receive: <span className="text-gami-accent font-bold">{quote.toAmount} {quote.toToken}</span>
          </p>
          <p className="font-mono text-[10px] text-gray-500">
            Rate: 1 {quote.fromToken} = {quote.rate.toFixed(4)} {quote.toToken} · Min: {quote.minimumReceived}
          </p>
          <p className="font-mono text-[10px] text-gray-500">
            Price impact: {quote.priceImpact}%
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleQuote}
          disabled={status === 'quoting'}
          className="py-3 border-2 border-white/20 font-display font-bold uppercase text-xs hover:border-gami-accent disabled:opacity-50"
        >
          {status === 'quoting' ? '...' : 'Get Quote'}
        </button>
        <button
          onClick={handleSwap}
          disabled={!quote || status === 'swapping'}
          className="py-3 gami-gradient neo-border font-display font-bold uppercase text-xs disabled:opacity-50"
        >
          {status === 'swapping' ? 'Swapping...' : 'Swap'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
      {(txHash || pendingTx) && status === 'success' && (
        <p className="text-green-400 text-xs font-mono break-all">Tx: {txHash ?? pendingTx}</p>
      )}
    </div>
  );
}
