import { Pressable, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';
import { tokens, type StickerTone } from '@/design/tokens';

const toneBg: Record<StickerTone, string> = {
  purple: 'bg-purple',
  magenta: 'bg-magenta',
  lime: 'bg-lime',
  yellow: 'bg-yellow',
  cyan: 'bg-cyan',
  ink: 'bg-bgRaised',
};

const offsetMap = { sm: 3, md: 6, lg: 9 };

type StickerCardProps = {
  tone?: StickerTone;
  offset?: 'sm' | 'md' | 'lg';
  rotate?: number;
  tape?: { label: string; tone?: 'magenta' | 'lime' | 'yellow'; rotate?: number };
  pressable?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StickerCard({
  tone = 'ink',
  offset = 'md',
  rotate = 0,
  tape,
  pressable = false,
  onPress,
  children,
  className = '',
}: StickerCardProps) {
  const scale = useSharedValue(1);
  const d = offsetMap[offset];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate}deg` }],
  }));

  const shadowStyle: ViewStyle = {
    shadowColor: tokens.shadow.sticker.color,
    shadowOffset: { width: d, height: d },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const inner = (
    <Animated.View style={[shadowStyle, animStyle]} className={`border-2 border-line ${toneBg[tone]} ${className}`}>
      {tape && (
        <View
          className={`absolute -top-2 right-3 z-10 px-2 py-0.5 border-2 border-black ${
            tape.tone === 'lime' ? 'bg-lime' : tape.tone === 'yellow' ? 'bg-yellow' : 'bg-magenta'
          }`}
          style={{ transform: [{ rotate: `${tape.rotate ?? 3}deg` }] }}
        >
          <Animated.Text className="font-mono text-[10px] text-black font-bold">{tape.label}</Animated.Text>
        </View>
      )}
      {children}
    </Animated.View>
  );

  if (pressable && onPress) {
    return (
      <AnimatedPressable
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={() => {
          hapticLight();
          onPress();
        }}
      >
        {inner}
      </AnimatedPressable>
    );
  }

  return inner;
}
