import { useState, useEffect } from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { DotsGrid } from '@/components/stickers/DotsGrid';
import { CharacterTile } from '@/components/stickers/CharacterTile';
import { HANDLE_BLOCKLIST } from '@/data/mocks';
import { useUserStore } from '@/stores/user.store';
import { gami } from '@/lib/gami/sdk';
import type { Character } from '@/types';

const CHARACTERS: Character[] = ['NX', 'PX', 'ZK', 'OG', 'OX', 'GG'];

export default function HandleScreen() {
  const [character, setCharacter] = useState<Character>('NX');
  const [handle, setHandle] = useState('noxx_');
  const [available, setAvailable] = useState(false);
  const setHandleStore = useUserStore((s) => s.setHandle);
  const setCharacterStore = useUserStore((s) => s.setCharacter);

  useEffect(() => {
    const timer = setTimeout(() => {
      const valid = /^[a-z0-9_]{3,16}$/.test(handle) && !handle.startsWith('_');
      const notBlocked = !HANDLE_BLOCKLIST.includes(handle.toLowerCase());
      setAvailable(valid && notBlocked);
    }, 250);
    return () => clearTimeout(timer);
  }, [handle]);

  const claim = () => {
    if (!available) return;
    setCharacterStore(character);
    setHandleStore(handle);
    gami.capture({
      type: 'onboarding.character.selected',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { character },
    });
    gami.capture({
      type: 'onboarding.handle.claimed',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: { handle },
    });
    router.push('/(onboarding)/nova');
  };

  return (
    <ScreenBackground>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DotsGrid total={4} index={2} />
          <T variant="h2" className="text-white">
            Pick your
          </T>
          <T variant="h2" className="text-white mb-6">
            character.
          </T>

          <View className="items-center mb-6">
            <CharacterTile character={character} selected size="lg" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
            <View className="flex-row gap-3">
              {CHARACTERS.map((c) => (
                <CharacterTile
                  key={c}
                  character={c}
                  selected={c === character}
                  size="sm"
                  onPress={() => {
                    setCharacter(c);
                    gami.capture({
                      type: 'onboarding.character.selected',
                      user_id: 'anon',
                      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
                      payload: { character: c },
                    });
                  }}
                />
              ))}
            </View>
          </ScrollView>

          <T variant="mono" className="text-inkDim mb-2">
            HANDLE
          </T>
          <View className="flex-row items-center border-2 border-line bg-bgRaised mb-2">
            <TextInput
              value={handle}
              onChangeText={(t) => setHandle(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              className="flex-1 p-4 font-mono text-white text-base"
              placeholder="@handle"
              placeholderTextColor="#6E6688"
              autoCapitalize="none"
            />
            {available && <Check size={20} color="#A6FF3D" strokeWidth={3} style={{ marginRight: 16 }} />}
          </View>
          <T variant="mono" className={`mb-8 ${available ? 'text-lime' : 'text-inkDim'}`}>
            {available ? `✓ available · saves to ${handle}.gami` : 'checking…'}
          </T>

          <PrimaryButton label="CLAIM IT →" disabled={!available} onPress={claim} />
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
