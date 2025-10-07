import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const notifications = [
    { id: 1, title: 'Market Alert: AAPL', message: 'Stock reached your target price of $150', time: '2 min ago', type: 'alert', icon: '📈' },
    { id: 2, title: 'New Message from Sarah', message: 'Thanks for sharing that chart analysis!', time: '5 min ago', type: 'message', icon: '💬' },
    { id: 3, title: 'Room Activity', message: 'New discussion in Crypto Analytics room', time: '10 min ago', type: 'room', icon: '🏢' },
    { id: 4, title: 'Chart Like', message: 'Mike liked your BTC/USD analysis', time: '15 min ago', type: 'social', icon: '❤️' },
    { id: 5, title: 'Market Update', message: 'Your watchlist stocks are moving', time: '1 hour ago', type: 'market', icon: '📊' },
  ];

  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'alert': return 'border-l-4 border-l-red-500';
      case 'message': return 'border-l-4 border-l-blue-500';
      case 'room': return 'border-l-4 border-l-green-500';
      case 'social': return 'border-l-4 border-l-purple-500';
      case 'market': return 'border-l-4 border-l-orange-500';
      default: return 'border-l-4 border-l-gray-500';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-5">
        {/* Header Actions */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-white">All Notifications</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="bg-blue-600 px-3 py-2 rounded-lg">
              <Text className="text-white text-sm font-medium">Mark All Read</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-700 px-3 py-2 rounded-lg">
              <Text className="text-white text-sm font-medium">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Filters */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">All</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Alerts</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Social</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Market</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Today's Notifications */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Today</Text>
          <View className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <TouchableOpacity 
                key={notification.id}
                className={`bg-gray-800 rounded-xl border border-gray-700 ${getNotificationBgColor(notification.type)}`}
              >
                <View className="p-4 flex-row items-start">
                  <Text className="text-2xl mr-3 mt-1">{notification.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-white font-medium mb-1">{notification.title}</Text>
                    <Text className="text-gray-300 text-sm leading-5 mb-2">{notification.message}</Text>
                    <Text className="text-gray-400 text-xs">{notification.time}</Text>
                  </View>
                  <View className="w-3 h-3 bg-blue-500 rounded-full ml-2"></View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Earlier Notifications */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Earlier</Text>
          <View className="space-y-3">
            {notifications.slice(3).map((notification) => (
              <TouchableOpacity 
                key={notification.id}
                className={`bg-gray-800 rounded-xl border border-gray-700 ${getNotificationBgColor(notification.type)} opacity-75`}
              >
                <View className="p-4 flex-row items-start">
                  <Text className="text-2xl mr-3 mt-1">{notification.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-white font-medium mb-1">{notification.title}</Text>
                    <Text className="text-gray-300 text-sm leading-5 mb-2">{notification.message}</Text>
                    <Text className="text-gray-400 text-xs">{notification.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notification Settings */}
        <View>
          <TouchableOpacity className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-4">⚙️</Text>
              <View>
                <Text className="text-white font-medium">Notification Settings</Text>
                <Text className="text-gray-400 text-sm">Manage your notification preferences</Text>
              </View>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}