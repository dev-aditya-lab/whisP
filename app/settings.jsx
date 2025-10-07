import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-5">
        {/* Account Settings */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Account Settings</Text>
          <View className="space-y-3">
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">👤</Text>
                <View>
                  <Text className="text-white font-medium">Edit Profile</Text>
                  <Text className="text-gray-400 text-sm">Update your profile information</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">🔒</Text>
                <View>
                  <Text className="text-white font-medium">Privacy & Security</Text>
                  <Text className="text-gray-400 text-sm">Manage your privacy settings</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">💳</Text>
                <View>
                  <Text className="text-white font-medium">Billing & Subscription</Text>
                  <Text className="text-gray-400 text-sm">Manage your payment methods</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Preferences */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">App Preferences</Text>
          <View className="space-y-3">
            <View className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">🔔</Text>
                <View>
                  <Text className="text-white font-medium">Notifications</Text>
                  <Text className="text-gray-400 text-sm">Enable app notifications</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#374151', true: '#3B82F6' }}
                thumbColor={notifications ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            
            <View className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">🌙</Text>
                <View>
                  <Text className="text-white font-medium">Dark Mode</Text>
                  <Text className="text-gray-400 text-sm">Use dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#374151', true: '#3B82F6' }}
                thumbColor={darkMode ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            
            <View className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">🔄</Text>
                <View>
                  <Text className="text-white font-medium">Auto Sync</Text>
                  <Text className="text-gray-400 text-sm">Sync data automatically</Text>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: '#374151', true: '#3B82F6' }}
                thumbColor={autoSync ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            
            <View className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">📱</Text>
                <View>
                  <Text className="text-white font-medium">Push Alerts</Text>
                  <Text className="text-gray-400 text-sm">Market alerts and updates</Text>
                </View>
              </View>
              <Switch
                value={pushAlerts}
                onValueChange={setPushAlerts}
                trackColor={{ false: '#374151', true: '#3B82F6' }}
                thumbColor={pushAlerts ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Trading Settings */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Trading Settings</Text>
          <View className="space-y-3">
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">📊</Text>
                <View>
                  <Text className="text-white font-medium">Default Chart Settings</Text>
                  <Text className="text-gray-400 text-sm">Customize your chart preferences</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">⚡</Text>
                <View>
                  <Text className="text-white font-medium">Trading Alerts</Text>
                  <Text className="text-gray-400 text-sm">Configure market alerts</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">🎯</Text>
                <View>
                  <Text className="text-white font-medium">Risk Management</Text>
                  <Text className="text-gray-400 text-sm">Set risk parameters</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View>
          <Text className="text-lg font-semibold text-white mb-3">About</Text>
          <View className="space-y-3">
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">ℹ️</Text>
                <View>
                  <Text className="text-white font-medium">App Version</Text>
                  <Text className="text-gray-400 text-sm">v1.0.0 (Build 123)</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">📄</Text>
                <View>
                  <Text className="text-white font-medium">Terms & Privacy</Text>
                  <Text className="text-gray-400 text-sm">Legal information</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}