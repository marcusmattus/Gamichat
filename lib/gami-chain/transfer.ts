import { isAddress, type Address } from 'viem';
import { SUPPORTED_TOKENS, type TokenSymbol } from './config';
import type { TransferRequest } from './types';

export function validateTransferRequest(req: Partial<TransferRequest>): string | null {
  if (!req.to || !isAddress(req.to)) {
    return 'Invalid recipient address';
  }
  if (!req.amount || parseFloat(req.amount) <= 0) {
    return 'Amount must be greater than zero';
  }
  if (!req.token || !(req.token in SUPPORTED_TOKENS)) {
    return 'Unsupported token';
  }
  if (req.from && req.to.toLowerCase() === req.from.toLowerCase()) {
    return 'Cannot send to yourself';
  }
  return null;
}

export function shortenAddress(address: Address, chars = 4): string {
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

export function formatTxAmount(amount: string, token: TokenSymbol): string {
  const num = parseFloat(amount);
  const symbol = SUPPORTED_TOKENS[token].symbol;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M ${symbol}`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K ${symbol}`;
  return `${num.toFixed(4)} ${symbol}`;
}
