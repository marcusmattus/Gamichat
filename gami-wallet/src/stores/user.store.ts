import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import { levelFromXP } from '@/lib/format';
import type { Character } from '@/types';

interface UserState {
  handle: string | null;
  character: Character | null;
  interests: string[];
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  backupCompleted: boolean;
  onboardingComplete: boolean;
  starterPackClaimed: boolean;
  setHandle: (h: string) => void;
  setCharacter: (c: Character) => void;
  toggleInterest: (id: string) => void;
  setInterests: (ids: string[]) => void;
  grantXP: (amount: number) => void;
  earnBadge: (id: string) => void;
  setBackupCompleted: (v: boolean) => void;
  setOnboardingComplete: (v: boolean) => void;
  setStarterPackClaimed: (v: boolean) => void;
  reset: () => void;
}

const initial = {
  handle: null as string | null,
  character: null as Character | null,
  interests: [] as string[],
  xp: 0,
  level: 1,
  streak: 0,
  badges: [] as string[],
  backupCompleted: false,
  onboardingComplete: false,
  starterPackClaimed: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initial,
      setHandle: (h) => set({ handle: h }),
      setCharacter: (c) => set({ character: c }),
      toggleInterest: (id) => {
        const cur = get().interests;
        if (cur.includes(id)) {
          set({ interests: cur.filter((x) => x !== id) });
        } else {
          set({ interests: [...cur, id] });
        }
      },
      setInterests: (ids) => set({ interests: ids }),
      grantXP: (amount) => {
        const xp = get().xp + amount;
        set({ xp, level: levelFromXP(xp) });
      },
      earnBadge: (id) => {
        const badges = get().badges;
        if (!badges.includes(id)) set({ badges: [...badges, id] });
      },
      setBackupCompleted: (v) => set({ backupCompleted: v }),
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
      setStarterPackClaimed: (v) => set({ starterPackClaimed: v }),
      reset: () => set(initial),
    }),
    { name: 'gami-user', storage: createJSONStorage(() => mmkvStorage) }
  )
);
