import { GAMI_MCP_URL } from './config';
import type { ChainTxStatus, UserProgress } from './types';

async function mcpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GAMI_MCP_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`MCP request failed (${res.status}): ${body || path}`);
  }

  return res.json() as Promise<T>;
}

export async function getChainActionStatus(txHash: string): Promise<ChainTxStatus> {
  try {
    const data = await mcpFetch<Record<string, unknown>>(`/api/chain/status/${txHash}`);
    return {
      txHash,
      status: (data.status as ChainTxStatus['status']) ?? 'unknown',
      blockNumber: data.block_number as number | undefined,
      confirmations: data.confirmations as number | undefined,
      gasUsed: data.gas_used as string | undefined,
    };
  } catch {
    return { txHash, status: 'unknown' };
  }
}

export async function getUserProgress(walletId: string): Promise<UserProgress> {
  return mcpFetch<UserProgress>(`/api/users/${walletId}/progress`);
}

export async function issueEconomyReward(payload: {
  user_wallet: string;
  amount_xp: number;
  reason: string;
  brand_id?: string;
}): Promise<{ tx_hash?: string }> {
  return mcpFetch('/api/economy/reward', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getEconomyRate(): Promise<{ rate?: number; gami_usd?: number }> {
  try {
    return await mcpFetch('/api/economy/rate');
  } catch {
    return { rate: 1, gami_usd: 2.0 };
  }
}

export async function checkMcpHealth(): Promise<boolean> {
  try {
    const data = await mcpFetch<{ status: string }>('/health');
    return data.status === 'ok';
  } catch {
    return false;
  }
}
