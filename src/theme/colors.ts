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
  azul: '#0b5cad',
  verde: '#12b981',
  header: '#083e78',
  fundo: '#eef6f4',
  card: '#ffffff',
  texto: '#102433',
  textoSecundario: '#5d7384',
  onPrimary: '#ffffff',
  erro: '#c62828',
  borda: '#d7e4ea',
};

export const darkColors: Palette = {
  azul: '#7eb6ff',
  verde: '#3ddc97',
  header: '#083e78',
  fundo: '#0d141b',
  card: '#162029',
  texto: '#e8f0f6',
  textoSecundario: '#9aafbd',
  onPrimary: '#ffffff',
  erro: '#ff8a80',
  borda: '#2a3a46',
};
