'use client';

import { useState } from 'react';
import { isAddress, type Address } from 'viem';
import { useGamiWallet } from '@/lib/gami-wallet-context';
import { SUPPORTED_TOKENS, type TokenSymbol } from '@/lib/gami-chain/config';

export function SendTransfer() {
  const { address, sendTransfer, pendingTx } = useGamiWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState<TokenSymbol>('GAMI');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!address) return null;

  const handleSend = async () => {
    setError(null);
    if (!isAddress(to)) {
      setError('Invalid recipient address');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setStatus('sending');
    try {
      await fetch('/api/chain/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: address, to, amount, token }),
      });

      const hash = await sendTransfer(to as Address, amount, token);
      setTxHash(hash);
      setStatus('success');
      setTo('');
      setAmount('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transfer failed');
      setStatus('error');
    }
  };

  return (
    <div className="bg-gami-panel neo-border p-4 shadow-brutal space-y-4">
      <h3 className="font-display font-bold uppercase text-sm">Send</h3>

      <div>
        <label className="font-mono text-[10px] uppercase text-gray-500 block mb-1">Token</label>
        <select
          value={token}
          onChange={(e) => setToken(e.target.value as TokenSymbol)}
          className="w-full bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple"
        >
          {(Object.keys(SUPPORTED_TOKENS) as TokenSymbol[]).map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase text-gray-500 block mb-1">Recipient</label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x..."
          className="w-full bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple"
        />
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase text-gray-500 block mb-1">Amount</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          type="number"
          min="0"
          step="any"
          className="w-full bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={status === 'sending'}
        className="w-full py-3 gami-gradient neo-border font-display font-bold uppercase text-sm disabled:opacity-50"
      >
        {status === 'sending' ? 'Signing...' : 'Send Transfer'}
      </button>

      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
      {(txHash || pendingTx) && status === 'success' && (
        <p className="text-green-400 text-xs font-mono break-all">
          Tx: {txHash ?? pendingTx}
        </p>
      )}
    </div>
  );
}
