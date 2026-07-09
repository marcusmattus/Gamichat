'use client';

import { useEffect, useState } from 'react';
import { useGamiWallet } from '@/lib/gami-wallet-context';

interface TxRecord {
  hash: string;
  type: 'send' | 'swap' | 'receive';
  status: string;
  timestamp: number;
}

const TX_STORAGE_KEY = 'gami-wallet-txs';

export function TransactionHistory() {
  const { address, pendingTx } = useGamiWallet();
  const [txs, setTxs] = useState<TxRecord[]>([]);

  useEffect(() => {
    if (!address) return;
    const stored = localStorage.getItem(`${TX_STORAGE_KEY}-${address}`);
    if (stored) {
      try {
        setTxs(JSON.parse(stored));
      } catch {
        setTxs([]);
      }
    }
  }, [address]);

  useEffect(() => {
    if (!pendingTx || !address) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/chain/status/${pendingTx}`);
        const data = await res.json();
        const record: TxRecord = {
          hash: pendingTx,
          type: 'send',
          status: data.status ?? 'pending',
          timestamp: Date.now(),
        };
        setTxs((prev) => {
          const updated = [record, ...prev.filter((t) => t.hash !== pendingTx)].slice(0, 20);
          localStorage.setItem(`${TX_STORAGE_KEY}-${address}`, JSON.stringify(updated));
          return updated;
        });
      } catch {
        /* ignore */
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [pendingTx, address]);

  if (!address) return null;

  return (
    <div className="bg-gami-panel neo-border p-4 shadow-brutal">
      <h3 className="font-display font-bold uppercase text-sm mb-4">Recent Transactions</h3>
      {txs.length === 0 ? (
        <p className="text-gray-500 text-sm font-mono text-center py-6">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {txs.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center justify-between p-3 bg-black/40 border border-white/10"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs truncate">{tx.hash}</p>
                <p className="text-[10px] text-gray-500 uppercase">{tx.type}</p>
              </div>
              <span
                className={`text-xs font-mono uppercase px-2 py-1 ${
                  tx.status === 'confirmed'
                    ? 'text-green-400'
                    : tx.status === 'failed'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                }`}
              >
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
