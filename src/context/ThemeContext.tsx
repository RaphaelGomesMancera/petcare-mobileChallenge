import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/services/storage';
import { darkColors, lightColors, Palette } from '@/theme/colors';

export type PreferenciaTema = 'sistema' | 'claro' | 'escuro';

const TEMA_KEY = 'petcare_tema';

interface ThemeContextData {
  colors: Palette;
  escuro: boolean;
  preferencia: PreferenciaTema;
  definirPreferencia: (preferencia: PreferenciaTema) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

/** Tema claro/escuro: segue o sistema por padrão, e o usuário pode fixar um dos modos na tela de Perfil. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const esquemaDoSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('sistema');

  useEffect(() => {
    storage.getItem(TEMA_KEY).then((salvo) => {
      if (salvo === 'claro' || salvo === 'escuro' || salvo === 'sistema') {
        setPreferencia(salvo);
      }
    });
  }, []);

  const escuro = preferencia === 'sistema' ? esquemaDoSistema === 'dark' : preferencia === 'escuro';

  const valor = useMemo<ThemeContextData>(
    () => ({
      colors: escuro ? darkColors : lightColors,
      escuro,
      preferencia,
      definirPreferencia: async (nova) => {
        setPreferencia(nova);
        await storage.setItem(TEMA_KEY, nova);
      },
    }),
    [escuro, preferencia],
  );

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um ThemeProvider');
  }
  return context;
}
