import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = 'http://10.102.30.54:3001';
const USER_ID_KEY = '@user_id';

let socket = null;
let currentUserId = null;

// Generate random ID function
export const generateRandomId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 9);
};

// Get or create user ID
export const getUserId = async () => {
  if (currentUserId) return currentUserId;
  
  try {
    let storedId = await AsyncStorage.getItem(USER_ID_KEY);
    if (!storedId) {
      storedId = generateRandomId();
      await AsyncStorage.setItem(USER_ID_KEY, storedId);
    }
    currentUserId = storedId;
    return storedId;
  } catch (error) {
    console.error('Failed to load user ID:', error);
    const fallbackId = generateRandomId();
    currentUserId = fallbackId;
    return fallbackId;
  }
};

// Get socket instance
export const getSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL);
  }
  return socket;
};

// Initialize socket connection
export const initSocket = async () => {
  const userId = await getUserId();
  const socketInstance = getSocket();
  
  socketInstance.on('connect', () => {
    console.log('Socket connected');
    socketInstance.emit('join', userId);
  });
  
  return { socket: socketInstance, userId };
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  getUserId,
  getSocket,
  initSocket,
  disconnectSocket,
  generateRandomId,
};
