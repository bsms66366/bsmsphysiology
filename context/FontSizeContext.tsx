import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FontSizeContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(16); // Default font size

  // Load saved font size when app starts
  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      if (savedFontSize) {
        setFontSize(Number(savedFontSize));
      }
    } catch (error) {
      console.error('Error loading font size:', error);
    }
  };

  const saveFontSize = async (size: number) => {
    try {
      await AsyncStorage.setItem('fontSize', size.toString());
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24); // Max font size is 24
    setFontSize(newSize);
    saveFontSize(newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12); // Min font size is 12
    setFontSize(newSize);
    saveFontSize(newSize);
  };

  const resetFontSize = () => {
    setFontSize(16);
    saveFontSize(16);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

function useFontSize(): FontSizeContextType {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}

export { FontSizeProvider, useFontSize };
export default FontSizeProvider;
