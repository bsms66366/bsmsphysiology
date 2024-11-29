import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import Icon from "@expo/vector-icons/Ionicons";
import CategoryQuizCount from '../../app/screens/CategoryQuizCount';

interface QuizResult {
  category: string;
  score: number;
  totalQuestions: number;
  date: string;
}

// Category ID to name mapping
const categoryMap: { [key: string]: string } = {
  '44': 'Core Concepts',
  '45': 'Cells Environment',
  '46': 'Nervous System',
  '48': 'Endocrine Regulation',
  '54': 'Musculoskeletal System',
  '49': 'Heart and Circulation',
  '50': 'Kidney and Urinary System',
  '51': 'Lungs and Gas Exchange',
  '52': 'Gastrointestinal System',
  '53': 'Reproductive System'
};

// Function to get category name from ID
const getCategoryName = (categoryId: string): string => {
  return categoryMap[categoryId] || categoryId;
};

const QuizResultsScreen = () => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    loadQuizResults();
  }, []);

  const loadQuizResults = async () => {
    try {
      const resultsString = await AsyncStorage.getItem('quizResults');
      if (resultsString) {
        const results = JSON.parse(resultsString);
        setQuizResults(results);
      }
    } catch (error) {
      console.error('Error loading quiz results:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Quiz Results</Text>
      </View>
      
      <ScrollView style={styles.resultsContainer}>
        <View style={styles.contentContainer}>
          <Link href="/quiz/general" style={styles.startButton}>
            <Text style={styles.startButtonText}>Start New Quiz</Text>
          </Link>
        </View>

        <CategoryQuizCount />

        <Text style={styles.resultsTitle}>Your Quiz Results</Text>
        {quizResults.length === 0 ? (
          <Text style={styles.noResults}>No quiz results yet. Take a quiz to see your results here!</Text>
        ) : (
          quizResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={styles.category}>{getCategoryName(result.category)}</Text>
              <Text style={styles.score}>
                Score: {result.score} / {result.totalQuestions}
              </Text>
              <Text style={styles.date}>
                {new Date(result.date).toLocaleDateString()}
              </Text>
              <Text style={styles.percentage}>
                {Math.round((result.score / result.totalQuestions) * 100)}% Correct
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F1C3E',
  },
  headerContainer: {
    backgroundColor: '#00679A',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#00679A',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  noResults: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00679A',
    marginBottom: 5,
  },
  score: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  percentage: {
    fontSize: 16,
    color: '#00679A',
    fontWeight: 'bold',
  },
});

export default QuizResultsScreen;
