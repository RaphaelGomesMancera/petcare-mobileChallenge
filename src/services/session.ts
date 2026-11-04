import { storage } from './storage';

export const TOKEN_KEY = 'petcare_token';
export const REFRESH_TOKEN_KEY = 'petcare_refresh_token';

/** Guarda o par de tokens recebido do login, cadastro ou renovação (SecureStore no celular). */
export async function salvarTokens(token: string, refreshToken: string): Promise<void> {
  await storage.setItem(TOKEN_KEY, token);
  await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function limparTokens(): Promise<void> {
  await storage.removeItem(TOKEN_KEY);
  await storage.removeItem(REFRESH_TOKEN_KEY);
}

export async function lerToken(): Promise<string | null> {
  return storage.getItem(TOKEN_KEY);
}

export async function lerRefreshToken(): Promise<string | null> {
  return storage.getItem(REFRESH_TOKEN_KEY);
}
