import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { DotsGrid } from '@/components/stickers/DotsGrid';
import { StickerCard } from '@/components/stickers/StickerCard';
import { TapeLabel } from '@/components/stickers/TapeLabel';
import { useSettingsStore } from '@/stores/settings.store';
import { storePinHash } from '@/lib/crypto/secure';
import { gami } from '@/lib/gami/sdk';
import type { SecureMethod } from '@/types';

export default function SecureScreen() {
  const [method, setMethod] = useState<SecureMethod>('faceid');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const setFaceIDLock = useSettingsStore((s) => s.setFaceIDLock);
  const setSecureMethod = useSettingsStore((s) => s.setSecureMethod);
  const setAutolock = useSettingsStore((s) => s.setAutolock);

  const options: { id: SecureMethod; label: string; sub?: string }[] = [
    { id: 'faceid', label: 'USE FACE ID / TOUCH ID' },
    { id: 'pin', label: 'SET A 6-DIGIT PIN' },
    { id: 'skip', label: 'SKIP (NOT RECOMMENDED)' },
  ];

  const lockItIn = async () => {
    if (method === 'faceid') {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Face ID for GAMI Wallet',
      });
      setFaceIDLock(result.success);
    } else if (method === 'pin' && pin.length === 6 && pin === confirmPin) {
      await storePinHash(btoa(pin));
      setFaceIDLock(false);
    } else if (method === 'skip') {
      setFaceIDLock(false);
    }

    setSecureMethod(method);
    setAutolock('1 minute');

    gami.capture({
      type: 'wallet.secure.method_set',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { method },
    });

    router.push('/(onboarding)/handle');
  };

  return (
    <ScreenBackground>
      <ScreenContainer>
        <DotsGrid total={4} index={1} />
        <T variant="h2" className="text-white mb-2">
          Secure
        </T>
        <T variant="h2" className="text-white mb-6">
          your vault.
        </T>
        <T variant="base" className="text-inkMute mb-8">
          Pick how you unlock GAMI. You can change this later.
        </T>

        <View className="gap-3 mb-6">
          {options.map((opt) => (
            <Pressable key={opt.id} onPress={() => setMethod(opt.id)}>
              <StickerCard
                tone={method === opt.id ? 'purple' : 'ink'}
                className="p-4"
              >
                <View className="flex-row items-center justify-between">
                  <T variant="mono" className="text-white text-sm">
                    {opt.label}
                  </T>
                  {opt.id === 'skip' && <TapeLabel label="!" tone="magenta" rotate={-3} />}
                </View>
              </StickerCard>
            </Pressable>
          ))}
        </View>

        {method === 'pin' && (
          <View className="gap-3 mb-6">
            <TextInput
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor="#6E6688"
              className="border-2 border-line bg-bgRaised p-4 font-mono text-white text-center text-xl"
            />
            <TextInput
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              placeholder="confirm"
              placeholderTextColor="#6E6688"
              className="border-2 border-line bg-bgRaised p-4 font-mono text-white text-center text-xl"
            />
          </View>
        )}

        <PrimaryButton label="LOCK IT IN →" onPress={lockItIn} />
      </ScreenContainer>
    </ScreenBackground>
  );
}
