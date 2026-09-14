import axios from 'axios';
import { storage } from './storage';

/**
 * IMPORTANTE: ajuste essa URL para o endereço da sua API Spring Boot.
 * - Emulador Android: use 10.0.2.2 no lugar de localhost
 * - Simulador iOS: localhost funciona normalmente
 * - Dispositivo físico: use o IP da sua máquina na rede local (ex: 192.168.0.10)
 */
export const API_BASE_URL = 'http://10.0.2.2:8080/api';

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