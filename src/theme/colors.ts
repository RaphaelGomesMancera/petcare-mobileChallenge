/** Paleta do app nos dois modos. Telas nunca usam cor fixa: pegam a paleta de `useTheme()`. */
export interface Palette {
  azul: string;          // destaque (títulos, links, botões secundários)
  verde: string;         // ação principal / sucesso
  header: string;        // fundo dos cabeçalhos (igual nos dois modos)
  fundo: string;         // fundo das telas
  card: string;          // fundo de cards e campos
  texto: string;
  textoSecundario: string;
  onPrimary: string;     // texto/ícone sobre botões coloridos
  erro: string;
  borda: string;
}

export const lightColors: Palette = {
  azul: '#1a5fb4',
  verde: '#1f9d63',
  header: '#1a5fb4',
  fundo: '#f5f7fa',
  card: '#ffffff',
  texto: '#1c1c1c',
  textoSecundario: '#666666',
  onPrimary: '#ffffff',
  erro: '#d32f2f',
  borda: '#e0e0e0',
};

export const darkColors: Palette = {
  azul: '#62a0ea',
  verde: '#2ec27e',
  header: '#1a5fb4',
  fundo: '#121517',
  card: '#1e2327',
  texto: '#eceff1',
  textoSecundario: '#a0a8ae',
  onPrimary: '#ffffff',
  erro: '#ff7b72',
  borda: '#333a40',
};
