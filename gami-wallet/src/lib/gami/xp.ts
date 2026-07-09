import { levelFromXP } from '../format';

export function grantXP(amount: number, currentXP: number): { xp: number; level: number } {
  const xp = currentXP + amount;
  return { xp, level: levelFromXP(xp) };
}
