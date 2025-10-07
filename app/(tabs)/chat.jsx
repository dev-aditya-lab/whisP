import  { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

import {  ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SERVER_URL = 'http://10.102.30.54:3001';
const SECRET_KEY = 'enderDevEnc'; 

let socket;

export default function ChatScreen() {
  const [userId, setUserId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    socket = io(SERVER_URL);

    socket.on('connect', () => console.log('Connected'));
    socket.on('online-users', (users) => {
      setOnlineUsers(users.filter((u) => u !== userId));
    });

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('chat-history', (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);


  const encryptMessage = (text) => {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  };

  const decryptMessage = (cipher) => {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleLogin = () => {
    if (!userId.trim()) return alert('Enter userId');
    socket.emit('join', userId);
    setLoggedIn(true);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages([]);
    socket.emit('get-messages', { userId, partnerId: user });
  };

  const sendMessage = () => {
    if (!selectedUser || !message.trim()) return;
    const encrypted = encryptMessage(message);
    socket.emit('private-message', {
      senderId: userId,
      receiverId: selectedUser,
      encryptedMessage: encrypted,
    });
    setMessage('');
  };

  const filteredMsgs = messages.filter(
    (m) =>
      (m.senderId === userId && m.receiverId === selectedUser) ||
      (m.senderId === selectedUser && m.receiverId === userId)
  );

  return (
    <ScrollView className="flex-1 bg-gray-900">
    {!loggedIn ? (
      <View className="m-auto p-24 text-center">
  <TextInput 
  value={userId}
  onChangeText={setUserId}
  placeholder="Enter User ID"
  className="border p-2 rounded mr-2"
   />
        <TouchableOpacity onPress={handleLogin} className="bg-blue-500 p-2 rounded mt-2">
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
      </View>
    ):(
      <>
        <View className="w-1/4 bg-white border-r p-4">
        <Text className="text-lg font-bold mb-4">Online Users</Text>
        {onlineUsers.map((user) => (
          <TouchableOpacity key={user} onPress={() => handleUserSelect(user)} className={`p-2 mb-2 rounded ${selectedUser === user ? 'bg-blue-200' : 'bg-gray-200'}`}>
            <Text>{user}</Text>
          </TouchableOpacity>
        ))}
        </View>

      <View className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <ScrollView className="flex-1 p-4">
              {filteredMsgs.map((m, idx) => (
                <View
                  key={idx}
                  className={`mb-2 flex ${
                    m.senderId === userId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <View
                    className={`p-2 rounded-lg max-w-xs ${
                      m.senderId === userId
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <Text className={m.senderId === userId ? 'text-white' : 'text-black'}>
                      {decryptMessage(m.encryptedMessage)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View className="p-4 flex flex-row gap-2 border-t bg-white">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                className="border p-2 flex-1 rounded"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                onPress={sendMessage}
                className="bg-green-600 px-4 py-2 rounded"
              >
                <Text className="text-white">Send</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="m-auto">
            <Text className="text-gray-500">
              Select a user to start chatting
            </Text>
          </View>
        )}
      </View>
      </>
    )}

    </ScrollView>
  );
}