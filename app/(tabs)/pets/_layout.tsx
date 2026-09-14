import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function PetsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.azul },
        headerTintColor: colors.branco,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Meus Pets' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo Pet' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalhes do Pet' }} />
    </Stack>
  );
}
