import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function PetsLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.onPrimary,
        contentStyle: { backgroundColor: colors.fundo },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Meus Pets' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo Pet' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalhes do Pet' }} />
    </Stack>
  );
}
