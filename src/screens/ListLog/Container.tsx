import React from 'react';
import {FlatList, View} from 'react-native';
import Text from '../../components/Text';
import storage, {storageKeys} from '../../database';
import Button from '../../components/Button';

const Container: React.FC = () => {
  const [listLog, setListLog] = React.useState<any[]>([]);

  React.useEffect(() => {
    const listLog_: any[] = JSON.parse(
      storage.getString(storageKeys.LOG) || '[]',
    );
    console.log('listLog_', listLog_);
    setListLog(listLog_);
  }, []);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <View className={'m-1 p-1 bg-pink-400 rounded'} style={{elevation: 2}}>
        <Text>{JSON.stringify(item)}</Text>
      </View>
    );
  };

  const clearLog = () => {
    storage.delete(storageKeys.LOG);
    setListLog([]);
  };

  return (
    <View className={'flex-1'}>
      <Button
        onPress={clearLog}
        className={'rounded p-2 m-2 justify-center items-center'}>
        <Text className={'text-black'}>Clear Log</Text>
      </Button>
      <FlatList
        data={listLog}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Container;
