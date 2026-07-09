import Svg, { Path } from 'react-native-svg';

export function ScribbleUnderline({ color = '#FF3D9A', width = 120 }: { color?: string; width?: number }) {
  return (
    <Svg width={width} height={8} viewBox={`0 0 ${width} 8`}>
      <Path
        d={`M2 6 Q ${width * 0.25} 2, ${width * 0.5} 5 T ${width - 2} 4`}
        stroke={color}
        strokeWidth={3}
        fill="none"
        strokeLinecap="square"
      />
    </Svg>
  );
}
