import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { StickerCard } from '@/components/stickers/StickerCard';
import { TapeLabel } from '@/components/stickers/TapeLabel';
import { CharacterTile } from '@/components/stickers/CharacterTile';
import { LevelPill, XPBar } from '@/components/xp/XPBar';
import { MOCK_BADGES } from '@/data/mocks';
import { useUserStore } from '@/stores/user.store';
import { useWalletStore } from '@/stores/wallet.store';
import { useSettingsStore } from '@/stores/settings.store';
import { truncateAddress, xpToNextLevel } from '@/lib/format';
import { gami } from '@/lib/gami/sdk';
import { hapticLight } from '@/lib/haptics';
import type { Character } from '@/types';

const ACCOUNT_ROWS = [
  { id: 'security', icon: '🛡', label: 'Security & backup', badge: 'NEW' },
  { id: 'wallets', icon: '🔗', label: 'Connected wallets', value: '1' },
  { id: 'notifications', icon: '🔔', label: 'Notifications', valueKey: 'notifications' as const },
  { id: 'nova', icon: '✨', label: 'NOVA settings' },
  { id: 'help', icon: '❓', label: 'Help & support' },
];

export default function ProfileScreen() {
  const handle = useUserStore((s) => s.handle);
  const character = useUserStore((s) => s.character) as Character;
  const xp = useUserStore((s) => s.xp);
  const streak = useUserStore((s) => s.streak) || 1;
  const badges = useUserStore((s) => s.badges);
  const backupCompleted = useUserStore((s) => s.backupCompleted);
  const evmAddress = useWalletStore((s) => s.evmAddress);
  const notifications = useSettingsStore((s) => s.notifications);
  const { current, max, level } = xpToNextLevel(xp);

  return (
    <ScreenBackground>
      <ScreenContainer className="pt-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-between items-center border-2 border-line bg-bgRaised p-3 mb-6">
            <T variant="xl" className="text-white font-display tracking-widest">
              PROFILE
            </T>
            <Pressable
              onPress={() => {
                hapticLight();
                router.push('/(app)/settings');
              }}
            >
              <Settings size={22} color="#fff" />
            </Pressable>
          </View>

          <StickerCard tone="purple" className="overflow-hidden p-0 mb-6">
            <LinearGradient colors={['#6E3CFB', '#4A1FD1']} className="p-4">
              <View className="flex-row gap-4">
                {character && <CharacterTile character={character} size="md" />}
                <View className="flex-1">
                  <T variant="h3" className="text-white">
                    @{handle}
                  </T>
                  <T variant="mono" className="text-inkMute text-xs mt-1">
                    {handle}.gami · {evmAddress ? truncateAddress(evmAddress) : '0x…'}
                  </T>
                  <View className="flex-row gap-2 mt-3">
                    <View className="bg-bgSunken border border-line px-2 py-1 rounded-full">
                      <T variant="mono" className="text-xs text-inkMute">
                        🔥 {streak}D STREAK
                      </T>
                    </View>
                    {badges.includes('starter') && (
                      <View className="bg-yellow border border-black px-2 py-1 rounded-full">
                        <T variant="mono" className="text-xs text-black">
                          🏷 STARTER
                        </T>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </StickerCard>

          <View className="flex-row gap-3 mb-6">
            <StickerCard tone="ink" className="flex-1 p-3">
              <LevelPill level={level} />
              <View className="mt-2">
                <XPBar current={current} max={max} />
              </View>
            </StickerCard>
            <StickerCard tone="ink" className="flex-1 p-3 justify-center">
              <T variant="mono" className="text-white text-sm">
                0.50 ETH
              </T>
              <T variant="mono" className="text-lime text-xs">
                +0.5 today
              </T>
            </StickerCard>
            <StickerCard tone="ink" className="flex-1 p-3 justify-center">
              <T variant="mono" className="text-white text-sm">
                #412
              </T>
              <T variant="mono" className="text-inkDim text-xs">
                of 18.2k
              </T>
            </StickerCard>
          </View>

          <View className="flex-row justify-between mb-3">
            <T variant="mono" className="text-inkDim">
              BADGES · {badges.length}/24
            </T>
            <T variant="mono" className="text-purple text-xs">
              VIEW ALL ▸
            </T>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
            <View className="flex-row gap-2">
              {MOCK_BADGES.map((b) => {
                const earned = badges.includes(b.id);
                return (
                  <StickerCard
                    key={b.id}
                    tone={earned ? 'yellow' : 'ink'}
                    className={`p-3 w-24 items-center ${!earned ? 'opacity-40' : ''}`}
                  >
                    <T variant="mono" className={`text-xs text-center ${earned ? 'text-black' : 'text-inkDim'}`}>
                      {b.title.toUpperCase()}
                    </T>
                  </StickerCard>
                );
              })}
            </View>
          </ScrollView>

          <T variant="mono" className="text-inkDim mb-3">
            ACCOUNT
          </T>
          {ACCOUNT_ROWS.map((row) => (
            <Pressable
              key={row.id}
              onPress={() => {
                hapticLight();
                gami.capture({
                  type: 'profile.row.tap',
                  user_id: 'anon',
                  tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
                  payload: { id: row.id },
                });
              }}
            >
              <View className="flex-row items-center justify-between border-2 border-line bg-bgRaised p-4 mb-2">
                <T variant="base" className="text-white">
                  {row.icon} {row.label}
                </T>
                {row.id === 'security' && !backupCompleted && (
                  <TapeLabel label="NEW" tone="magenta" rotate={2} />
                )}
                {row.value && (
                  <T variant="mono" className="text-inkDim">
                    {row.value}
                  </T>
                )}
                {row.valueKey === 'notifications' && (
                  <T variant="mono" className="text-inkDim">
                    {notifications ? 'ON' : 'OFF'}
                  </T>
                )}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
