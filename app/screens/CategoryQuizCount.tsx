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

// Category ID to name mapping
const categoryMap: { [key: string]: string } = {
  '44': 'Core Concepts',
  '45': 'Cells Environment',
  '46': 'Nervous System',
  '48': 'Endocrine Regulation',
  '54': 'Musculoskeletal System',
  '49': 'Heart and Circulation',
  '50': 'Kidney and Urinary System',
  '51': 'Lungs and Gas Exchange',
  '52': 'Gastrointestinal System',
  '53': 'Reproductive System'
};

const getCategoryName = (categoryId: string): string => {
  return categoryMap[categoryId] || categoryId;
};

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

        // Sort categories by name
        const formattedCounts = Object.entries(counts)
          .filter(([category]) => categoryMap[category]) // Only show known categories
          .map(([category, count]) => ({
            category,
            count,
          }))
          .sort((a, b) => getCategoryName(a.category).localeCompare(getCategoryName(b.category)));

        setCategoryCounts(formattedCounts);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Questions per Category</Text>
      <View style={styles.gridContainer}>
        {categoryCounts.map(({ category, count }) => (
          <View key={category} style={styles.categoryCard}>
            <Text style={styles.categoryName}>{getCategoryName(category)}</Text>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.label}>questions</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00679A',
    textAlign: 'center',
    marginBottom: 4,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7F1C3E',
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
});

export default CategoryQuizCount;
