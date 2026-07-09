import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { validateSwapQuote } from '@/lib/gami-chain/swap';
import { SUPPORTED_TOKENS } from '@/lib/gami-chain/config';
import type { SwapQuote } from '@/lib/gami-chain/types';

const SWAP_ROUTER = (process.env.GAMI_SWAP_ROUTER_ADDRESS ??
  '0x0000000000000000000000000000000000000999') as `0x${string}`;

export async function POST(req: NextRequest) {
  try {
    const quote = (await req.json()) as SwapQuote & { sender?: string };

    if (!validateSwapQuote(quote)) {
      return NextResponse.json({ error: 'Quote expired or invalid' }, { status: 400 });
    }

    if (!quote.sender || !isAddress(quote.sender)) {
      return NextResponse.json({ error: 'Connected wallet address required' }, { status: 400 });
    }

    const toConfig = SUPPORTED_TOKENS[quote.toToken];
    if (!toConfig) {
      return NextResponse.json({ error: 'Invalid output token' }, { status: 400 });
    }

    return NextResponse.json({
      action: 'transfer',
      recipient: SWAP_ROUTER,
      amount: quote.fromAmount,
      token: quote.fromToken,
      expectedOutput: quote.toAmount,
      minimumReceived: quote.minimumReceived,
      router: SWAP_ROUTER,
      message: `Swap ${quote.fromAmount} ${quote.fromToken} → ~${quote.toAmount} ${quote.toToken}`,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid swap request' }, { status: 400 });
  }
}
