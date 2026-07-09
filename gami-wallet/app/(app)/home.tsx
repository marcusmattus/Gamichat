import { useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Download, Trophy, Package, ChevronRight } from 'lucide-react-native';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { StickerCard } from '@/components/stickers/StickerCard';
import { TapeLabel } from '@/components/stickers/TapeLabel';
import { CharacterTile } from '@/components/stickers/CharacterTile';
import { StreakFlame } from '@/components/xp/XPBar';
import { LevelPill, XPBar } from '@/components/xp/XPBar';
import { NovaAvatar } from '@/components/nova/NovaAvatar';
import { useUserStore } from '@/stores/user.store';
import { xpToNextLevel } from '@/lib/format';
import { gami } from '@/lib/gami/sdk';
import { hapticLight } from '@/lib/haptics';
import type { Character } from '@/types';

const ACTIONS = [
  { icon: Send, label: 'Send', route: '/(app)/nova' },
  { icon: Download, label: 'Receive', route: '/(app)/stash' },
  { icon: Trophy, label: 'Quests', route: '/(app)/quests' },
  { icon: Package, label: 'Stash', route: '/(app)/stash' },
];

export default function HomeScreen() {
  const handle = useUserStore((s) => s.handle);
  const character = useUserStore((s) => s.character) as Character;
  const xp = useUserStore((s) => s.xp);
  const streak = useUserStore((s) => s.streak) || 1;
  const { current, max, level } = xpToNextLevel(xp);

  useEffect(() => {
    gami.capture({
      type: 'app.home.view',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: {},
    });
  }, []);

  return (
    <ScreenBackground>
      <ScreenContainer className="pt-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between border-2 border-line bg-bgRaised p-3 mb-6">
            <View className="flex-row items-center gap-2">
              {character && <CharacterTile character={character} size="sm" />}
              <T variant="mono" className="text-white text-sm">
                HEY, @{handle}
              </T>
            </View>
            <StreakFlame days={streak} />
          </View>

          <View className="relative mb-8">
            <StickerCard tone="purple" className="overflow-hidden p-0">
              <LinearGradient colors={['#6E3CFB', '#FF3D9A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5">
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <LevelPill level={level} />
                    <View className="mt-4 mr-4">
                      <XPBar current={current} max={max} />
                    </View>
                  </View>
                  <View className="items-end">
                    <T variant="h2" className="text-white">
                      WELCOME!
                    </T>
                    <T variant="mono" className="text-inkMute text-xs mt-1">
                      +250 XP UNLOCKED
                    </T>
                    <View className="mt-2">
                      <TapeLabel label="🏷 STARTER BADGE EARNED" tone="yellow" rotate={-2} />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </StickerCard>
            <View className="absolute -top-4 -right-2">
              <NovaAvatar size={48} />
            </View>
          </View>

          <View className="flex-row gap-3 mb-8">
            {ACTIONS.map((a) => (
              <Pressable
                key={a.label}
                className="flex-1"
                onPress={() => {
                  hapticLight();
                  router.push(a.route as never);
                }}
              >
                <StickerCard tone="ink" className="p-4 items-center aspect-square justify-center">
                  <a.icon size={24} color="#fff" />
                  <T variant="mono" className="text-white text-xs mt-2">
                    {a.label}
                  </T>
                </StickerCard>
              </Pressable>
            ))}
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <T variant="mono" className="text-inkDim">
              ACTIVE QUEST
            </T>
            <T variant="mono" className="text-purple text-xs">
              NOVA PICK ▸
            </T>
          </View>
          <StickerCard tone="ink" pressable className="p-4 flex-row items-center justify-between">
            <View>
              <T variant="base" className="text-white">
                🗡 First Swap
              </T>
              <T variant="mono" className="text-inkMute text-xs mt-1">
                +500 XP · 5 MIN
              </T>
            </View>
            <ChevronRight size={20} color="#6E6688" />
          </StickerCard>
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
