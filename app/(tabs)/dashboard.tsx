import { useMemo } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Cartao } from '@/components/Cartao';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useDashboard } from '@/hooks/useDashboard';
import { Palette } from '@/theme/colors';
import { formatarDataHoraBR } from '@/utils/datas';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { usuario } = useAuth();
  const { data, isLoading, isRefetching, refetch } = useDashboard();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <Text style={styles.saudacao}>Olá, {usuario?.nome?.split(' ')[0]} 👋</Text>

      {isLoading && <ActivityIndicator size="large" color={colors.azul} style={{ marginVertical: 24 }} />}

      {data && (
        <>
          <View style={styles.gridStats}>
            <Indicador valor={data.quantidadePets} rotulo="🐾 Pets" />
            <Indicador valor={data.proximasConsultas} rotulo="📅 Próx. consultas" />
            <Indicador valor={data.vacinasPendentes} rotulo="💉 Vacinas pendentes" />
          </View>

          <Cartao titulo="Próxima agenda">
            {data.agendaProximosSete.length === 0 && (
              <Text style={styles.textoSecundario}>Nenhuma consulta agendada.</Text>
            )}
            {data.agendaProximosSete.map((consulta) => (
              <View key={consulta.id} style={styles.itemAgenda}>
                <Text style={styles.itemAgendaTitulo}>{consulta.petNome}</Text>
                <Text style={styles.textoSecundario}>
                  {formatarDataHoraBR(consulta.dataHora)} — {consulta.motivo}
                </Text>
              </View>
            ))}
          </Cartao>
        </>
      )}
    </ScrollView>
  );
}

function Indicador({ valor, rotulo }: { valor: number; rotulo: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.stat}>
      <Text style={styles.statValor}>{valor}</Text>
      <Text style={styles.statRotulo}>{rotulo}</Text>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.fundo, padding: 16 },
    saudacao: { fontSize: 22, fontWeight: 'bold', color: colors.azul, marginBottom: 16 },
    gridStats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    stat: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, alignItems: 'center' },
    statValor: { fontSize: 24, fontWeight: 'bold', color: colors.verde },
    statRotulo: { fontSize: 12, color: colors.textoSecundario, textAlign: 'center', marginTop: 4 },
    itemAgenda: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borda },
    itemAgendaTitulo: { fontWeight: 'bold', color: colors.texto },
    textoSecundario: { color: colors.textoSecundario },
  });
