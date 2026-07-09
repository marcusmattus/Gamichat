# GAMI Wallet

**Your wallet, but make it FUN.**

A production-grade, mobile-first, multi-chain crypto wallet with an AI mascot (NOVA), gamified XP/quests, and a Cyber-Brutalist Arcade aesthetic.

## Stack

- **Expo SDK 57** + **Expo Router v3**
- **TypeScript** (strict)
- **NativeWind v4** (Tailwind for React Native)
- **Zustand** + **MMKV** persistence
- **viem** (EVM) + **@solana/web3.js** (Solana)
- **Anthropic SDK** (NOVA agent)

## Quick start

```bash
cd gami-wallet
cp .env.example .env   # fill RPC URLs + dev Anthropic key
npm install --legacy-peer-deps
npx expo start
```

Press `w` for web, `i` for iOS simulator, `a` for Android.

## Screens (14)

| # | Route | Screen |
|---|-------|--------|
| 01 | `/` | Splash |
| 02 | `/(onboarding)/welcome` | Welcome |
| 03 | `/(onboarding)/auth` | Auth |
| 04 | `/(onboarding)/create` | Create wallet |
| 05 | `/(onboarding)/secure` | Secure vault |
| 06 | `/(onboarding)/handle` | Handle |
| 07 | `/(onboarding)/nova` | NOVA intro |
| 08 | `/(onboarding)/interests` | Interests |
| 09 | `/(onboarding)/first-quest` | First quest |
| 10 | `/(onboarding)/starter-pack` | Starter pack |
| 11 | `/(onboarding)/permissions` | Permissions |
| 12 | `/(app)/home` | Home |
| 13 | `/(app)/profile` | Profile |
| 14 | `/(app)/settings` | Settings |

## Project structure

```
gami-wallet/
├── app/                  # Expo Router screens
├── src/
│   ├── components/       # Sticker UI, NOVA, quests, XP
│   ├── design/           # tokens + theme
│   ├── stores/           # Zustand (wallet, user, nova, quests, settings)
│   ├── lib/              # crypto, NOVA, Gami SDK
│   ├── data/             # mock data
│   └── types/
└── assets/
```

## Environment

See `.env.example` for required variables. Never commit `.env`.

## License

MIT
