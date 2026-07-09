import * as Haptics from 'expo-haptics';

export async function hapticLight() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function hapticSuccess() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function hapticWarn() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
