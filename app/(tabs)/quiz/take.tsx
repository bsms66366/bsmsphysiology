import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, Image, ScrollView, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { useFontSize } from '../../../context/FontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Question {
  id: number;
  question: string;
  answer: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  explanation: string;
  category_id: number;
  urlCode?: string;
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
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const categoryId = params.category_id;
      const questionIds = params.questionIds?.toString().split(',') || [];
      
      console.log('Fetching questions with:', {
        categoryId,
        questionIds
      });

      if (!categoryId) {
        console.error('No category_id provided');
        Alert.alert('Error', 'No category selected', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      if (questionIds.length === 0) {
        console.error('No questions selected');
        Alert.alert('Error', 'No questions selected', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      try {
        setLoading(true);
        // First get all questions for the category
        const allQuestionsResponse = await axios.get(`https://placements.bsms.ac.uk/api/physquiz`, {
          params: {
            category_id: categoryId
          }
        });

        if (Array.isArray(allQuestionsResponse.data)) {
          // Filter the questions to only include the selected ones
          const selectedQuestions = allQuestionsResponse.data.filter(
            question => questionIds.includes(question.id.toString())
          );

          if (selectedQuestions.length > 0) {
            setQuestions(selectedQuestions);
            setCurrentQuestion(selectedQuestions[0]);
            setCurrentIndex(0);
            setPercentageComplete(0);
          } else {
            console.error('No matching questions found');
            Alert.alert('Error', 'No questions found', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        } else {
          console.error('Invalid questions response format:', allQuestionsResponse.data);
          Alert.alert('Error', 'Invalid response format', [
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

    // Add a hardware back button handler
    const backHandler = () => {
      handleFinishQuiz();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => subscription.remove();
  }, [params.category_id, params.questionIds]);

  const handleOptionSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
    setAnsweredQuestions(prev => prev + 1);
    
    if (option === currentQuestion?.answer) {
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
      pathname: '/(modals)/QuizResults',
      params: {
        score,
        total: answeredQuestions,
        percentage,
        categoryId: params.category_id?.toString()
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

  if (loading || !currentQuestion) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00679A" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const options = [
    { key: 'option_1', value: currentQuestion.option_1 },
    { key: 'option_2', value: currentQuestion.option_2 },
    { key: 'option_3', value: currentQuestion.option_3 },
    { key: 'option_4', value: currentQuestion.option_4 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.exitButton} onPress={handleFinishQuiz}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${percentageComplete}%` }]} />
        </View>
      </View>
      
      <Text style={styles.questionCount}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

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
          {options.map((option, index) => (
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
            <Text style={styles.navButtonText}>Finish Quiz</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.navButton}
            onPress={handleNext}
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
  },
  headerContainer: {
    width: '100%',
  },
  exitButton: {
    position: 'absolute',
    top: 0,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00679A',
  },
  questionCount: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
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
