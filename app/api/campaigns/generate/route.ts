import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { objective, dataContext } = await req.json();

    const prompt = `You are the Gami Protocol AI Campaign Agent.
Based on the following objective and context, generate 3 marketing campaign concepts.
Include templates like Seasonal Sale, Referral Drive, Product Launch, or Engagement Challenge.

Objective: ${objective}
Context: ${dataContext}

Return the response as a JSON array of objects with the following structure:
[
  {
    "id": "unique-id",
    "title": "Campaign Name",
    "type": "Seasonal Sale | Referral Drive | Product Launch | Engagement Challenge",
    "description": "Short description of the campaign",
    "suggestedRewards": "e.g., 500 XP, 10% Discount",
    "targetAudience": "e.g., Lapsed users",
    "duration": "e.g., 14 days",
    "predictedMetrics": {
      "estimatedReach": "e.g., 12,500 users",
      "expectedConversion": "e.g., 14.5%",
      "engagementLift": "e.g., +28%"
    },
    "engagementGrowthTrend": [
      { "period": "Day 0", "engagement": 100 },
      { "period": "Day 3", "engagement": 125 },
      { "period": "Day 6", "engagement": 160 },
      { "period": "Day 9", "engagement": 210 },
      { "period": "Day 12", "engagement": 280 },
      { "period": "Day 15", "engagement": 350 }
    ]
  }
]
Return ONLY valid JSON, no markdown formatting. Keep the trends realistic but positive based on the rewards structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const text = response.text || "[]";
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    let campaigns = [];
    try {
        campaigns = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON", e);
    }

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
