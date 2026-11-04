import { useMemo } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { Chip } from '@/components/Chip';
import { useAuth } from '@/context/AuthContext';
import { PreferenciaTema, useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';

const OPCOES_TEMA: { valor: PreferenciaTema; rotulo: string }[] = [
  { valor: 'sistema', rotulo: 'Sistema' },
  { valor: 'claro', rotulo: 'Claro' },
  { valor: 'escuro', rotulo: 'Escuro' },
];

export default function PerfilScreen() {
  const { colors, preferencia, definirPreferencia } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { usuario, logout } = useAuth();

  async function sair() {
    await logout();
    router.replace('/(auth)/login');
  }

  function handleLogout() {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente sair da sua conta?')) {
        void sair();
      }
      return;
    }
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => void sair() },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{usuario?.nome?.charAt(0).toUpperCase()}</Text>
      </View>

      <Text style={styles.nome}>{usuario?.nome}</Text>
      <Text style={styles.email}>{usuario?.email}</Text>
      <Text style={styles.perfil}>{usuario?.perfil === 'CLINICA' ? 'Equipe da clínica' : 'Tutor'}</Text>

      <View style={styles.temaBox}>
        <Text style={styles.temaTitulo}>Aparência</Text>
        <View style={styles.temaOpcoes}>
          {OPCOES_TEMA.map((opcao) => (
            <Chip
              key={opcao.valor}
              rotulo={opcao.rotulo}
              selecionado={preferencia === opcao.valor}
              onPress={() => definirPreferencia(opcao.valor)}
            />
          ))}
        </View>
      </View>

      <Botao titulo="Sair da conta" variante="perigo" style={styles.botaoSair} onPress={handleLogout} />
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.fundo, alignItems: 'center', padding: 24, paddingTop: 60 },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.azul,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarTexto: { color: colors.onPrimary, fontSize: 36, fontWeight: 'bold' },
    nome: { fontSize: 20, fontWeight: 'bold', color: colors.texto },
    email: { color: colors.textoSecundario, marginTop: 4 },
    perfil: { color: colors.verde, marginTop: 8, fontWeight: 'bold' },
    temaBox: { width: '100%', marginTop: 32 },
    temaTitulo: { color: colors.texto, fontWeight: 'bold', marginBottom: 8 },
    temaOpcoes: { flexDirection: 'row', gap: 8 },
    botaoSair: { marginTop: 32, paddingHorizontal: 32 },
  });
