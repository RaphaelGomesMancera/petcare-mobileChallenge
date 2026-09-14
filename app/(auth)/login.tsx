import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !senha) {
      setErro('Preencha e-mail e senha');
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      await login({ email, senha });
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      if (!e?.response) {
        setErro('Não conectou na API. Confirme se ela está em http://localhost:8080');
      } else {
        setErro('E-mail ou senha inválidos');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>🐾 PetCareIA+</Text>
      <Text style={styles.subtitulo}>Cuidando do seu pet com carinho e tecnologia</Text>

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <Text style={styles.botaoTexto}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Link href="/(auth)/cadastro" style={styles.link}>
        Não tem conta? Cadastre-se
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.fundo },
  logo: { fontSize: 28, fontWeight: 'bold', color: colors.azul, textAlign: 'center' },
  subtitulo: { textAlign: 'center', color: colors.textoSecundario, marginBottom: 32, marginTop: 4 },
  input: {
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.borda,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: colors.verde,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: { color: colors.branco, fontWeight: 'bold', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, color: colors.azul },
  erro: { color: colors.erro, textAlign: 'center', marginBottom: 12 },
});
