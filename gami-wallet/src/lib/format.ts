export function truncateAddress(addr: string, start = 6, end = 4): string {
  if (addr.length <= start + end + 3) return addr;
  return `${addr.slice(0, start)}…${addr.slice(-end)}`;
}

export function formatXP(xp: number): string {
  return xp.toLocaleString('en-US');
}

export function levelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) ** 2 * 50;
}

export function xpToNextLevel(xp: number): { current: number; max: number; level: number } {
  const level = levelFromXP(xp);
  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  return { current: xp - floor, max: ceiling - floor, level };
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
