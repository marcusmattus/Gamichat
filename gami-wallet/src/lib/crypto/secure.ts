import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const MNEMONIC_KEY = 'gami_mnemonic_enc';
const PIN_KEY = 'gami_pin_hash';

const secureOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
};

export async function storeMnemonic(encrypted: string): Promise<void> {
  await SecureStore.setItemAsync(MNEMONIC_KEY, encrypted, secureOptions);
}

export async function getMnemonic(): Promise<string | null> {
  return SecureStore.getItemAsync(MNEMONIC_KEY, secureOptions);
}

export async function clearMnemonic(): Promise<void> {
  await SecureStore.deleteItemAsync(MNEMONIC_KEY, secureOptions);
}

export async function storePinHash(hash: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, hash, secureOptions);
}

export async function getPinHash(): Promise<string | null> {
  return SecureStore.getItemAsync(PIN_KEY, secureOptions);
}

export async function clearPinHash(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY, secureOptions);
}

export async function clearAllSecure(): Promise<void> {
  await clearMnemonic();
  await clearPinHash();
}

// Simple device-bound encoding for MVP (production: use proper AES-GCM with secure enclave key)
export function encryptMnemonic(mnemonic: string): string {
  const deviceSalt = Platform.OS + Platform.Version;
  return btoa(`${deviceSalt}::${mnemonic}`);
}

export function decryptMnemonic(encrypted: string): string {
  const decoded = atob(encrypted);
  const parts = decoded.split('::');
  return parts.slice(1).join('::');
}
