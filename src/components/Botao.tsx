import { useMemo } from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';

type Variante = 'primario' | 'secundario' | 'perigo';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Botão padrão do app (substitui os estilos de botão que estavam repetidos em cada tela). */
export function Botao({ titulo, onPress, variante = 'primario', carregando = false, desabilitado = false, style }: BotaoProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const secundario = variante === 'secundario';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={[styles.base, styles[variante], (carregando || desabilitado) && styles.desabilitado, style]}
      onPress={onPress}
      disabled={carregando || desabilitado}
    >
      {carregando ? (
        <ActivityIndicator color={secundario ? colors.azul : colors.onPrimary} />
      ) : (
        <Text style={secundario ? styles.textoSecundario : styles.texto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    base: { borderRadius: 999, padding: 14, alignItems: 'center' },
    primario: { backgroundColor: colors.verde },
    secundario: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.azul },
    perigo: { backgroundColor: colors.erro },
    desabilitado: { opacity: 0.6 },
    texto: { color: colors.onPrimary, fontWeight: 'bold' },
    textoSecundario: { color: colors.azul, fontWeight: 'bold' },
  });
