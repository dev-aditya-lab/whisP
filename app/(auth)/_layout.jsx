import { Stack } from 'expo-router';
import RouteProtection from '../../components/RouteProtection';

export default function AuthLayout() {
  return (
    <RouteProtection requireAuth={false}>
      <Stack
        screenOptions={{
          headerShown: false, // This removes the default header
        }}
      >
        <Stack.Screen name="WhatsAppNumberInput" />
        <Stack.Screen name="otp" />
      </Stack>
    </RouteProtection>
  );
}