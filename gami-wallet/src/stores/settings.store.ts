import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import type { NovaPersona, SecureMethod } from '@/types';

interface SettingsState {
  faceIDLock: boolean;
  autolock: string;
  hideBalances: boolean;
  soundEffects: boolean;
  haptics: boolean;
  notifications: boolean;
  pushToken: string | null;
  novaPersonality: NovaPersona;
  secureMethod: SecureMethod | null;
  dailyQuestReminder: string;
  hydrated: boolean;
  setFaceIDLock: (v: boolean) => void;
  setAutolock: (v: string) => void;
  setHideBalances: (v: boolean) => void;
  setSoundEffects: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
  setPushToken: (t: string | null) => void;
  setNovaPersonality: (p: NovaPersona) => void;
  setSecureMethod: (m: SecureMethod) => void;
  setDailyQuestReminder: (t: string) => void;
  setHydrated: (v: boolean) => void;
  reset: () => void;
}

const initial = {
  faceIDLock: true,
  autolock: '1 minute',
  hideBalances: false,
  soundEffects: true,
  haptics: true,
  notifications: true,
  pushToken: null as string | null,
  novaPersonality: 'Hype' as NovaPersona,
  secureMethod: null as SecureMethod | null,
  dailyQuestReminder: '9:00 AM',
  hydrated: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initial,
      setFaceIDLock: (v) => set({ faceIDLock: v }),
      setAutolock: (v) => set({ autolock: v }),
      setHideBalances: (v) => set({ hideBalances: v }),
      setSoundEffects: (v) => set({ soundEffects: v }),
      setHaptics: (v) => set({ haptics: v }),
      setNotifications: (v) => set({ notifications: v }),
      setPushToken: (t) => set({ pushToken: t }),
      setNovaPersonality: (p) => set({ novaPersonality: p }),
      setSecureMethod: (m) => set({ secureMethod: m }),
      setDailyQuestReminder: (t) => set({ dailyQuestReminder: t }),
      setHydrated: (v) => set({ hydrated: v }),
      reset: () => set({ ...initial, hydrated: true }),
    }),
    {
      name: 'gami-settings',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
