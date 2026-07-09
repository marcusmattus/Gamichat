import 'react-native-get-random-values';
import { HDKey } from '@scure/bip32';
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { mnemonicToSeed } from './mnemonic';
import { CHAINS } from '../chains';

export async function deriveSolanaKeypair(mnemonic: string): Promise<Keypair> {
  const seed = mnemonicToSeed(mnemonic);
  const hd = HDKey.fromMasterSeed(seed);
  const child = hd.derive(`m/44'/501'/0'/0'`);
  if (!child.privateKey) throw new Error('Failed to derive Solana key');
  return Keypair.fromSeed(child.privateKey.slice(0, 32));
}

export function getConnection(): Connection {
  return new Connection(CHAINS.solana.rpc, 'confirmed');
}

export async function getSolBalance(pubkey: PublicKey): Promise<number> {
  const conn = getConnection();
  const lamports = await conn.getBalance(pubkey);
  return lamports / LAMPORTS_PER_SOL;
}

export async function solanaHandshake(): Promise<number> {
  const conn = getConnection();
  return conn.getSlot();
}
