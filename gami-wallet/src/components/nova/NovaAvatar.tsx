import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export function NovaAvatar({ state = 'idle', size = 120 }: { state?: string; size?: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.04, { duration: 1200 }), withTiming(1, { duration: 1200 })),
      -1,
      true
    );
  }, [scale]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const eye = state === 'wink' ? '—' : '•';
  const mouth = state === 'happy' ? '◡' : state === 'thinking' ? '—' : '‿';

  return (
    <View className="items-center">
      <View
        className="absolute rounded-full bg-purple opacity-30"
        style={{ width: size * 1.4, height: size * 1.4 }}
      />
      <Animated.View
        style={[anim, { width: size, height: size }]}
        className="bg-purple border-[3px] border-black items-center justify-center rounded-full"
      >
        <View className="absolute -top-3 w-1 h-6 bg-lime border border-black" />
        <View className="flex-row gap-4 mt-2">
          <View className="w-2 h-2 bg-black rounded-full" />
          <View className="w-2 h-2 bg-black rounded-full" />
        </View>
        <View className="w-8 h-1 bg-black mt-3 rounded-full" style={{ borderRadius: 8 }} />
      </Animated.View>
    </View>
  );
}
