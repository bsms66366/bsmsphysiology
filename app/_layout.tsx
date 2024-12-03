import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { FontSizeProvider } from '../context/FontSizeContext';
import { FontStyleProvider } from '../context/FontStyleContext';

import { useColorScheme } from '@/hooks/useColorScheme';

//import ProfileScreen from "@/screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FontSizeProvider>
        <FontStyleProvider>
          {/* Root Stack Navigator */}
          <Stack>
            {/* Tabs Layout */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Profile and Edit Profile Screens */}
            {/* <Stack.Screen name="screens/ProfileScreen" options={{ title: "Profile" }} /> */}
            <Stack.Screen name="/screens/EditProfileScreen" options={{ title: "Edit Profile", headerShown: false }} />

            {/* Quiz Screen */}
            <Stack.Screen name="quiz/[category]" options={{ title: 'Quiz' }} />

            {/* Default not-found screen  */}
            {/*<Stack.Screen name="+not-found" />*/}
          </Stack>
        </FontStyleProvider>
      </FontSizeProvider>
    </ThemeProvider>
  );
}
