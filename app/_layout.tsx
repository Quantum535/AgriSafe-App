import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Theme } from '@/constants/Colors';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// AgriSafe runs as a single, intentional dark experience.
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Theme.accent,
    background: Theme.bg,
    card: Theme.bgElevated,
    text: Theme.text,
    border: Theme.border,
    notification: Theme.accent,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={AppTheme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Theme.bg },
          headerStyle: { backgroundColor: Theme.bgElevated },
          headerTintColor: Theme.text,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Node Details' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
