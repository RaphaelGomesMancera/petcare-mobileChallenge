import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useVacinasPorPet, useAplicarVacina } from '@/hooks/useVacinas';
import { colors } from '@/theme/colors';

export default function VacinasScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const idNumerico = Number(petId);

  const { data: vacinas, isLoading } = useVacinasPorPet(idNumerico);
  const aplicarVacina = useAplicarVacina();

  const [nome, setNome] = useState('');
  const [dataAplicacao, setDataAplicacao] = useState(''); // formato: 2026-09-12

  async function aplicar() {
    if (!nome || !dataAplicacao) {
      Alert.alert('Atenção', 'Preencha o nome da vacina e a data de aplicação');
      return;
    }
    await aplicarVacina.mutateAsync({ petId: idNumerico, nome, dataAplicacao });
    setNome('');
    setDataAplicacao('');
    Alert.alert('Vacina registrada!', 'A próxima dose foi calculada automaticamente.');
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tituloCard}>Registrar aplicação</Text>
        <TextInput style={styles.input} placeholder="Nome da vacina (ex: V10)" value={nome} onChangeText={setNome} />
        <TextInput
          style={styles.input}
          placeholder="Data de aplicação (ex: 2026-09-12)"
          value={dataAplicacao}
          onChangeText={setDataAplicacao}
        />
        <TouchableOpacity style={styles.botao} onPress={aplicar} disabled={aplicarVacina.isPending}>
          <Text style={styles.botaoTexto}>
            {aplicarVacina.isPending ? 'Registrando...' : 'Registrar vacina'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Carteira de vacinação</Text>
        {isLoading && <Text>Carregando...</Text>}
        {(vacinas ?? []).map((vacina) => (
          <View key={vacina.id} style={styles.item}>
            <Text style={styles.itemTitulo}>
              {vacina.nome} {vacina.pendente ? '⚠️' : ''}
            </Text>
            <Text style={styles.textoSecundario}>
              Aplicada em {new Date(vacina.dataAplicacao).toLocaleDateString('pt-BR')}
              {vacina.dataProximaDose &&
                ` • Próxima dose: ${new Date(vacina.dataProximaDose).toLocaleDateString('pt-BR')}`}
            </Text>
          </View>
        ))}
        {vacinas?.length === 0 && <Text style={styles.textoSecundario}>Nenhuma vacina registrada.</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo, padding: 16 },
  card: { backgroundColor: colors.branco, borderRadius: 12, padding: 16, marginBottom: 16 },
  tituloCard: { fontSize: 16, fontWeight: 'bold', color: colors.azul, marginBottom: 10 },
  input: {
    backgroundColor: colors.fundo,
    borderWidth: 1,
    borderColor: colors.borda,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  botao: { backgroundColor: colors.verde, borderRadius: 10, padding: 14, alignItems: 'center' },
  botaoTexto: { color: colors.branco, fontWeight: 'bold' },
  item: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borda },
  itemTitulo: { fontWeight: 'bold' },
  textoSecundario: { color: colors.textoSecundario },
});
