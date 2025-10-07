

import * as SecureStore from 'expo-secure-store';

 const KEY = 'auth_access_token';

/**
 * Save token.
 */
export async function setAuthToken(token) {
  if (!token) throw new Error('Missing token');
  await SecureStore.setItemAsync(KEY, token);
}

/**
 * Get token (null if none).
 */
export async function getAuthToken() {
  return SecureStore.getItemAsync(KEY);
}

/**
 * Remove token.
 */
export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(KEY);
}

/**
 * Optional: quick existence check.
 */
export async function hasAuthToken() {
  return !!(await getAuthToken());
}



export default {
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  hasAuthToken,
};