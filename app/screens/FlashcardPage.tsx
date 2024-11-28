import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handleFlip = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00679A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {flashcards[currentIndex].image && (
          <Image source={{ uri: flashcards[currentIndex].image }} style={styles.image} />
        )}
        <Text style={styles.text}>
          {showAnswer ? flashcards[currentIndex].answer : flashcards[currentIndex].question}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleFlip}>
        <Text style={styles.buttonText}>{showAnswer ? 'Show Question' : 'Show Answer'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
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
    width: '80%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00679A',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FlashcardPage;
