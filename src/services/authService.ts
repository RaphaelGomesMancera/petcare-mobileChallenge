import { api } from './api';
import { AuthResponse, Perfil } from '@/types';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegistroPayload {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  registrar: async (payload: RegistroPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/registrar', payload);
    return data;
  },
};
