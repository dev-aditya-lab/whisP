import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'user_object_id';


export async function setUserId(id) {
  if (!id) throw new Error('Missing user id');
  await AsyncStorage.setItem(KEY, id);
}

/**
 * Get stored user _id (string or null).
 */
export async function getUserId() {
  return AsyncStorage.getItem(KEY);
}

/**
 * Remove stored user _id.
 */
export async function clearUserId() {
  await AsyncStorage.removeItem(KEY);
}



export default {
  setUserId,
  getUserId,
  clearUserId
};

