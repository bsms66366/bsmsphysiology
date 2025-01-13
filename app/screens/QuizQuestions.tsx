import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useFontSize } from '../../context/FontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  
  // Handle youtu.be URLs
  if (url.includes('youtu.be/')) {
    // Split on '/' and take the last part, then split on '?' and take the first part
    const id = url.split('youtu.be/')[1].split('?')[0];
    return id;
  }
  
  // Handle youtube.com URLs
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoId = getYouTubeVideoId(videoUrl);
  const windowWidth = Dimensions.get('window').width;

  console.log('VideoPlayer:', {
    originalUrl: videoUrl,
    videoId,
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null
  });

  if (!videoId) return null;

  return (
    <View style={{
      width: windowWidth * 0.9,
      height: windowWidth * 0.5625,
      backgroundColor: '#f0f0f0',
      borderWidth: 1,
      borderColor: '#ddd',
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {isLoading && (
        <ActivityIndicator 
          size="large" 
          color="#00679A"
          style={{ position: 'absolute', zIndex: 1 }}
        />
      )}
      {hasError ? (
        <Text style={{ color: 'red' }}>Error loading video</Text>
      ) : (
        <WebView
          style={{ flex: 1, width: '100%' }}
          source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            setHasError(true);
            setIsLoading(false);
          }}
          onLoadStart={() => {
            console.log('WebView started loading');
            setIsLoading(true);
            setHasError(false);
          }}
          onLoad={() => {
            console.log('WebView loaded successfully');
            setIsLoading(false);
          }}
        />
      )}
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
        console.warn('🚀 Making API request with params:', {
          category_id: categoryId,
          question_ids: questionIds.join(',')
        });
        
        const response = await axios.get(`https://placements.bsms.ac.uk/api/physquiz`, {
          params: {
            category_id: categoryId,
            question_ids: questionIds.join(',')
          }
        });

        console.log('API Response:', {
          status: response.status,
          questionCount: response.data?.length,
          firstQuestion: response.data?.[0],
        });
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log('First question details:', {
            question: response.data[0].question,
            urlCode: response.data[0].urlCode,
            isYouTube: response.data[0].urlCode ? isYouTubeUrl(response.data[0].urlCode) : false
          });
          
          console.log('🎯 Setting first question:', {
            urlCode: response.data[0].urlCode,
            isYouTube: response.data[0].urlCode ? isYouTubeUrl(response.data[0].urlCode) : false,
            videoId: response.data[0].urlCode ? getYouTubeVideoId(response.data[0].urlCode) : null
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
    isYouTube: currentQuestion.urlCode ? isYouTubeUrl(currentQuestion.urlCode) : false
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentageComplete}%` }]} />
      </View>
      
      <Text style={[styles.questionNumber, { fontSize: fontSize * 0.8 }]}>
        Question {currentIndex + 1} of {questions.length}
      </Text>
      
      <Text style={[styles.questionText, { fontSize }]}>{currentQuestion.question}</Text>

      {console.log('Current question URL:', currentQuestion.urlCode)}
      {currentQuestion.urlCode && (
        console.log('Checking if YouTube:', isYouTubeUrl(currentQuestion.urlCode)),
        isYouTubeUrl(currentQuestion.urlCode) ? (
          console.log('Rendering video player for URL:', currentQuestion.urlCode),
          <VideoPlayer videoUrl={currentQuestion.urlCode} />
        ) : (
          console.log('Rendering image for URL:', currentQuestion.urlCode),
          <Image
            source={{ uri: currentQuestion.urlCode }}
            style={styles.questionImage}
            resizeMode="contain"
          />
        )
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
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
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
});
