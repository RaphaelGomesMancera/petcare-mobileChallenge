import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { useTheme } from '@/context/ThemeContext';
import { useAtualizarPet, useExcluirPet, usePet } from '@/hooks/usePets';
import { Palette } from '@/theme/colors';
import { mensagemDeErro } from '@/utils/erros';

export default function DetalhePetScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
    if (!nome.trim() || !raca.trim()) {
      Alert.alert('Atenção', 'Nome e raça são obrigatórios');
      return;
    }
    try {
      await atualizarPet.mutateAsync({
        id: petId,
        payload: {
          nome: nome.trim(),
          raca: raca.trim(),
          dataNascimento: pet?.dataNascimento ?? null,
          peso: peso ? Number(peso.replace(',', '.')) : null,
          fotoUrl: pet?.fotoUrl ?? null,
        },
      });
      Alert.alert('Pronto', 'Dados do pet atualizados!');
    } catch (e) {
      Alert.alert('Erro', mensagemDeErro(e, 'Não foi possível atualizar o pet.'));
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir pet',
      `Excluir ${pet?.nome}? As consultas e vacinas dele também serão removidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirPet.mutateAsync(petId);
              router.back();
            } catch (e) {
              Alert.alert('Erro', mensagemDeErro(e, 'Não foi possível excluir o pet.'));
            }
          },
        },
      ],
    );
  }

  if (isLoading || !pet) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color={colors.azul} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>{pet.nome}</Text>

      <CampoTexto value={nome} onChangeText={setNome} placeholder="Nome" />
      <CampoTexto value={raca} onChangeText={setRaca} placeholder="Raça" />
      <CampoTexto value={peso} onChangeText={setPeso} placeholder="Peso (kg)" keyboardType="numeric" />

      <Botao titulo="Salvar alterações" onPress={salvar} carregando={atualizarPet.isPending} />
      <Botao
        titulo="💉 Ver carteira de vacinação"
        variante="secundario"
        style={styles.espaco}
        onPress={() => router.push(`/(tabs)/vacinas/${petId}`)}
      />
      <Botao titulo="Excluir pet" variante="perigo" style={styles.espacoGrande} onPress={confirmarExclusao} />
    </ScrollView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { padding: 24, backgroundColor: colors.fundo, flexGrow: 1 },
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    titulo: { fontSize: 22, fontWeight: 'bold', color: colors.azul, marginBottom: 20 },
    espaco: { marginTop: 12 },
    espacoGrande: { marginTop: 24 },
  });
