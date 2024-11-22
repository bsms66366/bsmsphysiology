import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ScrollView, Text, Button, Alert  } from 'react-native';

// Import SVG Icons
import Icon1 from '@/assets/images/icon1.svg';
import Icon2 from '@/assets/images/icon2.svg';
import Icon3 from '@/assets/images/icon3.svg';
import Icon4 from '@/assets/images/icon4.svg';
import Icon5 from '@/assets/images/icon5.svg';
import Icon6 from '@/assets/images/icon6.svg';
import Icon7 from '@/assets/images/icon7.svg';
import Icon8 from '@/assets/images/icon8.svg';
import Icon9 from '@/assets/images/icon9.svg';
import Icon10 from '@/assets/images/icon10.svg';

const App = () => {
  // Array of imported icons
  //const icons = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8, Icon9, Icon10];
  const iconsWithLabels = [
    { Icon: Icon1, label: 'Core concepts' },
    { Icon: Icon2, label: 'Cells Environment' },
    { Icon: Icon3, label: 'Nervous System' },
    { Icon: Icon4, label: 'Endocrine Regulation' },
    { Icon: Icon5, label: 'Musculoskeletal System' },
    { Icon: Icon6, label: 'Heart and Circulation' },
    { Icon: Icon7, label: 'Kidney,Urinary System' },
    { Icon: Icon8, label: 'Lungs and Gas exchange' },
    { Icon: Icon9, label: 'Gastrointestinal System' },
    { Icon: Icon10, label: 'Reproductive System' },
  ];
  const handleButtonPress = (label: string) => {
    Alert.alert(`Button Pressed`, `You clicked on ${label}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {iconsWithLabels.map(({ Icon, label }, index) => (
        <View key={index} style={styles.iconContainer}>
          <Icon width={120} height={120} />
          <Text style={styles.label}>{label}</Text>
          <Button
            title="Click Me"
            onPress={() => handleButtonPress(label)}
            color="#1E90FF"
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#7F1C3E',
  },
  iconContainer: {
    width: '45%',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#7F1C3E',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});

export default App;
