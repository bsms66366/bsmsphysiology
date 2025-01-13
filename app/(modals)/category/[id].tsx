import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Question = {
  id: number;
  question: string;
  answer: string;
  explanation: string;
  category_id: number;
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('Fetching questions for category_id:', id);
    axios.get(`https://placements.bsms.ac.uk/api/questions?category_id=${id}`)
      .then(response => {
        console.log('Questions received:', response.data);
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setLoading(false);
      });
  }, [id]);

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
    
    router.push({
      pathname: '/screens/QuizQuestions',
      params: { 
        category_id: id,
        questionIds: selectedQuestions.join(',')
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noQuestionsText}>No questions available for this category.</Text>
        <Pressable 
          style={[styles.button, styles.backButton]} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Questions</Text>
      <Text style={styles.subtitle}>{questions.length} questions in this category</Text>
      
      <ScrollView style={styles.questionList}>
        {questions.map((q) => (
          <Pressable 
            key={q.id}
            style={[
              styles.questionItem,
              selectedQuestions.includes(q.id) && styles.selectedQuestion
            ]}
            onPress={() => toggleQuestion(q.id)}
          >
            <Text style={styles.questionText}>{q.question}</Text>
            {selectedQuestions.includes(q.id) && (
              <Text style={styles.selectedText}>✓ Selected</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectionText}>
          Selected: {selectedQuestions.length} questions
        </Text>
        
        <Pressable 
          style={styles.button} 
          onPress={handleStartQuiz}
        >
          <Text style={styles.buttonText}>Start Quiz</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.backButton]} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  questionList: {
    flex: 1,
  },
  questionItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  selectedQuestion: {
    backgroundColor: '#e3f2fd',
    borderColor: '#404040',
    borderWidth: 1,
  },
  questionText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#404040',
    marginTop: 4,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
    gap: 8,
  },
  selectionText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#404040',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#00679A',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noQuestionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
