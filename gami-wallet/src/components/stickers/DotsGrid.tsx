import { View } from 'react-native';

export function DotsGrid({ total, index }: { total: number; index: number }) {
  return (
    <View className="flex-row gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`w-1 h-1 border border-line ${i <= index ? 'bg-purple' : 'bg-transparent'}`}
          style={{ width: 16, height: 4 }}
        />
      ))}
    </View>
  );
}
