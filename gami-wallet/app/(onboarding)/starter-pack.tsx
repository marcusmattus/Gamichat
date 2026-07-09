import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { StickerCard } from '@/components/stickers/StickerCard';
import { useUserStore } from '@/stores/user.store';
import { useQuestsStore } from '@/stores/quests.store';
import { gami } from '@/lib/gami/sdk';
import { hapticSuccess } from '@/lib/haptics';

const REWARDS = [
  { label: 'BADGE — STARTER', tone: 'yellow' as const, rotate: -4 },
  { label: '+250 XP', tone: 'purple' as const, rotate: 0 },
  { label: '1× MINT CREDIT', tone: 'magenta' as const, rotate: 4 },
];

export default function StarterPackScreen() {
  const grantXP = useUserStore((s) => s.grantXP);
  const earnBadge = useUserStore((s) => s.earnBadge);
  const setStarterPackClaimed = useUserStore((s) => s.setStarterPackClaimed);
  const completeQuest = useQuestsStore((s) => s.completeQuest);

  useEffect(() => {
    grantXP(250);
    earnBadge('starter');
    setStarterPackClaimed(true);
    completeQuest('quest_001');
    hapticSuccess();

    gami.capture({
      type: 'quest.reward.claimed',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { quest_id: 'quest_001' },
    });
    gami.capture({
      type: 'xp.granted',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { amount: 250, source: 'quest_001' },
    });
    gami.capture({
      type: 'badge.earned',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { badge_id: 'starter' },
    });
    gami.capture({
      type: 'quest.001.complete',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: {},
    });
  }, []);

  return (
    <ScreenBackground>
      <ScreenContainer className="items-center justify-center">
        <View className="items-center gap-4 mb-10" style={{ height: 280 }}>
          {REWARDS.map((r, i) => (
            <MotiView
              key={r.label}
              from={{ opacity: 0, translateY: -40, rotate: `${r.rotate}deg` }}
              animate={{ opacity: 1, translateY: i * 8, rotate: `${r.rotate}deg` }}
              transition={{ type: 'spring', delay: i * 150, damping: 12 }}
              style={{ position: i === 0 ? 'relative' : 'absolute', top: i * 24, zIndex: 3 - i }}
            >
              <StickerCard tone={r.tone} className="px-8 py-4">
                <T variant="mono" className="text-black font-bold">
                  {r.label}
                </T>
              </StickerCard>
            </MotiView>
          ))}
        </View>

        <T variant="base" className="text-inkMute text-center mb-10">
          your starter pack is live. let's gooo.
        </T>

        <PrimaryButton
          label="STASH IT →"
          onPress={() => router.push('/(onboarding)/permissions')}
        />
      </ScreenContainer>
    </ScreenBackground>
  );
}
