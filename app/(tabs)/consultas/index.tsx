import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Botao } from '@/components/Botao';
import { Cartao } from '@/components/Cartao';
import { CampoTexto } from '@/components/CampoTexto';
import { Chip } from '@/components/Chip';
import {
  useConsultas,
  useAgendarConsulta,
  useAtualizarConsulta,
  useMarcarConsultaRealizada,
  useCancelarConsulta,
  useHorariosDisponiveis,
} from '@/hooks/useConsultas';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';
import { Consulta } from '@/types';
import { formatarDataHoraBR, proximosDias } from '@/utils/datas';
import { mensagemDeErro } from '@/utils/erros';

const DIAS_NA_AGENDA = 14;

export default function ConsultasScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { usuario } = useAuth();
  const ehClinica = usuario?.perfil === 'CLINICA';

  const { data: consultas, isLoading } = useConsultas();
  const { data: pets } = usePets();
  const agendarConsulta = useAgendarConsulta();
  const atualizarConsulta = useAtualizarConsulta();
  const marcarRealizada = useMarcarConsultaRealizada();
  const cancelarConsulta = useCancelarConsulta();

  const [petSelecionadoId, setPetSelecionadoId] = useState<number | null>(null);
  const [dia, setDia] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const [editando, setEditando] = useState<Consulta | null>(null);

  const dias = useMemo(() => proximosDias(DIAS_NA_AGENDA), []);
  const { data: horariosLivres, isFetching: carregandoHorarios } = useHorariosDisponiveis(dia);

  // Ao editar, o horário atual da própria consulta aparece como opção (a API o considera ocupado)
  const horarios = useMemo(() => {
    const lista = new Set(horariosLivres ?? []);
    if (editando && dia && editando.dataHora.slice(0, 10) === dia) {
      lista.add(editando.dataHora.slice(11, 16));
    }
    return Array.from(lista).sort();
  }, [horariosLivres, editando, dia]);

  const consultasOrdenadas = useMemo(
    () => [...(consultas ?? [])].sort((a, b) => b.dataHora.localeCompare(a.dataHora)),
    [consultas],
  );

  function limparFormulario() {
    setDia(null);
    setHora(null);
    setMotivo('');
    setPetSelecionadoId(null);
    setEditando(null);
  }

  function iniciarEdicao(consulta: Consulta) {
    setEditando(consulta);
    setPetSelecionadoId(consulta.petId);
    setDia(consulta.dataHora.slice(0, 10));
    setHora(consulta.dataHora.slice(11, 16));
    setMotivo(consulta.motivo);
  }

  function escolherDia(iso: string) {
    setDia(iso);
    setHora(null);
  }

  async function salvar() {
    if (!petSelecionadoId || !dia || !hora || !motivo.trim()) {
      Alert.alert('Atenção', 'Escolha o pet, o dia, o horário e informe o motivo');
      return;
    }

    const payload = {
      petId: petSelecionadoId,
      dataHora: `${dia}T${hora}:00`,
      motivo: motivo.trim(),
      observacoes: null,
    };

    try {
      if (editando) {
        await atualizarConsulta.mutateAsync({ id: editando.id, payload });
        Alert.alert('Consulta atualizada!', 'Os dados foram salvos.');
      } else {
        await agendarConsulta.mutateAsync(payload);
        Alert.alert('Consulta agendada!', 'Você receberá um lembrete 1 hora antes.');
      }
      limparFormulario();
    } catch (e) {
      Alert.alert(
        editando ? 'Erro ao atualizar' : 'Erro ao agendar',
        mensagemDeErro(e, 'Não foi possível salvar. Tente novamente.'),
      );
    }
  }

  function marcarComoRealizada(id: number) {
    Alert.alert('Marcar como realizada', 'Confirma que a consulta já aconteceu?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => marcarRealizada.mutate(id) },
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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Cartao titulo={editando ? 'Editar consulta' : 'Agendar consulta'}>

        <Text style={styles.rotulo}>Pet</Text>
        {(pets ?? []).length === 0 && (
          <Text style={styles.textoSecundario}>Cadastre um pet na aba “Meus Pets” para agendar.</Text>
        )}
        <View style={styles.chips}>
          {(pets ?? []).map((pet) => (
            <Chip
              key={pet.id}
              rotulo={pet.nome}
              selecionado={petSelecionadoId === pet.id}
              onPress={() => setPetSelecionadoId(pet.id)}
            />
          ))}
        </View>

        <Text style={styles.rotulo}>Dia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.diasLista}>
          {dias.map((d) => (
            <Chip
              key={d.iso}
              rotulo={d.diaSemana}
              subrotulo={d.dia}
              selecionado={dia === d.iso}
              onPress={() => escolherDia(d.iso)}
            />
          ))}
        </ScrollView>

        {dia && (
          <>
            <Text style={styles.rotulo}>Horário (atendimento das 08:00 às 18:00)</Text>
            {carregandoHorarios && <ActivityIndicator color={colors.azul} style={{ marginVertical: 8 }} />}
            {!carregandoHorarios && horarios.length === 0 && (
              <Text style={styles.textoSecundario}>Sem horários livres neste dia. Escolha outro dia.</Text>
            )}
            <View style={styles.chips}>
              {horarios.map((h) => (
                <Chip key={h} rotulo={h} selecionado={hora === h} onPress={() => setHora(h)} />
              ))}
            </View>
          </>
        )}

        <CampoTexto placeholder="Motivo da consulta" value={motivo} onChangeText={setMotivo} />

        <Botao
          titulo={editando ? 'Salvar alterações' : 'Agendar consulta'}
          onPress={salvar}
          carregando={salvando}
        />

        {editando && (
          <Botao titulo="Cancelar edição" variante="secundario" style={styles.espaco} onPress={limparFormulario} />
        )}
      </Cartao>

      <Cartao titulo={ehClinica ? 'Agenda da clínica' : 'Minhas consultas'}>
        {isLoading && <ActivityIndicator color={colors.azul} style={{ marginVertical: 12 }} />}
        {consultasOrdenadas.map((consulta) => (
          <View key={consulta.id} style={styles.itemConsulta}>
            <Text style={styles.itemTitulo}>
              {consulta.petNome} — {consulta.status}
            </Text>
            <Text style={styles.textoSecundario}>
              {formatarDataHoraBR(consulta.dataHora)} • {consulta.motivo}
            </Text>
            {consulta.status === 'AGENDADA' && (
              <View style={styles.acoes}>
                <TouchableOpacity onPress={() => iniciarEdicao(consulta)}>
                  <Text style={styles.linkEditar}>Editar</Text>
                </TouchableOpacity>
                {ehClinica && (
                  <TouchableOpacity onPress={() => marcarComoRealizada(consulta.id)}>
                    <Text style={styles.linkRealizar}>Realizar</Text>
                  </TouchableOpacity>
                )}
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
      </Cartao>
    </ScrollView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.fundo, padding: 16 },
    rotulo: { fontSize: 13, color: colors.textoSecundario, marginBottom: 6, marginTop: 4 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    diasLista: { gap: 8, paddingBottom: 12 },
    espaco: { marginTop: 10 },
    itemConsulta: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borda },
    itemTitulo: { fontWeight: 'bold', color: colors.texto },
    textoSecundario: { color: colors.textoSecundario },
    acoes: { flexDirection: 'row', gap: 16, marginTop: 8 },
    linkEditar: { color: colors.azul, fontWeight: '600' },
    linkRealizar: { color: colors.verde, fontWeight: '600' },
    linkCancelar: { color: colors.erro, fontWeight: '600' },
  });
