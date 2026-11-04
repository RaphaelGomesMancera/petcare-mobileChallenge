import { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';

interface CartaoProps {
  titulo?: string;
  children: ReactNode;
}

/** Bloco de conteúdo com fundo de card e título opcional. */
export function Cartao({ titulo, children }: CartaoProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.cartao}>
      {titulo && <Text style={styles.titulo}>{titulo}</Text>}
      {children}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    cartao: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 },
    titulo: { fontSize: 16, fontWeight: 'bold', color: colors.azul, marginBottom: 10 },
  });
