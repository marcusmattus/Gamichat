'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gami-bg/90 backdrop-blur-xl border-b-2 border-black py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gami-gradient neo-border flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-brutal">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm6 14.1L12 19.7l-6-3.6V7.9l6-3.6 6 3.6v8.2zM12 7l-4 2.4v5.2l4 2.4 4-2.4V9.4L12 7z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">GAMI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-display font-medium text-xs uppercase tracking-[0.2em]">
            <Link href="#products" className="hover:text-gami-accent transition-colors">Product</Link>
            <Link href="#agents" className="hover:text-gami-accent transition-colors">Agents</Link>
            <Link href="/wallet" className="hover:text-gami-accent transition-colors">Wallet</Link>
            <Link href="#devs" className="hover:text-gami-accent transition-colors">Developers</Link>
            <Link href="#token" className="hover:text-gami-accent transition-colors">Token</Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="px-6 py-2 font-display font-bold border-2 border-white/20 hover:border-white transition-all text-sm uppercase tracking-wider">
              Login
            </Link>
            <Link href="/studio" className="px-6 py-2 gami-gradient border-2 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-display font-bold text-sm uppercase tracking-wider">
              Launch Studio
            </Link>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2">
            {!mobileMenu ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="fixed inset-0 z-40 bg-gami-bg pt-24 px-6 lg:hidden">
          <div className="flex flex-col gap-6 text-2xl font-display font-bold uppercase italic">
            <Link href="#products" onClick={() => setMobileMenu(false)}>Product</Link>
            <Link href="#agents" onClick={() => setMobileMenu(false)}>Agents</Link>
            <Link href="/wallet" onClick={() => setMobileMenu(false)}>Wallet</Link>
            <Link href="#devs" onClick={() => setMobileMenu(false)}>Developers</Link>
            <Link href="#token" onClick={() => setMobileMenu(false)}>Token</Link>
            <hr className="border-white/10" />
            <Link href="/studio" className="gami-gradient p-4 text-center neo-border shadow-brutal">Launch Studio</Link>
          </div>
        </div>
      )}
    </>
  );
}
