import {MMKV} from 'react-native-mmkv';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';

const storage = new MMKV();

const storageKeys = {
  NOTIFICATION_URL: 'NOTIFICATION_URL',
  SMS_URL: 'SMS_URL',
  USER_AGENT: 'USER_AGENT',
  LIST_CHECK_APP: 'LIST_CHECK_APP',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  LIST_NOTIFICATION: 'LIST_NOTIFICATION',
  LIST_MESSAGE_ADDRESS: 'LIST_MESSAGE_ADDRESS',
};

function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : null;
}

function setItem<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

function removeItem(key: string): void {
  storage.delete(key);
}

function clearAll(): void {
  storage.clearAll();
}

const atomWithMMKV = <T>(key: string, initialValue: T) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => ({
      getItem,
      setItem,
      removeItem,
      clearAll,
    })),
  );

export default storage;
export {storageKeys, atomWithMMKV};
