import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { getUserProgress } from '@/lib/gami-chain/mcp-client';
import { createPublicClient, http } from 'viem';
import { GAMIXP_ABI } from '@/lib/gami-chain/abis';
import { GAMIXP_PRECOMPILE, GAMI_RPC_URL, gamiChain } from '@/lib/gami-chain/config';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ walletId: string }> }
) {
  const { walletId } = await params;

  if (!walletId || !isAddress(walletId)) {
    return NextResponse.json({ error: 'Valid wallet address required' }, { status: 400 });
  }

  let mcpProgress = null;
  try {
    mcpProgress = await getUserProgress(walletId);
  } catch {
    /* MCP may be offline */
  }

  let onChain = null;
  try {
    const client = createPublicClient({ chain: gamiChain, transport: http(GAMI_RPC_URL) });
    const [level, totalXP] = (await Promise.all([
      client.readContract({
        address: GAMIXP_PRECOMPILE,
        abi: GAMIXP_ABI,
        functionName: 'getLevel',
        args: [walletId as `0x${string}`],
      }),
      client.readContract({
        address: GAMIXP_PRECOMPILE,
        abi: GAMIXP_ABI,
        functionName: 'getTotalXP',
        args: [walletId as `0x${string}`],
      }),
    ])) as [bigint, bigint];
    onChain = { level: level.toString(), totalXP: totalXP.toString() };
  } catch {
    /* chain may be offline */
  }

  return NextResponse.json({
    wallet_id: walletId,
    mcp: mcpProgress,
    onChain,
  });
}
