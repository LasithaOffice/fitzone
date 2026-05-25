import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller'
import * as SystemUI from 'expo-system-ui';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.setOptions({
  duration: 0,
  fade: false,
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  console.log("ccc ", colorScheme)

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF');
  }, [colorScheme]);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <KeyboardProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, }} initialRouteName='index' >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </KeyboardProvider>
    </ThemeProvider>
  );
}
