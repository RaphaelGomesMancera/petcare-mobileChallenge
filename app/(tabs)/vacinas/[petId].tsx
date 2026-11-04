import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Botao } from '@/components/Botao';
import { Cartao } from '@/components/Cartao';
import { CampoTexto } from '@/components/CampoTexto';
import { Chip } from '@/components/Chip';
import { useLocalSearchParams } from 'expo-router';
import { useVacinasPorPet, useAplicarVacina, useExcluirVacina } from '@/hooks/useVacinas';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';
import { formatarDataBR, hojeISO } from '@/utils/datas';
import { mensagemDeErro } from '@/utils/erros';

const SUGESTOES_VACINAS = ['V10', 'V8', 'Antirrábica', 'Giárdia', 'Gripe canina'];
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export default function VacinasScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const idNumerico = Number(petId);

  const { data: vacinas, isLoading } = useVacinasPorPet(idNumerico);
  const aplicarVacina = useAplicarVacina();
  const excluirVacina = useExcluirVacina();

  const [nome, setNome] = useState('');
  const [dataAplicacao, setDataAplicacao] = useState(hojeISO());

  async function aplicar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome da vacina');
      return;
    }
    if (!FORMATO_DATA.test(dataAplicacao)) {
      Alert.alert('Atenção', 'Use a data no formato AAAA-MM-DD (ex.: 2026-10-26)');
      return;
    }
    try {
      await aplicarVacina.mutateAsync({ petId: idNumerico, nome: nome.trim(), dataAplicacao });
      setNome('');
      setDataAplicacao(hojeISO());
      Alert.alert('Vacina registrada!', 'A próxima dose foi calculada automaticamente.');
    } catch (e) {
      Alert.alert('Erro', mensagemDeErro(e, 'Não foi possível registrar a vacina.'));
    }
  }

  function confirmarExclusao(id: number, nomeVacina: string) {
    Alert.alert('Excluir vacina', `Remover o registro de ${nomeVacina}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => excluirVacina.mutate({ id, petId: idNumerico }),
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Cartao titulo="Registrar aplicação">

        <View style={styles.chips}>
          {SUGESTOES_VACINAS.map((sugestao) => (
            <Chip key={sugestao} rotulo={sugestao} selecionado={nome === sugestao} onPress={() => setNome(sugestao)} />
          ))}
        </View>

        <CampoTexto placeholder="Nome da vacina (ou escolha acima)" value={nome} onChangeText={setNome} />
        <CampoTexto
          placeholder="Data de aplicação (AAAA-MM-DD)"
          value={dataAplicacao}
          onChangeText={setDataAplicacao}
          keyboardType="numbers-and-punctuation"
        />
        <Botao titulo="Registrar vacina" onPress={aplicar} carregando={aplicarVacina.isPending} />
      </Cartao>

      <Cartao titulo="Carteira de vacinação">
        {isLoading && <ActivityIndicator color={colors.azul} style={{ marginVertical: 12 }} />}
        {(vacinas ?? []).map((vacina) => (
          <View key={vacina.id} style={styles.item}>
            <Text style={styles.itemTitulo}>
              {vacina.nome} {vacina.pendente ? '⚠️' : ''}
            </Text>
            <Text style={styles.textoSecundario}>
              Aplicada em {formatarDataBR(vacina.dataAplicacao)}
              {vacina.dataProximaDose && ` • Próxima dose: ${formatarDataBR(vacina.dataProximaDose)}`}
            </Text>
            <TouchableOpacity onPress={() => confirmarExclusao(vacina.id, vacina.nome)}>
              <Text style={styles.linkExcluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ))}
        {!isLoading && vacinas?.length === 0 && (
          <Text style={styles.textoSecundario}>Nenhuma vacina registrada.</Text>
        )}
      </Cartao>
    </ScrollView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.fundo, padding: 16 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    item: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borda },
    itemTitulo: { fontWeight: 'bold', color: colors.texto },
    textoSecundario: { color: colors.textoSecundario },
    linkExcluir: { color: colors.erro, marginTop: 6, fontWeight: '600' },
  });
