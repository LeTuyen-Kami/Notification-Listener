/**
 * @format
 */

import {AppRegistry, ToastAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {RNNotificationHeadlessTaskName} from './src/components/NativeModule';
import storage, {storageKeys} from './src/database';
import {sendNotification, sendSms} from './src/Api/Api';
const headlessNotificationListener = async ({
  notification,
  listNotifications,
  sms,
}) => {
  if (notification) {
    console.log('notification', notification, typeof notification);
    notification = JSON.parse(notification);
    const list = JSON.parse(storage.getString(storageKeys.LIST_NOTIFICATION));
    if (list) {
      storage.set(
        storageKeys.LIST_NOTIFICATION,
        JSON.stringify([...list, notification]),
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
      console.log('error', error);
    }

    const urlNotification = JSON.parse(
      JSON.parse(storage.getString(storageKeys.NOTIFICATION_URL)),
    );
    const token = storage.getString(storageKeys.ACCESS_TOKEN);

    console.log('checkApp', checkApp, typeof checkApp);
    console.log(
      'checkApp',
      !!checkApp.find(item => item.packageName === notification.app),
      urlNotification?.trim(),
      token?.trim(),
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
          ToastAndroid.show(
            'Send notification success' + '\n' + urlNotification,
            ToastAndroid.SHORT,
          );
        })
        .catch(err => {
          console.log('sendNotification', err);
          ToastAndroid.show(
            err.toString() + '\n' + urlNotification,
            ToastAndroid.SHORT,
          );
        });
    } else {
      console.log('App not found', checkApp, notification.app);
      ToastAndroid.show(
        'App not found' + '\n' + urlNotification,
        ToastAndroid.SHORT,
      );
    }
  }
  if (listNotifications) {
    storage.set(storageKeys.LIST_NOTIFICATION, listNotifications);
  }
  if (sms) {
    console.log('sms', sms, typeof sms);
    sms = JSON.parse(sms);
    let listMessageAddress = JSON.parse(
      storage.getString(storageKeys.LIST_MESSAGE_ADDRESS) || '',
    );

    try {
      listMessageAddress = JSON.parse(listMessageAddress);
    } catch (error) {
      console.log('error', error);
    }

    const arr = listMessageAddress.split(',');
    const urlSMS = JSON.parse(
      JSON.parse(storage.getString(storageKeys.SMS_URL)),
    );
    const token = storage.getString(storageKeys.ACCESS_TOKEN);
    console.log(
      'checkSendsms',
      arr.find(item => item === sms.messageAddress),
      urlSMS,
      token,
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
          ToastAndroid.show(
            'Send sms success' + '\n' + urlSMS,
            ToastAndroid.SHORT,
          );
        })
        .catch(err => {
          console.log('sendSms', err);
          ToastAndroid.show(err.toString() + '\n' + urlSMS, ToastAndroid.SHORT);
        });
    } else {
      console.log(
        'Address not found',
        arr,
        sms.messageAddress,
        sms.messageBody,
      );
      ToastAndroid.show(
        'Address not found' + '\n' + urlSMS,
        ToastAndroid.SHORT,
      );
    }
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
