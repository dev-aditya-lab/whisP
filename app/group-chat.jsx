import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function GroupChatScreen() {
  const [newMessage, setNewMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState({});

  // Sample room data
  const rooms = [
    { 
      id: 1, 
      name: 'Tech Talk', 
      members: 89, 
      emoji: '💻',
      category: 'Technology',
      description: 'Discuss the latest in tech, AI, and development'
    },
    { 
      id: 2, 
      name: 'Music Lovers', 
      members: 156, 
      emoji: '🎵',
      category: 'Music',
      description: 'Share your favorite songs and discover new music'
    },
    { 
      id: 3, 
      name: 'Gaming Zone', 
      members: 234, 
      emoji: '🎮',
      category: 'Gaming',
      description: 'Gaming discussions, tips, and finding teammates'
    },
    { 
      id: 4, 
      name: 'Art & Design', 
      members: 67, 
      emoji: '🎨',
      category: 'Creative',
      description: 'Share artwork, design tips, and creative inspiration'
    },
    { 
      id: 5, 
      name: 'Food Lovers', 
      members: 123, 
      emoji: '🍕',
      category: 'Food',
      description: 'Recipes, restaurant recommendations, and food photos'
    }
  ];

  // Sample messages for different rooms
  const sampleMessages = {
    1: [
      {
        id: 1,
        uid: 'USR123',
        avatar: '👨‍💻',
        message: 'Has anyone tried the new React 19 features?',
        timestamp: '2:15 PM',
        isVerified: true,
        isOwn: false
      },
      {
        id: 2,
        uid: 'USR456',
        avatar: '👩‍💻',
        message: 'Yes! The new hooks are amazing, especially useOptimistic',
        timestamp: '2:18 PM',
        isVerified: false,
        isOwn: false
      }
    ],
    2: [
      {
        id: 1,
        uid: 'USR789',
        avatar: '👨‍🎤',
        message: 'Just discovered this amazing indie band! 🎶',
        timestamp: '1:45 PM',
        isVerified: true,
        isOwn: false
      },
      {
        id: 2,
        uid: 'USR321',
        avatar: '👩‍🎤',
        message: 'Share the link! Always looking for new music',
        timestamp: '1:47 PM',
        isVerified: false,
        isOwn: false
      }
    ],
    3: [
      {
        id: 1,
        uid: 'USR654',
        avatar: '👾',
        message: 'Anyone up for a multiplayer game tonight?',
        timestamp: '3:30 PM',
        isVerified: true,
        isOwn: false
      }
    ]
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedRoom) {
      const message = {
        id: (messages[selectedRoom.id] || []).length + 1,
        uid: 'YOU',
        avatar: '👤',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isVerified: false,
        isOwn: true
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedRoom.id]: [...(prev[selectedRoom.id] || sampleMessages[selectedRoom.id] || []), message]
      }));
      setNewMessage('');
    }
  };

  const joinRoom = (room) => {
    setSelectedRoom(room);
    if (!messages[room.id]) {
      setMessages(prev => ({
        ...prev,
        [room.id]: sampleMessages[room.id] || []
      }));
    }
  };

  const leaveRoom = () => {
    setSelectedRoom(null);
  };

  if (!selectedRoom) {
    // Room selection screen
    return (
      <ScrollView className="flex-1 bg-gray-900">
        {/* Header */}
        <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
          <Text className="text-2xl font-bold text-white mb-2">Group Chats</Text>
          <Text className="text-gray-400">Join a room to start chatting with people who share your interests</Text>
        </View>

        {/* Rooms List */}
        <View className="p-5">
          <Text className="text-lg font-semibold text-white mb-4">Available Rooms</Text>
          
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              onPress={() => joinRoom(room)}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-3">{room.emoji}</Text>
                  <View>
                    <Text className="text-white font-semibold text-lg">{room.name}</Text>
                    <Text className="text-gray-400 text-sm">{room.category}</Text>
                  </View>
                </View>
                <View className="bg-blue-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm font-medium">{room.members}</Text>
                </View>
              </View>
              <Text className="text-gray-300 text-sm mb-3">{room.description}</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-green-400 text-sm">🟢 Active now</Text>
                <View className="bg-blue-600 px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Join Room</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Room Button */}
        <View className="p-5">
          <TouchableOpacity className="bg-green-600 rounded-xl p-4 items-center">
            <Text className="text-white font-semibold text-lg">+ Create New Room</Text>
            <Text className="text-green-200 text-sm mt-1">Start your own group chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Chat screen for selected room
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-900"
    >
      {/* Header */}
      <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={leaveRoom} className="mr-3">
            <Text className="text-blue-400 text-lg">← Back</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">{selectedRoom.emoji}</Text>
              <View>
                <Text className="text-white font-bold text-lg">{selectedRoom.name}</Text>
                <Text className="text-gray-400 text-sm">{selectedRoom.members} members</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="bg-gray-700 px-3 py-2 rounded-lg">
            <Text className="text-white text-sm">👥</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-4 py-4">
        {(messages[selectedRoom.id] || []).map((msg) => (
          <View 
            key={msg.id} 
            className={`mb-4 ${msg.isOwn ? 'items-end' : 'items-start'}`}
          >
            <View 
              className={`max-w-[80%] ${
                msg.isOwn 
                  ? 'bg-blue-600 rounded-l-xl rounded-tr-xl rounded-br-sm' 
                  : 'bg-gray-800 rounded-r-xl rounded-tl-xl rounded-bl-sm'
              } p-3`}
            >
              {!msg.isOwn && (
                <View className="flex-row items-center mb-2">
                  <Text className="text-xl mr-2">{msg.avatar}</Text>
                  <Text className="text-white font-semibold text-sm">{msg.uid}</Text>
                  {msg.isVerified && (
                    <Text className="text-blue-400 ml-1">✓</Text>
                  )}
                </View>
              )}
              <Text className={`text-base ${msg.isOwn ? 'text-white' : 'text-gray-100'}`}>
                {msg.message}
              </Text>
              <Text className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="bg-gray-800 p-4 border-t border-gray-700">
        <View className="flex-row items-center bg-gray-700 rounded-xl px-4 py-2">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={`Message ${selectedRoom.name}...`}
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white text-base py-2"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            onPress={sendMessage}
            className={`ml-3 px-4 py-2 rounded-lg ${
              newMessage.trim() ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <Text className="text-white font-medium">Send</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 text-xs mt-2 text-center">
          Group chat • Keep it friendly and on-topic
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}