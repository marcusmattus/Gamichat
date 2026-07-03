'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Studio() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [chatHistory, setChatHistory] = useState<{role: string, content: string, time: string, reward?: any}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Initial chat message
    setChatHistory([
      { 
        role: 'agent', 
        content: 'Greetings. I am the Gami AI Architect. Let’s build your gamification engine. What type of business do you run?', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  // We connect to WS and establish the Live API session.
  const connectLiveAPI = async () => {
    if (isConnected) return;
    try {
      const wsUrl = window.location.protocol === 'https:' ? `wss://${window.location.host}/live` : `ws://${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const inputAudioCtx = new AudioContext({ sampleRate: 16000 });
      const outputAudioCtx = new AudioContext({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputAudioCtx;
      outputAudioCtxRef.current = outputAudioCtx;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
          playAudioChunk(outputAudioCtx, msg.audio);
        }
        if (msg.interrupted) {
          // stop playback
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        stopRecording();
      };
    } catch (e) {
      console.error(e);
    }
  };

  let nextStartTime = 0;
  const playAudioChunk = async (audioCtx: AudioContext, base64Audio: string) => {
    try {
      const binaryStr = atob(base64Audio);
      const len = binaryStr.length;
      const bytes = new Int16Array(len / 2);
      for (let i = 0; i < len; i += 2) {
        bytes[i / 2] = (binaryStr.charCodeAt(i) & 0xff) | (binaryStr.charCodeAt(i + 1) << 8);
      }
      
      const buffer = audioCtx.createBuffer(1, bytes.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < bytes.length; i++) {
        channelData[i] = bytes[i] / 32768.0;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      
      if (nextStartTime < audioCtx.currentTime) {
        nextStartTime = audioCtx.currentTime;
      }
      source.start(nextStartTime);
      nextStartTime += buffer.duration;
    } catch (e) {
      console.error('Error playing audio chunk', e);
    }
  };

  const pcmToBase64 = (float32Array: Float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startRecording = async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connectLiveAPI();
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioCtx = inputAudioCtxRef.current!;
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };
      
      setIsRecording(true);
    } catch (e) {
      console.error("Error starting recording", e);
    }
  };

  const stopRecording = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    setChatHistory(prev => [...prev, {
      role: 'user',
      content: userInput,
      time: now
    }]);

    const input = userInput;
    setUserInput('');
    setIsTyping(true);

    // Call standard generation API for text since live API is audio only
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    })
    .then(res => res.json())
    .then(data => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, {
        role: 'agent',
        content: data.text,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        reward: data.reward
      }]);
    })
    .catch(err => {
      console.error(err);
      setIsTyping(false);
    });
  };

  if (loading || !user) return <div className="min-h-screen bg-gami-bg flex items-center justify-center font-display text-white">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      <nav className="h-16 border-b-2 border-black glass-panel flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gami-gradient neo-border flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm6 14.1L12 19.7l-6-3.6V7.9l6-3.6 6 3.6v8.2zM12 7l-4 2.4v5.2l4 2.4 4-2.4V9.4L12 7z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden md:block">GAMI STUDIO</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Protocol Node: <span className="text-white">Active-09</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="bg-gami-bg text-white border-2 border-white px-4 py-1.5 text-xs font-display font-bold uppercase hover:bg-white hover:text-black transition-all">
            Dashboard
          </Link>
          <button className="gami-gradient neo-border px-4 py-1.5 text-xs font-display font-bold uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            {user.email}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col bg-black/20 scanline relative">
          <div className="p-6 border-b-2 border-black flex items-center justify-between glass-panel">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 neo-border flex items-center justify-center text-2xl bg-gami-purple">
                ⚡
              </div>
              <div>
                <h2 className="font-display font-bold text-xl uppercase italic tracking-tighter">Gami Architect</h2>
                <p className="text-xs font-mono text-gami-accent">Building your gamification infrastructure.</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-3">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 border border-white/10 font-mono text-[10px] uppercase font-bold transition-all ${isRecording ? 'bg-red-500 text-white shadow-brutal' : 'bg-black/40 text-gami-accent'}`}
              >
                {isRecording ? '■ STOP MIC' : '▶ START MIC (LIVE API)'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8" ref={chatWindowRef}>
            {chatHistory.map((msg, index) => (
              <div key={index} className={msg.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] uppercase text-gray-500">{msg.role === 'user' ? 'YOU' : 'Gami Architect'}</span>
                  <span className="text-[10px] text-gray-700">{msg.time}</span>
                </div>
                <div className={`max-w-[85%] md:max-w-[60%] p-4 text-sm leading-relaxed relative ${msg.role === 'user' ? 'bg-gami-purple neo-border shadow-brutal text-white' : 'bg-gami-panel neo-border shadow-brutal-purple text-gray-300'}`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start transition-opacity duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] uppercase text-gray-500">Gami Architect</span>
                </div>
                <div className="bg-gami-panel neo-border p-4 flex gap-2">
                  <div className="w-2 h-2 bg-gami-purple animate-bounce"></div>
                  <div className="w-2 h-2 bg-gami-purple animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gami-purple animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 glass-panel border-t-2 border-black">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gami-purple to-gami-accent opacity-20 group-focus-within:opacity-50 blur transition duration-300"></div>
              <form onSubmit={sendMessage} className="relative flex gap-4">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Describe your business or ask to generate a quest..." 
                  className="flex-1 bg-black neo-border p-4 outline-none font-mono text-sm placeholder:text-gray-700 focus:border-gami-accent transition-colors text-white"
                />
                <button type="submit" className="bg-white text-black px-8 font-display font-bold uppercase neo-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  Send
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Right Panel: Code / Generated Output */}
        <aside className="w-96 border-l-2 border-black glass-panel hidden xl:flex flex-col p-6 space-y-8">
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gray-500 mb-6 italic">Architecture Preview</h3>
            <div className="p-4 bg-black/40 border border-white/10 neo-border space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-mono uppercase">Status</span>
                <span className="font-bold text-gami-accent">DESIGNING</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-mono uppercase">Modules</span>
                <span className="font-bold">Pending...</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-[10px] text-gray-400 bg-black/50 p-4 border border-white/5">
            // Live Generated Config
            <br/>
            {`{
  "project": "Pending",
  "economy": {
    "xpSystem": true,
    "points": false
  },
  "modules": []
}`}
          </div>
        </aside>
      </main>
    </div>
  );
}
