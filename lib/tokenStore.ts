import * as SecureStore from 'expo-secure-store';

let _accessToken: string | null = null;
let _refreshToken: string | null = null;

export const setTokens = async (accessToken: string, refreshToken: string) => {
  _accessToken = accessToken;
  _refreshToken = refreshToken;
  try {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  } catch (e) {
    console.warn('SecureStore is not available or failed to save tokens. Falling back to in-memory storage.', e);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (_accessToken) return _accessToken;
  try {
    _accessToken = await SecureStore.getItemAsync('accessToken');
  } catch (e) {
    console.warn('SecureStore is not available or failed to get accessToken. Falling back to in-memory storage.', e);
  }
  return _accessToken;
};

export const getRefreshToken = async (): Promise<string | null> => {
  if (_refreshToken) return _refreshToken;
  try {
    _refreshToken = await SecureStore.getItemAsync('refreshToken');
  } catch (e) {
    console.warn('SecureStore is not available or failed to get refreshToken. Falling back to in-memory storage.', e);
  }
  return _refreshToken;
};

export const clearTokens = async () => {
  _accessToken = null;
  _refreshToken = null;
  try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (e) {
    console.warn('SecureStore is not available or failed to clear tokens.', e);
  }
};
