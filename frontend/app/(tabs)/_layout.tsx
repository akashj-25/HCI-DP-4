// frontend/app/(tabs)/_layout.tsx
// FIXED VERSION - Proper icons replacing emojis

import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, IconNames } from '../../constants/design';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.neutral,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: Colors.borderMedium,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 88 : 68,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name={IconNames.home}
              size={24} 
              color={focused ? Colors.neutral : Colors.textTertiary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name={IconNames.goals}
              size={24} 
              color={focused ? Colors.neutral : Colors.textTertiary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name={IconNames.timeline}
              size={24} 
              color={focused ? Colors.neutral : Colors.textTertiary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name={IconNames.profile}
              size={24} 
              color={focused ? Colors.neutral : Colors.textTertiary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-goal-modal"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-goal-modal"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-event-modal"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-event-modal"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}