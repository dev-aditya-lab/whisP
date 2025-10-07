import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_KEY = '@chats';
const MESSAGES_KEY_PREFIX = '@messages_';

// Get all conversations
export const getChats = async () => {
  try {
    const chatsJson = await AsyncStorage.getItem(CHATS_KEY);
    return chatsJson ? JSON.parse(chatsJson) : [];
  } catch (error) {
    console.error('Failed to load chats:', error);
    return [];
  }
};

// Save or update a conversation
export const saveChat = async (partnerId, lastMessage, timestamp) => {
  try {
    const chats = await getChats();
    const existingIndex = chats.findIndex(chat => chat.partnerId === partnerId);
    
    const chatData = {
      partnerId,
      lastMessage,
      timestamp,
      unread: 0, // Can be enhanced later
    };

    if (existingIndex >= 0) {
      chats[existingIndex] = chatData;
    } else {
      chats.push(chatData);
    }

    // Sort by timestamp (most recent first)
    chats.sort((a, b) => b.timestamp - a.timestamp);

    await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    return chats;
  } catch (error) {
    console.error('Failed to save chat:', error);
    return [];
  }
};

// Get messages for a specific conversation
export const getMessages = async (partnerId) => {
  try {
    const messagesJson = await AsyncStorage.getItem(`${MESSAGES_KEY_PREFIX}${partnerId}`);
    return messagesJson ? JSON.parse(messagesJson) : [];
  } catch (error) {
    console.error('Failed to load messages:', error);
    return [];
  }
};

// Save messages for a specific conversation
export const saveMessages = async (partnerId, messages) => {
  try {
    // Keep only last 500 messages to avoid storage bloat
    const messagesToSave = messages.slice(-500);
    await AsyncStorage.setItem(
      `${MESSAGES_KEY_PREFIX}${partnerId}`,
      JSON.stringify(messagesToSave)
    );
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
};

// Add a single message to conversation
export const addMessage = async (partnerId, message) => {
  try {
    const messages = await getMessages(partnerId);
    messages.push(message);
    await saveMessages(partnerId, messages);
    return messages;
  } catch (error) {
    console.error('Failed to add message:', error);
    return [];
  }
};

// Delete a conversation
export const deleteChat = async (partnerId) => {
  try {
    const chats = await getChats();
    const filtered = chats.filter(chat => chat.partnerId !== partnerId);
    await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(filtered));
    await AsyncStorage.removeItem(`${MESSAGES_KEY_PREFIX}${partnerId}`);
  } catch (error) {
    console.error('Failed to delete chat:', error);
  }
};

export default {
  getChats,
  saveChat,
  getMessages,
  saveMessages,
  addMessage,
  deleteChat,
};
