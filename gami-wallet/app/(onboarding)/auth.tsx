import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { DotsGrid } from '@/components/stickers/DotsGrid';
import { StickerCard } from '@/components/stickers/StickerCard';
import { gami } from '@/lib/gami/sdk';
import { hapticLight } from '@/lib/haptics';

export default function AuthScreen() {
  useEffect(() => {
    gami.capture({
      type: 'onboarding.auth.view',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: {},
    });
  }, []);

  const selectMethod = (method: string) => {
    gami.capture({
      type: 'onboarding.auth.method_selected',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { method },
    });
    if (method === 'create') router.push('/(onboarding)/create');
    else if (method === 'import') router.push('/(onboarding)/create');
    else router.push('/(onboarding)/create');
  };

  return (
    <ScreenBackground>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DotsGrid total={4} index={0} />
          <T variant="h1" className="text-white mb-2">
            Choose your
          </T>
          <T variant="h1" className="text-white mb-4">
            start.
          </T>
          <T variant="base" className="text-inkMute mb-8">
            You can switch later. No pressure.
          </T>

          <StickerCard
            tone="purple"
            pressable
            onPress={() => selectMethod('create')}
            tape={{ label: '+50 XP', tone: 'magenta' }}
            className="p-5 mb-4"
          >
            <View className="flex-row items-start gap-3">
              <Plus size={28} color="#fff" strokeWidth={2.5} />
              <View className="flex-1">
                <T variant="lg" className="text-white uppercase tracking-wide">
                  CREATE NEW WALLET
                </T>
                <T variant="base" className="text-inkMute mt-2">
                  Fresh start. We'll handle the boring crypto bits — you focus on stacking XP.
                </T>
              </View>
            </View>
          </StickerCard>

          <View className="flex-row gap-3 mb-6">
            <StickerCard tone="ink" pressable onPress={() => selectMethod('google')} className="flex-1 p-4">
              <T variant="mono" className="text-white text-sm">
                GOOGLE
              </T>
              <T variant="xs" className="text-inkDim mt-1">
                1-tap auth
              </T>
            </StickerCard>
            <StickerCard tone="ink" pressable onPress={() => selectMethod('apple')} className="flex-1 p-4">
              <T variant="mono" className="text-white text-sm">
                APPLE
              </T>
              <T variant="xs" className="text-inkDim mt-1">
                Face ID
              </T>
            </StickerCard>
          </View>

          <Pressable
            onPress={() => {
              hapticLight();
              selectMethod('import');
            }}
            className="border-2 border-dashed border-lineHot p-4 items-center"
          >
            <T variant="mono" className="text-inkMute">
              📂 I HAVE A WALLET — IMPORT IT
            </T>
          </Pressable>
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
