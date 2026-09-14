import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/services/storage';
import { authService, LoginPayload, RegistroPayload } from '@/services/authService';
import { TOKEN_KEY } from '@/services/api';
import { Usuario } from '@/types';

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
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, tenta restaurar a sessão salva (persistência exigida pela sprint)
  useEffect(() => {
    async function restaurarSessao() {
      const usuarioSalvo = await storage.getItem(USUARIO_KEY);
      const token = await storage.getItem(TOKEN_KEY);

      if (usuarioSalvo && token) {
        setUsuario(JSON.parse(usuarioSalvo));
      }
      setCarregando(false);
    }
    restaurarSessao();
  }, []);

  async function persistirSessao(resposta: { token: string; nome: string; email: string; perfil: Usuario['perfil'] }) {
    const dadosUsuario: Usuario = { nome: resposta.nome, email: resposta.email, perfil: resposta.perfil };
    await storage.setItem(TOKEN_KEY, resposta.token);
    await storage.setItem(USUARIO_KEY, JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  async function login(payload: LoginPayload) {
    const resposta = await authService.login(payload);
    await persistirSessao(resposta);
  }

  async function registrar(payload: RegistroPayload) {
    const resposta = await authService.registrar(payload);
    await persistirSessao(resposta);
  }

  async function logout() {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USUARIO_KEY);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, registrar, logout }}>
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