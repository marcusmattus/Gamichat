import { View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '@/design/tokens';

export function ScreenBackground({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`flex-1 bg-bg ${className}`}>
      <LinearGradient
        colors={['#4A1FD133', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.4 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%' }}
      />
      <LinearGradient
        colors={['transparent', '#FF3D9A22']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' }}
      />
      {children}
    </View>
  );
}

export function ScreenContainer({ children, className = '' }: ViewProps & { children: React.ReactNode; className?: string }) {
  return (
    <View className={`flex-1 px-6 pt-14 pb-8 ${className}`}>{children}</View>
  );
}

export function GamiText({
  children,
  className = '',
  mono = false,
}: {
  children: React.ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <View>
      {/* Text rendered via className in RN */}
    </View>
  );
}

export { tokens };
