import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { DotsGrid } from '@/components/stickers/DotsGrid';
import { NovaAvatar } from '@/components/nova/NovaAvatar';
import { NovaBubble } from '@/components/nova/NovaBubble';
import { StickerCard } from '@/components/stickers/StickerCard';
import { gami } from '@/lib/gami/sdk';

const CAPS = [
  { icon: '🏆', label: 'QUESTS' },
  { icon: '⚡', label: 'TIMING' },
  { icon: '✨', label: 'ALPHA' },
];

export default function NovaIntroScreen() {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    gami.capture({
      type: 'nova.intro.view',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: {},
    });

    const full = "yo. i'm your wallet's brain.";
    let i = 0;
    const interval = setInterval(() => {
      if (i <= full.length) {
        setTyped(full.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScreenBackground>
      <ScreenContainer>
        <DotsGrid total={4} index={2} />
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-2 h-2 bg-lime rounded-full" />
          <T variant="mono" className="text-lime text-xs">
            ▸ AI AGENT — ONLINE
          </T>
        </View>
        <T variant="h2" className="text-white mb-8">
          meet NOVA.
        </T>

        <View className="items-center">
          <NovaAvatar size={140} />
        </View>

        <NovaBubble speaker={`"${typed}"`}>
          I find quests you'll actually like, time your moves, and call out alpha.
        </NovaBubble>
        <View className="mt-2 mb-8">
          <T variant="base" className="text-inkMute">
            {' '}
          </T>
        </View>

        <View className="flex-row gap-2 mb-10">
          {CAPS.map((c) => (
            <StickerCard key={c.label} tone="ink" className="flex-1 p-3 items-center">
              <T variant="mono" className="text-lg">
                {c.icon}
              </T>
              <T variant="mono" className="text-white text-xs mt-1">
                {c.label}
              </T>
            </StickerCard>
          ))}
        </View>

        <PrimaryButton
          label="LET'S DO THIS →"
          onPress={() => {
            gami.capture({
              type: 'nova.intro.continue',
              user_id: 'anon',
              tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
              payload: {},
            });
            router.push('/(onboarding)/interests');
          }}
        />
      </ScreenContainer>
    </ScreenBackground>
  );
}
