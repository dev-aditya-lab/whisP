import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState('personal');
  const personalChats = [
    { 
      id: 1, 
      uid: 'USR456', 
      avatar: '👩', 
      lastMessage: 'Hey! How are you doing?', 
      time: '2m ago', 
      unread: 3, 
      isOnline: true,
      isVerified: false 
    },
    { 
      id: 2, 
      uid: 'USR123', 
      avatar: '👨', 
      lastMessage: 'Thanks for the chat yesterday', 
      time: '15m ago', 
      unread: 0, 
      isOnline: true,
      isVerified: true 
    },
    { 
      id: 3, 
      uid: 'USR789', 
      avatar: '👤', 
      lastMessage: 'Let me know when you are free', 
      time: '1h ago', 
      unread: 1, 
      isOnline: false,
      isVerified: true 
    },
    { 
      id: 4, 
      uid: 'USR321', 
      avatar: '👨‍💻', 
      lastMessage: 'That was fun! Let us chat again', 
      time: '3h ago', 
      unread: 0, 
      isOnline: true,
      isVerified: false 
    },
    { 
      id: 5, 
      uid: 'USR654', 
      avatar: '👩‍🎨', 
      lastMessage: 'Good night!', 
      time: '1d ago', 
      unread: 0, 
      isOnline: false,
      isVerified: true 
    },
    { 
      id: 6, 
      uid: 'USR987', 
      avatar: '👨‍🚀', 
      lastMessage: 'See you tomorrow!', 
      time: '2d ago', 
      unread: 0, 
      isOnline: false,
      isVerified: false 
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-white">Chats</Text>
          <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">+ New Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-5">
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Recent Conversations</Text>
          
          {personalChats.map((chat) => (
            <TouchableOpacity 
              key={chat.id} 
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3"
            >
              <View className="flex-row items-center">
                <View className="relative mr-3">
                  <View className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center">
                    <Text className="text-2xl">{chat.avatar}</Text>
                  </View>
                  {chat.isOnline ? (
                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
                  ) : (
                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-800" />
                  )}
                </View>
                
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <Text className="text-white font-semibold text-base mr-2">{chat.uid}</Text>
                      {chat.isVerified && (
                        <Image 
                          source={require('../../assets/image.png')} 
                          className="w-4 h-4"
                          resizeMode="contain"
                        />
                      )}
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-xs mr-2">{chat.time}</Text>
                      {chat.unread > 0 && (
                        <View className="bg-red-500 px-2 py-1 rounded-full">
                          <Text className="text-white text-xs font-bold">{chat.unread}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text className="text-gray-400 text-sm" numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  
                  <View className="flex-row items-center mt-1">
                    <Text className={`text-xs ${chat.isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                      {chat.isOnline ? '● Online' : '● Offline'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}