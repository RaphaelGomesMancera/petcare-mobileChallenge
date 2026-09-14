import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function VacinasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.azul },
        headerTintColor: colors.branco,
      }}
    >
      <Stack.Screen name="[petId]" options={{ title: 'Carteira de Vacinação' }} />
    </Stack>
  );
}
