import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, StatusBar } from 'react-native';
import axios from 'axios';

interface Flashcard {
  question: string;
  answer: string;
  image?: string;
}

const FlashcardPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('https://placements.bsms.ac.uk/api/physquiz');
        const flashcardsData = response.data.map(item => ({
          question: item.question,
          answer: item.answer,
          image: item.image
        }));
        setFlashcards(flashcardsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!flashcards.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No flashcards available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.card}>
        {flashcards[currentIndex].image && (
          <Image source={{ uri: flashcards[currentIndex].image }} style={styles.image} />
        )}
        <Text style={styles.questionText}>{flashcards[currentIndex].question}</Text>
        {showAnswer && (
          <Text style={styles.answerText}>{flashcards[currentIndex].answer}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePrevious} style={styles.navigationButton}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowAnswer(!showAnswer)} style={styles.showAnswerButton}>
          <Text style={styles.buttonText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.navigationButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7F1C3E',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  answerText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#00679A',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 20,
  },
  navigationButton: {
    backgroundColor: '#00679A',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  showAnswerButton: {
    backgroundColor: '#00679A',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FlashcardPage;
