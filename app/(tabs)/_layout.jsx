import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import RouteProtection from '../../components/RouteProtection';

export default function TabLayout() {
  return (
    <RouteProtection requireAuth={true}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#60A5FA', // Blue-400
          tabBarInactiveTintColor: '#9CA3AF', // Gray-400
          tabBarStyle: {
            backgroundColor: '#1F2937', // Gray-800
            borderTopColor: '#374151', // Gray-700
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        }}>
      
            {/* Chat Tab - Messaging */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: (size || 20) - 2, color }}>💬</Text>
          ),
        }}
      />

      
      {/* All Tab - Main dashboard/overview */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat Setting',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: (size || 20) - 2, color }}>📊</Text>
          ),
        }}
      />
      

      

      
      {/* Profile Tab - User profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: (size || 20) - 2, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
    </RouteProtection>
  );
}
