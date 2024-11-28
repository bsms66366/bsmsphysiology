import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

interface Quiz {
  category_id: string;
  // other quiz properties
}

interface CategoryCount {
  category: string;
  count: number;
}

const CategoryQuizCount: React.FC = () => {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get<Quiz[]>('https://placements.bsms.ac.uk/api/physquiz');
        const quizData = response.data;

        const counts: { [key: string]: number } = {};
        quizData.forEach((quiz) => {
          counts[quiz.category_id] = (counts[quiz.category_id] || 0) + 1;
        });

        const formattedCounts = Object.entries(counts).map(([category, count]) => ({
          category,
          count,
        }));

        setCategoryCounts(formattedCounts);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {categoryCounts.map(({ category, count }) => (
        <View key={category} style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{category}: {count} quizzes</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoryQuizCount;
