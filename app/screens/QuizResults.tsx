import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFontSize } from '../../context/FontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "@expo/vector-icons/Ionicons";

interface Category {
  id: number;
  name: string;
}

interface QuizHistory {
  categoryId: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export default function QuizResults() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { fontSize } = useFontSize();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  const score = parseInt(params.score as string) || 0;
  const total = parseInt(params.total as string) || 0;
  const percentage = parseInt(params.percentage as string) || 0;
  const categoryId = params.categoryId;

  useEffect(() => {
    const saveQuizHistory = async () => {
      try {
        // Load existing history
        const historyString = await AsyncStorage.getItem('quizHistory');
        let history = historyString ? JSON.parse(historyString) : [];

        // Add new quiz result
        const newQuiz = {
          categoryId: categoryId,
          score,
          total,
          percentage,
          date: new Date().toISOString(),
        };

        // Add to beginning of array
        history = [newQuiz, ...history];

        // Save updated history
        await AsyncStorage.setItem('quizHistory', JSON.stringify(history));

        // Update state
        setQuizHistory(history);
        setTotalQuizzes(history.length);
        const avg = history.reduce((sum, quiz) => sum + quiz.percentage, 0) / history.length;
        setAverageScore(Math.round(avg));
      } catch (error) {
        console.error('Error saving quiz history:', error);
      }
    };

    saveQuizHistory();
  }, []);

  const getCategoryName = (categoryId: string | number): string => {
    const categories = {
      '44': 'Core Concepts',
      '45': 'Cells Environment',
      '46': 'Nervous System',
      '48': 'Endocrine Regulation',
      '49': 'Heart and Circulation',
      '50': 'Kidney and Urinary System',
      '51': 'Lungs and Gas Exchange',
      '52': 'Gastrointestinal System',
      '53': 'Reproductive System',
      '54': 'Musculoskeletal System',
      '55': 'Flash Card'
    };
    return categories[categoryId.toString()] || 'Unknown Category';
  };

  const getFeedback = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding! Excellent understanding!';
    if (percentage >= 80) return 'Great job! Very good knowledge!';
    if (percentage >= 70) return 'Good work! Keep it up!';
    if (percentage >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You\'ll get better!';
  };

  const handleTryAgain = () => {
    // Navigate to quiz index first, then to the quiz
    router.replace('/quiz');
    setTimeout(() => {
      router.push(`/quiz/take?category_id=${categoryId}`);
    }, 100);
  };

  const handleBackToCategories = () => {
    router.replace('/quiz');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { fontSize: fontSize + 4 }]}>Quiz Results</Text>
        
        <Text style={[styles.categoryName, { fontSize: fontSize + 2 }]}>
          {getCategoryName(categoryId)}
        </Text>

        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { fontSize: fontSize + 8 }]}>
            {percentage}%
          </Text>
          <Text style={[styles.scoreDetails, { fontSize }]}>
            {score} correct out of {total} questions
          </Text>
        </View>

        <Text style={[styles.feedback, { fontSize }]}>
          {getFeedback(percentage)}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="book-outline" size={24} color="#fff" />
            <Text style={[styles.statLabel, { fontSize }]}>Total Quizzes</Text>
            <Text style={[styles.statValue, { fontSize }]}>{totalQuizzes}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Icon name="stats-chart-outline" size={24} color="#fff" />
            <Text style={[styles.statLabel, { fontSize }]}>Average Score</Text>
            <Text style={[styles.statValue, { fontSize }]}>{averageScore}%</Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={[styles.historyTitle, { fontSize }]}>Recent Quizzes</Text>
          {quizHistory.slice(0, 5).map((quiz, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={[styles.historyCategory, { fontSize: fontSize - 2 }]}>
                {getCategoryName(quiz.categoryId)}
              </Text>
              <Text style={[styles.historyScore, { fontSize: fontSize - 2 }]}>
                {quiz.percentage}%
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleTryAgain}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>

          <Pressable 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleBackToCategories}
          >
            <Text style={styles.buttonText}>Back to Categories</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryName: {
    color: '#fff',
    opacity: 0.9,
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreDetails: {
    color: '#fff',
    opacity: 0.9,
  },
  feedback: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
    padding: 10,
  },
  statLabel: {
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  historyContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  historyTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyCategory: {
    color: '#fff',
    opacity: 0.8,
    flex: 1,
  },
  historyScore: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#00679A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
