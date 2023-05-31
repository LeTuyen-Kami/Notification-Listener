import React from 'react';
import {FlatList, ToastAndroid, View} from 'react-native';
import Text from '../../components/Text';
import {IApp, INotification} from '../../contants/Interface';
import storage, {storageKeys} from '../../database';
import Item from './Item';
import {useAtom} from 'jotai';
import {listCheckAppAtom} from '../../Atom/Atom';
import Button from '../../components/Button';
import {sendNotification} from '../../Api/Api';
import {customLog} from '../../utils/common';

const Container: React.FC = () => {
  const [listNotification, setListNotification] = React.useState<
    INotification[]
  >([]);
  const [listCheckApp] = useAtom(listCheckAppAtom);
  const [selected, setSelected] = React.useState<
    {
      index: number;
      item: INotification;
    }[]
  >([]);

  const onPressSelect = (_index: number, _item: INotification) => {
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

  React.useEffect(() => {
    const listNot: INotification[] = JSON.parse(
      storage.getString(storageKeys.LIST_NOTIFICATION) || '[]',
    );

    setListNotification(
      listNot.filter((item: INotification) => {
        if (listCheckApp.length === 0) {
          return true;
        }

        const index = listCheckApp.findIndex(
          (checkedItem: IApp) => checkedItem.packageName === item.app,
        );

        return index !== -1;
      }),
    );
  }, [listCheckApp]);

  const renderItem = ({item, index}: {item: INotification; index: number}) => {
    return (
      <Item
        item={item}
        index={index}
        selected={selected}
        onPressSelect={onPressSelect}
      />
    );
  };

  const onPressSendNotification = () => {
    if (selected.length === 0) {
      ToastAndroid.show('Chưa chọn notification', ToastAndroid.SHORT);
      return;
    }

    const urlNotification = JSON.parse(
      JSON.parse(storage.getString(storageKeys.NOTIFICATION_URL) || ''),
    );
    if (!!urlNotification?.trim()) {
      const token = storage.getString(storageKeys.ACCESS_TOKEN) || '';
      for (let i = 0; i < selected.length; i++) {
        const notification = selected[i].item;
        sendNotification(urlNotification, token, {
          package: notification.app,
          title: notification.title,
          content: notification.text || notification.bigText,
        })
          .then(() => {
            ToastAndroid.show('Send notification success', ToastAndroid.SHORT);
          })
          .catch((err: any) => {
            customLog('sendNotification', err);
            ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
          });
      }
    } else {
      ToastAndroid.show('Chưa cấu hình url notification', ToastAndroid.SHORT);
    }
  };

  return (
    <View className={'flex-1 p-2'}>
      <FlatList
        data={listNotification}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={<View className={'h-20'} />}
      />
      <Button
        disabled={selected.length === 0}
        onPress={onPressSendNotification}
        backgroundColor={'#4497F8'}
        className={'absolute bottom-0 left-0 right-0 bg-blue-500 mb-5 py-3 '}>
        <Text c={'white'}>
          {selected.length === 0
            ? 'Chưa chọn thông báo'
            : `Chọn ${selected.length} thông báo`}
        </Text>
      </Button>
    </View>
  );
};

export default Container;
