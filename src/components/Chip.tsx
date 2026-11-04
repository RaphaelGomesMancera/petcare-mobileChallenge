import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';

interface ChipProps {
  rotulo: string;
  subrotulo?: string;
  selecionado: boolean;
  onPress: () => void;
}

/** Opção selecionável (pet, dia, horário, tipo de vacina). */
export function Chip({ rotulo, subrotulo, selecionado, onPress }: ChipProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const estiloTexto = selecionado ? styles.textoSelecionado : styles.texto;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: selecionado }}
      style={[styles.chip, selecionado && styles.selecionado]}
      onPress={onPress}
    >
      <Text style={estiloTexto}>{rotulo}</Text>
      {subrotulo && <Text style={estiloTexto}>{subrotulo}</Text>}
    </TouchableOpacity>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    chip: {
      borderWidth: 1,
      borderColor: colors.azul,
      borderRadius: 18,
      paddingVertical: 6,
      paddingHorizontal: 14,
      alignItems: 'center',
    },
    selecionado: { backgroundColor: colors.azul },
    texto: { color: colors.azul },
    textoSelecionado: { color: colors.onPrimary, fontWeight: 'bold' },
  });
