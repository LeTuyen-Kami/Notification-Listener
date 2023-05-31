/**
 * @format
 */

import {AppRegistry, ToastAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {RNNotificationHeadlessTaskName} from './src/components/NativeModule';
import storage, {storageKeys} from './src/database';
import {sendNotification, sendSms} from './src/Api/Api';
import {customLog} from './src/utils/common';
const headlessNotificationListener = async ({
  notification,
  listNotifications,
  sms,
  destroy,
}) => {
  if (notification) {
    notification = JSON.parse(notification);
    const list = JSON.parse(storage.getString(storageKeys.LIST_NOTIFICATION));
    if (list) {
      storage.set(
        storageKeys.LIST_NOTIFICATION,
        JSON.stringify([notification, ...list]),
      );
    } else {
      storage.set(
        storageKeys.LIST_NOTIFICATION,
        JSON.stringify([notification]),
      );
    }
    let checkApp = [];
    try {
      checkApp = JSON.parse(
        JSON.parse(storage.getString(storageKeys.LIST_CHECK_APP) || '[]'),
      );
    } catch (error) {
      customLog('JSON parse notification thất bại', error);
    }

    const urlNotification = JSON.parse(
      JSON.parse(storage.getString(storageKeys.NOTIFICATION_URL)),
    );
    const token = storage.getString(storageKeys.ACCESS_TOKEN);

    customLog(
      'Đã Nhận Notification',
      !!checkApp.find(item => item.packageName === notification.app),
      !!token?.trim(),
      notification.app,
    );

    if (
      !!checkApp.find(item => item.packageName === notification.app) &&
      !!urlNotification?.trim() &&
      !!token?.trim()
    ) {
      sendNotification(urlNotification, token, {
        package: notification.app,
        title: notification.title,
        content: notification.content || notification.bigText,
      })
        .then(() => {
          customLog('Gửi Notification thành công');
          ToastAndroid.show(
            'Send notification success' + '\n' + urlNotification,
            ToastAndroid.SHORT,
          );
        })
        .catch(err => {
          customLog('Gửi Notification thất bại', err);
        });
    } else {
      customLog('Kiểm tra notification thất bại', checkApp, notification.app);
    }
  }
  if (listNotifications) {
    storage.set(storageKeys.LIST_NOTIFICATION, listNotifications);
  }
  if (sms) {
    sms = JSON.parse(sms);
    let listMessageAddress = JSON.parse(
      storage.getString(storageKeys.LIST_MESSAGE_ADDRESS) || '',
    );

    try {
      listMessageAddress = JSON.parse(listMessageAddress);
    } catch (error) {
      customLog('JSON parse thất bại', error);
    }

    const arr = listMessageAddress.split(',');
    const urlSMS = JSON.parse(
      JSON.parse(storage.getString(storageKeys.SMS_URL)),
    );
    const token = storage.getString(storageKeys.ACCESS_TOKEN);
    customLog(
      'Đã Nhận SMS',
      !!arr.find(item => item === sms.messageAddress),
      !!urlSMS,
      !!token,
      sms.messageAddress,
    );
    if (
      arr.find(item => item === sms.messageAddress) &&
      !!urlSMS?.trim() &&
      !!token?.trim()
    ) {
      sendSms(urlSMS, token, {
        original_address: sms.messageAddress,
        message_content: sms.messageBody,
      })
        .then(() => {
          customLog('Gửi SMS Thành Công');
          ToastAndroid.show(
            'Send sms success' + '\n' + urlSMS,
            ToastAndroid.SHORT,
          );
        })
        .catch(err => {
          customLog('Gửi SMS Thất Bại', err);
        });
    } else {
      customLog(
        'Kiểm Tra SMS Thất Bại',
        arr,
        sms.messageAddress,
        sms.messageBody,
      );
    }
  }

  if (destroy) {
    console.log('destroy');
    storage.set(
      storageKeys.DESTROY,
      RNNotificationHeadlessTaskName + 'destroy',
    );
  }
};

/**
 * AppRegistry should be required early in the require sequence
 * to make sure the JS execution environment is setup before other
 * modules are required.
 */
AppRegistry.registerHeadlessTask(
  RNNotificationHeadlessTaskName,
  () => headlessNotificationListener,
);
AppRegistry.registerComponent(appName, () => App);
