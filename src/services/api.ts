import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { AuthResponse } from '@/types';
import { lerRefreshToken, lerToken, limparTokens, salvarTokens } from './session';

/**
 * URL da API:
 * - Produção/APK: defina EXPO_PUBLIC_API_URL (ex.: https://petcare-api.onrender.com/api), veja .env.example
 * - Desenvolvimento: web/iOS simulator → localhost; emulador Android → 10.0.2.2 (alias do host)
 *   (celular físico: use o IP da sua máquina na variável EXPO_PUBLIC_API_URL)
 */
function resolveApiBaseUrl(): string {
  const urlConfigurada = process.env.EXPO_PUBLIC_API_URL;
  if (urlConfigurada) {
    return urlConfigurada.replace(/\/+$/, '');
  }
  return Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';
}

export const API_BASE_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// ---------- sessão expirada ----------
// O AuthContext registra aqui o que fazer quando não dá mais para renovar a sessão (volta para o login).
let aoExpirarSessao: (() => void) | null = null;

export function registrarAoExpirarSessao(callback: (() => void) | null) {
  aoExpirarSessao = callback;
}

// ---------- requisição: anexa o access token ----------
api.interceptors.request.use(async (config) => {
  const token = await lerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- resposta: 401 → tenta renovar a sessão uma vez e repete a chamada ----------
type RequisicaoRepetivel = InternalAxiosRequestConfig & { _jaTentouRenovar?: boolean };

let renovacaoEmAndamento: Promise<string | null> | null = null;

/** Troca o refresh token por um novo par de tokens. Várias chamadas simultâneas compartilham a mesma renovação. */
async function renovarSessao(): Promise<string | null> {
  if (!renovacaoEmAndamento) {
    renovacaoEmAndamento = (async () => {
      try {
        const refreshToken = await lerRefreshToken();
        if (!refreshToken) {
          return null;
        }
        // axios "puro" (sem os interceptors) para não entrar em loop se o refresh também falhar
        const { data } = await axios.post<AuthResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { timeout: 15000 },
        );
        await salvarTokens(data.token, data.refreshToken);
        return data.token;
      } catch {
        return null;
      } finally {
        renovacaoEmAndamento = null;
      }
    })();
  }
  return renovacaoEmAndamento;
}

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro: AxiosError) => {
    const original = erro.config as RequisicaoRepetivel | undefined;
    const ehRotaDeAuth = original?.url?.startsWith('/auth/') ?? false;

    if (erro.response?.status !== 401 || !original || ehRotaDeAuth || original._jaTentouRenovar) {
      return Promise.reject(erro);
    }

    original._jaTentouRenovar = true;
    const novoToken = await renovarSessao();

    if (!novoToken) {
      await limparTokens();
      aoExpirarSessao?.();
      return Promise.reject(erro);
    }

    original.headers.Authorization = `Bearer ${novoToken}`;
    return api(original);
  },
);
