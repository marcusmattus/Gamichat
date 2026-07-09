import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { DotsGrid } from '@/components/stickers/DotsGrid';
import { TapeLabel } from '@/components/stickers/TapeLabel';
import { ScribbleUnderline } from '@/components/stickers/ScribbleUnderline';
import { FeatureStickerTile } from '@/components/stickers/CharacterTile';
import { gami } from '@/lib/gami/sdk';
import { useEffect } from 'react';

const FEATURES = [
  { icon: '⚡', label: 'XP ON EVERY ACTION' },
  { icon: '🏆', label: 'QUESTS + REWARDS' },
  { icon: '🛡', label: 'NON-CUSTODIAL' },
  { icon: '🤖', label: 'AI AGENT INSIDE' },
];

export default function WelcomeScreen() {
  useEffect(() => {
    gami.capture({
      type: 'onboarding.welcome.view',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: {},
    });
  }, []);

  return (
    <ScreenBackground>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DotsGrid total={4} index={0} />
          <TapeLabel label="NEW PLAYER" className="mb-6" />
          <T variant="hero" className="text-white">
            Your wallet,
          </T>
          <T variant="hero" className="text-white">
            but make it
          </T>
          <View className="mb-2">
            <T variant="hero" className="text-magenta">
              FUN.
            </T>
            <ScribbleUnderline color="#FF3D9A" width={100} />
          </View>
          <T variant="base" className="text-inkMute mt-4 mb-8">
            Stack XP. Smash quests. Earn real rewards across every chain you touch. Let's gooo.
          </T>
          <View className="flex-row flex-wrap gap-3 mb-10">
            {FEATURES.map((f, i) => (
              <MotiView
                key={f.label}
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: i * 60, type: 'timing', duration: 400 }}
                style={{ width: '47%' }}
              >
                <FeatureStickerTile icon={f.icon} label={f.label} />
              </MotiView>
            ))}
          </View>
          <PrimaryButton label="LET'S GO →" onPress={() => router.push('/(onboarding)/auth')} />
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
