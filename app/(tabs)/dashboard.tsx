import { ScrollView, View, Text, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';

export default function DashboardScreen() {
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
            <Cartao valor={data.quantidadePets} rotulo="🐾 Pets" />
            <Cartao valor={data.proximasConsultas} rotulo="📅 Próx. consultas" />
            <Cartao valor={data.vacinasPendentes} rotulo="💉 Vacinas pendentes" />
          </View>

          <View style={styles.card}>
            <Text style={styles.tituloCard}>Próxima agenda</Text>
            {data.agendaProximosSete.length === 0 && (
              <Text style={styles.textoSecundario}>Nenhuma consulta agendada.</Text>
            )}
            {data.agendaProximosSete.map((consulta) => (
              <View key={consulta.id} style={styles.itemAgenda}>
                <Text style={styles.itemAgendaTitulo}>{consulta.petNome}</Text>
                <Text style={styles.textoSecundario}>
                  {new Date(consulta.dataHora).toLocaleString('pt-BR')} — {consulta.motivo}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function Cartao({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValor}>{valor}</Text>
      <Text style={styles.statRotulo}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo, padding: 16 },
  saudacao: { fontSize: 22, fontWeight: 'bold', color: colors.azul, marginBottom: 16 },
  gridStats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  stat: {
    flex: 1,
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statValor: { fontSize: 24, fontWeight: 'bold', color: colors.verde },
  statRotulo: { fontSize: 12, color: colors.textoSecundario, textAlign: 'center', marginTop: 4 },
  card: { backgroundColor: colors.branco, borderRadius: 12, padding: 16 },
  tituloCard: { fontSize: 16, fontWeight: 'bold', color: colors.azul, marginBottom: 8 },
  itemAgenda: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borda },
  itemAgendaTitulo: { fontWeight: 'bold' },
  textoSecundario: { color: colors.textoSecundario },
});
