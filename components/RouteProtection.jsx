import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { getAuthToken } from '../utils/AuthToken';

export default function RouteProtection({ children, requireAuth = true }) {
  const [isLoading, setLoading] = useState(true);
  const [isAuthed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getAuthToken();
      setAuthed(!!token);
      setLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-white mt-4 text-base">Loading...</Text>
      </View>
    );
  }

  if (requireAuth && !isAuthed) {
    return <Redirect href='/(auth)/WhatsAppNumberInput' />;
  }

  if (!requireAuth && isAuthed) {
    return <Redirect href='/(tabs)' />;
  }

  return children;
}