import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Option from "../../components/Option";
import axios from "axios";
import { useFontSize } from '../../context/FontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, router } from "expo-router";

type Question = {
  question: string;
  answer: string;
  explanation: string;
  option_1?: string;
  option_2?: string;
  option_3?: string;
  option_4?: string;
  category_id: string;
};

export default function QuizQuestions() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [percentageComplete, setPercentageComplete] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const { fontSize } = useFontSize();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions for category:', category);
        const response = await axios.get<Question[]>("https://placements.bsms.ac.uk/api/physquiz");
        console.log('API Response:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Verify the structure of the first question
          const firstQuestion = response.data[0];
          console.log('First question structure:', firstQuestion);
          
          setQuestions(response.data);
        } else {
          console.error('Invalid API response format:', response.data);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    if (category) {
      fetchQuestions();
    } else {
      console.error('No category provided');
      router.back();
    }
  }, [category]);

  useEffect(() => {
    if (!category || !questions.length) {
      console.log('Waiting for questions or category:', {
        hasCategory: !!category,
        questionsCount: questions.length
      });
      return;
    }
    
    console.log('Filtering questions for category:', category);
    // Filter by category_id instead of category
    const filtered = questions.filter(q => q.category_id.toString() === category);
    console.log('Found questions:', filtered.length);

    if (filtered.length === 0) {
      console.warn('No questions found for category:', category);
      return;
    }

    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setSelectedAnswers([]);
    setExplanation("");
    setPercentageComplete(0);
  }, [category, questions]);

  const getCurrentQuestion = () => {
    if (!filteredQuestions.length) {
      console.error('No questions available');
      return null;
    }
    if (currentQuestionIndex >= filteredQuestions.length) {
      console.error('Invalid question index:', currentQuestionIndex);
      return null;
    }
    const question = filteredQuestions[currentQuestionIndex];
    console.log('Current question:', question);
    return question;
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;

    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    // Store the selected answer
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);

    setSelectedOption(option);

    // Compare answers after normalizing
    const normalizedOption = option.trim().toLowerCase();
    const normalizedAnswer = currentQuestion.answer.trim().toLowerCase();
    const correct = normalizedOption === normalizedAnswer;

    setIsAnswerCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    setExplanation(currentQuestion.explanation);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === filteredQuestions.length - 1) {
      handleFinishQuiz();
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setExplanation("");
      setIsAnswerCorrect(null);
      const newPercentage = ((nextIndex + 1) / filteredQuestions.length) * 100;
      setPercentageComplete(newPercentage);
    }
  };

  const handleFinishQuiz = async () => {
    try {
      // Save the quiz result
      const quizResult = {
        category,
        score,
        totalQuestions: filteredQuestions.length,
        date: new Date().toISOString(),
        questions: filteredQuestions.map((q, index) => ({
          question: q.question,
          correctAnswer: q.answer,
          userAnswer: selectedAnswers[index],
          wasCorrect: selectedAnswers[index]?.trim().toLowerCase() === q.answer.trim().toLowerCase(),
          explanation: q.explanation
        }))
      };

      // Save to AsyncStorage
      const existingResultsStr = await AsyncStorage.getItem('quizResults');
      const existingResults = existingResultsStr ? JSON.parse(existingResultsStr) : [];
      await AsyncStorage.setItem('quizResults', JSON.stringify([quizResult, ...existingResults]));

      setShowResult(true);
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  if (!filteredQuestions.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00679A" />
        <Text style={[styles.loadingText, { fontSize }]}>Loading questions...</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTitle, { fontSize: fontSize + 8 }]}>Quiz Complete!</Text>
          <Text style={[styles.resultScore, { fontSize: fontSize + 4 }]}>
            Your Score: {score} / {filteredQuestions.length}
          </Text>
          <Text style={[styles.resultPercentage, { fontSize: fontSize + 2 }]}>
            {Math.round((score / filteredQuestions.length) * 100)}%
          </Text>
          
          <TouchableOpacity
            style={styles.viewResultsButton}
            onPress={() => router.push("/(tabs)/quiz-results")}
          >
            <Text style={[styles.viewResultsText, { fontSize }]}>View All Results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.newQuizButton}
            onPress={() => router.push("/quiz/general")}
          >
            <Text style={[styles.newQuizText, { fontSize }]}>Try Another Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${percentageComplete}%` }]}
            />
          </View>
          <Text style={[styles.progressText, { fontSize }]}>
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={[styles.questionText, { fontSize: fontSize + 2 }]}>
            {currentQuestion.question}
          </Text>
        </View>

        <View style={styles.optionsWrapper}>
          <TouchableOpacity
            style={[
              styles.answerButton,
              selectedOption && isAnswerCorrect && styles.correctAnswer,
              selectedOption && !isAnswerCorrect && styles.wrongAnswer
            ]}
            onPress={() => !selectedOption && handleOptionSelect(currentQuestion.answer)}
            disabled={!!selectedOption}
          >
            <Text style={[styles.answerText, { fontSize }]}>
              {selectedOption ? currentQuestion.answer : 'Tap to reveal answer'}
            </Text>
          </TouchableOpacity>
        </View>

        {explanation && (
          <View style={styles.explanationContainer}>
            <Text style={[styles.explanationText, { fontSize }]}>
              {explanation}
            </Text>
          </View>
        )}

        {selectedOption && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={[styles.nextButtonText, { fontSize }]}>
              {currentQuestionIndex === filteredQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00679A",
  },
  progressText: {
    textAlign: "center",
    color: "#666",
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    lineHeight: 28,
  },
  optionsWrapper: {
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  correctAnswer: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  wrongAnswer: {
    backgroundColor: '#ffebee',
    borderColor: '#ef5350',
  },
  explanationContainer: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  explanationText: {
    color: "#666",
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: "#00679A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  resultScore: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 30,
  },
  viewResultsButton: {
    backgroundColor: '#00679A',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  viewResultsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newQuizButton: {
    backgroundColor: '#7F1C3E',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  newQuizText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
