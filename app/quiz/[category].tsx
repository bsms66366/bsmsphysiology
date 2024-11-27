import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Category {
  id: number;
  name: string;
}

export default function QuizScreen() {
  const { category } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories
    setLoading(true);
    setError(null);
    axios
      .get<Category[]>("https://placements.bsms.ac.uk/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      });
  }, []);

  useEffect(() => {
    // Fetch questions
    setLoading(true);
    setError(null);
    axios
      .get<Question[]>("https://placements.bsms.ac.uk/api/physquiz")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
        setError("Failed to load questions");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  const handleAnswerClick = async (selectedOption: number) => {
    if (questions[currentQuestion]?.correctAnswer === selectedOption) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      try {
        await axios.post("https://placements.bsms.ac.uk/api/physquiz/results", {
          category,
          score: score + 1
        });
      } catch (error) {
        console.error("Error submitting quiz results:", error);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#7F1C3E" />
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No questions available yet.</Text>
        <Pressable style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (showScore) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Complete!</Text>
        <Text style={styles.scoreText}>
          You scored {score} out of {questions.length}
        </Text>
        <Pressable style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleBack}>
          <Text style={styles.buttonText}>Back to Category</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.questionCount}>
        Question {currentQuestion + 1}/{questions.length}
      </Text>
      <Text style={styles.question}>
        {questions[currentQuestion]?.question || 'Loading question...'}
      </Text>
      
      <View style={styles.optionsContainer}>
        {questions[currentQuestion]?.options?.map((option, index) => (
          <Pressable
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswerClick(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  questionCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#7F1C3E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7F1C3E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});
