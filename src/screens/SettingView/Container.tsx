import React from 'react';

import {FlatList, TouchableOpacity, View} from 'react-native';
import Text from '../../components/Text';
import Input from '../../components/Input';
import {useAtom} from 'jotai';
import {UtilsModule} from '../../components/NativeModule';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  apiNotificationUrlAtom,
  apiSMSUrlAtom,
  listCheckAppAtom,
  listMessageAddressAtom,
  userAgentAtom,
} from '../../Atom/Atom';

const Container: React.FC<any> = props => {
  const [apiNotificationUrl, setApiNotificationUrl] = useAtom(
    apiNotificationUrlAtom,
  );
  const [apiSMSUrl, setApiSMSUrl] = useAtom(apiSMSUrlAtom);
  const [userAgent, setUserAgent] = useAtom(userAgentAtom);
  const [search, setSearch] = React.useState('');
  const [listApp, setListApp] = React.useState<any[]>([]);
  const [listAppFilter, setListAppFilter] = React.useState<any[]>([]);
  const [listCheckedApp, setListCheckedApp] = useAtom(listCheckAppAtom);
  const [listMessageAddress, setListMessageAddress] = useAtom(
    listMessageAddressAtom,
  );

  const checkApp = (item: any) => {
    const index = listCheckedApp.findIndex(
      (checkedItem: any) => checkedItem.packageName === item.packageName,
    );

    if (index !== -1) {
      const newListCheckedApp = [...listCheckedApp];
      newListCheckedApp.splice(index, 1);
      setListCheckedApp(newListCheckedApp);
    } else {
      setListCheckedApp([...listCheckedApp, item]);
    }
  };

  const checkHaveApp = (item: any) => {
    const index = listCheckedApp.findIndex(
      (checkedItem: any) => checkedItem.packageName === item.packageName,
    );

    return index !== -1;
  };

  const getAppList: () => void = async () => {
    const appList = JSON.parse(await UtilsModule.getAppList());

    setListApp(appList);
    setListAppFilter(appList);
  };

  const onChangeSearch = (text: string) => {
    setSearch(text);
    setListAppFilter(
      listApp.filter((item: any) =>
        item.appName.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  React.useEffect(() => {
    getAppList();
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
  }, []);

  const renderItem = ({item}: any) => {
    const isHaveApp = checkHaveApp(item);

    return (
      <TouchableOpacity
        onPress={checkApp.bind(this, item)}
        className={'flex-row m-1 p-1 bg-fuchsia-50 rounded'}
        style={{
          elevation: 1,
        }}>
        <View className={'w-10 h-10 justify-center items-center '}>
          <View
            style={{
              borderWidth: 1,
              borderColor: isHaveApp ? 'transparent' : 'black',
            }}
            className={`w-5 h-5 rounded-full justify-center items-center ${
              isHaveApp ? 'bg-blue-500' : 'bg-white'
            }`}>
            <FontAwesome5Icon name={'check'} size={10} color={'white'} />
          </View>
        </View>
        <View className={''}>
          <Text className={'font-bold'}>{item.appName}</Text>
          <Text className={'opacity-70'}>{item.packageName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className={'flex-1 m-1'}>
      <Text>API NOTIFICATION URL</Text>
      <Input
        placeholder={'Nhập url thông báo'}
        value={apiNotificationUrl}
        onChangeText={setApiNotificationUrl}
      />
      <Text>API SMS URL</Text>
      <Input
        placeholder={'Nhập url tin nhắn'}
        value={apiSMSUrl}
        onChangeText={setApiSMSUrl}
      />
      <Text>USER AGENT</Text>
      <Input
        value={userAgent}
        onChangeText={setUserAgent}
        placeholder={'Nhập user agent'}
      />
      <Text>Danh Sách Người Nhận Tin Nhắn</Text>
      <Input
        value={listMessageAddress}
        onChangeText={setListMessageAddress}
        placeholder={'Cách Nhau bằng dấu ,'}
      />
      <Text className={'font-bold'}>NOTIFICATIONS</Text>
      <Input
        value={search}
        onChangeText={onChangeSearch}
        placeholder={'Tìm App'}
      />
      <FlatList
        data={listAppFilter}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Container;
