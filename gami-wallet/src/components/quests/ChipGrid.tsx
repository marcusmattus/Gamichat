import { View, Pressable, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';

type ChipItem = { id: string; label: string; emoji?: string; tone?: string };

export function ChipGrid({
  items,
  value,
  onChange,
  min = 3,
}: {
  items: ChipItem[];
  value: string[];
  onChange: (next: string[]) => void;
  min?: number;
}) {
  const toggle = (id: string) => {
    hapticLight();
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => {
        const selected = value.includes(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() => toggle(item.id)}
            className={`border-2 border-black px-3 py-2 flex-row items-center gap-1 ${
              selected ? '' : 'bg-bgRaised'
            }`}
            style={selected ? { backgroundColor: item.tone ?? '#6E3CFB' } : undefined}
          >
            {item.emoji && <Text>{item.emoji}</Text>}
            <Text className={`font-display text-sm uppercase ${selected ? 'text-white' : 'text-inkMute'}`}>
              {item.label}
            </Text>
            {selected && <Check size={14} color="#fff" strokeWidth={3} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export function ChipGridProgress({ count, target }: { count: number; target: number }) {
  return (
    <Text className="font-mono text-magenta text-sm mb-2">
      {count}/{target}
    </Text>
  );
}
