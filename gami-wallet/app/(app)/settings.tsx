import { useState } from 'react';
import { View, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { useUserStore } from '@/stores/user.store';
import { useWalletStore } from '@/stores/wallet.store';
import { useNovaStore } from '@/stores/nova.store';
import { useQuestsStore } from '@/stores/quests.store';
import { useSettingsStore } from '@/stores/settings.store';
import { clearAllSecure } from '@/lib/crypto/secure';
import { gami } from '@/lib/gami/sdk';
import { truncateAddress } from '@/lib/format';
import { hapticLight, hapticWarn } from '@/lib/haptics';
import type { NovaPersona } from '@/types';

function SettingRow({
  label,
  value,
  action,
  onPress,
  toggle,
  toggleValue,
  onToggle,
  warn,
}: {
  label: string;
  value?: string;
  action?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  warn?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={toggle}
      className="flex-row items-center justify-between border-2 border-line bg-bgRaised p-4 mb-2"
    >
      <T variant="base" className="text-white">
        {label}
      </T>
      {toggle && onToggle !== undefined && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#241B3F', true: '#6E3CFB' }}
          thumbColor="#fff"
        />
      )}
      {value && (
        <T variant="mono" className={warn ? 'text-magenta' : 'text-inkDim'}>
          {value}
        </T>
      )}
      {action && (
        <T variant="mono" className="text-purple text-xs">
          {action}
        </T>
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const handle = useUserStore((s) => s.handle);
  const backupCompleted = useUserStore((s) => s.backupCompleted);
  const evmAddress = useWalletStore((s) => s.evmAddress);

  const faceIDLock = useSettingsStore((s) => s.faceIDLock);
  const autolock = useSettingsStore((s) => s.autolock);
  const hideBalances = useSettingsStore((s) => s.hideBalances);
  const soundEffects = useSettingsStore((s) => s.soundEffects);
  const haptics = useSettingsStore((s) => s.haptics);
  const novaPersonality = useSettingsStore((s) => s.novaPersonality);
  const dailyQuestReminder = useSettingsStore((s) => s.dailyQuestReminder);
  const memoryEnabled = useNovaStore((s) => s.memoryEnabled);

  const setFaceIDLock = useSettingsStore((s) => s.setFaceIDLock);
  const setHideBalances = useSettingsStore((s) => s.setHideBalances);
  const setSoundEffects = useSettingsStore((s) => s.setSoundEffects);
  const setHaptics = useSettingsStore((s) => s.setHaptics);
  const setNovaPersonality = useSettingsStore((s) => s.setNovaPersonality);
  const setMemoryEnabled = useNovaStore((s) => s.setMemoryEnabled);

  const personas: NovaPersona[] = ['Hype', 'Chill', 'Pro'];
  const [personaIdx, setPersonaIdx] = useState(personas.indexOf(novaPersonality));

  const changeSetting = (key: string, value: unknown) => {
    gami.capture({
      type: 'settings.changed',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { key, value },
    });
  };

  const signOut = () => {
    Alert.alert('Sign out?', 'This wipes your local wallet data.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await clearAllSecure();
          useUserStore.getState().reset();
          useWalletStore.getState().reset();
          useNovaStore.getState().reset();
          useQuestsStore.getState().reset();
          useSettingsStore.getState().reset();
          gami.clear();
          gami.capture({
            type: 'auth.signout',
            user_id: 'anon',
            tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
            payload: {},
          });
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ScreenBackground>
      <ScreenContainer className="pt-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} className="mb-6">
            <T variant="mono" className="text-white">
              ◀ SETTINGS
            </T>
          </Pressable>

          <T variant="mono" className="text-inkDim mb-2">
            ACCOUNT
          </T>
          <SettingRow label="Display name" value={`@${handle}`} action="EDIT" />
          <SettingRow label="Email" value="nox@gami.xyz" action="EDIT" />
          <SettingRow
            label="Wallet address"
            value={evmAddress ? truncateAddress(evmAddress) : '—'}
            action="COPY"
            onPress={async () => {
              if (evmAddress) {
                await Clipboard.setStringAsync(evmAddress);
                hapticLight();
              }
            }}
          />

          <T variant="mono" className="text-inkDim mb-2 mt-6">
            SECURITY
          </T>
          <SettingRow
            label="Face ID lock"
            toggle
            toggleValue={faceIDLock}
            onToggle={(v) => {
              setFaceIDLock(v);
              changeSetting('faceIDLock', v);
            }}
          />
          <SettingRow label="Auto-lock" value={autolock} />
          <SettingRow
            label="Backup phrase"
            value={backupCompleted ? 'Backed up' : 'Not backed up'}
            warn={!backupCompleted}
            onPress={() => {
              if (!backupCompleted) hapticWarn();
            }}
          />
          <SettingRow
            label="Hide balances"
            toggle
            toggleValue={hideBalances}
            onToggle={(v) => {
              setHideBalances(v);
              changeSetting('hideBalances', v);
            }}
          />

          <T variant="mono" className="text-inkDim mb-2 mt-6">
            GAME
          </T>
          <SettingRow
            label="Sound effects"
            toggle
            toggleValue={soundEffects}
            onToggle={(v) => {
              setSoundEffects(v);
              changeSetting('soundEffects', v);
            }}
          />
          <SettingRow
            label="Haptics"
            toggle
            toggleValue={haptics}
            onToggle={(v) => {
              setHaptics(v);
              changeSetting('haptics', v);
            }}
          />
          <SettingRow
            label="NOVA personality"
            value={novaPersonality}
            onPress={() => {
              const next = (personaIdx + 1) % personas.length;
              setPersonaIdx(next);
              setNovaPersonality(personas[next]);
              changeSetting('novaPersonality', personas[next]);
            }}
          />
          <SettingRow label="NOVA memory" toggle toggleValue={memoryEnabled} onToggle={setMemoryEnabled} />
          <SettingRow label="Daily quest reminder" value={dailyQuestReminder} />

          <View className="mt-10 mb-8">
            <PrimaryButton label="SIGN OUT" tone="magenta" onPress={signOut} />
          </View>

          <T variant="mono" className="text-inkDim text-center mb-8">
            v1.0.0
          </T>
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
