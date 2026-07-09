import 'react-native-get-random-values';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from './mnemonic';
import { privateKeyToAccount } from 'viem/accounts';
import { createPublicClient, http, type Address, type Hash } from 'viem';
import { base, polygon, arbitrum } from 'viem/chains';
import { CHAINS } from '../chains';
import type { ChainId } from '@/types';

const viemChains = { base, polygon, arbitrum } as const;

export async function deriveEvmAccount(mnemonic: string, index = 0) {
  const seed = mnemonicToSeed(mnemonic);
  const hd = HDKey.fromMasterSeed(seed);
  const child = hd.derive(`m/44'/60'/0'/0/${index}`);
  if (!child.privateKey) throw new Error('Failed to derive EVM key');
  const hex = `0x${Buffer.from(child.privateKey).toString('hex')}` as `0x${string}`;
  return privateKeyToAccount(hex);
}

export function getPublicClient(chainId: ChainId) {
  const chain = viemChains[chainId as keyof typeof viemChains];
  if (!chain) throw new Error(`Unknown EVM chain: ${chainId}`);
  return createPublicClient({
    chain,
    transport: http(CHAINS[chainId].rpc),
  });
}

export async function getBalance(address: Address, chainId: ChainId): Promise<bigint> {
  const client = getPublicClient(chainId);
  return client.getBalance({ address });
}

export async function handshake(chainId: ChainId = 'base'): Promise<number> {
  const client = getPublicClient(chainId);
  return Number(await client.getBlockNumber());
}

export async function estimateFee(chainId: ChainId): Promise<bigint> {
  const client = getPublicClient(chainId);
  const gasPrice = await client.getGasPrice();
  return gasPrice * 21000n;
}

export const FEE_CEILINGS: Record<ChainId, bigint> = {
  base: 500000000000000n,
  polygon: 500000000000000000n,
  arbitrum: 500000000000000n,
  solana: 10000000n,
};
