import React from "react";
import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFontSize } from '../../context/FontSizeContext';

// Import SVG Icons
import Icon1 from '../../assets/images/icon1.svg';
import Icon2 from '../../assets/images/icon2.svg';
import Icon3 from '../../assets/images/icon3.svg';
import Icon4 from '../../assets/images/icon4.svg';
import Icon5 from '../../assets/images/icon5.svg';
import Icon6 from '../../assets/images/icon6.svg';
import Icon7 from '../../assets/images/icon7.svg';
import Icon8 from '../../assets/images/icon8.svg';
import Icon9 from '../../assets/images/icon9.svg';
import Icon10 from '../../assets/images/icon10.svg';

const App = () => {
  const { fontSize } = useFontSize();

  const iconsWithLabels = [
    { Icon: Icon1, label: 'Core Concepts', id: '44' },
    { Icon: Icon2, label: 'Cells Environment', id: '45' },
    { Icon: Icon3, label: 'Nervous System', id: '46' },
    { Icon: Icon4, label: 'Endocrine Regulation', id: '48' },
    { Icon: Icon5, label: 'Musculoskeletal System', id: '54' },
    { Icon: Icon6, label: 'Heart and Circulation', id: '49' },
    { Icon: Icon7, label: 'Kidney and Urinary System', id: '50' },
    { Icon: Icon8, label: 'Lungs and Gas Exchange', id: '51' },
    { Icon: Icon9, label: 'Gastrointestinal System', id: '52' },
    { Icon: Icon10, label: 'Reproductive System', id: '53' },
  ];

  const handleCategoryPress = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    router.push({
      pathname: '/screens/QuizQuestions',
      params: { category: categoryId }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/quiz-results')}
        >
          <Text style={[styles.backButtonText, { fontSize }]}>← Back to Results</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: fontSize + 4 }]}>Topics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {iconsWithLabels.map((item, index) => (
          <Pressable
            key={index}
            style={styles.iconContainer}
            onPress={() => handleCategoryPress(item.id)}
          >
            <item.Icon width={80} height={80} />
            <Text style={[styles.label, { fontSize }]}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#7F1C3E',
  },
  header: {
    backgroundColor: '#00679A',
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  backButton: {
    paddingVertical: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  iconContainer: {
    width: '45%',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#7F1C3E',
    marginBottom: 10,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default App;
