import storage, {storageKeys} from '../database';

export const customLog = (...args: any[]) => {
  if (__DEV__) {
    console.log(...args);
  }
  const log = JSON.parse(storage.getString(storageKeys.LOG) || '[]');
  const newListLog = [...log, args.toString()].slice(-1000);
  storage.set(storageKeys.LOG, JSON.stringify(newListLog));
};
