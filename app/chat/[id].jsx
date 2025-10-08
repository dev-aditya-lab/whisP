import { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMessages, saveMessages, saveChat } from '../../utils/chatStorage';
import { 
  getAutoDeleteSetting, 
  addMessageExpiry, 
  filterExpiredMessages 
} from '../../utils/autoDelete';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const SERVER_URL = 'http://10.102.30.54:3001';
const SECRET_KEY = 'enderDevEnc';
const USER_ID_KEY = '@user_id';

let socket;

export default function UserChat() {
  const { id: partnerId } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef(null);

  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [autoDeleteSetting, setAutoDeleteSetting] = useState('never');

  // Clean expired messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => {
        const filtered = filterExpiredMessages(prev);
        if (filtered.length !== prev.length) {
          // Messages were deleted, update storage
          const deletedCount = prev.length - filtered.length;
          console.log(`[Auto-Delete] Removed ${deletedCount} expired message(s)`);
          saveMessages(partnerId, filtered);
        }
        return filtered;
      });
    }, 10000); // Check every 10 seconds for testing (was 60000)

    return () => clearInterval(interval);
  }, [partnerId]);

  const loadUserIdAndConnect = async () => {
    try {
      const storedId = await AsyncStorage.getItem(USER_ID_KEY);
      if (storedId) {
        setUserId(storedId);
        
        // Load auto-delete setting
        const setting = await getAutoDeleteSetting();
        setAutoDeleteSetting(setting);
        
        // Load stored messages first and filter expired
        const storedMessages = await getMessages(partnerId);
        if (storedMessages.length > 0) {
          const validMessages = filterExpiredMessages(storedMessages);
          setMessages(validMessages);
          
          // Save filtered messages if any were removed
          if (validMessages.length !== storedMessages.length) {
            saveMessages(partnerId, validMessages);
          }
          
          setTimeout(scrollToBottom, 100);
        }
        
        connectSocket(storedId);
      }
    } catch (error) {
      console.error('Failed to load user ID:', error);
    }
  };

  const connectSocket = (uid) => {
    socket = io(SERVER_URL);

    socket.on('connect', () => {
      console.log('Connected to chat');
      socket.emit('join', uid);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive-message', async (msg) => {
      // Only add messages relevant to this conversation
      if (
        (msg.senderId === uid && msg.receiverId === partnerId) ||
        (msg.senderId === partnerId && msg.receiverId === uid)
      ) {
        // Add expiry metadata to message
        const setting = await getAutoDeleteSetting();
        const msgWithExpiry = addMessageExpiry(msg, setting);
        
        console.log('[Auto-Delete] Message received with setting:', setting);
        if (msgWithExpiry.expiresAt) {
          const expiryDate = new Date(msgWithExpiry.expiresAt);
          console.log('[Auto-Delete] Message will expire at:', expiryDate.toLocaleString());
        }
        
        setMessages((prev) => {
          const updated = [...prev, msgWithExpiry];
          // Save to storage
          saveMessages(partnerId, updated);
          
          // Update chat list with last message
          const decrypted = decryptMessage(msg.encryptedMessage);
          saveChat(partnerId, decrypted, Date.now());
          
          return updated;
        });
        scrollToBottom();
      }
    });

    socket.on('chat-history', async (msgs) => {
      // Get current auto-delete setting
      const setting = await getAutoDeleteSetting();
      
      // Merge with stored messages (avoid duplicates)
      setMessages(prev => {
        const combined = [...prev];
        msgs.forEach(msg => {
          const exists = combined.some(
            m => m.senderId === msg.senderId && 
                 m.receiverId === msg.receiverId && 
                 m.encryptedMessage === msg.encryptedMessage
          );
          if (!exists) {
            // Add expiry metadata to history messages
            const msgWithExpiry = addMessageExpiry(msg, setting);
            combined.push(msgWithExpiry);
          }
        });
        
        // Save combined messages
        saveMessages(partnerId, combined);
        return combined;
      });
      setTimeout(scrollToBottom, 100);
    });
  };

  // Load user ID and connect to socket
  useEffect(() => {
    loadUserIdAndConnect();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Request message history when userId is set
  useEffect(() => {
    if (userId && partnerId && socket) {
      socket.emit('get-messages', { userId, partnerId });
    }
  }, [userId, partnerId]);

  const encryptMessage = (text) => {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  };

  const decryptMessage = (cipher) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (_error) {
      return '[Encrypted message]';
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !isConnected) return;
    
    const encrypted = encryptMessage(message);
    const msgObject = {
      senderId: userId,
      receiverId: partnerId,
      encryptedMessage: encrypted,
    };
    
    socket.emit('private-message', msgObject);
    
    // Don't add to state here - let the server echo it back via 'receive-message'
    // This prevents duplicate messages
    
    // Still update chat list with the sent message
    saveChat(partnerId, message, Date.now());
    
    setMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const filteredMsgs = messages.filter(
    (m) =>
      (m.senderId === userId && m.receiverId === partnerId) ||
      (m.senderId === partnerId && m.receiverId === userId)
  );

  const hasMessages = filteredMsgs.length > 0;
  const isSendDisabled = !message.trim() || !isConnected;

  const getAutoDeleteLabel = () => {
    switch (autoDeleteSetting) {
      case 'never': return null;
      case 'after_reading': return '👁️ Delete after reading';
      case '24_hours': return '⏱️ 24h auto-delete';
      case '7_days': return '⏱️ 7d auto-delete';
      case '30_days': return '⏱️ 30d auto-delete';
      default: return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="px-6 py-4 border-b border-white/10 bg-slate-900 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 w-10 h-10 items-center justify-center rounded-full bg-white/10"
            activeOpacity={0.7}
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
          
          <View className="flex-1">
            <Text className="text-xl font-semibold text-white">
              {partnerId}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <Text className="text-xs text-emerald-400">
                {isConnected ? 'Online' : 'Connecting...'}
              </Text>
              {getAutoDeleteLabel() && (
                <>
                  <Text className="text-xs text-white/40 mx-2">•</Text>
                  <Text className="text-xs text-yellow-400">
                    {getAutoDeleteLabel()}
                  </Text>
                </>
              )}
            </View>
          </View>

          <View className="w-3 h-3 rounded-full bg-emerald-400" />
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 20,
            flexGrow: 1,
            justifyContent: hasMessages ? 'flex-start' : 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          {hasMessages ? (
            filteredMsgs.map((m, idx) => {
              const isMine = m.senderId === userId;
              return (
                <View
                  key={idx}
                  className={`mb-4 w-full ${
                    isMine ? 'items-end' : 'items-start'
                  }`}
                >
                  <View
                    className={`max-w-[85%] rounded-3xl px-4 py-3 ${
                      isMine
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                        : 'bg-white/15 border border-white/10'
                    }`}
                  >
                    <Text className="text-sm text-white">
                      {decryptMessage(m.encryptedMessage)}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="items-center px-10">
              <Text className="text-2xl font-semibold text-white mb-2 text-center">
                Start the conversation 💬
              </Text>
              <Text className="text-sm text-white/50 text-center">
                Send a message to {partnerId}. All messages are end-to-end encrypted.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-4 pb-4 pt-3 bg-slate-950/60 border-t border-white/10">
          <View className="flex-row items-end bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-white text-base max-h-24"
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={isSendDisabled}
              activeOpacity={0.85}
              className={`ml-3 rounded-full px-4 py-2 ${
                isSendDisabled
                  ? 'bg-emerald-500/40'
                  : 'bg-emerald-500'
              }`}
            >
              <Text className="text-white font-semibold">Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
