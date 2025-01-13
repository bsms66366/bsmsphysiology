import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFontSize } from '../../context/FontSizeContext';

interface QuizHistory {
  categoryId: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
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
  return categoryMap[categoryId] || 'Unknown Category';
};

const QuizResultsScreen = () => {
  const { fontSize } = useFontSize();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [categoryStats, setCategoryStats] = useState<{[key: string]: { total: number, average: number }}>({});

  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        const historyString = await AsyncStorage.getItem('quizHistory');
        if (historyString) {
          const history: QuizHistory[] = JSON.parse(historyString);
          setQuizHistory(history);
          setTotalQuizzes(history.length);
          
          // Calculate overall average
          const avg = history.reduce((sum, quiz) => sum + quiz.percentage, 0) / history.length;
          setAverageScore(Math.round(avg));

          // Calculate per-category statistics
          const catStats: {[key: string]: { total: number, sum: number }} = {};
          history.forEach(quiz => {
            if (!catStats[quiz.categoryId]) {
              catStats[quiz.categoryId] = { total: 0, sum: 0 };
            }
            catStats[quiz.categoryId].total += 1;
            catStats[quiz.categoryId].sum += quiz.percentage;
          });

          // Convert sums to averages
          const finalStats: {[key: string]: { total: number, average: number }} = {};
          Object.entries(catStats).forEach(([categoryId, stats]) => {
            finalStats[categoryId] = {
              total: stats.total,
              average: Math.round(stats.sum / stats.total)
            };
          });
          setCategoryStats(finalStats);
        }
      } catch (error) {
        console.error('Error loading quiz history:', error);
      }
    };

    loadQuizHistory();
    // Set up an interval to refresh the stats every minute
    const interval = setInterval(loadQuizHistory, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { fontSize: fontSize + 4 }]}>Quiz Statistics</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="book-outline" size={24} color="#fff" />
            <Text style={[styles.statLabel, { fontSize }]}>Total Quizzes</Text>
            <Text style={[styles.statValue, { fontSize }]}>{totalQuizzes}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="stats-chart-outline" size={24} color="#fff" />
            <Text style={[styles.statLabel, { fontSize }]}>Average Score</Text>
            <Text style={[styles.statValue, { fontSize }]}>{averageScore}%</Text>
          </View>
        </View>

        <View style={styles.categoryStatsContainer}>
          <Text style={[styles.sectionTitle, { fontSize }]}>Category Performance</Text>
          {Object.entries(categoryStats)
            .sort((a, b) => b[1].average - a[1].average)
            .map(([categoryId, stats]) => (
              <View key={categoryId} style={styles.categoryStatItem}>
                <View style={styles.categoryStatHeader}>
                  <Text style={[styles.categoryName, { fontSize: fontSize - 2 }]}>
                    {getCategoryName(categoryId)}
                  </Text>
                  <Text style={[styles.categoryAverage, { fontSize: fontSize - 2 }]}>
                    {stats.average}%
                  </Text>
                </View>
                <Text style={[styles.quizCount, { fontSize: fontSize - 4 }]}>
                  Quizzes taken: {stats.total}
                </Text>
              </View>
            ))}
        </View>

        <View style={styles.historyContainer}>
          <Text style={[styles.sectionTitle, { fontSize }]}>Recent Quizzes</Text>
          {quizHistory.slice(0, 10).map((quiz, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyItemLeft}>
                <Text style={[styles.historyCategory, { fontSize: fontSize - 2 }]}>
                  {getCategoryName(quiz.categoryId)}
                </Text>
                <Text style={[styles.historyDate, { fontSize: fontSize - 4 }]}>
                  {new Date(quiz.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.historyScore, { fontSize: fontSize - 2 }]}>
                {quiz.percentage}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default QuizResultsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
    fontSize: 28,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    padding: 10,
  },
  statLabel: {
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryStatsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  categoryStatItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  categoryStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    color: '#fff',
    flex: 1,
  },
  categoryAverage: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quizCount: {
    color: '#fff',
    opacity: 0.7,
    marginTop: 5,
  },
  historyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyItemLeft: {
    flex: 1,
  },
  historyCategory: {
    color: '#fff',
  },
  historyDate: {
    color: '#fff',
    opacity: 0.7,
    marginTop: 2,
  },
  historyScore: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
