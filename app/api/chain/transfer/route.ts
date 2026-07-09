import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { validateTransferRequest } from '@/lib/gami-chain/transfer';
import type { TransferRequest } from '@/lib/gami-chain/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<TransferRequest>;
    const error = validateTransferRequest(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (!body.from || !isAddress(body.from)) {
      return NextResponse.json({ error: 'Sender address required' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      transfer: {
        from: body.from,
        to: body.to,
        amount: body.amount,
        token: body.token,
      },
      message: 'Transfer validated. Sign with connected wallet on client.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
