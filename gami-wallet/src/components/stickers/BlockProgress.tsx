import { View } from 'react-native';
import { T } from '../primitives/Text';

export function BlockProgress({ progress, className = '' }: { progress: number; className?: string }) {
  const segments = 10;
  const filled = Math.round((progress / 100) * segments);
  return (
    <View className={`flex-row gap-1 ${className}`}>
      {Array.from({ length: segments }).map((_, i) => (
        <View
          key={i}
          className={`h-1 flex-1 border border-line ${i < filled ? 'bg-purple' : 'bg-bgSunken'}`}
        />
      ))}
    </View>
  );
}

export function BlockProgressText({ progress, version = 'v1.0.0' }: { progress: number; version?: string }) {
  const bar = '█'.repeat(Math.round(progress / 10)) + '░'.repeat(10 - Math.round(progress / 10));
  return (
    <T variant="mono" className="text-inkDim text-center mt-2">
      {version} · LOADING [{bar}] {Math.round(progress)}%
    </T>
  );
}
