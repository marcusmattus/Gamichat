'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';

export default function Login() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/studio');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/studio');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gami-purple/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gami-accent/10 blur-[100px] rounded-full pointer-events-none"></div>

      <nav className="fixed w-full z-50 py-6 px-6 top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gami-gradient neo-border flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-glow">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm6 14.1L12 19.7l-6-3.6V7.9l6-3.6 6 3.6v8.2zM12 7l-4 2.4v5.2l4 2.4 4-2.4V9.4L12 7z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">GAMI</span>
          </Link>
          <Link href="/" className="font-mono text-xs uppercase tracking-tighter text-gray-500 hover:text-white transition-colors">
            &larr; Back to protocol hub
          </Link>
        </div>
      </nav>

      <div className="w-full max-w-lg relative z-10">
        <div className="absolute -top-12 -right-8 animate-bounce hidden md:block z-20">
          <div className="bg-black neo-border px-4 py-2 font-mono text-gami-accent text-sm shadow-brutal">
            +1000 XP ON LOGIN
          </div>
        </div>

        <div className="bg-gami-bg neo-border shadow-brutal relative overflow-hidden">
          <div className="scanline"></div>
          
          <div className="p-8 border-b-4 border-black bg-black/40 relative z-10">
            <div className="flex justify-between items-end mb-2">
              <h1 className="font-display font-bold text-4xl uppercase italic leading-none">
                {authMode === 'login' ? 'SECURE_LOGIN' : 'CREATE_ID'}
              </h1>
            </div>
            <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">
              Protocol Version: 2.0.4-STABLE // ENCRYPTED_CHANNEL
            </p>
          </div>

          <div className="grid grid-cols-2 border-b-2 border-black relative z-10">
            <button onClick={() => setAuthMode('login')} 
                    className={`py-4 font-display font-bold text-xs uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-gami-purple text-white' : 'bg-transparent text-gray-500'}`}>
              Existing User
            </button>
            <button onClick={() => setAuthMode('signup')} 
                    className={`py-4 font-display font-bold text-xs uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-gami-purple text-white' : 'bg-transparent text-gray-500'}`}>
              New Entity
            </button>
          </div>

          <div className="p-8 relative z-10">
            <button onClick={handleGoogleAuth} 
                    className="w-full mb-6 p-4 gami-gradient neo-border shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"></path></svg>
              <span className="font-display font-bold text-lg uppercase tracking-wider">Connect Google Account</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="font-mono text-[10px] text-gray-600 uppercase italic">Or authenticate via email</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 text-xs font-mono p-3 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-gray-500 mb-1 ml-1">Universal_ID / Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-black/40 border-2 border-white/10 p-4 font-mono text-sm outline-none focus:border-gami-purple transition-colors" 
                       placeholder="identity@gami.protocol" />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-gray-500 mb-1 ml-1">Security_Cipher</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-black/40 border-2 border-white/10 p-4 font-mono text-sm outline-none focus:border-gami-purple transition-colors" 
                       placeholder="••••••••••••" />
              </div>

              <button type="submit" disabled={isLoading}
                      className="w-full py-4 bg-white text-black font-display font-bold text-lg uppercase neo-border hover:bg-gami-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {isLoading ? 'AUTHENTICATING...' : (authMode === 'login' ? 'INITIALIZE SESSION' : 'REGISTER ENTITY')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
