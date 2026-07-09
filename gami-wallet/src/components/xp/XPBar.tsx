import { View } from 'react-native';
import { T } from '../primitives/Text';

export function XPBar({ current, max, tone = 'purple' }: { current: number; max: number; tone?: 'purple' | 'magenta' }) {
  const pct = Math.min(100, (current / max) * 100);
  const fill = tone === 'magenta' ? 'bg-magenta' : 'bg-lime';
  return (
    <View className="gap-1">
      <View className="h-3 border-2 border-black bg-bgSunken flex-row">
        <View className={`h-full ${fill}`} style={{ width: `${pct}%` }} />
      </View>
      <T variant="mono" className="text-inkMute text-xs">
        {current} / {max} XP
      </T>
    </View>
  );
}

export function LevelPill({ level }: { level: number }) {
  return (
    <View className="bg-black border-2 border-black px-3 py-1">
      <T variant="mono" className="text-lime text-sm font-bold">
        LVL {level}
      </T>
    </View>
  );
}

export function StreakFlame({ days }: { days: number }) {
  return (
    <View className="bg-yellow border-2 border-black px-2 py-0.5" style={{ transform: [{ rotate: '2deg' }] }}>
      <T variant="mono" className="text-black text-xs font-bold">
        ▶ {days} DAY{days !== 1 ? 'S' : ''}
      </T>
    </View>
  );
}
