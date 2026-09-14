import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  useConsultas,
  useAgendarConsulta,
  useAtualizarConsulta,
  useMarcarConsultaRealizada,
  useCancelarConsulta,
} from '@/hooks/useConsultas';
import { usePets } from '@/hooks/usePets';
import { colors } from '@/theme/colors';
import { Consulta } from '@/types';

export default function ConsultasScreen() {
  const { data: consultas, isLoading } = useConsultas();
  const { data: pets } = usePets();
  const agendarConsulta = useAgendarConsulta();
  const atualizarConsulta = useAtualizarConsulta();
  const marcarRealizada = useMarcarConsultaRealizada();
  const cancelarConsulta = useCancelarConsulta();

  const [petSelecionadoId, setPetSelecionadoId] = useState<number | null>(null);
  const [dataHora, setDataHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  function limparFormulario() {
    setDataHora('');
    setMotivo('');
    setPetSelecionadoId(null);
    setEditandoId(null);
  }

  function iniciarEdicao(consulta: Consulta) {
    setEditandoId(consulta.id);
    setPetSelecionadoId(consulta.petId);
    setDataHora(consulta.dataHora.slice(0, 19));
    setMotivo(consulta.motivo);
  }

  async function salvar() {
    if (!petSelecionadoId || !dataHora || !motivo) {
      Alert.alert('Atenção', 'Selecione o pet e preencha data/hora e motivo');
      return;
    }

    const payload = {
      petId: petSelecionadoId,
      dataHora,
      motivo,
      observacoes: null,
    };

    try {
      if (editandoId) {
        await atualizarConsulta.mutateAsync({ id: editandoId, payload });
        Alert.alert('Consulta atualizada!', 'Os dados foram salvos na API.');
      } else {
        await agendarConsulta.mutateAsync(payload);
        Alert.alert('Consulta agendada!', 'Você pode acompanhar na sua agenda.');
      }
      limparFormulario();
    } catch (e: any) {
      const mensagem =
        e?.response?.data?.mensagem ??
        e?.response?.data?.message ??
        'Não foi possível salvar. Verifique conflitos de horário.';
      Alert.alert(editandoId ? 'Erro ao atualizar' : 'Erro ao agendar', mensagem);
    }
  }

  function marcarComoRealizada(id: number) {
    Alert.alert('Marcar como realizada', 'Confirma que a consulta já aconteceu?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: () => marcarRealizada.mutate(id),
      },
    ]);
  }

  function cancelar(id: number) {
    Alert.alert('Cancelar consulta', 'Tem certeza?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim, cancelar', style: 'destructive', onPress: () => cancelarConsulta.mutate(id) },
    ]);
  }

  const salvando = agendarConsulta.isPending || atualizarConsulta.isPending;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tituloCard}>{editandoId ? 'Editar consulta' : 'Agendar consulta'}</Text>

        <Text style={styles.rotulo}>Pet</Text>
        <View style={styles.chips}>
          {(pets ?? []).map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[styles.chip, petSelecionadoId === pet.id && styles.chipSelecionado]}
              onPress={() => setPetSelecionadoId(pet.id)}
            >
              <Text style={petSelecionadoId === pet.id ? styles.chipTextoSelecionado : styles.chipTexto}>
                {pet.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Data/hora (ex: 2026-09-20T14:30:00)"
          value={dataHora}
          onChangeText={setDataHora}
        />
        <TextInput style={styles.input} placeholder="Motivo da consulta" value={motivo} onChangeText={setMotivo} />

        <TouchableOpacity style={styles.botao} onPress={salvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color={colors.branco} />
          ) : (
            <Text style={styles.botaoTexto}>{editandoId ? 'Salvar alterações' : 'Agendar consulta'}</Text>
          )}
        </TouchableOpacity>

        {editandoId && (
          <TouchableOpacity style={styles.botaoSecundario} onPress={limparFormulario}>
            <Text style={styles.botaoSecundarioTexto}>Cancelar edição</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Minhas consultas</Text>
        {isLoading && <ActivityIndicator color={colors.azul} style={{ marginVertical: 12 }} />}
        {(consultas ?? []).map((consulta: Consulta) => (
          <View key={consulta.id} style={styles.itemConsulta}>
            <Text style={styles.itemTitulo}>
              {consulta.petNome} — {consulta.status}
            </Text>
            <Text style={styles.textoSecundario}>
              {new Date(consulta.dataHora).toLocaleString('pt-BR')} • {consulta.motivo}
            </Text>
            {consulta.status === 'AGENDADA' && (
              <View style={styles.acoes}>
                <TouchableOpacity onPress={() => iniciarEdicao(consulta)}>
                  <Text style={styles.linkEditar}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => marcarComoRealizada(consulta.id)}>
                  <Text style={styles.linkRealizar}>Realizar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cancelar(consulta.id)}>
                  <Text style={styles.linkCancelar}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        {!isLoading && consultas?.length === 0 && (
          <Text style={styles.textoSecundario}>Nenhuma consulta ainda.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo, padding: 16 },
  card: { backgroundColor: colors.branco, borderRadius: 12, padding: 16, marginBottom: 16 },
  tituloCard: { fontSize: 16, fontWeight: 'bold', color: colors.azul, marginBottom: 10 },
  rotulo: { fontSize: 13, color: colors.textoSecundario, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.azul,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipSelecionado: { backgroundColor: colors.azul },
  chipTexto: { color: colors.azul },
  chipTextoSelecionado: { color: colors.branco },
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
  botaoSecundario: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.azul,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  botaoSecundarioTexto: { color: colors.azul, fontWeight: 'bold' },
  itemConsulta: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borda },
  itemTitulo: { fontWeight: 'bold' },
  textoSecundario: { color: colors.textoSecundario },
  acoes: { flexDirection: 'row', gap: 16, marginTop: 8 },
  linkEditar: { color: colors.azul, fontWeight: '600' },
  linkRealizar: { color: colors.verde, fontWeight: '600' },
  linkCancelar: { color: colors.erro, fontWeight: '600' },
});
