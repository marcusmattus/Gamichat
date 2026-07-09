import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import { filterExpired } from '@/lib/nova/memory';
import type { NovaMessage, NovaPersona } from '@/types';

interface NovaState {
  persona: NovaPersona;
  memoryEnabled: boolean;
  conversation: NovaMessage[];
  isStreaming: boolean;
  setPersona: (p: NovaPersona) => void;
  setMemoryEnabled: (v: boolean) => void;
  addMessage: (msg: Omit<NovaMessage, 'id' | 'ts'>) => void;
  setStreaming: (v: boolean) => void;
  clearConversation: () => void;
  reset: () => void;
}

const initial = {
  persona: 'Hype' as NovaPersona,
  memoryEnabled: true,
  conversation: [] as NovaMessage[],
  isStreaming: false,
};

export const useNovaStore = create<NovaState>()(
  persist(
    (set, get) => ({
      ...initial,
      setPersona: (p) => set({ persona: p }),
      setMemoryEnabled: (v) => set({ memoryEnabled: v }),
      addMessage: (msg) => {
        const entry: NovaMessage = {
          ...msg,
          id: `msg_${Date.now()}`,
          ts: Date.now(),
        };
        const conv = get().memoryEnabled
          ? filterExpired([...get().conversation, entry])
          : [entry];
        set({ conversation: conv });
      },
      setStreaming: (v) => set({ isStreaming: v }),
      clearConversation: () => set({ conversation: [] }),
      reset: () => set(initial),
    }),
    { name: 'gami-nova', storage: createJSONStorage(() => mmkvStorage) }
  )
);
