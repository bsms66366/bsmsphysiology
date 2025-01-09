import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, Image, ScrollView, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { useFontSize } from '../../../context/FontSizeContext';  // Keep this path as it points to the correct file
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Question {
  id: number;
  question: string;
  answer: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  option_5: string | null;
  explanation: string;
  category_id: number;
  urlCode?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function QuizQuestions() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { fontSize } = useFontSize();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [percentageComplete, setPercentageComplete] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const category_id = params.category_id;
      
      console.log('Fetching questions for category:', category_id);

      if (!category_id) {
        console.error('No category_id provided');
        Alert.alert('Error', 'No category selected', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      try {
        setLoading(true);

        // Fetch all questions first
        const response = await axios.get('https://placements.bsms.ac.uk/api/physquiz');
        const allQuestions = response.data;
        
        // Filter questions by category
        const categoryQuestions = allQuestions.filter(
          (q: Question) => q.category_id.toString() === category_id.toString()
        );

        if (categoryQuestions.length > 0) {
          // Shuffle the questions
          const shuffledQuestions = [...categoryQuestions].sort(() => Math.random() - 0.5);
          setQuestions(shuffledQuestions);
          setCurrentQuestion(shuffledQuestions[0]);
          setCurrentIndex(0);
          setPercentageComplete(0);
          
          // Set category details
          const categoryDetails = {
            id: Number(category_id),
            name: getCategoryName(category_id),
          };
          setCategory(categoryDetails);
        } else {
          console.error('No questions found for category:', category_id);
          Alert.alert('Error', 'No questions available for this category', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load questions. Please try again.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const backHandler = () => {
      Alert.alert(
        'Exit Quiz',
        'Are you sure you want to exit the quiz?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => null,
          },
          {
            text: 'Exit',
            onPress: () => router.back(),
          },
        ],
        { cancelable: false }
      );
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => subscription.remove();
  }, [params.category_id]);

  // Helper function to get category name
  const getCategoryName = (category_id: string | number): string => {
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
    return categories[category_id.toString()] || 'Unknown Category';
  };

  const handleOptionSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
    setAnsweredQuestions(prev => prev + 1);
    
    // Normalize both strings for comparison (trim whitespace and convert to lowercase)
    const normalizedOption = option.trim().toLowerCase();
    const normalizedAnswer = currentQuestion?.answer.trim().toLowerCase();
    
    if (normalizedOption === normalizedAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleFinishQuiz = () => {
    if (answeredQuestions === 0) {
      Alert.alert(
        'Finish Quiz',
        'Are you sure you want to exit without answering any questions?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Exit',
            onPress: () => router.push('/quiz')
          }
        ]
      );
      return;
    }

    const percentage = Math.round((score / answeredQuestions) * 100);
    router.push({
      pathname: '/screens/QuizResults',
      params: {
        score,
        total: answeredQuestions,
        percentage,
        categoryId: params.category_id
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentQuestion(questions[currentIndex + 1]);
      setShowAnswer(false);
      setSelectedOption(null);
      setPercentageComplete(((currentIndex + 1) / questions.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCurrentQuestion(questions[currentIndex - 1]);
      setShowAnswer(false);
      setSelectedOption(null);
      setPercentageComplete(((currentIndex - 1) / questions.length) * 100);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.exitButton}
          onPress={() => {
            Alert.alert(
              'Exit Quiz',
              'Are you sure you want to exit?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Exit', onPress: () => router.push('/quiz') }
              ]
            );
          }}
        >
          <Text style={styles.exitButtonText}>Exit Quiz</Text>
        </Pressable>
        {currentQuestion && (
          <Text style={[styles.progress, { fontSize }]}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
        )}
      </View>

      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00679A" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          <Text style={[styles.questionText, { fontSize }]}>
            {currentQuestion.question}
          </Text>

          {currentQuestion.urlCode && (
            <Image
              source={{ uri: currentQuestion.urlCode }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.optionsContainer}>
            {[
              { key: 'option_1', value: currentQuestion.option_1 },
              { key: 'option_2', value: currentQuestion.option_2 },
              { key: 'option_3', value: currentQuestion.option_3 },
              { key: 'option_4', value: currentQuestion.option_4 },
            ].map((option, index) => (
              <Pressable
                key={option.key}
                style={[
                  styles.optionButton,
                  selectedOption === option.value && styles.selectedOption,
                  showAnswer && option.value === currentQuestion.answer && styles.correctOption,
                  showAnswer && selectedOption === option.value && 
                  selectedOption !== currentQuestion.answer && styles.incorrectOption,
                ]}
                onPress={() => handleOptionSelect(option.value)}
                disabled={showAnswer}
              >
                <Text style={[
                  styles.optionText,
                  showAnswer && option.value === currentQuestion.answer && styles.correctOptionText,
                  showAnswer && selectedOption === option.value && 
                  selectedOption !== currentQuestion.answer && styles.incorrectOptionText,
                ]}>
                  {String.fromCharCode(65 + index)}. {option.value}
                </Text>
              </Pressable>
            ))}
          </View>

          {showAnswer && (
            <View style={styles.answerContainer}>
              <Text style={[styles.explanationLabel, { fontSize: fontSize - 2 }]}>Explanation:</Text>
              <Text style={[styles.explanationText, { fontSize }]}>{currentQuestion.explanation}</Text>
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.navigationContainer}>
        <Pressable
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </Pressable>

        {currentIndex === questions.length - 1 ? (
          <Pressable
            style={[styles.navButton, styles.finishButton]}
            onPress={handleFinishQuiz}
          >
            <Text style={styles.navButtonText}>Finish</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.navButton, !showAnswer && styles.disabledButton]}
            onPress={handleNext}
            disabled={!showAnswer}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F1C3E',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  exitButton: {
    backgroundColor: '#00679A',
    padding: 8,
    borderRadius: 5,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  progress: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  questionText: {
    color: '#fff',
    marginBottom: 20,
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  correctOption: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  },
  incorrectOption: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  correctOptionText: {
    color: '#90EE90',
  },
  incorrectOptionText: {
    color: '#FFB6C1',
  },
  answerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  explanationLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    color: '#fff',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  navButton: {
    backgroundColor: '#00679A',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  finishButton: {
    backgroundColor: '#00679A',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});
