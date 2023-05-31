import React, {useEffect, useRef, useState} from 'react';
import {AppState, View} from 'react-native';
import Text from '../../components/Text';
import {useNavigation} from '@react-navigation/native';
import Button from '../../components/Button';
import {RNNotificationModule, UtilsModule} from '../../components/NativeModule';
import storage, {storageKeys} from '../../database';
import {useAtom} from 'jotai/index';
import {
  apiNotificationUrlAtom,
  apiSMSUrlAtom,
  listCheckAppAtom,
  userAgentAtom,
} from '../../Atom/Atom';

const Container: React.FC = () => {
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  const [isListenerDestroy, setIsListenerDestroy] =
    React.useState<boolean>(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const listener = AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState: any) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  const navigation = useNavigation<any>();

  const getCurrentNotification = async () => {};

  const onPressGetNotification = async () => {
    navigation.navigate('ListNotification');
  };

  const goToSetting = () => {
    navigation.navigate('Setting');
  };

  const logout = () => {
    storage.delete(storageKeys.ACCESS_TOKEN);
    storage.delete(storageKeys.REFRESH_TOKEN);
    navigation.navigate('Login');
  };

  const onPressListSMS = async () => {
    navigation.navigate('ListSMS');
  };

  const onPressRequestPermission = () => {
    RNNotificationModule.requestNotificationPermission();
  };

  const onPressRequestSMSPermission = () => {
    UtilsModule.requestSMSReceiverPermission();
  };

  const onListLog = () => {
    navigation.navigate('ListLog');
  };

  const closeListener = () => {
    setIsListenerDestroy(false);
  };

  React.useEffect(() => {
    RNNotificationModule.getNotificationPermission().then(result => {
      setHasPermission(result);
    });
  }, []);

  const requestDestroy = async () => {
    const isServiceRunning =
      await UtilsModule.checkNotificationListenerService();
    setIsListenerDestroy(!isServiceRunning);
  };

  React.useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      requestDestroy();
    });
    return () => {
      listener();
    };
  }, [navigation]);

  React.useEffect(() => {
    requestDestroy();
  }, [appStateVisible]);

  return (
    <View className={'flex-1 p-2'}>
      <Button className={'mt-10'} onPress={onPressGetNotification}>
        <Text>Danh Sách Thông Báo</Text>
      </Button>
      <Button className={'mt-10'} onPress={onPressListSMS}>
        <Text>Danh Sách Tin Nhắn</Text>
      </Button>
      <Button className={'mt-10'} onPress={goToSetting}>
        <Text>Cài Đặt</Text>
      </Button>
      <Button className={'mt-10'} onPress={onPressRequestPermission}>
        <Text>Yêu Cầu Quyền Thông Báo</Text>
      </Button>
      <Button className={'mt-10'} onPress={onPressRequestSMSPermission}>
        <Text>Yêu Cầu Quyền Nhận Tin Nhắn</Text>
      </Button>
      <Button className={'mt-10'} onPress={onListLog}>
        <Text>Danh Sách Log</Text>
      </Button>
      {isListenerDestroy && (
        <Button className={'mt-10'} backgroundColor={'red'}>
          <Text c={'white'}>Service đã bị tắt</Text>
        </Button>
      )}

      <Button className={'mt-10'} onPress={logout}>
        <Text c={'red'}>Thoát</Text>
      </Button>
    </View>
  );
};

export default Container;
