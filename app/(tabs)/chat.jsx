import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChats } from '../../utils/chatStorage';
import 'react-native-get-random-values';

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';

const SERVER_URL = 'http://10.102.30.54:3001';
const USER_ID_KEY = '@user_id';

let socket;

// Generate random ID function
const generateRandomId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 9);
};

export default function ChatScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [storedChats, setStoredChats] = useState([]);
  const [allChats, setAllChats] = useState([]);

  // Load or generate user ID on mount
  useEffect(() => {
    loadUserId();
    loadStoredChats();
  }, []);

  // Reload chats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadStoredChats();
    }, [])
  );

  // Merge online users with stored chats
  useEffect(() => {
    mergeChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineUsers, storedChats, lastMessages]);

  // Connect to socket when we have a userId
  useEffect(() => {
    if (!userId) return;

    socket = io(SERVER_URL);

    socket.on('connect', () => {
      console.log('Connected');
      socket.emit('join', userId);
    });

    socket.on('online-users', (users) => {
      setOnlineUsers(users.filter((u) => u !== userId));
    });

    socket.on('receive-message', (msg) => {
      // Update last message for this user
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      setLastMessages(prev => ({
        ...prev,
        [partnerId]: {
          text: msg.encryptedMessage,
          timestamp: Date.now()
        }
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const loadUserId = async () => {
    try {
      let storedId = await AsyncStorage.getItem(USER_ID_KEY);
      if (!storedId) {
        storedId = generateRandomId();
        await AsyncStorage.setItem(USER_ID_KEY, storedId);
      }
      setUserId(storedId);
    } catch (error) {
      console.error('Failed to load user ID:', error);
      const fallbackId = generateRandomId();
      setUserId(fallbackId);
    }
  };

  const loadStoredChats = async () => {
    const chats = await getChats();
    setStoredChats(chats);
  };

  const mergeChats = () => {
    // Create a map of all chats
    const chatMap = new Map();

    // Add stored chats
    storedChats.forEach(chat => {
      chatMap.set(chat.partnerId, {
        partnerId: chat.partnerId,
        lastMessage: chat.lastMessage,
        timestamp: chat.timestamp,
        isOnline: false,
      });
    });

    // Update with online users and real-time messages
    onlineUsers.forEach(user => {
      const existing = chatMap.get(user);
      const realtimeMsg = lastMessages[user];
      
      chatMap.set(user, {
        partnerId: user,
        lastMessage: realtimeMsg?.text || existing?.lastMessage || null,
        timestamp: realtimeMsg?.timestamp || existing?.timestamp || Date.now(),
        isOnline: true,
      });
    });

    // Convert to array and sort by timestamp
    const merged = Array.from(chatMap.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );

    setAllChats(merged);
  };

  const handleUserSelect = (user) => {
    // Navigate to the chat screen with the user ID
    router.push(`/chat/${user}`);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-3 border-b border-white/10 bg-slate-900">
          <Text className="text-3xl font-bold text-white">Chats</Text>
          <Text className="text-sm text-white/60 mt-1">
            Your ID: {userId}
          </Text>
        </View>

        {/* User List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {allChats.length === 0 ? (
            <View className="flex-1 items-center justify-center px-10 py-20">
              <Text className="text-2xl font-semibold text-white mb-2 text-center">
                No chats yet 👋
              </Text>
              <Text className="text-sm text-white/60 text-center">
                Share your ID with friends to start chatting
              </Text>
            </View>
          ) : (
            allChats.map((chat) => {
              return (
                <TouchableOpacity
                  key={chat.partnerId}
                  onPress={() => handleUserSelect(chat.partnerId)}
                  activeOpacity={0.7}
                  className="px-6 py-4 border-b border-white/5 bg-slate-950 active:bg-white/5"
                >
                  <View className="flex-row items-center">
                    {/* Avatar */}
                    <View className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 items-center justify-center mr-4">
                      <Text className="text-xl font-bold text-emerald-400">
                        {chat.partnerId.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    {/* User Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-semibold text-white">
                          {chat.partnerId}
                        </Text>
                        {chat.timestamp && (
                          <Text className="text-xs text-white/40">
                            {formatTime(chat.timestamp)}
                          </Text>
                        )}
                      </View>
                      <Text className="text-sm text-white/50" numberOfLines={1}>
                        {chat.lastMessage ? '💬 ' + (chat.lastMessage.length > 30 ? chat.lastMessage.substring(0, 30) + '...' : chat.lastMessage) : 'Tap to start chatting'}
                      </Text>
                    </View>

                    {/* Online Indicator */}
                    {chat.isOnline && (
                      <View className="w-3 h-3 rounded-full bg-emerald-400 ml-2" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}