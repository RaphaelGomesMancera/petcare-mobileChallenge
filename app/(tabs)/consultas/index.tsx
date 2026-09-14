import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useConsultas, useAgendarConsulta, useCancelarConsulta } from '@/hooks/useConsultas';
import { usePets } from '@/hooks/usePets';
import { colors } from '@/theme/colors';
import { Consulta } from '@/types';

export default function ConsultasScreen() {
  const { data: consultas, isLoading } = useConsultas();
  const { data: pets } = usePets();
  const agendarConsulta = useAgendarConsulta();
  const cancelarConsulta = useCancelarConsulta();

  const [petSelecionadoId, setPetSelecionadoId] = useState<number | null>(null);
  const [dataHora, setDataHora] = useState(''); // formato: 2026-09-20T14:30:00
  const [motivo, setMotivo] = useState('');

  async function agendar() {
    if (!petSelecionadoId || !dataHora || !motivo) {
      Alert.alert('Atenção', 'Selecione o pet e preencha data/hora e motivo');
      return;
    }
    try {
      await agendarConsulta.mutateAsync({
        petId: petSelecionadoId,
        dataHora,
        motivo,
        observacoes: null,
      });
      setDataHora('');
      setMotivo('');
      Alert.alert('Consulta agendada!', 'Você pode acompanhar na sua agenda.');
    } catch (e: any) {
      const mensagem = e?.response?.data?.mensagem ?? 'Não foi possível agendar. Verifique conflitos de horário.';
      Alert.alert('Erro ao agendar', mensagem);
    }
  }

  function cancelar(id: number) {
    Alert.alert('Cancelar consulta', 'Tem certeza?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim, cancelar', style: 'destructive', onPress: () => cancelarConsulta.mutate(id) },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tituloCard}>Agendar consulta</Text>

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

        <TouchableOpacity style={styles.botao} onPress={agendar} disabled={agendarConsulta.isPending}>
          <Text style={styles.botaoTexto}>
            {agendarConsulta.isPending ? 'Agendando...' : 'Agendar consulta'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Minhas consultas</Text>
        {isLoading && <Text>Carregando...</Text>}
        {(consultas ?? []).map((consulta: Consulta) => (
          <View key={consulta.id} style={styles.itemConsulta}>
            <Text style={styles.itemTitulo}>{consulta.petNome} — {consulta.status}</Text>
            <Text style={styles.textoSecundario}>
              {new Date(consulta.dataHora).toLocaleString('pt-BR')} • {consulta.motivo}
            </Text>
            {consulta.status === 'AGENDADA' && (
              <TouchableOpacity onPress={() => cancelar(consulta.id)}>
                <Text style={styles.linkCancelar}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {consultas?.length === 0 && <Text style={styles.textoSecundario}>Nenhuma consulta ainda.</Text>}
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
  itemConsulta: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borda },
  itemTitulo: { fontWeight: 'bold' },
  textoSecundario: { color: colors.textoSecundario },
  linkCancelar: { color: colors.erro, marginTop: 4 },
});
