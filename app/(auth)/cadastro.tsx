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

export default function CadastroScreen() {
  const { registrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleCadastro() {
    if (!nome || !email || senha.length < 6) {
      setErro('Preencha nome, e-mail e uma senha com 6+ caracteres');
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      // Cadastro pelo Mobile é sempre como TUTOR (perfil CLINICA é criado pela equipe da clínica)
      await registrar({ nome, email, senha, perfil: 'TUTOR' });
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 409) {
        setErro('Este e-mail já está cadastrado. Use Entrar ou outro e-mail.');
      } else if (status === 400) {
        setErro(e?.response?.data?.mensagem ?? 'Dados inválidos. Verifique e-mail e senha (mín. 6).');
      } else if (!e?.response) {
        setErro('Não conectou na API. Confirme se ela está em http://localhost:8080');
      } else {
        setErro('Não foi possível criar a conta. Tente novamente.');
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
      <Text style={styles.titulo}>Criar conta de tutor</Text>

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
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
        placeholder="Senha (mín. 6 caracteres)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleCadastro} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <Text style={styles.botaoTexto}>Criar conta</Text>
        )}
      </TouchableOpacity>

      <Link href="/(auth)/login" style={styles.link}>
        Já tem conta? Entrar
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.fundo },
  titulo: { fontSize: 22, fontWeight: 'bold', color: colors.azul, textAlign: 'center', marginBottom: 24 },
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
