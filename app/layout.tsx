import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { GamiWalletProvider } from '@/lib/gami-wallet-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Gami Protocol - Universal Gamification Layer',
  description: 'Gami AI Studio for creating gamified businesses.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans hexagon-bg text-white selection:bg-gami-accent selection:text-white min-h-screen flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <GamiWalletProvider>
            {children}
          </GamiWalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
