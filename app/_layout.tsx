import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30, // 30s
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="light" />
          {Platform.OS === 'web' ? (
            <View style={{ flex: 1, backgroundColor: '#d7e6e2', alignItems: 'center' }}>
              <View style={{ width: '100%', maxWidth: 430, flex: 1, backgroundColor: '#eef6f4' }}>
                <Slot />
              </View>
            </View>
          ) : (
            <Slot />
          )}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
