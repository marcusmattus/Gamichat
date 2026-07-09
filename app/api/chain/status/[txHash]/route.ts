import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { getChainActionStatus } from '@/lib/gami-chain/mcp-client';
import { GAMI_RPC_URL, gamiChain } from '@/lib/gami-chain/config';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ txHash: string }> }
) {
  const { txHash } = await params;

  if (!txHash || !txHash.startsWith('0x')) {
    return NextResponse.json({ error: 'Invalid transaction hash' }, { status: 400 });
  }

  const mcpStatus = await getChainActionStatus(txHash);

  if (mcpStatus.status !== 'unknown') {
    return NextResponse.json(mcpStatus);
  }

  try {
    const client = createPublicClient({ chain: gamiChain, transport: http(GAMI_RPC_URL) });
    const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });

    if (!receipt) {
      return NextResponse.json({ txHash, status: 'pending' });
    }

    return NextResponse.json({
      txHash,
      status: receipt.status === 'success' ? 'confirmed' : 'failed',
      blockNumber: Number(receipt.blockNumber),
      gasUsed: receipt.gasUsed.toString(),
    });
  } catch {
    return NextResponse.json({ txHash, status: 'pending' });
  }
}
