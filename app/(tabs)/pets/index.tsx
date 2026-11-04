import { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { useTheme } from '@/context/ThemeContext';
import { usePets } from '@/hooks/usePets';
import { Palette } from '@/theme/colors';
import { Pet } from '@/types';

export default function PetsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { data: pets, isLoading, isRefetching, refetch } = usePets();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color={colors.azul} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.lista}
        data={pets ?? []}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListEmptyComponent={<Text style={styles.vazio}>Você ainda não cadastrou nenhum pet.</Text>}
        renderItem={({ item }: { item: Pet }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/(tabs)/pets/${item.id}`)}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhe}>
              {item.raca}
              {item.peso ? ` • ${item.peso}kg` : ''}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Botao titulo="+ Cadastrar pet" style={styles.botaoNovo} onPress={() => router.push('/(tabs)/pets/novo')} />
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.fundo },
    centro: { justifyContent: 'center', alignItems: 'center' },
    lista: { padding: 16, gap: 10 },
    card: { backgroundColor: colors.card, borderRadius: 12, padding: 16 },
    nome: { fontSize: 16, fontWeight: 'bold', color: colors.azul },
    detalhe: { color: colors.textoSecundario, marginTop: 4 },
    vazio: { textAlign: 'center', color: colors.textoSecundario, marginTop: 40 },
    botaoNovo: { margin: 16 },
  });
