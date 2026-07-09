import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';

interface QuestsState {
  completed: string[];
  tutorialStep: number;
  notificationsEnabled: boolean;
  completeQuest: (id: string) => void;
  setTutorialStep: (step: number) => void;
  setNotificationsEnabled: (v: boolean) => void;
  reset: () => void;
}

const initial = {
  completed: [] as string[],
  tutorialStep: 0,
  notificationsEnabled: false,
};

export const useQuestsStore = create<QuestsState>()(
  persist(
    (set, get) => ({
      ...initial,
      completeQuest: (id) => {
        const cur = get().completed;
        if (!cur.includes(id)) set({ completed: [...cur, id] });
      },
      setTutorialStep: (step) => set({ tutorialStep: step }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      reset: () => set(initial),
    }),
    { name: 'gami-quests', storage: createJSONStorage(() => mmkvStorage) }
  )
);
