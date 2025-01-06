import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFontSize } from '../../context/FontSizeContext';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function QuizResults() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { fontSize } = useFontSize();
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  const score = parseInt(params.score as string) || 0;
  const total = parseInt(params.total as string) || 0;
  const percentage = parseInt(params.percentage as string) || 0;
  const categoryId = params.categoryId;

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setError('No category ID provided');
        return;
      }

      try {
        const response = await axios.get(`https://placements.bsms.ac.uk/api/categories/${categoryId}`);
        if (response.data) {
          setCategory(response.data);
        } else {
          setError('Category not found');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to load category');
      }
    };

    fetchCategory();
  }, [categoryId]);

  const getFeedback = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding! Excellent understanding!';
    if (percentage >= 80) return 'Great job! Very good knowledge!';
    if (percentage >= 70) return 'Good work! Keep it up!';
    if (percentage >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You\'ll get better!';
  };

  const handleTryAgain = () => {
    router.push(`/quiz/questions?category_id=${categoryId}`);
  };

  const handleBackToCategories = () => {
    router.push('/quiz');
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </Pressable>

      <Text style={[styles.title, { fontSize: fontSize + 4 }]}>Quiz Results</Text>
      
      <Text style={[styles.categoryName, { fontSize: fontSize + 2 }]}>
        {category?.name || 'Quiz Complete'}
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

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F1C3E',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
