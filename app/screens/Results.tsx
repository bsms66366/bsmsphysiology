import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuizResult {
  category: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export default function HomeScreen() {
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>
      {quizResults.length === 0 ? (
        <Text style={styles.noResults}>No quiz results yet. Take a quiz to see your results here!</Text>
      ) : (
        quizResults.map((result, index) => (
          <View key={index} style={styles.resultCard}>
            <Text style={styles.category}>{result.category}</Text>
            <Text style={styles.score}>
              Score: {result.score} / {result.totalQuestions}
            </Text>
            <Text style={styles.date}>
              {new Date(result.date).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  score: {
    fontSize: 16,
    color: '#7F1C3E',
    marginBottom: 4,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
});
