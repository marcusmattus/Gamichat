import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { ERC20_ABI } from '@/lib/gami-chain/abis';
import { GAMI_RPC_URL, SUPPORTED_TOKENS, gamiChain, type TokenSymbol } from '@/lib/gami-chain/config';
import { formatUnits } from 'viem';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  const token = req.nextUrl.searchParams.get('token') as TokenSymbol | null;

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'Valid address required' }, { status: 400 });
  }

  const client = createPublicClient({ chain: gamiChain, transport: http(GAMI_RPC_URL) });

  try {
    if (token && token in SUPPORTED_TOKENS) {
      const config = SUPPORTED_TOKENS[token];
      let balance: bigint;

      if (config.isNative) {
        balance = await client.getBalance({ address });
      } else if (config.address) {
        balance = (await client.readContract({
          address: config.address,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [address],
        })) as bigint;
      } else {
        balance = 0n;
      }

      return NextResponse.json({
        symbol: token,
        balance: formatUnits(balance, config.decimals),
        balanceRaw: balance.toString(),
        decimals: config.decimals,
      });
    }

    const balances = await Promise.all(
      (Object.keys(SUPPORTED_TOKENS) as TokenSymbol[]).map(async (sym) => {
        const config = SUPPORTED_TOKENS[sym];
        let balance: bigint;
        if (config.isNative) {
          balance = await client.getBalance({ address });
        } else if (config.address) {
          balance = (await client.readContract({
            address: config.address,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
          })) as bigint;
        } else {
          balance = 0n;
        }
        return {
          symbol: sym,
          name: config.name,
          balance: formatUnits(balance, config.decimals),
          balanceRaw: balance.toString(),
          decimals: config.decimals,
        };
      })
    );

    return NextResponse.json({ address, balances });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch balances' },
      { status: 502 }
    );
  }
}
