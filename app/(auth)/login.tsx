import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { TextoErro } from '@/components/TextoErro';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';
import { mensagemDeErro } from '@/utils/erros';

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
      await login({ email: email.trim(), senha });
      router.replace('/(tabs)/dashboard');
    } catch (e) {
      setErro(mensagemDeErro(e, 'E-mail ou senha inválidos'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.logo}>🐾 PetCareIA+</Text>
      <Text style={styles.subtitulo}>Cuidando do seu pet com carinho e tecnologia</Text>

      <TextoErro mensagem={erro} />

      <CampoTexto
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <CampoTexto placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

      <Botao titulo="Entrar" onPress={handleLogin} carregando={carregando} />

      <Link href="/(auth)/cadastro" style={styles.link}>
        Não tem conta? Cadastre-se
      </Link>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.fundo },
    logo: { fontSize: 28, fontWeight: 'bold', color: colors.azul, textAlign: 'center' },
    subtitulo: { textAlign: 'center', color: colors.textoSecundario, marginBottom: 32, marginTop: 4 },
    link: { textAlign: 'center', marginTop: 20, color: colors.azul },
  });
