import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define available font styles
export const FONT_STYLES = {
  default: 'System',
  roboto: 'Roboto-Regular',
  robotoMedium: 'Roboto-Medium',
  robotoBold: 'Roboto-Bold',
  robotoLight: 'Roboto-Light',
  inter: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interBold: 'Inter-Bold',
  interLight: 'Inter-Light'
} as const;

type FontStyleType = typeof FONT_STYLES[keyof typeof FONT_STYLES];

interface FontStyleContextType {
  fontStyle: FontStyleType;
  setFontStyle: (style: FontStyleType) => void;
  availableFontStyles: typeof FONT_STYLES;
}

const FontStyleContext = createContext<FontStyleContextType | undefined>(undefined);

export const FontStyleProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontStyle, setFontStyleState] = useState<FontStyleType>(FONT_STYLES.default);

  // Load saved font style when app starts
  useEffect(() => {
    loadFontStyle();
  }, []);

  const loadFontStyle = async () => {
    try {
      const savedFontStyle = await AsyncStorage.getItem('fontStyle');
      if (savedFontStyle && savedFontStyle in FONT_STYLES) {
        setFontStyleState(savedFontStyle as FontStyleType);
      }
    } catch (error) {
      console.error('Error loading font style:', error);
    }
  };

  const setFontStyle = async (style: FontStyleType) => {
    try {
      await AsyncStorage.setItem('fontStyle', style);
      setFontStyleState(style);
    } catch (error) {
      console.error('Error saving font style:', error);
    }
  };

  return (
    <FontStyleContext.Provider 
      value={{ 
        fontStyle, 
        setFontStyle, 
        availableFontStyles: FONT_STYLES 
      }}
    >
      {children}
    </FontStyleContext.Provider>
  );
};

export const useFontStyle = () => {
  const context = useContext(FontStyleContext);
  if (context === undefined) {
    throw new Error('useFontStyle must be used within a FontStyleProvider');
  }
  return context;
};
