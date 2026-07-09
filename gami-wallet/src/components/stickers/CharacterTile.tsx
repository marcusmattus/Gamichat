import { View, Text } from 'react-native';
import { StickerCard } from '../stickers/StickerCard';
import { CHARACTER_COLORS } from '@/design/tokens';
import type { Character } from '@/types';

export function CharacterTile({
  character,
  selected,
  size = 'md',
  onPress,
}: {
  character: Character;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}) {
  const dim = size === 'lg' ? 200 : size === 'sm' ? 48 : 64;
  const color = CHARACTER_COLORS[character] ?? '#6E3CFB';

  return (
    <View style={{ width: dim, height: dim }}>
      <StickerCard
        pressable={!!onPress}
        onPress={onPress}
        tone="ink"
        offset={selected ? 'md' : 'sm'}
        className={`items-center justify-center flex-1 ${selected ? 'border-magenta border-[3px]' : ''}`}
      >
        <View className="flex-1 w-full items-center justify-center" style={{ backgroundColor: color, minHeight: dim - 8 }}>
          <Text className="font-displayXL text-white text-2xl">{character}</Text>
        </View>
      </StickerCard>
    </View>
  );
}

export function FeatureStickerTile({ icon, label }: { icon: string; label: string }) {
  return (
    <StickerCard tone="ink" className="p-4 flex-1 min-h-[100px] justify-between">
      <Text className="text-2xl">{icon}</Text>
      <Text className="font-display text-white text-sm tracking-wide mt-4">{label}</Text>
    </StickerCard>
  );
}
