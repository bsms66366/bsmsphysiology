import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Question {
  id: number;
  question: string;
  answer: string;
  explanation: string;
  category_id: number;
}

export default function CategoryQuizCount() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const categoryId = params.category_id;
        if (!categoryId) {
          console.error('No category_id provided');
          Alert.alert('Error', 'No category selected', [
            { text: 'OK', onPress: () => router.back() }
          ]);
          return;
        }

        console.log('Fetching questions for category_id:', categoryId);
        const response = await axios.get(`https://placements.bsms.ac.uk/api/physquiz`, {
          params: {
            category_id: categoryId
          }
        });
        console.log('Questions received:', response.data);
        
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          Alert.alert('Error', 'Failed to load questions', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Error', 'Failed to load questions', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [params.category_id]);

  const toggleQuestion = (questionId: number) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleStartQuiz = () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }
    
    router.push(`/quiz/take?category_id=${params.category_id}&questionIds=${selectedQuestions.join(',')}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00679A" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{questions.length} questions available</Text>

      <ScrollView style={styles.questionList}>
        {questions.map((question) => (
          <Pressable 
            key={question.id}
            style={[
              styles.questionItem,
              selectedQuestions.includes(question.id) && styles.selectedQuestion
            ]}
            onPress={() => toggleQuestion(question.id)}
          >
            <Text style={styles.questionText}>{question.question}</Text>
            {selectedQuestions.includes(question.id) && (
              <Text style={styles.selectedText}>✓ Selected</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {selectedQuestions.length > 0 && (
        <View style={styles.bottomContainer}>
          <Text style={styles.selectedCount}>
            {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
          </Text>
          <Pressable style={styles.startButton} onPress={handleStartQuiz}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#7F1C3E',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  questionList: {
    flex: 1,
  },
  questionItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedQuestion: {
    backgroundColor: '#00679A',
  },
  questionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  selectedCount: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#00679A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
