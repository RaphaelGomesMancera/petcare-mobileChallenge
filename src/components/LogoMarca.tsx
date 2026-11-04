import { Image, StyleSheet, Text, View } from 'react-native';

interface LogoMarcaProps {
  tamanho?: number;
  titulo?: string;
  corTitulo?: string;
}

/** Marca do PetCareIA+: a logo circular ao lado do nome. */
export function LogoMarca({ tamanho = 36, titulo = 'PetCareIA+', corTitulo = '#ffffff' }: LogoMarcaProps) {
  return (
    <View style={styles.linha}>
      <Image source={require('../../assets/logo.png')} style={{ width: tamanho, height: tamanho, borderRadius: tamanho / 2 }} />
      {titulo ? <Text style={[styles.titulo, { color: corTitulo, fontSize: tamanho > 64 ? 28 : 17 }]}>{titulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titulo: { fontWeight: '800' },
});
