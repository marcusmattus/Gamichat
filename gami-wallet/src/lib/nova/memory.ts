import type { NovaMessage } from '@/types';

const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function filterExpired(messages: NovaMessage[]): NovaMessage[] {
  const cutoff = Date.now() - TTL_MS;
  return messages.filter((m) => m.ts > cutoff);
}

export function sanitizeContent(content: string): string {
  const patterns = [
    /\b([a-z]+\s+){11,23}[a-z]+\b/gi,
    /0x[a-fA-F0-9]{64}/g,
    /[1-9A-HJ-NP-Za-km-z]{87,88}/g,
  ];
  let safe = content;
  for (const p of patterns) {
    safe = safe.replace(p, '[redacted]');
  }
  return safe;
}
