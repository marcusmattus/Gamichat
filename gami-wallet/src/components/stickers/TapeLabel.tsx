import { View, Text } from 'react-native';

type TapeLabelProps = {
  label: string;
  tone?: 'magenta' | 'lime' | 'yellow';
  rotate?: number;
  className?: string;
};

export function TapeLabel({ label, tone = 'magenta', rotate = 3, className = '' }: TapeLabelProps) {
  const bg = tone === 'lime' ? 'bg-lime' : tone === 'yellow' ? 'bg-yellow' : 'bg-magenta';
  return (
    <View
      className={`self-start px-3 py-1 border-2 border-black ${bg} ${className}`}
      style={{ transform: [{ rotate: `${rotate}deg` }] }}
    >
      <Text className="font-mono text-xs text-black font-bold tracking-wider">{label}</Text>
    </View>
  );
}
