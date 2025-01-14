import * as DevClient from 'expo-dev-client';
import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quizzes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'albums' : 'albums-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="flashcards"
        options={{
          title: 'Flashcards',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'albums' : 'albums-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="video-test"
        options={{
          title: 'Videos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'videocam' : 'videocam-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz-results"
        options={{
          title: 'Results',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
