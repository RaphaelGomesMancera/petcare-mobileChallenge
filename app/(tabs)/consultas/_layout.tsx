import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ConsultasLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.onPrimary,
        contentStyle: { backgroundColor: colors.fundo },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Consultas' }} />
    </Stack>
  );
}
