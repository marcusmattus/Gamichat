import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { StickerCard } from '@/components/stickers/StickerCard';
import { TapeLabel } from '@/components/stickers/TapeLabel';
import { useSettingsStore } from '@/stores/settings.store';
import { useQuestsStore } from '@/stores/quests.store';
import { useUserStore } from '@/stores/user.store';
import { gami } from '@/lib/gami/sdk';
import { hapticLight } from '@/lib/haptics';

export default function PermissionsScreen() {
  const setNotifications = useSettingsStore((s) => s.setNotifications);
  const setPushToken = useSettingsStore((s) => s.setPushToken);
  const setNotificationsEnabled = useQuestsStore((s) => s.setNotificationsEnabled);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);

  const finish = () => {
    setOnboardingComplete(true);
    router.replace('/(app)/home');
  };

  const enableNotifs = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setNotifications(granted);
    setNotificationsEnabled(granted);
    if (granted) {
      const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
      if (token) setPushToken(token.data);
      gami.capture({
        type: 'permissions.notifications.granted',
        user_id: 'anon',
        tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
        payload: {},
      });
    } else {
      gami.capture({
        type: 'permissions.notifications.denied',
        user_id: 'anon',
        tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
        payload: {},
      });
    }
    finish();
  };

  return (
    <ScreenBackground>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <T variant="h2" className="text-white">
            Stay in
          </T>
          <T variant="h2" className="text-white mb-4">
            the loop.
          </T>
          <T variant="base" className="text-inkMute mb-10">
            We ping you for streaks + rewards. Nothing else. Promise.
          </T>

          <View style={{ transform: [{ rotate: '-2deg' }] }} className="mb-6">
            <StickerCard tone="yellow" className="p-10 items-center relative">
              <View className="absolute -top-2 -right-2">
                <TapeLabel label="3" tone="magenta" />
              </View>
              <Bell size={48} color="#000" strokeWidth={2} />
            </StickerCard>
          </View>

          <StickerCard tone="ink" className="p-4 mb-3 opacity-80">
            <T variant="base" className="text-inkMute">
              🔥 7-day streak! +200 XP awarded
            </T>
          </StickerCard>
          <StickerCard tone="ink" className="p-4 mb-10 opacity-80">
            <T variant="base" className="text-inkMute">
              ⭐ New quest available — NOVA recommends: Mint Mondays
            </T>
          </StickerCard>

          <PrimaryButton label="TURN ON NOTIFS →" onPress={enableNotifs} className="mb-4" />
          <Pressable
            onPress={() => {
              hapticLight();
              finish();
            }}
            className="items-center py-4"
          >
            <T variant="mono" className="text-inkMute underline">
              Maybe later
            </T>
          </Pressable>
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
