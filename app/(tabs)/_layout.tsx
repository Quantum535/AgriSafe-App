import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Theme, Font } from '@/constants/Colors';
import { LayoutGrid, ScanLine, Activity, Server } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.accent,
        tabBarInactiveTintColor: Theme.textTertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Theme.bgElevated,
          borderTopWidth: 1,
          borderTopColor: Theme.border,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontFamily: Font.mono,
          fontSize: 10,
          letterSpacing: 0.5,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'GLANCE',
          tabBarIcon: ({ color }) => <LayoutGrid size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="diagnostic"
        options={{
          title: 'DIAGNOSE',
          tabBarIcon: ({ color }) => <ScanLine size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'TRENDS',
          tabBarIcon: ({ color }) => <Activity size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'NODE',
          tabBarIcon: ({ color }) => <Server size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
