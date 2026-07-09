import { View } from 'react-native';
import { T } from '../primitives/Text';
import { StickerCard } from '../stickers/StickerCard';
import { TapeLabel } from '../stickers/TapeLabel';

export function QuestCard({
  id,
  title,
  subtitle,
  xp,
  badge,
  tape,
}: {
  id: string;
  title: string;
  subtitle?: string;
  xp?: number;
  badge?: string;
  tape?: string;
}) {
  return (
    <StickerCard tone="purple" className="p-5">
      {tape && (
        <View className="mb-2">
          <TapeLabel label={tape} tone="magenta" />
        </View>
      )}
      <T variant="mono" className="text-inkMute text-xs mb-1">
        {id}
      </T>
      <T variant="h3" className="text-white mb-2">
        {title}
      </T>
      {subtitle && (
        <T variant="base" className="text-inkMute mb-4">
          {subtitle}
        </T>
      )}
      <View className="flex-row gap-2">
        {xp && (
          <View className="bg-lime border-2 border-black px-2 py-1">
            <T variant="mono" className="text-black text-xs">
              ⚡ +{xp} XP
            </T>
          </View>
        )}
        {badge && (
          <View className="bg-yellow border-2 border-black px-2 py-1">
            <T variant="mono" className="text-black text-xs">
              🏷 BADGE
            </T>
          </View>
        )}
      </View>
    </StickerCard>
  );
}
