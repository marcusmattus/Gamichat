import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { DotsGrid } from '@/components/stickers/DotsGrid';
import { BlockProgress } from '@/components/stickers/BlockProgress';
import { ChipGrid, ChipGridProgress } from '@/components/quests/ChipGrid';
import { INTEREST_CHIPS } from '@/data/mocks';
import { useUserStore } from '@/stores/user.store';
import { gami } from '@/lib/gami/sdk';

export default function InterestsScreen() {
  const interests = useUserStore((s) => s.interests);
  const setInterests = useUserStore((s) => s.setInterests);
  const min = 3;
  const target = 5;
  const canContinue = interests.length >= min;

  return (
    <ScreenBackground>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DotsGrid total={4} index={3} />
          <T variant="h2" className="text-white">
            What's your
          </T>
          <T variant="h2" className="text-white mb-4">
            vibe?
          </T>
          <T variant="base" className="text-inkMute mb-4">
            NOVA tunes quests to your taste. Pick 3+.
          </T>
          <ChipGridProgress count={interests.length} target={target} />
          <BlockProgress progress={(interests.length / target) * 100} className="mb-6" />

          <ChipGrid items={INTEREST_CHIPS} value={interests} onChange={setInterests} min={min} />

          <View className="mt-10">
            <PrimaryButton
              label="LOCK IN MY VIBE →"
              disabled={!canContinue}
              onPress={() => {
                gami.capture({
                  type: 'onboarding.interests.selected',
                  user_id: 'anon',
                  tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
                  payload: { interests },
                });
                router.push('/(onboarding)/first-quest');
              }}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
