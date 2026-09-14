import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';

export default function PerfilScreen() {
  const { usuario, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
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

      <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  avatarTexto: { color: colors.branco, fontSize: 36, fontWeight: 'bold' },
  nome: { fontSize: 20, fontWeight: 'bold', color: colors.texto },
  email: { color: colors.textoSecundario, marginTop: 4 },
  perfil: { color: colors.verde, marginTop: 8, fontWeight: 'bold' },
  botaoSair: {
    marginTop: 40,
    backgroundColor: colors.erro,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  botaoSairTexto: { color: colors.branco, fontWeight: 'bold' },
});
