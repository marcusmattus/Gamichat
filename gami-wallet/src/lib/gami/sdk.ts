import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { mmkv } from '@/lib/storage';

export interface GamiEvent {
  type: string;
  ts: number;
  user_id: string;
  tenant_id: string;
  idempotency_key: string;
  payload: Record<string, unknown>;
  device: { id: string; os: string; app_version: string };
}

const QUEUE_KEY = 'gami_event_queue';

function getQueue(): GamiEvent[] {
  const raw = mmkv.getString(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GamiEvent[];
  } catch {
    return [];
  }
}

function saveQueue(events: GamiEvent[]) {
  mmkv.set(QUEUE_KEY, JSON.stringify(events));
}

export const gami = {
  capture(
    e: Omit<GamiEvent, 'ts' | 'device' | 'idempotency_key'> & { idempotency_key?: string }
  ) {
    const event: GamiEvent = {
      ...e,
      ts: Date.now(),
      idempotency_key: e.idempotency_key ?? uuidv4(),
      device: {
        id: Constants.sessionId ?? 'unknown',
        os: Platform.OS,
        app_version: Constants.expoConfig?.version ?? '1.0.0',
      },
    };
    const queue = getQueue();
    queue.push(event);
    saveQueue(queue);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.debug('[gami]', event.type, event.payload);
    }
    return event;
  },

  async flush(): Promise<void> {
    const queue = getQueue();
    if (queue.length === 0) return;
    const base = process.env.EXPO_PUBLIC_GAMI_API_BASE;
    if (!base) {
      saveQueue([]);
      return;
    }
    try {
      await fetch(`${base}/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gami-Signature': 'dev-stub',
        },
        body: JSON.stringify({ events: queue }),
      });
      saveQueue([]);
    } catch {
      // keep queue for retry
    }
  },

  clear() {
    saveQueue([]);
  },
};
