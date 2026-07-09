export type Character = 'NX' | 'PX' | 'ZK' | 'OG' | 'OX' | 'GG';

export type ChainId = 'base' | 'polygon' | 'arbitrum' | 'solana';

export type NovaPersona = 'Hype' | 'Chill' | 'Pro';

export type NovaMessage = {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolName?: string;
  ts: number;
};

export type Quest = {
  id: string;
  title: string;
  xp: number;
  badge?: string;
  steps?: string[];
  est_min?: number;
  chain?: string;
  recurring?: string;
};

export type Badge = {
  id: string;
  title: string;
  rarity: 'common' | 'uncommon' | 'rare';
  earned: boolean;
};

export type SecureMethod = 'faceid' | 'pin' | 'skip';
