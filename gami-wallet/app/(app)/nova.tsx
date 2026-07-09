import { useState } from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/primitives/PrimaryButton';
import { NovaAvatar } from '@/components/nova/NovaAvatar';
import { StickerCard } from '@/components/stickers/StickerCard';
import { streamNovaReply } from '@/lib/nova/client';
import { suggestQuests } from '@/lib/gami/quests';
import { useNovaStore } from '@/stores/nova.store';
import { useUserStore } from '@/stores/user.store';
import { useWalletStore } from '@/stores/wallet.store';
import { useSettingsStore } from '@/stores/settings.store';

export default function NovaScreen() {
  const [input, setInput] = useState('');
  const [streamText, setStreamText] = useState('');
  const [toolCalls, setToolCalls] = useState<string[]>([]);

  const persona = useNovaStore((s) => s.persona);
  const conversation = useNovaStore((s) => s.conversation);
  const isStreaming = useNovaStore((s) => s.isStreaming);
  const addMessage = useNovaStore((s) => s.addMessage);
  const setStreaming = useNovaStore((s) => s.setStreaming);
  const setPersona = useNovaStore((s) => s.setPersona);

  const interests = useUserStore((s) => s.interests);
  const grantXP = useUserStore((s) => s.grantXP);
  const balances = useWalletStore((s) => s.balances);
  const activeChain = useWalletStore((s) => s.activeChain);
  const setNovaPersonality = useSettingsStore((s) => s.setNovaPersonality);

  const handleTool = async (name: string, toolInput: Record<string, unknown>): Promise<string> => {
    switch (name) {
      case 'get_balance':
        return JSON.stringify({
          amount: balances[activeChain] ?? '0',
          symbol: activeChain === 'solana' ? 'SOL' : 'ETH',
          usd: '0',
        });
      case 'suggest_quest': {
        const quests = suggestQuests(interests);
        return JSON.stringify(quests.slice(0, 3));
      }
      case 'grant_xp': {
        const amount = Number(toolInput.amount ?? 0);
        grantXP(amount);
        return JSON.stringify({ ok: true });
      }
      case 'set_persona': {
        const p = toolInput.persona as 'Hype' | 'Chill' | 'Pro';
        setPersona(p);
        setNovaPersonality(p);
        return JSON.stringify({ ok: true });
      }
      default:
        return JSON.stringify({ ok: true });
    }
  };

  const send = async () => {
    if (!input.trim() || isStreaming) return;
    const msg = input.trim();
    setInput('');
    addMessage({ role: 'user', content: msg });
    setStreaming(true);
    setStreamText('');
    setToolCalls([]);

    const full = await streamNovaReply(
      msg,
      persona,
      (token) => setStreamText((t) => t + token),
      (name, input) => {
        setToolCalls((t) => [...t, name]);
      },
      handleTool
    );

    addMessage({ role: 'assistant', content: full });
    setStreamText('');
    setStreaming(false);
  };

  return (
    <ScreenBackground>
      <ScreenContainer className="pt-4">
        <View className="flex-row items-center gap-3 mb-4">
          <NovaAvatar size={48} />
          <View>
            <T variant="mono" className="text-lime text-xs">
              ▸ AI AGENT — ONLINE
            </T>
            <T variant="lg" className="text-white">
              NOVA
            </T>
          </View>
        </View>

        <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
          {conversation.map((m) => (
            <StickerCard
              key={m.id}
              tone={m.role === 'user' ? 'ink' : 'purple'}
              className="p-3 mb-2"
            >
              <T variant="base" className="text-white">
                {m.content}
              </T>
            </StickerCard>
          ))}
          {isStreaming && streamText && (
            <StickerCard tone="purple" className="p-3 mb-2">
              <T variant="base" className="text-white">
                {streamText}|
              </T>
            </StickerCard>
          )}
          {toolCalls.map((t) => (
            <StickerCard key={t} tone="ink" className="p-2 mb-2 opacity-70">
              <T variant="mono" className="text-inkDim text-xs">
                NOVA used `{t}`
              </T>
            </StickerCard>
          ))}
        </ScrollView>

        <View className="flex-row gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="ask NOVA anything…"
            placeholderTextColor="#6E6688"
            className="flex-1 border-2 border-line bg-bgRaised p-3 font-sans text-white"
            onSubmitEditing={send}
          />
          <PrimaryButton label="→" onPress={send} loading={isStreaming} className="px-4" />
        </View>
      </ScreenContainer>
    </ScreenBackground>
  );
}
