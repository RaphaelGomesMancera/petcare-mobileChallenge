import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { usePet, useAtualizarPet, useExcluirPet } from '@/hooks/usePets';
import { colors } from '@/theme/colors';

export default function DetalhePetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = Number(id);

  const { data: pet, isLoading } = usePet(petId);
  const atualizarPet = useAtualizarPet();
  const excluirPet = useExcluirPet();

  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');

  useEffect(() => {
    if (pet) {
      setNome(pet.nome);
      setRaca(pet.raca);
      setPeso(pet.peso ? String(pet.peso) : '');
    }
  }, [pet]);

  async function salvar() {
    try {
      await atualizarPet.mutateAsync({
        id: petId,
        payload: {
          nome,
          raca,
          dataNascimento: pet?.dataNascimento ?? null,
          peso: peso ? Number(peso.replace(',', '.')) : null,
          fotoUrl: pet?.fotoUrl ?? null,
        },
      });
      Alert.alert('Pronto', 'Dados do pet atualizados!');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o pet.');
    }
  }

  function confirmarExclusao() {
    Alert.alert('Excluir pet', `Tem certeza que deseja excluir ${pet?.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirPet.mutateAsync(petId);
          router.back();
        },
      },
    ]);
  }

  if (isLoading || !pet) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color={colors.azul} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{pet.nome}</Text>

      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
      <TextInput style={styles.input} value={raca} onChangeText={setRaca} placeholder="Raça" />
      <TextInput
        style={styles.input}
        value={peso}
        onChangeText={setPeso}
        placeholder="Peso (kg)"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.botao} onPress={salvar} disabled={atualizarPet.isPending}>
        {atualizarPet.isPending ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <Text style={styles.botaoTexto}>Salvar alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => router.push(`/(tabs)/vacinas/${petId}`)}
      >
        <Text style={styles.botaoSecundarioTexto}>💉 Ver carteira de vacinação</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
        <Text style={styles.botaoTexto}>Excluir pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: colors.fundo, flexGrow: 1 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: colors.azul, marginBottom: 20 },
  input: {
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.borda,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  botao: { backgroundColor: colors.verde, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  botaoSecundario: { backgroundColor: colors.branco, borderWidth: 1, borderColor: colors.azul, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 12 },
  botaoExcluir: { backgroundColor: colors.erro, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: colors.branco, fontWeight: 'bold' },
  botaoSecundarioTexto: { color: colors.azul, fontWeight: 'bold' },
});
