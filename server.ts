import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import next from 'next';
import { parse } from 'url';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const wss = new WebSocketServer({ server: httpServer, path: '/live' });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  wss.on('connection', async (clientWs) => {
    try {
      const session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are the Gami Protocol AI Architect. You help users design and build gamified reward systems for their business.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) clientWs.send(JSON.stringify({ audio }));
            if (message.serverContent?.interrupted)
              clientWs.send(JSON.stringify({ interrupted: true }));
          },
        },
      });

      clientWs.on('message', (data) => {
        try {
          const { audio } = JSON.parse(data.toString());
          if (audio) {
            session.sendRealtimeInput({
              audio: { data: audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } catch (e) {
          console.error('Error handling WS message', e);
        }
      });

      clientWs.on('close', () => {
        // session.close();
      });
    } catch (e) {
      console.error('Failed to connect to Live API', e);
      clientWs.close();
    }
  });

  server.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
