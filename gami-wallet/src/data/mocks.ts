export const MOCK_USER = {
  id: 'usr_01HZNX',
  handle: 'noxx_',
  character: 'NX' as const,
  evm: { address: '0x7f3aA1C3b4FfE6E3a92dBDe0B3F1ed5fC9b9Ab29c' },
  sol: { address: 'Hn8q9c1k2m3n4o5p6q7r8s9t0u1v2w3x4y5z6' },
  xp: 250,
  level: 1,
  streak: 1,
  badges: ['starter'],
  interests: ['gaming', 'nfts', 'ai'],
};

export const MOCK_QUESTS = [
  {
    id: 'quest_001',
    title: 'First Steps',
    xp: 250,
    badge: 'starter',
    steps: ['create_wallet', 'pick_handle', 'choose_interests', 'enable_notifs', 'claim_reward'],
  },
  { id: 'quest_002', title: 'First Swap', xp: 500, est_min: 5, chain: 'base' },
  { id: 'quest_003', title: 'Mint Mondays', xp: 300, recurring: 'weekly' },
];

export const MOCK_BADGES = [
  { id: 'starter', title: 'Starter', rarity: 'common' as const, earned: true },
  { id: 'first_swap', title: 'First Swap', rarity: 'common' as const, earned: false },
  { id: '7_day', title: '7-Day', rarity: 'uncommon' as const, earned: false },
  { id: 'holder', title: 'Holder', rarity: 'rare' as const, earned: false },
];

export const MOCK_NOVA_TURNS = [
  { role: 'assistant' as const, content: "yo. i'm your wallet's brain. ready to stack?" },
];

export const INTEREST_CHIPS = [
  { id: 'gaming', label: 'GAMING', emoji: '🎮', tone: '#6E3CFB' },
  { id: 'defi', label: 'DEFI', emoji: '🪙', tone: '#FFD53D' },
  { id: 'nfts', label: 'NFTs', emoji: '🖼', tone: '#FF3D9A' },
  { id: 'airdrops', label: 'AIRDROPS', emoji: '🪂', tone: '#3DE6FF' },
  { id: 'memes', label: 'MEMES', emoji: '😹', tone: '#FF8A3D' },
  { id: 'daos', label: 'DAOs', emoji: '🏛', tone: '#A6FF3D' },
  { id: 'ai', label: 'AI', emoji: '🤖', tone: '#8B5BFF' },
  { id: 'trading', label: 'TRADING', emoji: '📈', tone: '#FF3D6B' },
  { id: 'community', label: 'COMMUNITY', emoji: '💬', tone: '#B6ADD2' },
];

export const HANDLE_BLOCKLIST = ['admin', 'gami', 'nova', 'root', 'test'];
