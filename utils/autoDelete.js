import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTO_DELETE_KEY = '@auto_delete_setting';

export const AUTO_DELETE_OPTIONS = {
  NEVER: 'never',
  AFTER_READING: 'after_reading',
  HOURS_24: '24_hours',
  DAYS_7: '7_days',
  DAYS_30: '30_days',
};

export const AUTO_DELETE_DURATIONS = {
  [AUTO_DELETE_OPTIONS.NEVER]: null,
  [AUTO_DELETE_OPTIONS.AFTER_READING]: 0, // Handled separately
  [AUTO_DELETE_OPTIONS.HOURS_24]: 24 * 60 * 60 * 1000, // 24 hours in ms
  [AUTO_DELETE_OPTIONS.DAYS_7]: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  [AUTO_DELETE_OPTIONS.DAYS_30]: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
};

// Get current auto-delete setting
export const getAutoDeleteSetting = async () => {
  try {
    const setting = await AsyncStorage.getItem(AUTO_DELETE_KEY);
    return setting || AUTO_DELETE_OPTIONS.NEVER;
  } catch (error) {
    console.error('Failed to load auto-delete setting:', error);
    return AUTO_DELETE_OPTIONS.NEVER;
  }
};

// Save auto-delete setting
export const setAutoDeleteSetting = async (setting) => {
  try {
    await AsyncStorage.setItem(AUTO_DELETE_KEY, setting);
    return true;
  } catch (error) {
    console.error('Failed to save auto-delete setting:', error);
    return false;
  }
};

// Add expiry timestamp to message
export const addMessageExpiry = (message, setting) => {
  const duration = AUTO_DELETE_DURATIONS[setting];
  
  if (duration === null) {
    // Never expire
    return { ...message, expiresAt: null };
  } else if (setting === AUTO_DELETE_OPTIONS.AFTER_READING) {
    // Mark for deletion after reading
    return { ...message, expiresAt: 'after_reading', isRead: false };
  } else {
    // Set expiry timestamp
    return { ...message, expiresAt: Date.now() + duration };
  }
};

// Filter out expired messages
export const filterExpiredMessages = (messages) => {
  const now = Date.now();
  return messages.filter(msg => {
    if (!msg.expiresAt || msg.expiresAt === null) {
      return true; // Keep messages with no expiry
    }
    if (msg.expiresAt === 'after_reading') {
      return !msg.isRead; // Keep unread messages
    }
    return msg.expiresAt > now; // Keep messages that haven't expired
  });
};

// Mark message as read
export const markMessageAsRead = (message) => {
  return { ...message, isRead: true };
};

// Clean expired messages from storage
export const cleanExpiredMessages = async (partnerId, messages) => {
  const filtered = filterExpiredMessages(messages);
  return filtered;
};

export default {
  AUTO_DELETE_OPTIONS,
  AUTO_DELETE_DURATIONS,
  getAutoDeleteSetting,
  setAutoDeleteSetting,
  addMessageExpiry,
  filterExpiredMessages,
  markMessageAsRead,
  cleanExpiredMessages,
};
