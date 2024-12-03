import * as Font from 'expo-font';
import React from 'react';

export const loadFonts = async () => {
  return Font.loadAsync({
    // Roboto Fonts
    'Roboto-Regular': require('../../assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../../assets/fonts/Roboto/Roboto-Medium.ttf'),
    'Roboto-Bold': require('../../assets/fonts/Roboto/Roboto-Bold.ttf'),
    'Roboto-Light': require('../../assets/fonts/Roboto/Roboto-Light.ttf'),

    // Inter Fonts
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'Inter-Light': require('../../assets/fonts/Inter-Light.ttf'),
  });
};

export const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadAppFonts();
  }, []);

  return fontsLoaded;
};
