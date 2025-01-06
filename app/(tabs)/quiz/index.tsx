import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
  { id: '44', name: 'Core Concepts' },
  { id: '45', name: 'Cells Environment' },
  { id: '46', name: 'Nervous System' },
  { id: '48', name: 'Endocrine Regulation' },
  { id: '54', name: 'Musculoskeletal System' },
  { id: '49', name: 'Heart and Circulation' },
  { id: '50', name: 'Kidney and Urinary System' },
  { id: '51', name: 'Lungs and Gas Exchange' },
  { id: '52', name: 'Gastrointestinal System' },
  { id: '53', name: 'Reproductive System' }
];

export default function CategoryScreen() {
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    router.push({
      pathname: '/quiz/questions',
      params: {
        category_id: categoryId
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select a Category</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={styles.categoryButton}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F1C3E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  categoriesContainer: {
    padding: 16,
    gap: 12,
  },
  categoryButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});
