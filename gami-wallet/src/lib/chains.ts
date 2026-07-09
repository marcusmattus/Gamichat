import type { ChainId } from '@/types';

export const CHAINS = {
  base: {
    id: 8453,
    name: 'Base',
    family: 'evm' as const,
    rpc: process.env.EXPO_PUBLIC_BASE_RPC ?? 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    native: 'ETH',
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    family: 'evm' as const,
    rpc: process.env.EXPO_PUBLIC_POLYGON_RPC ?? 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    native: 'MATIC',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    family: 'evm' as const,
    rpc: process.env.EXPO_PUBLIC_ARB_RPC ?? 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    native: 'ETH',
  },
  solana: {
    id: 'mainnet' as const,
    name: 'Solana',
    family: 'svm' as const,
    rpc: process.env.EXPO_PUBLIC_SOL_RPC ?? 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    native: 'SOL',
  },
} as const;

export type ChainKey = keyof typeof CHAINS;

export function getChainKey(id: ChainId): ChainKey {
  return id;
}
