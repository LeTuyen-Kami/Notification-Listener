import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeView,
  ListNotification,
  ListSMS,
  LoginView,
  SettingView,
} from '../screens';
import storage, {storageKeys} from '../database';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          storage.getString(storageKeys.ACCESS_TOKEN) ? 'Home' : 'Login'
        }>
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
          component={LoginView}
        />
        <Stack.Screen
          name="Setting"
          options={{
            title: 'Cài đặt',
          }}
          component={SettingView}
        />
        <Stack.Screen name="Home" component={HomeView} />
        <Stack.Screen
          name="ListNotification"
          options={{
            title: 'Danh sách thông báo',
          }}
          component={ListNotification}
        />
        <Stack.Screen
          name="ListSMS"
          options={{
            title: 'Danh sách tin nhắn',
          }}
          component={ListSMS}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
