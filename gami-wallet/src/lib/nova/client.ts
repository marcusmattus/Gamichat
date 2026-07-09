import Anthropic from '@anthropic-ai/sdk';
import { NOVA_MODEL, NOVA_PERSONAS } from './prompts';
import { suggestQuests } from '../gami/quests';
import { sanitizeContent } from './memory';
import type { NovaPersona } from '@/types';

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  const key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!key) return null;
  if (!client) client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
  return client;
}

export const NOVA_TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_balance',
    description: 'Get wallet balance for a chain',
    input_schema: {
      type: 'object' as const,
      properties: {
        chain: { type: 'string', enum: ['base', 'polygon', 'arbitrum', 'solana'] },
        token: { type: 'string' },
      },
      required: ['chain'],
    },
  },
  {
    name: 'suggest_quest',
    description: 'Suggest quests based on user interests',
    input_schema: {
      type: 'object' as const,
      properties: {
        interests: { type: 'array', items: { type: 'string' } },
        recent_actions: { type: 'array', items: { type: 'string' } },
      },
      required: ['interests'],
    },
  },
  {
    name: 'grant_xp',
    description: 'Grant XP to user',
    input_schema: {
      type: 'object' as const,
      properties: {
        amount: { type: 'number' },
        source: { type: 'string' },
        idempotency_key: { type: 'string' },
      },
      required: ['amount', 'source'],
    },
  },
  {
    name: 'set_persona',
    description: 'Change NOVA personality',
    input_schema: {
      type: 'object' as const,
      properties: {
        persona: { type: 'string', enum: ['Hype', 'Chill', 'Pro'] },
      },
      required: ['persona'],
    },
  },
  {
    name: 'start_send_flow',
    description: 'Open send flow for a chain',
    input_schema: {
      type: 'object' as const,
      properties: {
        chain: { type: 'string' },
        to: { type: 'string' },
        amount: { type: 'string' },
      },
      required: ['chain'],
    },
  },
];

export type ToolHandler = (name: string, input: Record<string, unknown>) => Promise<string>;

export async function streamNovaReply(
  userMessage: string,
  persona: NovaPersona,
  onToken: (token: string) => void,
  onToolCall: (name: string, input: Record<string, unknown>) => void,
  handleTool: ToolHandler
): Promise<string> {
  const anthropic = getClient();

  if (!anthropic) {
    const stub = "yo — i'm offline rn but here's a quest pick: try First Swap on Base for +500 XP 🔥";
    onToolCall('suggest_quest', { interests: [] });
    const quests = suggestQuests([]);
    const full = `${stub}\n\n• ${quests[0]?.title} (+${quests[0]?.xp} XP)`;
    for (const ch of full) {
      onToken(ch);
      await new Promise((r) => setTimeout(r, 12));
    }
    return full;
  }

  const stream = anthropic.messages.stream({
    model: NOVA_MODEL,
    max_tokens: 1024,
    system: NOVA_PERSONAS[persona],
    tools: NOVA_TOOLS,
    messages: [{ role: 'user', content: userMessage }],
  });

  let full = '';

  stream.on('text', (text) => {
    const safe = sanitizeContent(text);
    full += safe;
    onToken(safe);
  });

  const final = await stream.finalMessage();

  for (const block of final.content) {
    if (block.type === 'tool_use') {
      onToolCall(block.name, block.input as Record<string, unknown>);
      const result = await handleTool(block.name, block.input as Record<string, unknown>);
      full += `\n[${block.name}: ${result}]`;
    }
  }

  return full;
}
