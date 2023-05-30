import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ISMS} from '../../contants/Interface';
import Text from '../../components/Text';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Item: React.FC<{
  item: ISMS;
  index: number;
  selected: {
    index: number;
    item: ISMS;
  }[];
  onPressSelect: (index: number, item: ISMS) => void;
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
      <View className={'flex-1'}>
        <Text className={'font-bold'}>{item.messageAddress}</Text>
        <Text className={'my-2'}>{item.messageBody}</Text>
        <Text>{new Date(+item.messageDate).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Item;
