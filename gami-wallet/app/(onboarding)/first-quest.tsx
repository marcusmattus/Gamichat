import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { TapeLabel } from '@/components/stickers/TapeLabel';
import { QuestCard } from '@/components/quests/QuestCard';
import { ChecklistRow } from '@/components/quests/ChecklistRow';
import { useWalletStore } from '@/stores/wallet.store';
import { useUserStore } from '@/stores/user.store';
import { useQuestsStore } from '@/stores/quests.store';
import { gami } from '@/lib/gami/sdk';

export default function FirstQuestScreen() {
  const hasMnemonic = useWalletStore((s) => s.hasMnemonic);
  const handle = useUserStore((s) => s.handle);
  const interests = useUserStore((s) => s.interests);
  const notificationsEnabled = useQuestsStore((s) => s.notificationsEnabled);
  const starterPackClaimed = useUserStore((s) => s.starterPackClaimed);

  const steps = [
    { label: 'Create wallet', state: hasMnemonic ? ('done' as const) : ('todo' as const) },
    { label: 'Pick handle', state: handle ? ('done' as const) : ('todo' as const) },
    { label: 'Choose interests', state: interests.length >= 3 ? ('done' as const) : ('todo' as const) },
    {
      label: 'Enable notifications',
      state: notificationsEnabled ? ('done' as const) : ('active' as const),
      tape: '4',
    },
    { label: 'Claim reward', state: starterPackClaimed ? ('done' as const) : ('todo' as const) },
  ];

  return (
    <ScreenBackground>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-between items-center mb-4">
            <TapeLabel label="▸ TUTORIAL QUEST" tone="magenta" />
            <T variant="mono" className="text-inkMute">
              01/01
            </T>
          </View>

          <QuestCard
            id="QUEST_001"
            title="First Steps"
            subtitle="Complete onboarding to unlock your starter pack."
            xp={250}
            badge="starter"
          />

          <View className="mt-6 mb-8">
            {steps.map((s) => (
              <ChecklistRow key={s.label} label={s.label} state={s.state} tape={'tape' in s ? s.tape : undefined} />
            ))}
          </View>

          <PrimaryButton
            label="CONTINUE →"
            onPress={() => {
              gami.capture({
                type: 'quest.001.step_complete',
                user_id: 'anon',
                tenant_id: process.env.EXPO_PUBLIC_GAMI_TENANT_ID ?? 'dev',
                payload: { step: 'notifications' },
              });
              router.push('/(onboarding)/starter-pack');
            }}
          />
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
