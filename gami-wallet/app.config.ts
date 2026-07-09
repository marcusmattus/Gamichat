import { ExpoConfig, ConfigContext } from 'expo/config';

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
    bundleIdentifier: 'xyz.gami.wallet',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#6E3CFB',
      foregroundImage: './assets/android-icon-foreground.png',
    },
    package: 'xyz.gami.wallet',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: ['expo-router', 'expo-secure-store', 'expo-font', 'expo-splash-screen'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
  },
});
