import {atomWithMMKV, storageKeys} from '../database';

export const apiNotificationUrlAtom = atomWithMMKV(
  storageKeys.NOTIFICATION_URL,
  '',
);
export const apiSMSUrlAtom = atomWithMMKV(storageKeys.SMS_URL, '');
export const userAgentAtom = atomWithMMKV(storageKeys.USER_AGENT, '');
export const listCheckAppAtom = atomWithMMKV<
  {
    appName: string;
    packageName: string;
  }[]
>(storageKeys.LIST_CHECK_APP, []);

export const listMessageAddressAtom = atomWithMMKV<string>(
  storageKeys.LIST_MESSAGE_ADDRESS,
  '',
);
