import { View } from 'react-native';
import { Check, Loader } from 'lucide-react-native';
import { T } from '../primitives/Text';
import { TapeLabel } from '../stickers/TapeLabel';

export function ChecklistRow({
  label,
  state,
  tape,
}: {
  label: string;
  state: 'done' | 'active' | 'todo';
  tape?: string;
}) {
  const border =
    state === 'active' ? 'border-magenta border-[3px]' : state === 'done' ? 'border-line' : 'border-line opacity-60';

  return (
    <View className={`relative flex-row items-center gap-3 p-4 border-2 bg-bgRaised mb-2 ${border}`}>
      {tape && (
        <View className="absolute -top-2 right-2">
          <TapeLabel label={tape} tone="yellow" rotate={4} />
        </View>
      )}
      <View
        className={`w-8 h-8 border-2 border-black items-center justify-center ${
          state === 'done' ? 'bg-lime' : state === 'active' ? 'bg-purple' : 'bg-bgSunken'
        }`}
      >
        {state === 'done' ? (
          <Check size={16} color="#000" strokeWidth={3} />
        ) : state === 'active' ? (
          <Loader size={16} color="#fff" />
        ) : (
          <T variant="mono" className="text-inkDim">
            ○
          </T>
        )}
      </View>
      <T variant="base" className={state === 'todo' ? 'text-inkDim' : 'text-ink'}>
        {label}
      </T>
    </View>
  );
}
