import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import type { ChainId } from '@/types';

interface WalletState {
  hasMnemonic: boolean;
  evmAddress: string | null;
  solAddress: string | null;
  activeChain: ChainId;
  balances: Record<string, string>;
  setHasMnemonic: (v: boolean) => void;
  setAddresses: (evm: string, sol: string) => void;
  setActiveChain: (chain: ChainId) => void;
  setBalance: (chain: string, amount: string) => void;
  reset: () => void;
}

const initial = {
  hasMnemonic: false,
  evmAddress: null,
  solAddress: null,
  activeChain: 'base' as ChainId,
  balances: {} as Record<string, string>,
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      ...initial,
      setHasMnemonic: (v) => set({ hasMnemonic: v }),
      setAddresses: (evm, sol) => set({ evmAddress: evm, solAddress: sol }),
      setActiveChain: (chain) => set({ activeChain: chain }),
      setBalance: (chain, amount) =>
        set((s) => ({ balances: { ...s.balances, [chain]: amount } })),
      reset: () => set(initial),
    }),
    { name: 'gami-wallet-state', storage: createJSONStorage(() => mmkvStorage) }
  )
);
