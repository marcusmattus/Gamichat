import { NextRequest, NextResponse } from 'next/server';
import { buildSwapQuote } from '@/lib/gami-chain/swap';
import { getEconomyRate } from '@/lib/gami-chain/mcp-client';
import type { TokenSymbol } from '@/lib/gami-chain/config';
import { SUPPORTED_TOKENS } from '@/lib/gami-chain/config';

export async function POST(req: NextRequest) {
  try {
    const { fromToken, toToken, fromAmount, slippageBps } = await req.json();

    if (!fromToken || !toToken || !fromAmount) {
      return NextResponse.json({ error: 'fromToken, toToken, and fromAmount required' }, { status: 400 });
    }

    if (!(fromToken in SUPPORTED_TOKENS) || !(toToken in SUPPORTED_TOKENS)) {
      return NextResponse.json({ error: 'Unsupported token pair' }, { status: 400 });
    }

    if (fromToken === toToken) {
      return NextResponse.json({ error: 'Cannot swap same token' }, { status: 400 });
    }

    const rateData = await getEconomyRate();
    const mcpRate = rateData.gami_usd ?? rateData.rate ?? 2.0;

    const quote = buildSwapQuote(
      fromToken as TokenSymbol,
      toToken as TokenSymbol,
      fromAmount,
      mcpRate,
      slippageBps ?? 50
    );

    return NextResponse.json(quote);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Quote failed' },
      { status: 500 }
    );
  }
}
