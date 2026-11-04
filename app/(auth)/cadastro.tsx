import { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { TextoErro } from '@/components/TextoErro';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/theme/colors';
import { mensagemDeErro } from '@/utils/erros';

export default function CadastroScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { registrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || senha.length < 6) {
      setErro('Preencha nome, e-mail e uma senha com 6+ caracteres');
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      // A API cadastra sempre como TUTOR (conta de CLINICA é criada pela própria clínica)
      await registrar({ nome: nome.trim(), email: email.trim(), senha });
      router.replace('/(tabs)/dashboard');
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível criar a conta. Tente novamente.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.titulo}>Criar conta de tutor</Text>

      <TextoErro mensagem={erro} />

      <CampoTexto placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <CampoTexto
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <CampoTexto
        placeholder="Senha (mín. 6 caracteres)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Botao titulo="Criar conta" onPress={handleCadastro} carregando={carregando} />

      <Link href="/(auth)/login" style={styles.link}>
        Já tem conta? Entrar
      </Link>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.fundo },
    logo: { width: 84, height: 84, borderRadius: 22, alignSelf: 'center', marginBottom: 12 },
    titulo: { fontSize: 22, fontWeight: '800', color: colors.azul, textAlign: 'center', marginBottom: 24 },
    link: { textAlign: 'center', marginTop: 20, color: colors.azul },
  });
