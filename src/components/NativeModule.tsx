import {NativeModules} from 'react-native';

const {Utils, RNNotification} = NativeModules;

export const RNNotificationHeadlessTaskName =
  'RNNotificationListenerHeadlessTask';

type UtilsType = {
  getAppList: () => Promise<string>;
  getSmsList: (from: string) => Promise<string>;
  requestSMSReceiverPermission: () => void;
  checkNotificationListenerService: () => Promise<boolean>;
  startNotificationListenerService: () => void;
  stopNotificationListenerService: () => void;
};

type RNNotificationType = {
  requestNotificationPermission: () => void;
  getNotificationPermission: () => Promise<boolean>;
};

export const RNNotificationModule = RNNotification as RNNotificationType;
export const UtilsModule = Utils as UtilsType;
