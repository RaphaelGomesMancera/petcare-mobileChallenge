import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  const { usuario, carregando } = useAuth();

  // Proteção de rota: sem usuário autenticado, não acessa nenhuma tela interna
  if (!carregando && !usuario) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.verde,
        tabBarInactiveTintColor: colors.textoSecundario,
        headerStyle: { backgroundColor: colors.azul },
        headerTintColor: colors.branco,
      }}
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
  );
}
