import { MOCK_QUESTS } from '@/data/mocks';
import type { Quest } from '@/types';

export function getQuests(): Quest[] {
  return MOCK_QUESTS;
}

export function suggestQuests(interests: string[]): Quest[] {
  const quests = MOCK_QUESTS.filter((q) => q.id !== 'quest_001');
  if (interests.includes('defi') || interests.includes('trading')) {
    return [quests[0], quests[1], quests[0]];
  }
  return quests.slice(0, 3);
}
