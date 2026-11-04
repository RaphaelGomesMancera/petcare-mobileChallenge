import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';

/** Mensagem de erro de formulário. */
export function TextoErro({ mensagem }: { mensagem: string | null }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!mensagem) {
    return null;
  }
  return (
    <Text accessibilityRole="alert" style={styles.erro}>
      {mensagem}
    </Text>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    erro: { color: colors.erro, textAlign: 'center', marginBottom: 12 },
  });
