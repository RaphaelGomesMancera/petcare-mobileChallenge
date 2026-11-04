import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { LogoMarca } from '@/components/LogoMarca';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useAbrirTelaPelaNotificacao, useLembretesAutomaticos } from '@/hooks/useLembretes';

/** Só existe com usuário logado: mantém os lembretes sincronizados e abre telas ao tocar nas notificações. */
function ServicosEmSegundoPlano() {
  useLembretesAutomaticos();
  useAbrirTelaPelaNotificacao();
  return null;
}

export default function TabsLayout() {
  const { usuario, carregando } = useAuth();
  const { colors } = useTheme();

  // Proteção de rota: sem usuário autenticado, não acessa nenhuma tela interna
  if (!carregando && !usuario) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      {usuario && <ServicosEmSegundoPlano />}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.verde,
          tabBarInactiveTintColor: colors.textoSecundario,
          tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.borda },
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.onPrimary,
          headerTitle: () => <LogoMarca />,
        }}
        sceneContainerStyle={{ backgroundColor: colors.fundo }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
          }}
        />
        {/* "pets" é uma pasta com 3 telas (index, novo, [id]) -> vira uma pilha aninhada nessa aba */}
        <Tabs.Screen
          name="pets"
          options={{
            title: 'Meus Pets',
            headerShown: false,
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🐾</Text>,
          }}
        />
        {/* "consultas" é uma pasta com a tela index -> mesma lógica */}
        <Tabs.Screen
          name="consultas"
          options={{
            title: 'Consultas',
            headerShown: false,
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅</Text>,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
          }}
        />
        {/* "vacinas" não aparece na barra, é acessada a partir do detalhe do pet */}
        <Tabs.Screen name="vacinas" options={{ href: null, headerShown: false }} />
      </Tabs>
    </>
  );
}
