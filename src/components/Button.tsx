import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';

interface Props extends Partial<PressableProps> {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'ghost';
  backgroundColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
  activityIndicatorColor?: string;
  style?: any;
}

const Button: React.FC<Props> = ({
  variant = 'solid',
  backgroundColor = 'white',
  style,
  activityIndicatorColor = 'black',
  ...props
}) => {
  return (
    <Pressable
      style={[
        style,
        {
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variant === 'outline' ? 'black' : 'transparent',
          backgroundColor:
            variant === 'solid' ? backgroundColor : 'transparent',
          padding: 10,
          borderRadius: 20,
          opacity: props.disabled ? 0.5 : 1,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
      ]}
      disabled={props.isLoading || props.disabled}
      android_ripple={{
        color: 'rgba(94,83,83,0.2)',
      }}
      {...props}>
      {props.children}
      {props.isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: backgroundColor,
            },
          ]}
          className={`justify-center items-center]`}>
          <ActivityIndicator size={'small'} color={activityIndicatorColor} />
        </View>
      )}
    </Pressable>
  );
};

export default Button;
