import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { TextoErro } from '@/components/TextoErro';
import { useTheme } from '@/context/ThemeContext';
import { useCriarPet } from '@/hooks/usePets';
import { Palette } from '@/theme/colors';
import { mensagemDeErro } from '@/utils/erros';

export default function NovoPetScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const criarPet = useCriarPet();
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    if (!nome.trim() || !raca.trim()) {
      setErro('Nome e raça são obrigatórios');
      return;
    }
    setErro(null);
    try {
      await criarPet.mutateAsync({
        nome: nome.trim(),
        raca: raca.trim(),
        dataNascimento: null,
        peso: peso ? Number(peso.replace(',', '.')) : null,
        fotoUrl: null,
      });
      router.back();
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível cadastrar o pet. Tente novamente.'));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Novo pet</Text>

      <TextoErro mensagem={erro} />

      <CampoTexto placeholder="Nome do pet" value={nome} onChangeText={setNome} />
      <CampoTexto placeholder="Raça" value={raca} onChangeText={setRaca} />
      <CampoTexto placeholder="Peso (kg)" keyboardType="numeric" value={peso} onChangeText={setPeso} />

      <Botao titulo="Salvar" onPress={salvar} carregando={criarPet.isPending} />
    </ScrollView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { padding: 24, backgroundColor: colors.fundo, flexGrow: 1 },
    titulo: { fontSize: 20, fontWeight: 'bold', color: colors.azul, marginBottom: 20 },
  });
