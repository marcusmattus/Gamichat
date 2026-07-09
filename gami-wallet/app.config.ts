import { ExpoConfig, ConfigContext } from 'expo/config';

const BUNDLE_ID = 'com.gami.gamiwalletapp';
const APPLE_TEAM_ID = '28DWZWQ4YG';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GAMI Wallet',
  slug: 'gami-wallet',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'gami-wallet',
  userInterfaceStyle: 'dark',
  icon: './assets/icon.png',
  ios: {
    supportsTablet: false,
    bundleIdentifier: BUNDLE_ID,
    buildNumber: '1',
    appleTeamId: APPLE_TEAM_ID,
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      CFBundleDisplayName: 'GAMI Wallet',
      LSApplicationQueriesSchemes: ['gami-wallet'],
      NSFaceIDUsageDescription:
        'GAMI Wallet uses Face ID to unlock your vault and protect your seed phrase.',
      NSUserNotificationsUsageDescription:
        'GAMI Wallet sends streak reminders and quest rewards. No spam, promise.',
      UIBackgroundModes: ['remote-notification'],
      ITSAppUsesNonExemptEncryption: false,
    },
    entitlements: {
      'aps-environment': 'production',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#6E3CFB',
      foregroundImage: './assets/android-icon-foreground.png',
    },
    package: BUNDLE_ID,
    versionCode: 1,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-font',
    'expo-splash-screen',
    [
      'expo-local-authentication',
      {
        faceIDPermission:
          'Allow GAMI Wallet to use Face ID to secure your vault.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#6E3CFB',
        defaultChannel: 'gami-default',
        sounds: [],
        mode: 'production',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
    appleTeamId: APPLE_TEAM_ID,
    bundleIdentifier: BUNDLE_ID,
  },
  updates: {
    url: process.env.EAS_UPDATE_URL,
  },
});
