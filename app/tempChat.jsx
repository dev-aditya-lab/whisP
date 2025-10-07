import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
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

let socket;

// Generate random ID function
const generateRandomId = () => {
    return 'user_' + Math.random().toString(36).substring(2, 9);
};

export default function ChatScreen() {
    const [userId, setUserId] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Auto-generate and login with random ID on mount
    useEffect(() => {
        const randomId = generateRandomId();
        setUserId(randomId);
        
        socket = io(SERVER_URL);

        socket.on('connect', () => {
            console.log('Connected');
            socket.emit('join', randomId);
        });

        socket.on('online-users', (users) => {
            setOnlineUsers(users.filter((u) => u !== randomId));
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
    }, []);

    const encryptMessage = (text) => {
        return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    };

    const decryptMessage = (cipher) => {
        const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
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

    const hasMessages = filteredMsgs.length > 0;
    const isSendDisabled = !selectedUser || !message.trim();
    const messageContentStyle = {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 110,
        flexGrow: 1,
        justifyContent: hasMessages ? 'flex-start' : 'center',
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <View className="flex-1 px-4 pb-6">
                <View className="flex-1 gap-4">
                    <View className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-md">
                        <Text className="text-lg font-semibold text-white mb-3">
                            Online right now
                        </Text>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: 220 }}
                        >
                            {onlineUsers.length === 0 ? (
                                <View className="py-4 items-center">
                                    <Text className="text-white/50 text-sm text-center">
                                        No friends online just yet. Share your handle to get them here.
                                    </Text>
                                </View>
                            ) : (
                                onlineUsers.map((user) => (
                                    <TouchableOpacity
                                        key={user}
                                        onPress={() => handleUserSelect(user)}
                                        activeOpacity={0.85}
                                        className={`mb-3 rounded-2xl px-4 py-3 border ${
                                            selectedUser === user
                                                ? 'bg-emerald-500/20 border-emerald-400'
                                                : 'bg-white/5 border-white/10'
                                        }`}
                                    >
                                        <Text className="text-white text-base font-medium">
                                            {user}
                                        </Text>
                                        <Text className="text-xs text-white/50 mt-1">
                                            Tap to open a private thread
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>

                    <View className="flex-1 bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                        {selectedUser ? (
                            <>
                                <View className="px-6 py-4 border-b border-white/10 bg-white/5">
                                    <Text className="text-xl font-semibold text-white">
                                        {selectedUser}
                                    </Text>
                                    <Text className="text-xs text-emerald-200 mt-1">
                                        End-to-end encrypted conversation
                                    </Text>
                                </View>

                                <ScrollView
                                    contentContainerStyle={messageContentStyle}
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
                                                        {!isMine && (
                                                            <Text className="text-[11px] text-white/60 mb-1 uppercase tracking-[1.5px]">
                                                                {m.senderId}
                                                            </Text>
                                                        )}
                                                        <Text className="text-sm text-white">
                                                            {decryptMessage(m.encryptedMessage)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    ) : (
                                        <View className="items-center">
                                            <Text className="text-sm text-white/50">
                                                Say hi! Your history will appear here.
                                            </Text>
                                        </View>
                                    )}
                                </ScrollView>

                                <KeyboardAvoidingView
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    keyboardVerticalOffset={24}
                                >
                                    <View className="px-6 pb-5 pt-3 bg-slate-950/60 border-t border-white/10">
                                        <View className="flex-row items-end bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                                            <TextInput
                                                value={message}
                                                onChangeText={setMessage}
                                                placeholder="Type something thoughtful..."
                                                placeholderTextColor="#9CA3AF"
                                                className="flex-1 text-white text-base"
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
                            </>
                        ) : (
                            <View className="flex-1 items-center justify-center px-10">
                                <Text className="text-2xl font-semibold text-white mb-2">
                                    Choose someone to chat ✨
                                </Text>
                                <Text className="text-sm text-white/60 text-center">
                                    Your encrypted conversation feed will appear here once you select a friend from the online list above.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
