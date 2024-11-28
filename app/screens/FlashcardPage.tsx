import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Flashcard {
  question: string;
  answer: string;
}

const flashcards: Flashcard[] = [
  { question: 'What is the powerhouse of the cell?', answer: 'The mitochondria' },
  { question: 'What is the chemical symbol for water?', answer: 'H2O' },
  // Add more flashcards as needed
];

const FlashcardPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handleFlip = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
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
    backgroundColor: '#fff',
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
