import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get('https://placements.bsms.ac.uk/api/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    router.push(`/(tabs)/quiz-results/CategoryQuizCount?category_id=${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Category</Text>
      <ScrollView style={styles.scrollView}>
        {categories.map((category: any) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryButton}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Text style={styles.categoryName}>{category.name}</Text>
            {category.description && (
              <Text style={styles.categoryDescription}>{category.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
  },
});
