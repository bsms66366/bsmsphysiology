import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { FontSizeProvider } from '../context/FontSizeContext';
import { FontStyleProvider } from '../context/FontStyleContext';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <FontSizeProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <FontStyleProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#00679A',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {/* Tabs Layout */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </FontStyleProvider>
      </ThemeProvider>
    </FontSizeProvider>
  );
}
