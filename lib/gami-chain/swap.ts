import { parseUnits, formatUnits } from 'viem';
import { SUPPORTED_TOKENS, type TokenSymbol } from './config';
import type { SwapQuote } from './types';

const DEFAULT_RATES: Record<string, number> = {
  'GAMI-USDC': 2.0,
  'GAMI-ETH': 0.001,
  'USDC-GAMI': 0.5,
  'USDC-ETH': 0.0005,
  'ETH-GAMI': 1000,
  'ETH-USDC': 2000,
};

const QUOTE_TTL_MS = 30_000;

export function getExchangeRate(
  fromToken: TokenSymbol,
  toToken: TokenSymbol,
  mcpRate?: number
): number {
  if (fromToken === toToken) return 1;

  const pairKey = `${fromToken}-${toToken}`;
  if (pairKey === 'GAMI-USDC' && mcpRate) return mcpRate;
  if (pairKey === 'USDC-GAMI' && mcpRate) return 1 / mcpRate;

  return DEFAULT_RATES[pairKey] ?? 1;
}

export function buildSwapQuote(
  fromToken: TokenSymbol,
  toToken: TokenSymbol,
  fromAmount: string,
  mcpRate?: number,
  slippageBps = 50
): SwapQuote {
  const fromConfig = SUPPORTED_TOKENS[fromToken];
  const toConfig = SUPPORTED_TOKENS[toToken];
  const rate = getExchangeRate(fromToken, toToken, mcpRate);

  const fromAmountNum = parseFloat(fromAmount);
  const toAmountNum = fromAmountNum * rate;
  const priceImpact = fromAmountNum > 1000 ? 0.5 : 0.1;
  const slippageFactor = 1 - slippageBps / 10_000;
  const minimumReceived = toAmountNum * slippageFactor;

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount: toAmountNum.toFixed(toConfig.decimals > 6 ? 6 : toConfig.decimals),
    rate,
    priceImpact,
    minimumReceived: minimumReceived.toFixed(toConfig.decimals > 6 ? 6 : toConfig.decimals),
    expiresAt: Date.now() + QUOTE_TTL_MS,
  };
}

export function validateSwapQuote(quote: SwapQuote): boolean {
  return Date.now() < quote.expiresAt && parseFloat(quote.fromAmount) > 0;
}

export function parseTokenAmount(amount: string, token: TokenSymbol): bigint {
  return parseUnits(amount, SUPPORTED_TOKENS[token].decimals);
}

export function formatTokenAmount(amount: bigint, token: TokenSymbol): string {
  return formatUnits(amount, SUPPORTED_TOKENS[token].decimals);
}
