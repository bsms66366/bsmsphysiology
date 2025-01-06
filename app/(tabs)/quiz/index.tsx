import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useFontSize } from '../../../context/FontSizeContext';

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function CategoryScreen() {
  const router = useRouter();
  const { fontSize } = useFontSize();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://placements.bsms.ac.uk/api/categories');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/quiz/questions?category_id=${categoryId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00679A" />
        <Text style={[styles.loadingText, { fontSize }]}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: fontSize + 4 }]}>Select a Category</Text>
      <Text style={[styles.subtitle, { fontSize }]}>
        Select a category to start practicing questions
      </Text>

      <ScrollView style={styles.categoryList}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={[styles.categoryName, { fontSize: fontSize + 2 }]}>
              {category.name}
            </Text>
            {category.description && (
              <Text style={[styles.categoryDescription, { fontSize }]}>
                {category.description}
              </Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#7F1C3E',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    opacity: 0.8,
    marginBottom: 24,
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryName: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  categoryDescription: {
    color: '#666',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
});
