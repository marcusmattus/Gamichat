import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

export function GamiLogo({ size = 80 }: { size?: number }) {
  return (
    <View
      className="bg-white border-2 border-purple items-center justify-center"
      style={{ width: size, height: size, shadowColor: '#000', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0 }}
    >
      <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 48 48">
        <Rect x="8" y="8" width="32" height="6" fill="#6E3CFB" />
        <Rect x="8" y="8" width="6" height="28" fill="#6E3CFB" />
        <Rect x="8" y="30" width="20" height="6" fill="#6E3CFB" />
        <Rect x="28" y="22" width="12" height="6" fill="#6E3CFB" />
      </Svg>
    </View>
  );
}

export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <View className="bg-purple rounded-full items-center justify-center" style={{ width: size, height: size }}>
      <Text className="font-displayXL text-white" style={{ fontSize: size * 0.4 }}>
        G
      </Text>
    </View>
  );
}
