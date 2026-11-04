import { useMemo } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';

/** Campo de texto padrão, com as cores do tema claro/escuro. */
export function CampoTexto(props: TextInputProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return <TextInput placeholderTextColor={colors.textoSecundario} {...props} style={[styles.campo, props.style]} />;
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    campo: {
      color: colors.texto,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borda,
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
    },
  });
