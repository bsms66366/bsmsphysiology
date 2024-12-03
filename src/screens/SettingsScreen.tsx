import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFontStyle } from '../../context/FontStyleContext';

const SettingsScreen = () => {
  const { fontStyle, setFontStyle, availableFontStyles } = useFontStyle();

  // Create an array of font style options for the picker
  const fontStyleOptions = Object.entries(availableFontStyles)
    .filter(([key]) => key !== 'default')
    .map(([key, value]) => ({ label: key, value }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Font Style</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={fontStyle}
            onValueChange={(itemValue) => setFontStyle(itemValue)}
            style={styles.picker}
          >
            {fontStyleOptions.map((option) => (
              <Picker.Item 
                key={option.value} 
                label={option.label.replace(/([A-Z])/g, ' $1').trim()} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SettingsScreen;
