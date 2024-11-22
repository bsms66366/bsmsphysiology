import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useSearchParams } from 'expo-router';
import Option from '@/components/Option';

type Question = {
  question: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  answer: string;
  explanation: string;
  category: string;
};

export default function QuizScreen() {
  const { category } = useSearchParams(); // Retrieve the selected category
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios
      .get<Question[]>('https://placements.bsms.ac.uk/api/physquiz')
      .then((response) => {
        const filteredQuestions = response.data.filter((q) => q.category === category);
        setQuestions(filteredQuestions);
      })
      .catch((error) => {
        console.error('Error fetching quiz data:', error);
      });
  }, [category]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (selectedOption === currentQuestion?.answer) {
      setScore((prev) => prev + 1);
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert(`Quiz Complete! Your score: ${score}/${questions.length}`);
    }
    setSelectedOption(null);
  };

  if (!currentQuestion) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.category}>Category: {category}</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      {[currentQuestion.option_1, currentQuestion.option_2, currentQuestion.option_3, currentQuestion.option_4].map(
        (option, index) => (
          <Option key={index} option={option} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        )
      )}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  category: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  question: { fontSize: 18, marginBottom: 20 },
  nextButton: { backgroundColor: '#004643', padding: 16, borderRadius: 8, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
