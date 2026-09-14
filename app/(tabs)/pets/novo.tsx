import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useCriarPet } from '@/hooks/usePets';
import { colors } from '@/theme/colors';

export default function NovoPetScreen() {
  const criarPet = useCriarPet();
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    if (!nome || !raca) {
      setErro('Nome e raça são obrigatórios');
      return;
    }
    setErro(null);
    try {
      await criarPet.mutateAsync({
        nome,
        raca,
        dataNascimento: null,
        peso: peso ? Number(peso.replace(',', '.')) : null,
        fotoUrl: null,
      });
      router.back();
    } catch {
      setErro('Não foi possível cadastrar o pet. Tente novamente.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Novo pet</Text>

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <TextInput style={styles.input} placeholder="Nome do pet" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Raça" value={raca} onChangeText={setRaca} />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
      />

      <TouchableOpacity style={styles.botao} onPress={salvar} disabled={criarPet.isPending}>
        {criarPet.isPending ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <Text style={styles.botaoTexto}>Salvar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: colors.fundo, flexGrow: 1 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: colors.azul, marginBottom: 20 },
  input: {
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.borda,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  botao: { backgroundColor: colors.verde, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  botaoTexto: { color: colors.branco, fontWeight: 'bold' },
  erro: { color: colors.erro, marginBottom: 12 },
});
