import React from 'react';
import {View} from 'react-native';
import Text from '../../components/Text';
import {useNavigation} from '@react-navigation/native';
import Button from '../../components/Button';
import {RNNotificationModule, UtilsModule} from '../../components/NativeModule';
import storage, {storageKeys} from '../../database';

const Container: React.FC = () => {
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
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

  React.useEffect(() => {
    RNNotificationModule.getNotificationPermission().then(result => {
      setHasPermission(result);
    });
  }, []);

  return (
    <View className={'flex-1 p-2'}>
      <View className={'flex-1'}>
        <Button className={'mt-10'} onPress={onPressGetNotification}>
          <Text>Danh Sách Thông Báo</Text>
        </Button>
        <Button className={'mt-10'} onPress={onPressListSMS}>
          <Text>Danh Sách Tin Nhắn</Text>
        </Button>
        <Button className={'mt-10'} onPress={goToSetting}>
          <Text>Setting</Text>
        </Button>
        <Button className={'mt-10'} onPress={onPressRequestPermission}>
          <Text>Yêu Cầu Quyền Thông Báo</Text>
        </Button>
        <Button className={'mt-10'} onPress={onPressRequestSMSPermission}>
          <Text>Yêu Cầu Quyền Nhận Tin Nhắn</Text>
        </Button>
      </View>
      <Button onPress={logout} backgroundColor={'red'}>
        <Text c={'white'}>Đăng Xuất</Text>
      </Button>
    </View>
  );
};

export default Container;
