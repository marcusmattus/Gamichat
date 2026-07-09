import { defineChain } from 'viem';

export const GAMIXP_PRECOMPILE = '0x0000000000000000000000000000000000000800' as const;
export const GAMI_TREASURY_PRECOMPILE = '0x0000000000000000000000000000000000000801' as const;

export const GAMI_CHAIN_ID = Number(process.env.NEXT_PUBLIC_GAMI_CHAIN_ID ?? '1337');
export const GAMI_RPC_URL = process.env.NEXT_PUBLIC_GAMI_RPC_URL ?? 'http://localhost:8545';
export const GAMI_MCP_URL = process.env.GAMI_MCP_URL ?? 'http://localhost:9000';

export const gamiChain = defineChain({
  id: GAMI_CHAIN_ID,
  name: 'Gami Protocol',
  nativeCurrency: {
    name: 'GAMI',
    symbol: 'GAMI',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [GAMI_RPC_URL] },
  },
});

export const SUPPORTED_TOKENS = {
  GAMI: {
    symbol: 'GAMI',
    name: 'Gami Token',
    decimals: 18,
    address: null as `0x${string}` | null,
    isNative: true,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: (process.env.NEXT_PUBLIC_GAMI_USDC_ADDRESS ??
      '0x0000000000000000000000000000000000000001') as `0x${string}`,
    isNative: false,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Wrapped ETH',
    decimals: 18,
    address: (process.env.NEXT_PUBLIC_GAMI_WETH_ADDRESS ??
      '0x0000000000000000000000000000000000000002') as `0x${string}`,
    isNative: false,
  },
} as const;

export type TokenSymbol = keyof typeof SUPPORTED_TOKENS;
