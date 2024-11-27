import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Mock questions - this would typically come from your API or database
const mockQuestions = {
  'core-concepts': [
    {
      question: 'What is homeostasis?',
      options: [
        'The maintenance of a stable internal environment',
        'The process of cell division',
        'The breakdown of glucose',
        'The transport of oxygen in blood'
      ],
      correctAnswer: 0
    },
    // Add more questions...
  ],
  // Add more categories...
};

export default function QuizScreen() {
  const { category } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const questions = mockQuestions[category as keyof typeof mockQuestions] || [];

  const handleAnswerClick = (selectedOption: number) => {
    if (questions[currentQuestion].correctAnswer === selectedOption) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
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

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No questions available for this category yet.</Text>
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
      <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      
      <View style={styles.optionsContainer}>
        {questions[currentQuestion].options.map((option, index) => (
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
});
