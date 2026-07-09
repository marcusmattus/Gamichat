import { Pressable, Text, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';

type PrimaryButtonProps = {
  label: string;
  tone?: 'purple' | 'magenta' | 'lime';
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

const toneClass = {
  purple: 'bg-purple',
  magenta: 'bg-magenta',
  lime: 'bg-lime',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  label,
  tone = 'purple',
  icon: Icon,
  loading,
  disabled,
  onPress,
  className = '',
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      disabled={disabled || loading}
      style={[
        anim,
        {
          shadowColor: '#000',
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
        },
      ]}
      className={`border-2 border-black py-4 px-6 items-center justify-center flex-row gap-2 ${toneClass[tone]} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        hapticLight();
        onPress?.();
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {Icon && <Icon size={20} color="#fff" strokeWidth={2.5} />}
          <Text className="font-display text-white text-base tracking-widest uppercase">{label}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}
