import { api } from './api';
import { AuthResponse } from '@/types';

export interface LoginPayload {
  email: string;
  senha: string;
}

/** O perfil não é enviado: a API cadastra sempre como TUTOR. */
export interface RegistroPayload {
  nome: string;
  email: string;
  senha: string;
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
