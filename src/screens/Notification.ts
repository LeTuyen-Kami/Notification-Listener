import {AppRegistry} from 'react-native';
import RNAndroidNotificationListener, {
  RNAndroidNotificationListenerHeadlessJsName,
} from 'react-native-android-notification-listener';

// To check if the user has permission
const status = await RNAndroidNotificationListener.getPermissionStatus();
console.log(status); // Result can be 'authorized', 'denied' or 'unknown'

// To open the Android settings so the user can enable it
RNAndroidNotificationListener.requestPermission();

/**
 * Note that this method MUST return a Promise.
 * Is that why I'm using an async function here.
 */
const headlessNotificationListener = async ({notification}) => {
  console.log('notification', notification);
};

/**
 * This should be required early in the sequence
 * to make sure the JS execution environment is setup before other
 * modules are required.
 *
 * Your entry file (index.js) would be the better place for it.
 *
 * PS: I'm using here the constant RNAndroidNotificationListenerHeadlessJsName to ensure
 *     that I register the headless with the right name
 */
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);
