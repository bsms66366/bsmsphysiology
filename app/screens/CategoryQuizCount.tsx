import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Question {
  id: number;
  question: string;
  answer: string;
  explanation: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function CategoryQuizCount() {
  const { category_id } = useLocalSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for category_id:', category_id);
        
        // Fetch category details
        const categoryResponse = await axios.get(`https://placements.bsms.ac.uk/api/categories/${category_id}`);
        setCategory(categoryResponse.data);
        
        // Fetch questions
        const questionsResponse = await axios.get<Question[]>(`https://placements.bsms.ac.uk/api/physquiz?category_id=${category_id}`);
        console.log('Questions received:', questionsResponse.data);
        
        if (Array.isArray(questionsResponse.data)) {
          setQuestions(questionsResponse.data);
        } else {
          console.error('Invalid questions response format:', questionsResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [category_id]);

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
    
    router.push(`/quiz/take/${category_id}?questionIds=${selectedQuestions.join(',')}`);
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
      <Text style={styles.title}>{category?.name || 'Category'}</Text>
      {category?.description && (
        <Text style={styles.description}>{category.description}</Text>
      )}
      <Text style={styles.subtitle}>
        {questions.length} question{questions.length !== 1 ? 's' : ''} available in this category
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ Select questions to include in your quiz. All questions are from the {category?.name || 'current'} category.
        </Text>
      </View>

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
            <Text style={[
              styles.questionText,
              selectedQuestions.includes(question.id) && styles.selectedQuestionText
            ]}>
              {question.question}
            </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    opacity: 0.8,
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
  selectedQuestionText: {
    color: '#fff',
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
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
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
