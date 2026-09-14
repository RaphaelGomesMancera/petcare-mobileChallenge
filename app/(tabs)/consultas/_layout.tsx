import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function ConsultasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.azul },
        headerTintColor: colors.branco,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Consultas' }} />
    </Stack>
  );
}
