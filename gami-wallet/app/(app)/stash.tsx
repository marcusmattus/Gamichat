import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { StickerCard } from '@/components/stickers/StickerCard';
import { MOCK_BADGES } from '@/data/mocks';
import { useUserStore } from '@/stores/user.store';

export default function StashScreen() {
  const badges = useUserStore((s) => s.badges);

  return (
    <ScreenBackground>
      <ScreenContainer className="pt-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <T variant="h2" className="text-white mb-2">
            Stash
          </T>
          <T variant="base" className="text-inkMute mb-8">
            Badges, NFTs, and rewards you've collected.
          </T>

          <T variant="mono" className="text-inkDim mb-3">
            BADGES
          </T>
          <View className="flex-row flex-wrap gap-3 mb-8">
            {MOCK_BADGES.map((b) => {
              const earned = badges.includes(b.id);
              return (
                <StickerCard
                  key={b.id}
                  tone={earned ? 'yellow' : 'ink'}
                  className={`p-4 w-[45%] items-center ${!earned ? 'opacity-40' : ''}`}
                >
                  <T variant="mono" className={earned ? 'text-black' : 'text-inkDim'}>
                    🏷 {b.title.toUpperCase()}
                  </T>
                </StickerCard>
              );
            })}
          </View>

          <T variant="mono" className="text-inkDim mb-3">
            MINT CREDITS
          </T>
          <StickerCard tone="magenta" className="p-4">
            <T variant="mono" className="text-white">
              1× MINT CREDIT — unused
            </T>
          </StickerCard>
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
