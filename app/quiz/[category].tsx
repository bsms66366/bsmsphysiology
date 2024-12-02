import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Option from '../../components/Option';
import { useFontSize } from '../../context/FontSizeContext';

interface Question {
  id: number;
  question: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  answer: string;
  explanation: string;
  category_id: number;
}

interface QuizResult {
  category: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export default function QuizScreen() {
  const { category } = useLocalSearchParams();
  const categoryStr = category as string;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [percentageComplete, setPercentageComplete] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const { fontSize } = useFontSize();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions for category:', categoryStr);
        const response = await axios.get<Question[]>("https://placements.bsms.ac.uk/api/physquiz");
        if (Array.isArray(response.data) && response.data.length > 0) {
          const processedQuestions = response.data.map(q => {
            // Get unique options excluding the answer
            const uniqueOptions = new Set([
              q.option_1,
              q.option_2,
              q.option_3,
              q.option_4
            ].filter(opt => opt && opt.trim() !== q.answer.trim()));
            
            // Convert back to array and ensure exactly 4 options
            const optionsArray = Array.from(uniqueOptions);
            const finalOptions = [
              optionsArray[0] || 'Option 1',
              optionsArray[1] || 'Option 2',
              optionsArray[2] || 'Option 3',
              optionsArray[3] || 'Option 4'
            ];

            return {
              ...q,
              option_1: finalOptions[0],
              option_2: finalOptions[1],
              option_3: finalOptions[2],
              option_4: finalOptions[3]
            };
          });
          setQuestions(processedQuestions);
        } else {
          console.log('Invalid API response format:', response.data);
          Alert.alert('Error', 'Failed to load questions. Please try again.');
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        Alert.alert('Error', 'Failed to load questions. Please check your connection.');
      }
    };

    if (categoryStr) {
      fetchQuestions();
    } else {
      Alert.alert('Error', 'No category selected', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [categoryStr]);

  useEffect(() => {
    if (!categoryStr || !questions.length) return;
    
    const filtered = questions.filter(q => 
      q.category_id.toString() === categoryStr.toString()
    );

    if (filtered.length === 0) {
      Alert.alert('No Questions', 'No questions found for this category.');
      return;
    }

    // Shuffle and select exactly 4 unique questions
    const shuffledQuestions = filtered.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 4);

    setFilteredQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setSelectedAnswers([]);
    setExplanation("");
    setPercentageComplete(0);
  }, [categoryStr, questions]);

  const getCurrentQuestion = () => {
    if (!filteredQuestions.length || currentQuestionIndex >= filteredQuestions.length) {
      return null;
    }
    return filteredQuestions[currentQuestionIndex];
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;

    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
    setSelectedOption(option);

    const normalizedOption = option.trim().toLowerCase();
    const normalizedAnswer = currentQuestion.answer.trim().toLowerCase();
    const correct = normalizedOption === normalizedAnswer;

    setIsAnswerCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    setExplanation(currentQuestion.explanation);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === filteredQuestions.length - 1) {
      setShowResult(true);
      saveQuizResult();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setExplanation("");
      setIsAnswerCorrect(null);
      setShowAnswer(false);
      const newPercentage = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
      setPercentageComplete(newPercentage);
    }
  };

  const saveQuizResult = async () => {
    try {
      const quizResult: QuizResult = {
        category: categoryStr,
        score,
        totalQuestions: filteredQuestions.length,
        date: new Date().toISOString(),
      };

      const existingResultsStr = await AsyncStorage.getItem('quizResults');
      const existingResults = existingResultsStr ? JSON.parse(existingResultsStr) : [];
      const updatedResults = [...existingResults, quizResult];
      await AsyncStorage.setItem('quizResults', JSON.stringify(updatedResults));
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (showResult) {
    return (
      <ScrollView style={styles.container}>
        <Text style={[styles.resultText, { fontSize: fontSize }]}>
          Quiz Complete!{'\n'}
          Score: {score} out of {filteredQuestions.length}
        </Text>
        <Text style={[styles.resultText, { fontSize: fontSize - 2 }]}>
          Percentage: {((score / filteredQuestions.length) * 100).toFixed(1)}%
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.progressText, { fontSize: fontSize - 4 }]}>
        Question {currentQuestionIndex + 1} of {filteredQuestions.length}
      </Text>
      <Text style={[styles.questionText, { fontSize: fontSize }]}>
        {currentQuestion.question}
      </Text>
      {(() => {
        const allOptions = [
          currentQuestion.option_1,
          currentQuestion.option_2,
          currentQuestion.option_3,
          currentQuestion.option_4,
          currentQuestion.answer
        ];
        
        console.log('All Options:', allOptions);
        
        const uniqueOptions = Array.from(new Set(
          allOptions.filter(opt => opt && opt.trim())
        )).slice(0, 4);
        
        console.log('Unique Options:', uniqueOptions);
        
        return uniqueOptions.map((option, index) => (
          <Option
            key={index}
            option={option}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            onSelect={handleOptionSelect}
          />
        ));
      })()}
      {showAnswer && (
        <>
          <Text style={[styles.answerText, { fontSize: fontSize - 2, marginTop: 15 }]}>
            Correct Answer: {currentQuestion.answer}
          </Text>
          {explanation && (
            <View style={styles.explanationContainer}>
              <Text style={[styles.explanationText, { fontSize: fontSize - 2 }]}>
                {explanation}
              </Text>
            </View>
          )}
        </>
      )}
      {selectedOption && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, { padding: 12, backgroundColor: '#4CAF50', borderRadius: 8 }]}
            onPress={handleNextQuestion}
          >
            <Text style={{ color: 'white', fontSize: fontSize - 2, textAlign: 'center' }}>
              Next Question
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  questionText: {
    marginBottom: 20,
    fontWeight: '500',
  },
  explanationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  explanationText: {
    color: '#444',
  },
  nextButtonContainer: {
    marginTop: 20,
  },
  resultText: {
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  answerText: {
    fontWeight: '500',
    color: '#4CAF50',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  nextButton: {
    marginTop: 20,
    width: '100%',
  },
});
