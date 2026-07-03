import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const interaction = await ai.interactions.create({
      model: 'gemini-3.1-pro-preview',
      input: message,
      system_instruction: "You are the Gami Protocol AI Architect. You help users design and build gamified reward systems for their business. Output clean, conversational responses. If they mention their business type, propose an XP system and some quests.",
      generation_config: {
        thinking_level: "high"
      }
    });

    let fullOutput = "";
    for (const step of interaction.steps) {
      if (step.type === 'model_output') {
        const textContent = step.content?.find((c: any) => c.type === 'text') as any;
        if (textContent && textContent.text) {
          fullOutput += textContent.text;
        }
      }
    }

    return NextResponse.json({ text: fullOutput });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
