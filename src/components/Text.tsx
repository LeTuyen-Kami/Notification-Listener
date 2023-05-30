import React from 'react';

import {Text, TextProps} from 'react-native';

interface Props extends TextProps {
  c?: string;
}

const CText: React.FC<Props> = props => {
  return (
    <Text
      style={{
        color: props.c,
      }}
      {...props}
    />
  );
};

export default CText;
