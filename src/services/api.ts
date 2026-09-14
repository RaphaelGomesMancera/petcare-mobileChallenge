import axios from 'axios';
import { Platform } from 'react-native';
import { storage } from './storage';

/**
 * URL da API conforme o ambiente:
 * - Web / iOS simulator → localhost
 * - Emulador Android → 10.0.2.2 (alias do host)
 * - Celular físico → troque para o IP da sua máquina na Wi-Fi
 */
function resolveApiBaseUrl(): string {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  return 'http://localhost:8080/api';
}

export const API_BASE_URL = resolveApiBaseUrl();

export const TOKEN_KEY = 'petcare_token';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Todas as chamadas autenticadas passam pelo token salvo (SecureStore no celular, localStorage na web)
api.interceptors.request.use(async (config) => {
  const token = await storage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
