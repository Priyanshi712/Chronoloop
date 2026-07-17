// App.js

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { FocusProvider } from './src/context/FocusContext';
import { TrackerProvider } from './src/context/TrackerContext';

export default function App() {
  return (
    <FocusProvider>
      <TrackerProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </TrackerProvider>
    </FocusProvider>
  );
}