import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { registrarAoExpirarSessao } from '@/services/api';
import { authService, LoginPayload, RegistroPayload } from '@/services/authService';
import { cancelarTodosLembretes } from '@/services/notificationService';
import { lerRefreshToken, lerToken, limparTokens, salvarTokens } from '@/services/session';
import { storage } from '@/services/storage';
import { AuthResponse, Usuario } from '@/types';

const USUARIO_KEY = 'petcare_usuario';

interface AuthContextData {
  usuario: Usuario | null;
  carregando: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registrar: (payload: RegistroPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  /** Encerra a sessão local: apaga credenciais, dados em cache e lembretes agendados do usuário. */
  const encerrarSessao = useCallback(async () => {
    await limparTokens();
    await storage.removeItem(USUARIO_KEY);
    await cancelarTodosLembretes();
    queryClient.clear();
    setUsuario(null);
  }, [queryClient]);

  // Ao abrir o app, restaura a sessão salva (persistência)
  useEffect(() => {
    async function restaurarSessao() {
      const usuarioSalvo = await storage.getItem(USUARIO_KEY);
      const token = await lerToken();
      const refreshToken = await lerRefreshToken();

      if (usuarioSalvo && token && refreshToken) {
        setUsuario(JSON.parse(usuarioSalvo) as Usuario);
      }
      setCarregando(false);
    }
    restaurarSessao();
  }, []);

  // Quando a API não aceita mais o token nem consegue renová-lo, volta para o login
  useEffect(() => {
    registrarAoExpirarSessao(() => {
      encerrarSessao();
    });
    return () => registrarAoExpirarSessao(null);
  }, [encerrarSessao]);

  async function persistirSessao(resposta: AuthResponse) {
    const dadosUsuario: Usuario = { nome: resposta.nome, email: resposta.email, perfil: resposta.perfil };
    await salvarTokens(resposta.token, resposta.refreshToken);
    await storage.setItem(USUARIO_KEY, JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  async function login(payload: LoginPayload) {
    await persistirSessao(await authService.login(payload));
  }

  async function registrar(payload: RegistroPayload) {
    await persistirSessao(await authService.registrar(payload));
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, registrar, logout: encerrarSessao }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return context;
}
