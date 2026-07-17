// src/navigation/AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import TrackerScreen from '../screens/TrackerScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.textPrimary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Pomodoro"
          component={PomodoroScreen}
          options={{
            tabBarLabel: 'Focus',
            tabBarIcon: ({ color }) => (
              <Ionicons name="time-outline" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Tracker"
          component={TrackerScreen}
          options={{
            tabBarLabel: 'Tracker',
            tabBarIcon: ({ color }) => (
              <Ionicons name="checkmark-circle-outline" size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}