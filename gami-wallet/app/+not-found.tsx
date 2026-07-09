import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ScreenBackground, ScreenContainer } from '@/components/primitives/Screen';
import { T } from '@/components/primitives/Text';

export default function NotFound() {
  return (
    <ScreenBackground>
      <ScreenContainer className="items-center justify-center">
        <T variant="h2">404</T>
        <T variant="base" className="text-inkMute mt-2">
          screen not found
        </T>
        <Link href="/">
          <T variant="mono" className="text-purple mt-6">
            ← back to splash
          </T>
        </Link>
      </ScreenContainer>
    </ScreenBackground>
  );
}
