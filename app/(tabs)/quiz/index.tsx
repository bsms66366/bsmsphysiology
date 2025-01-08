import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useFontSize } from '../../../context/FontSizeContext';
import { SvgProps } from 'react-native-svg';

// Import SVG files
import Icon1 from '../../../assets/images/icon1.svg';  // Core Concepts
import Icon2 from '../../../assets/images/icon2.svg';  // Cells Environment
import Icon3 from '../../../assets/images/icon3.svg';  // Nervous System
import Icon4 from '../../../assets/images/icon4.svg';  // Endocrine Regulation
import Icon5 from '../../../assets/images/icon5.svg';  // Musculoskeletal System
import Icon6 from '../../../assets/images/icon6.svg';  // Heart and Circulation
import Icon7 from '../../../assets/images/icon7.svg';  // Kidney and Urinary System
import Icon8 from '../../../assets/images/icon8.svg';  // Lungs and Gas Exchange
import Icon9 from '../../../assets/images/icon9.svg';  // Gastrointestinal System
import Icon10 from '../../../assets/images/icon10.svg'; // Reproductive System
import Icon11 from '../../../assets/images/icon11.svg'; // Flash Cards

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: React.FC<SvgProps>;
}

// Map category IDs to SVG components based on visual representation
const CATEGORY_ICONS: { [key: number]: React.FC<SvgProps> } = {
  44: Icon1,  // Core Concepts - brain icon
  45: Icon2,  // Cells Environment - cell icon
  46: Icon3,  // Nervous System - neuron icon
  48: Icon4,  // Endocrine Regulation - hormone icon
  49: Icon6,  // Heart and Circulation - heart icon
  50: Icon7,  // Kidney and Urinary System - kidney icon
  51: Icon8,  // Lungs and Gas Exchange - lung icon
  52: Icon9,  // Gastrointestinal System - digestive icon
  53: Icon10,  //reproductive icon
  54: Icon5, //Musculoskeletal System - muscle/bone icon
  55: Icon11, // Flash Card
};

export default function CategoryScreen() {
  const router = useRouter();
  const { fontSize } = useFontSize();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all categories
        const categoriesResponse = await axios.get('https://placements.bsms.ac.uk/api/categories');
        const allCategories = categoriesResponse.data;

        // Fetch questions to get active categories
        const physquizResponse = await axios.get('https://placements.bsms.ac.uk/api/physquiz');
        const activeCategories = new Set(physquizResponse.data.map((item: any) => item.category_id));

        // Filter categories to only show ones that have questions and add icons
        const validCategories = allCategories
          .filter((category: Category) => activeCategories.has(category.id))
          .map(category => ({
            ...category,
            icon: CATEGORY_ICONS[category.id]
          }));
        
        setCategories(validCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/quiz/take?category_id=${categoryId}`);
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
            <View style={styles.categoryContent}>
              {category.icon && (
                <View style={styles.iconContainer}>
                  <category.icon width={40} height={40} />
                </View>
              )}
              <View style={styles.textContainer}>
                <Text style={[styles.categoryName, { fontSize: fontSize + 2 }]}>
                  {category.name}
                </Text>
                {category.description && (
                  <Text style={[styles.categoryDescription, { fontSize }]}>
                    {category.description}
                  </Text>
                )}
              </View>
            </View>
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
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
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
