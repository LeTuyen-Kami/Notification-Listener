import React from 'react';
import {TextInput, TextInputProps} from 'react-native';

interface Props extends TextInputProps {}

const Input: React.FC<Props> = ({style, ...props}) => {
  return (
    <TextInput
      style={[
        {
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default Input;
