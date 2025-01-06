import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useFontSize } from '../../../context/FontSizeContext';
import { SvgProps } from 'react-native-svg';

// Import SVG files
import Icon1 from '../../../assets/images/icon1.svg';
import Icon2 from '../../../assets/images/icon2.svg';
import Icon3 from '../../../assets/images/icon3.svg';
import Icon4 from '../../../assets/images/icon4.svg';
import Icon5 from '../../../assets/images/icon5.svg';
import Icon6 from '../../../assets/images/icon6.svg';
import Icon7 from '../../../assets/images/icon7.svg';
import Icon8 from '../../../assets/images/icon8.svg';
import Icon9 from '../../../assets/images/icon9.svg';
import Icon10 from '../../../assets/images/icon10.svg';

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: React.FC<SvgProps>;
}

const CATEGORY_NAMES: { [key: number]: string } = {
  44: "Core Concepts",
  45: "Cells Environment",
  46: "Nervous System",
  47: "Adrenal Glands",
  48: "Endocrine Regulation",
  49: "Heart and Circulation",
  50: "Kidney and Urinary System",
  51: "Lungs and Gas Exchange",
  52: "Gastrointestinal System",
  53: "Reproductive System",
  54: "Musculoskeletal System"
};

// Map category IDs to SVG components
const CATEGORY_ICONS: { [key: number]: React.FC<SvgProps> } = {
  44: Icon1,
  45: Icon2,
  46: Icon3,
  47: Icon4,
  48: Icon5,
  49: Icon6,
  50: Icon7,
  51: Icon8,
  52: Icon9,
  53: Icon10,
  54: Icon1, // Using Icon1 as fallback for Musculoskeletal
};

export default function CategoryScreen() {
  const router = useRouter();
  const { fontSize } = useFontSize();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const physquizResponse = await axios.get('https://placements.bsms.ac.uk/api/physquiz');
        const uniqueCategoryIds = [...new Set(physquizResponse.data.map((item: any) => item.category_id))];
        
        // Create category objects from the unique IDs
        const validCategories = uniqueCategoryIds.map(id => ({
          id,
          name: CATEGORY_NAMES[id] || `Category ${id}`,
          description: `Questions related to ${CATEGORY_NAMES[id] || `Category ${id}`}`,
          icon: CATEGORY_ICONS[id]
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
