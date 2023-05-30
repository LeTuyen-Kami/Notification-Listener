/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import AppNavigation from './src/routes/routes';

function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <AppNavigation />
    </SafeAreaView>
  );
}

export default App;
