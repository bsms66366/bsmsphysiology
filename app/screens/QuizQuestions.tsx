import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { useFontSize } from '../../context/FontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PanoptoViewer from '../PanoptoViewer';

const MediaPlayer = ({ url }: { url: string }) => {
  const windowWidth = Dimensions.get('window').width;
  
  if (!url) {
    console.log('MediaPlayer: No URL provided');
    return null;
  }

  console.log('MediaPlayer received URL:', url);

  // Check if the URL is a Panopto video URL
  if (url.includes('brighton.cloud.panopto.eu')) {
    console.log('Rendering PanoptoViewer for URL:', url);
    return (
      <View style={styles.mediaContainer}>
        <PanoptoViewer url={url} />
      </View>
    );
  }
  
  // If not a video, render as image
  console.log('Rendering image for URL:', url);
  return (
    <View style={styles.mediaContainer}>
      <Image
        source={{ uri: url }}
        style={[
          styles.mediaContent,
          { width: windowWidth * 0.9, height: windowWidth * 0.9 }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

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
  urlCode: string | null;
}

export default function QuizQuestions() {
  const params = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [percentageComplete, setPercentageComplete] = useState(0);
  const [loading, setLoading] = useState(true);
  const { fontSize } = useFontSize();
  const router = useRouter();

  useEffect(() => {
    console.log('Fetching questions with params:', {
      category_id: params.category_id,
      questionIds: params.questionIds
    });

    const fetchQuestions = async () => {
      const categoryId = params.category_id?.toString();
      const questionIds = params.questionIds?.toString().split(',') || [];
      
      console.log('Fetching questions with:', {
        categoryId,
        questionIds
      });

      if (!categoryId || questionIds.length === 0) {
        console.error('Missing required params:', {
          categoryId,
          questionIds
        });
        Alert.alert('Error', 'No questions selected', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      try {
        setLoading(true);
        console.warn('Making API request with params:', {
          category_id: categoryId,
          question_ids: questionIds.join(',')
        });
        
        const response = await axios.get(`https://placements.bsms.ac.uk/api/physquiz`, {
          params: {
            category_id: categoryId,
            question_ids: questionIds.join(',')
          }
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log('API Response:', response.data);
          console.log('First question details:', {
            id: response.data[0].id,
            question: response.data[0].question,
            urlCode: response.data[0].urlCode,
          });
          
          setQuestions(response.data);
          setCurrentQuestion(response.data[0]);
          setCurrentIndex(0);
          setPercentageComplete(0);
        } else {
          console.error('No questions received from API');
          Alert.alert('Error', 'No questions found', [
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
  }, [params.category_id, params.questionIds]);

  const handleAnswer = (selectedOption: string) => {
    if (!currentQuestion || selectedAnswer) return;
    
    setSelectedAnswer(selectedOption);
    if (selectedOption === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
    setExplanation(currentQuestion.explanation);
  };

  const handleNextQuestion = async () => {
    if (currentIndex === questions.length - 1) {
      // Save quiz result
      try {
        const existingResults = await AsyncStorage.getItem('quizResults');
        const results = existingResults ? JSON.parse(existingResults) : [];
        
        results.push({
          category: params.category_id,
          score: score,
          totalQuestions: questions.length,
          date: new Date().toISOString()
        });
        
        await AsyncStorage.setItem('quizResults', JSON.stringify(results));
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
      
      setShowResult(true);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setSelectedAnswer(null);
      setExplanation("");
      setPercentageComplete((nextIndex / questions.length) * 100);
    }
  };

  if (loading) {
    console.log('Loading questions...');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={[styles.loadingText, { fontSize }]}>Loading questions...</Text>
      </View>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    console.log('Quiz complete:', {
      score,
      totalQuestions: questions.length,
      percentage
    });
    return (
      <View style={styles.container}>
        <Text style={[styles.resultText, { fontSize: fontSize * 1.5 }]}>Quiz Complete!</Text>
        <Text style={[styles.resultText, { fontSize }]}>
          You scored {score} out of {questions.length} ({percentage}%)
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { fontSize }]}>Back to Categories</Text>
        </Pressable>
      </View>
    );
  }

  if (!currentQuestion) {
    console.log('No current question available');
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { fontSize }]}>No questions available</Text>
      </View>
    );
  }

  console.log('Rendering question:', {
    id: currentQuestion.id,
    question: currentQuestion.question,
    urlCode: currentQuestion.urlCode,
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentageComplete}%` }]} />
      </View>
      
      <Text style={[styles.questionNumber, { fontSize: fontSize * 0.8 }]}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <Text style={[styles.debugText, { fontSize }]}>
        Debug - Question ID: {currentQuestion.id}
      </Text>
      
      <Text style={[styles.questionText, { fontSize }]}>{currentQuestion.question}</Text>

      {currentQuestion.urlCode && (
        <>
          <Text style={[styles.debugText, { fontSize, color: 'blue' }]}>
            Debug - Media URL: {currentQuestion.urlCode}
          </Text>
          <View style={styles.mediaContainer}>
            {(() => {
              console.log('Processing URL:', currentQuestion.urlCode);
              const url = currentQuestion.urlCode;
              
              if (url.includes('brighton.cloud.panopto.eu') || url.includes('youtu.be') || url.includes('youtube.com')) {
                const videoType = url.includes('brighton.cloud.panopto.eu') ? 'Panopto' : 'YouTube';
                console.log(`Rendering ${videoType} video`);
                return (
                  <View style={styles.videoContainer}>
                    <PanoptoViewer url={url} />
                  </View>
                );
              } else {
                console.log('Rendering image');
                return (
                  <Image
                    source={{ uri: url }}
                    style={[
                      styles.mediaContent,
                      { width: Dimensions.get('window').width * 0.9, height: Dimensions.get('window').width * 0.9 }
                    ]}
                    resizeMode="contain"
                  />
                );
              }
            })()}
          </View>
        </>
      )}

      <View style={styles.optionsContainer}>
        {[
          currentQuestion.option_1,
          currentQuestion.option_2,
          currentQuestion.option_3,
          currentQuestion.option_4
        ].map((option, index) => (
          <Pressable
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
              selectedAnswer && option === currentQuestion.answer && styles.correctOption,
              selectedAnswer && selectedAnswer === option && option !== currentQuestion.answer && styles.wrongOption
            ]}
            onPress={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
          >
            <Text style={[
              styles.optionText,
              { fontSize },
              selectedAnswer && option === currentQuestion.answer && styles.correctOptionText,
              selectedAnswer && selectedAnswer === option && option !== currentQuestion.answer && styles.wrongOptionText
            ]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {selectedAnswer && (
        <View style={styles.explanationContainer}>
          <Text style={[styles.explanationText, { fontSize: fontSize * 0.9 }]}>
            {explanation}
          </Text>
          <Pressable
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={[styles.nextButtonText, { fontSize }]}>
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Text>
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
    backgroundColor: '#404040',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00679A',
    borderRadius: 4,
  },
  questionNumber: {
    color: '#fff',
    marginBottom: 8,
    opacity: 0.8,
  },
  questionText: {
    color: '#fff',
    marginBottom: 24,
    fontWeight: '500',
  },
  mediaContainer: {
    marginVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaContent: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
  },
  correctOption: {
    backgroundColor: '#C8E6C9',
  },
  wrongOption: {
    backgroundColor: '#FFCDD2',
  },
  optionText: {
    color: '#000',
  },
  correctOptionText: {
    color: '#2E7D32',
  },
  wrongOptionText: {
    color: '#C62828',
  },
  explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  explanationText: {
    color: '#fff',
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#00679A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  resultText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#00679A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  debugText: {
    color: '#fff',
    marginBottom: 8,
    opacity: 0.8,
  },
});
