import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {INotification} from '../../contants/Interface';
import Text from '../../components/Text';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Item: React.FC<{
  item: INotification;
  index: number;
  selected: {
    index: number;
    item: INotification;
  }[];
  onPressSelect: (index: number, item: INotification) => void;
}> = ({item, index, selected, onPressSelect}) => {
  return (
    <TouchableOpacity
      onPress={onPressSelect.bind(this, index, item)}
      className={'flex-row m-1 p-1 bg-fuchsia-50 rounded'}
      style={{
        elevation: 1,
      }}>
      <View className={'w-10 justify-center items-center '}>
        <View
          style={{
            borderWidth: 1,
            borderColor:
              selected.findIndex(
                selectedItem => selectedItem.index === index,
              ) !== -1
                ? 'transparent'
                : 'black',
          }}
          className={`w-5 h-5 rounded-full justify-center items-center ${
            selected.findIndex(selectedItem => selectedItem.index === index) !==
            -1
              ? 'bg-blue-500'
              : 'bg-white'
          }`}>
          <FontAwesome5Icon name={'check'} size={10} color={'white'} />
        </View>
      </View>
      <View>
        <Text>{item.appName}</Text>
        <Text className={'font-bold'}>{item.title}</Text>
        <Text>{item.text || item.bigText}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Item;
