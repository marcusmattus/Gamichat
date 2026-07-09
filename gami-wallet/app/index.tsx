import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { GamiLogo } from '@/components/stickers/GamiLogo';
import { BlockProgress, BlockProgressText } from '@/components/stickers/BlockProgress';
import { useWalletStore } from '@/stores/wallet.store';
import { useUserStore } from '@/stores/user.store';
import { gami } from '@/lib/gami/sdk';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const hasMnemonic = useWalletStore((s) => s.hasMnemonic);
  const handle = useUserStore((s) => s.handle);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.02, { duration: 1200 }), withTiming(1, { duration: 1200 })),
      -1,
      true
    );
  }, [scale]);

  useEffect(() => {
    gami.capture({
      type: 'app.launch',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: {},
    });

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 80));
    }, 100);

    const timer = setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
      if (hasMnemonic && handle && onboardingComplete) {
        router.replace('/(app)/home');
      } else {
        router.replace('/(onboarding)/welcome');
      }
    }, 1600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [hasMnemonic, handle, onboardingComplete]);

  const logoAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScreenBackground>
      <ScreenContainer className="items-center justify-center">
        <Animated.View style={logoAnim}>
          <GamiLogo size={96} />
        </Animated.View>
        <View className="items-center mt-8">
          <T variant="hero" className="text-white tracking-tight">
            GAMI
          </T>
          <T variant="hero" className="text-purple tracking-tight">
            WALLET
          </T>
        </View>
        <T variant="mono" className="text-inkMute mt-4 tracking-widest">
          ▸ PLAY · EARN · OWN ◂
        </T>
        <View className="absolute bottom-16 w-full px-6">
          <BlockProgress progress={progress} />
          <BlockProgressText progress={progress} />
        </View>
      </ScreenContainer>
    </ScreenBackground>
  );
}
