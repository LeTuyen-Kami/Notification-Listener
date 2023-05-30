import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../components/Text';
import {ISMS} from '../../contants/Interface';
import Item from './Item';
import Button from '../../components/Button';
import {UtilsModule} from '../../components/NativeModule';
import Input from '../../components/Input';
import DatePicker from 'react-native-date-picker';
import storage, {storageKeys} from '../../database';
import {sendNotification} from '../../Api/Api';

const Container: React.FC = () => {
  const [listSMS, setListSMS] = React.useState<ISMS[]>([]);
  const [listSMSFilter, setListSMSFilter] = React.useState<ISMS[]>([]);
  const [selected, setSelected] = React.useState<
    {
      index: number;
      item: ISMS;
    }[]
  >([]);
  const [search, setSearch] = React.useState<string>('');
  const [days, setDays] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);

  const onChangeText = (text: string) => {
    setSearch(text);
    setListSMSFilter(
      listSMS.filter((item: ISMS) => {
        return item.messageAddress.toLowerCase().includes(text.toLowerCase());
      }),
    );
  };

  const onPressSelect = (_index: number, _item: ISMS) => {
    setSelected(_selected => {
      const index = _selected.findIndex(
        (selectedItem: any) => selectedItem.index === _index,
      );

      if (index !== -1) {
        const newList = [..._selected];
        newList.splice(index, 1);
        return newList;
      } else {
        return [..._selected, {index: _index, item: _item}];
      }
    });
  };

  const onPressSendSMS = async () => {
    if (selected.length === 0) {
      ToastAndroid.show('Chưa chọn tin nhắn', ToastAndroid.SHORT);
      return;
    }
    const urlSMS = JSON.parse(
      JSON.parse(storage.getString(storageKeys.SMS_URL) || ''),
    );
    if (!!urlSMS?.trim()) {
      const token = storage.getString(storageKeys.ACCESS_TOKEN) || '';
      for (let i = 0; i < selected.length; i++) {
        const sms = selected[i].item;
        sendNotification(urlSMS, token, {
          original_address: sms.messageAddress,
          message_content: sms.messageBody,
        })
          .then(() => {
            ToastAndroid.show('Send notification success', ToastAndroid.SHORT);
          })
          .catch((err: any) => {
            ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
          });
      }
    } else {
      ToastAndroid.show('Chưa cấu hình url tin nhắn', ToastAndroid.SHORT);
    }
  };

  const renderItem = ({item, index}: {item: ISMS; index: number}) => {
    return (
      <Item
        item={item}
        index={index}
        selected={selected}
        onPressSelect={onPressSelect}
      />
    );
  };

  const handleListSMS = async (from: string) => {
    setLoading(true);
    const listSMS: ISMS[] = JSON.parse(await UtilsModule.getSmsList(from));
    setListSMS(listSMS);
    setListSMSFilter(listSMS);
    setSearch('');
    setLoading(false);
  };

  const onPressPickDate = () => {
    setOpen(true);
  };

  const onConfirmDate = (date: Date) => {
    setOpen(false);
    if (date.getTime() > new Date().getTime()) {
      ToastAndroid.show(
        'Không thể chọn ngày lớn hơn ngày hiện tại!',
        ToastAndroid.SHORT,
      );
    } else {
      setDays(date);
      handleListSMS(date.getTime().toString());
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      handleListSMS(new Date().getTime().toString());
    }, 100);
  }, []);

  return (
    <View className={'flex-1 p-2'}>
      {loading ? (
        <View className={'flex-1 justify-center items-center'}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      ) : (
        <>
          <View className={'flex-row'}>
            <TouchableOpacity
              className={
                'justify-center items-center border-gray-600 border-[1px] rounded'
              }
              style={{width: 100}}
              onPress={onPressPickDate}>
              <Text>{days?.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <Input
              value={search}
              onChangeText={onChangeText}
              placeholder={'Tìm kiếm theo địa chỉ'}
              className={'flex-1 ml-2'}
            />
          </View>
          <FlatList
            data={listSMSFilter}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            ListFooterComponent={<View className={'h-20'} />}
            windowSize={5}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
          />
          <DatePicker
            modal={true}
            open={open}
            date={days}
            onConfirm={onConfirmDate}
            mode={'date'}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <Button
            disabled={selected.length === 0}
            onPress={onPressSendSMS}
            backgroundColor={'#4497F8'}
            className={
              'absolute bottom-0 left-0 right-0 bg-blue-500 mb-5 py-3 '
            }>
            <Text c={'white'}>
              {selected.length === 0
                ? 'Chưa chọn tin nhắn'
                : `Chọn ${selected.length} tin nhắn`}
            </Text>
          </Button>
        </>
      )}
    </View>
  );
};

export default Container;
