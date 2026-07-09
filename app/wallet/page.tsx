'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { WalletConnect, BalanceList, XPStats } from './components/WalletConnect';
import { SendTransfer } from './components/SendTransfer';
import { ReceiveTransfer } from './components/ReceiveTransfer';
import { TokenSwap } from './components/TokenSwap';
import { TransactionHistory } from './components/TransactionHistory';
import { useGamiWallet } from '@/lib/gami-wallet-context';
import { useState } from 'react';

type Tab = 'overview' | 'send' | 'receive' | 'swap';

export default function WalletPage() {
  const { address } = useGamiWallet();
  const [tab, setTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'send', label: 'Send', icon: '↑' },
    { id: 'receive', label: 'Receive', icon: '↓' },
    { id: 'swap', label: 'Swap', icon: '⇄' },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-28 px-4 max-w-lg mx-auto w-full">
        <div className="mb-6">
          <Link href="/" className="font-mono text-xs text-gami-accent uppercase hover:underline">
            ← Back to Gami
          </Link>
          <h1 className="font-display font-bold text-3xl uppercase italic mt-2">Gami Wallet</h1>
          <p className="text-sm text-gray-400 mt-1">
            On-chain transfers, token swaps, and XP on Gami Protocol L1
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <WalletConnect />
          {address && <XPStats />}
          {address && tab === 'overview' && <BalanceList />}
        </div>

        {address && (
          <>
            <div className="grid grid-cols-4 gap-1 mb-4 sticky top-20 z-30 bg-gami-bg/95 backdrop-blur py-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`py-3 text-center border-2 font-display font-bold text-[10px] uppercase transition-all ${
                    tab === t.id
                      ? 'bg-gami-purple border-black shadow-brutal'
                      : 'border-white/10 hover:border-gami-accent'
                  }`}
                >
                  <span className="block text-lg mb-0.5">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {tab === 'send' && <SendTransfer />}
              {tab === 'receive' && <ReceiveTransfer />}
              {tab === 'swap' && <TokenSwap />}
              {(tab === 'overview' || tab === 'send' || tab === 'swap') && <TransactionHistory />}
            </div>
          </>
        )}

        {!address && (
          <div className="mt-8 p-6 border-2 border-dashed border-white/10 text-center">
            <p className="font-mono text-sm text-gray-500 uppercase mb-2">Chain Connection Points</p>
            <ul className="text-left text-sm text-gray-400 space-y-2 font-mono">
              <li>• Gami L1 RPC via wallet-sdk + viem</li>
              <li>• MCP backend for XP rewards & tx status</li>
              <li>• XP precompile 0x...0800</li>
              <li>• Treasury precompile 0x...0801</li>
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
