import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { colors } from '@/theme/colors';
import { Pet } from '@/types';

export default function PetsScreen() {
  const { data: pets, isLoading, isRefetching, refetch } = usePets();

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.lista}
        data={pets ?? []}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.vazio}>Você ainda não cadastrou nenhum pet.</Text> : null
        }
        renderItem={({ item }: { item: Pet }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(tabs)/pets/${item.id}`)}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhe}>{item.raca}{item.peso ? ` • ${item.peso}kg` : ''}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.botaoNovo} onPress={() => router.push('/(tabs)/pets/novo')}>
        <Text style={styles.botaoNovoTexto}>+ Cadastrar pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo },
  lista: { padding: 16, gap: 10 },
  card: { backgroundColor: colors.branco, borderRadius: 12, padding: 16 },
  nome: { fontSize: 16, fontWeight: 'bold', color: colors.azul },
  detalhe: { color: colors.textoSecundario, marginTop: 4 },
  vazio: { textAlign: 'center', color: colors.textoSecundario, marginTop: 40 },
  botaoNovo: {
    backgroundColor: colors.verde,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoNovoTexto: { color: colors.branco, fontWeight: 'bold' },
});
