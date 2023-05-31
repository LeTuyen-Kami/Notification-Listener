import React from 'react';
import {Image, Switch, ToastAndroid, View} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {getAccessToken} from '../../Api/Api';
import storage, {storageKeys} from '../../database';
import {useAtom} from 'jotai/index';
import {
  apiNotificationUrlAtom,
  apiSMSUrlAtom,
  userAgentAtom,
} from '../../Atom/Atom';

const Container: React.FC = () => {
  const navigation = useNavigation<any>();

  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const [apiSMSUrl, setApiSMSUrl] = useAtom(apiSMSUrlAtom);
  const [userAgent, setUserAgent] = useAtom(userAgentAtom);
  const [apiNotificationUrl, setApiNotificationUrl] = useAtom(
    apiNotificationUrlAtom,
  );
  const canSubmit = React.useMemo(() => {
    return username.trim().length > 0 && password.trim().length > 0;
  }, [username, password]);

  const onPressSubmit = () => {
    if (loadingSubmit) {
      return;
    }

    setLoadingSubmit(true);

    getAccessToken(username, password)
      .then(res => {
        storage.set(storageKeys.ACCESS_TOKEN, res.access);
        storage.set(storageKeys.REFRESH_TOKEN, res.refresh);
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      })
      .catch(() => {
        ToastAndroid.show('Đăng nhập thất bại', ToastAndroid.SHORT);
      })
      .finally(() => {
        setLoadingSubmit(false);
      });
  };

  const onPressSetting = () => {
    navigation.navigate('Setting');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  React.useEffect(() => {
    if (!apiNotificationUrl?.trim()) {
      setApiNotificationUrl(
        'https://truyenyy.vip/valhalla/api/internet-banking/submit-notification/',
      );
    }
    if (!apiSMSUrl?.trim()) {
      setApiSMSUrl(
        'https://truyenyy.vip/valhalla/api/internet-banking/submit-message/',
      );
    }
    if (!userAgent?.trim()) {
      setUserAgent('TLT/2023');
    }
  }, [
    apiNotificationUrl,
    apiSMSUrl,
    setApiNotificationUrl,
    setApiSMSUrl,
    setUserAgent,
    userAgent,
  ]);

  return (
    <View className={'flex-1 p-2'}>
      <View className={'flex-1 items-center justify-center'}>
        <Image
          source={require('../../../assets/Logo-yy-2021.png')}
          style={{
            width: '50%',
            height: 100,
          }}
          resizeMode={'contain'}
        />
      </View>
      <View className={'flex-[2] '}>
        <Text>Tài Khoản</Text>
        <Input
          value={username}
          onChangeText={setUsername}
          placeholder={'Tài Khoản'}
        />
        <Text>Mật Khẩu</Text>
        <Input
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder={'Mật Khẩu'}
        />
        <View className={'self-end flex-row items-center my-2'}>
          <Text>Show Password</Text>
          <Switch value={showPassword} onValueChange={toggleShowPassword} />
        </View>
        <View className={'mt-3 flex-row'}>
          <Button
            activityIndicatorColor={'white'}
            disabled={!canSubmit}
            isLoading={loadingSubmit}
            backgroundColor={'#4497F8'}
            className={'flex-1 mr-2'}
            onPress={onPressSubmit}>
            <Text c={'white'}>Đăng Nhập</Text>
          </Button>
          <Button onPress={onPressSetting}>
            <Icon name="settings" size={30} color="#3b5998" />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Container;
