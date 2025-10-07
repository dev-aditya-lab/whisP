import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  
  return (
    <SafeAreaProvider>
      <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Authentication pages - no header */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
        {/* Main tabs navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Additional pages outside tabs */}
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{ 
            title: 'Notifications',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
          }} 
        />
        <Stack.Screen 
          name="group-chat" 
          options={{ 
            title: 'Group Chats',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
            headerShown: false,
          }} 
        />
      </Stack>
      <StatusBar style="light" />
    </>
    </SafeAreaProvider>
  );
}
