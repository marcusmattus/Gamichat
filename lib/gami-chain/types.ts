import type { Address, Hash } from 'viem';
import type { TokenSymbol } from './config';

export interface UserStats {
  level: bigint;
  totalXP: bigint;
  xpToNextLevel: bigint;
}

export interface BudgetCheck {
  allowed: boolean;
  remaining: bigint;
}

export interface TokenBalance {
  symbol: TokenSymbol;
  name: string;
  balance: string;
  balanceRaw: bigint;
  decimals: number;
  usdValue?: string;
}

export interface TransferRequest {
  from: Address;
  to: Address;
  amount: string;
  token: TokenSymbol;
}

export interface TransferResult {
  txHash: Hash;
  from: Address;
  to: Address;
  amount: string;
  token: TokenSymbol;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface SwapQuote {
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  fromAmount: string;
  toAmount: string;
  rate: number;
  priceImpact: number;
  minimumReceived: string;
  expiresAt: number;
}

export interface SwapRequest {
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  fromAmount: string;
  slippageBps?: number;
}

export interface SwapResult {
  txHash: Hash;
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  fromAmount: string;
  toAmount: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface ChainTxStatus {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed' | 'unknown';
  blockNumber?: number;
  confirmations?: number;
  gasUsed?: string;
}

export interface UserProgress {
  wallet_id: string;
  level?: number;
  total_xp?: number;
  active_quests?: unknown[];
  reward_eligibility?: Record<string, unknown>;
}
