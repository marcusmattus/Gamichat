import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Wallet } from 'lucide-react-native';
import { MotiView } from 'moti';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { DotsGrid } from '@/components/stickers/DotsGrid';
import { StickerCard } from '@/components/stickers/StickerCard';
import { createMnemonic } from '@/lib/crypto/mnemonic';
import { deriveEvmAccount, handshake } from '@/lib/crypto/evm';
import { deriveSolanaKeypair } from '@/lib/crypto/solana';
import { encryptMnemonic, storeMnemonic } from '@/lib/crypto/secure';
import { useWalletStore } from '@/stores/wallet.store';
import { useUserStore } from '@/stores/user.store';
import { gami } from '@/lib/gami/sdk';

type Step = 'keys' | 'vault' | 'handshake';

export default function CreateWalletScreen() {
  const [steps, setSteps] = useState<Record<Step, 'pending' | 'done' | 'loading'>>({
    keys: 'loading',
    vault: 'pending',
    handshake: 'pending',
  });
  const [error, setError] = useState<string | null>(null);
  const setHasMnemonic = useWalletStore((s) => s.setHasMnemonic);
  const setAddresses = useWalletStore((s) => s.setAddresses);
  const grantXP = useUserStore((s) => s.grantXP);

  useEffect(() => {
    gami.capture({
      type: 'wallet.create.start',
      user_id: 'anon',
      tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
      payload: {},
    });

    let cancelled = false;

    async function forge() {
      try {
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;

        const mnemonic = createMnemonic();
        const evm = await deriveEvmAccount(mnemonic);
        const sol = await deriveSolanaKeypair(mnemonic);

        setSteps((s) => ({ ...s, keys: 'done', vault: 'loading' }));
        await new Promise((r) => setTimeout(r, 500));
        if (cancelled) return;

        const encrypted = encryptMnemonic(mnemonic);
        await storeMnemonic(encrypted);
        setHasMnemonic(true);
        setAddresses(evm.address, sol.publicKey.toBase58());

        setSteps((s) => ({ ...s, vault: 'done', handshake: 'loading' }));
        await new Promise((r) => setTimeout(r, 500));
        if (cancelled) return;

        const block = await handshake('base');
        setSteps((s) => ({ ...s, handshake: 'done' }));

        grantXP(50);
        gami.capture({
          type: 'wallet.create.success',
          user_id: 'anon',
          tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
          payload: { chains_ready: ['base', 'solana'], block },
        });

        await new Promise((r) => setTimeout(r, 400));
        if (!cancelled) router.replace('/(onboarding)/secure');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Wallet creation failed');
      }
    }

    forge();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows: { key: Step; label: string; icon: string }[] = [
    { key: 'keys', label: 'KEYS GENERATED', icon: '✓' },
    { key: 'vault', label: 'VAULT ENCRYPTED', icon: '✓' },
    { key: 'handshake', label: 'ON-CHAIN HANDSHAKE', icon: '↻' },
  ];

  return (
    <ScreenBackground>
      <ScreenContainer className="items-center">
        <DotsGrid total={4} index={1} />
        <StickerCard tone="purple" className="p-8 mb-2">
          <Wallet size={48} color="#fff" strokeWidth={2} />
        </StickerCard>
        <T variant="mono" className="text-inkDim mb-8">
          ▶ WHIRR.WAV
        </T>
        <T variant="h2" className="text-white text-center">
          Forging your
        </T>
        <T variant="h2" className="text-white text-center mb-4">
          wallet…
        </T>
        <T variant="base" className="text-inkMute text-center mb-10">
          Generating keys. Locking 'em up tight. We'll set up backup later — promise.
        </T>

        <View className="w-full gap-3">
          {rows.map((row) => {
            const state = steps[row.key];
            return (
              <MotiView
                key={row.key}
                from={{ scale: 1.15 }}
                animate={{ scale: state === 'done' ? 1 : 1 }}
                transition={{ type: 'spring', damping: 12 }}
              >
                <View className="flex-row items-center justify-between border-2 border-line bg-bgRaised p-4">
                  <T variant="mono" className={state === 'pending' ? 'text-inkDim' : 'text-white'}>
                    {row.label}
                  </T>
                  <T variant="mono" className={state === 'done' ? 'text-lime' : state === 'loading' ? 'text-purple' : 'text-inkDim'}>
                    {state === 'done' ? '✓' : state === 'loading' ? '↻' : '○'}
                  </T>
                </View>
              </MotiView>
            );
          })}
        </View>

        {error && (
          <StickerCard tone="magenta" className="p-4 mt-6 w-full">
            <T variant="base" className="text-white">
              {error}
            </T>
          </StickerCard>
        )}
      </ScreenContainer>
    </ScreenBackground>
  );
}
