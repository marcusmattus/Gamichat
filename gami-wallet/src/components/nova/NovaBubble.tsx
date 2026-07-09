import { View } from 'react-native';
import { T } from '../primitives/Text';
import { StickerCard } from '../stickers/StickerCard';
import { TapeLabel } from '../stickers/TapeLabel';

export function NovaBubble({
  children,
  speaker,
  highlight,
}: {
  children: React.ReactNode;
  speaker?: string;
  highlight?: string;
}) {
  return (
    <StickerCard tone="ink" className="p-4 mt-6">
      {speaker && (
        <T variant="mono" className="text-inkMute mb-2">
          {speaker}
        </T>
      )}
      <T variant="base" className="text-ink leading-6">
        {children}
        {highlight && (
          <View className="mt-1">
            <TapeLabel label={highlight} tone="yellow" rotate={-2} />
          </View>
        )}
      </T>
    </StickerCard>
  );
}
