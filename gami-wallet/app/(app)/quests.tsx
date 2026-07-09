import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { QuestCard } from '@/components/quests/QuestCard';
import { MOCK_QUESTS } from '@/data/mocks';
import { useQuestsStore } from '@/stores/quests.store';

export default function QuestsScreen() {
  const completed = useQuestsStore((s) => s.completed);

  return (
    <ScreenBackground>
      <ScreenContainer className="pt-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <T variant="h2" className="text-white mb-6">
            Quests
          </T>
          {MOCK_QUESTS.filter((q) => q.id !== 'quest_001').map((q) => (
            <View key={q.id} className="mb-4">
              <QuestCard
                id={q.id.toUpperCase()}
                title={q.title}
                xp={q.xp}
                tape={completed.includes(q.id) ? 'DONE' : 'NOVA PICK'}
              />
            </View>
          ))}
        </ScrollView>
      </ScreenContainer>
    </ScreenBackground>
  );
}
