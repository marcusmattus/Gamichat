import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gami-purple/20 blur-[120px] rounded-full"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-gami-accent font-mono text-xs mb-8 uppercase tracking-tighter">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                GAMI AI STUDIO ONLINE
              </div>
              <h1 className="font-display font-bold text-6xl md:text-[5.5rem] leading-[0.9] mb-8 uppercase italic">
                Build Your <span className="text-gami-purple">Reward</span> System With AI.
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mb-10 font-light leading-relaxed">
                Describe your business. Gami builds the entire gamification engine automatically. No coding required.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link href="/studio" className="px-10 py-5 gami-gradient neo-border shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-display font-bold text-lg uppercase tracking-wider">
                  Start Building
                </Link>
                <Link href="#how-it-works" className="px-10 py-5 border-2 border-white hover:bg-white hover:text-black transition-all font-display font-bold text-lg uppercase tracking-wider">
                  How it Works
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md bg-black neo-border shadow-brutal-purple p-6 overflow-hidden">
                <div className="scanline"></div>
                <div className="flex gap-2 items-center border-b border-white/10 pb-4 mb-4">
                  <div className="w-8 h-8 rounded-full gami-gradient flex items-center justify-center text-xs font-bold">AI</div>
                  <div>
                    <p className="text-xs font-mono text-gray-400">Gami Architect</p>
                    <p className="text-[10px] text-green-400 uppercase tracking-widest font-mono">Ready to build</p>
                  </div>
                </div>
                
                <div className="space-y-4 font-mono text-xs text-gray-300">
                  <div className="p-3 bg-white/5 border-l-2 border-gami-accent">
                    <p className="text-gami-accent mb-1">What industry?</p>
                    <p>&quot;I own a coffee shop.&quot;</p>
                  </div>
                  <div className="p-3 bg-white/5 border-l-2 border-gami-accent">
                    <p className="text-gami-accent mb-1">Should customers earn XP?</p>
                    <p>&quot;Yes, for every coffee purchased.&quot;</p>
                  </div>
                  <div className="p-3 bg-white/5 border-l-2 border-gami-accent">
                    <p className="text-gami-accent mb-1">Generating your gamification engine...</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-gami-purple/30 text-white">✓ XP System</span>
                      <span className="px-2 py-1 bg-gami-purple/30 text-white">✓ Rewards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="products" className="py-24 bg-black border-y-4 border-black relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-gami-bg neo-border p-10 shadow-brutal hover:shadow-brutal-purple hover:-translate-y-2 transition-all">
                <div className="w-14 h-14 gami-gradient neo-border mb-8 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl">⚡</span>
                </div>
                <h3 className="font-display font-bold text-3xl mb-4">AI GENERATED</h3>
                <p className="text-gray-400 mb-10 h-20">Simply describe your business. Our AI agents build your complete XP, quest, and rewards infrastructure instantly.</p>
              </div>
              <div className="group bg-gami-bg neo-border p-10 shadow-brutal-purple translate-y-4 transition-all lg:scale-105 z-10">
                <div className="w-14 h-14 bg-white text-black neo-border mb-8 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl">🔗</span>
                </div>
                <h3 className="font-display font-bold text-3xl mb-4 text-gami-accent">OMNICHANNEL</h3>
                <p className="text-gray-400 mb-10 h-20">Deploy your rewards across web, mobile, in-store POS, and smart contracts with our unified SDK.</p>
              </div>
              <div className="group bg-gami-bg neo-border p-10 shadow-brutal hover:shadow-brutal-purple hover:-translate-y-2 transition-all">
                <div className="w-14 h-14 border-2 border-gami-accent mb-8 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl">💎</span>
                </div>
                <h3 className="font-display font-bold text-3xl mb-4">UNIVERSAL</h3>
                <p className="text-gray-400 mb-10 h-20">Users collect their rewards in the universal Gami Wallet. Let them redeem your points, or trade them for $GAMI.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-gami-bg border-t-4 border-black pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="font-display font-bold text-2xl tracking-tight uppercase italic mb-4 block">GAMI AI STUDIO</span>
          <p className="text-gray-500 font-mono text-xs uppercase">© 2024 GAMI PROTOCOL FOUNDATION. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </>
  );
}
