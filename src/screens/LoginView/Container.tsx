import React from 'react';
import {Image, Switch, ToastAndroid, View} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {getAccessToken} from '../../Api/Api';
import storage, {storageKeys} from '../../database';

const Container: React.FC = () => {
  const navigation = useNavigation<any>();

  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);

  const canSubmit = React.useMemo(() => {
    return username.trim().length > 0 && password.trim().length > 0;
  }, [username, password]);

  const onPressSubmit = () => {
    console.log('onPressSubmit', username, password);
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
