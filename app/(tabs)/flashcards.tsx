import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, StatusBar, ScrollView } from 'react-native';
import axios from 'axios';
import { useFontSize } from '../../context/FontSizeContext';

interface Flashcard {
  question: string;
  answer: string;
  image?: string;
  urlCode?: string;
  category_id: string;
}

const categories = [
  { label: 'All', id: 'all' },
  { label: 'Core Concepts', id: '44' },
  { label: 'Cells Environment', id: '45' },
  { label: 'Nervous System', id: '46' },
  { label: 'Endocrine Regulation', id: '48' },
  { label: 'Musculoskeletal System', id: '54' },
  { label: 'Heart and Circulation', id: '49' },
  { label: 'Kidney and Urinary System', id: '50' },
  { label: 'Lungs and Gas Exchange', id: '51' },
  { label: 'Gastrointestinal System', id: '52' },
  { label: 'Reproductive System', id: '53' },
];

const FlashcardPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const { fontSize } = useFontSize();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('https://placements.bsms.ac.uk/api/physquiz');
        console.log('API Response:', response.data);
        const flashcardsData = response.data.map(item => ({
          question: item.question,
          answer: item.answer,
          image: item.image,
          urlCode: item.urlCode,
          category_id: item.category_id
        }));
        console.log('Processed Flashcards:', flashcardsData);
        setFlashcards(flashcardsData);
        setFilteredFlashcards(flashcardsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFlashcards(flashcards);
    } else {
      console.log('Selected Category:', selectedCategory);
      console.log('All Flashcards:', flashcards);
      const filtered = flashcards.filter(card => {
        const cardCategoryStr = String(card.category_id);
        const selectedCategoryStr = String(selectedCategory);
        console.log('Comparing card:', {
          cardCategoryId: cardCategoryStr,
          selectedCategory: selectedCategoryStr,
          matches: cardCategoryStr === selectedCategoryStr,
          hasImage: !!card.urlCode
        });
        return cardCategoryStr === selectedCategoryStr;
      });
      console.log('Filtered Flashcards:', filtered);
      setFilteredFlashcards(filtered);
    }
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [selectedCategory, flashcards]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredFlashcards.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredFlashcards.length) % filteredFlashcards.length);
    setShowAnswer(false);
  };

  const getCategoryLabel = (categoryId: string) => {
    console.log('Getting label for category:', {
      categoryId,
      type: typeof categoryId,
      availableCategories: categories.map(c => ({ id: c.id, label: c.label }))
    });
    const category = categories.find(cat => String(cat.id) === String(categoryId));
    console.log('Found category:', category);
    return category ? category.label : 'Unknown';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <ScrollView horizontal style={styles.categoryContainer} showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText,
              { fontSize: fontSize - 2 }
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredFlashcards.length > 0 ? (
        <>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowAnswer(!showAnswer)}
              activeOpacity={0.9}
            >
              {filteredFlashcards[currentIndex].urlCode && (
                <Image
                  source={{ uri: filteredFlashcards[currentIndex].urlCode }}
                  style={styles.image}
                  resizeMode="contain"
                  onError={(error) => console.log('Image loading error:', error.nativeEvent)}
                  onLoad={() => console.log('Image loaded successfully:', filteredFlashcards[currentIndex].urlCode)}
                />
              )}
              <Text style={[styles.categoryLabel, { fontSize: fontSize - 4 }]}>
                {getCategoryLabel(filteredFlashcards[currentIndex].category_id)}
              </Text>
              <Text style={[styles.text, { fontSize }]}>
                {showAnswer ? filteredFlashcards[currentIndex].answer : filteredFlashcards[currentIndex].question}
              </Text>
              {!showAnswer && (
                <Text style={[styles.tapPrompt, { fontSize: fontSize - 4 }]}>
                  Tap to see answer
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePrevious} style={styles.navigationButton}>
              <Text style={[styles.buttonText, { fontSize }]}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.navigationButton}>
              <Text style={[styles.buttonText, { fontSize }]}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noCardsContainer}>
          <Text style={[styles.noCardsText, { fontSize }]}>No flashcards available for this category</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7F1C3E',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 20,
  },
  navigationButton: {
    backgroundColor: '#00679A',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 140,
    marginBottom: 5,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryContainer: {
    maxHeight: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedCategory: {
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    color: '#FFFFFF',
  },
  selectedCategoryText: {
    color: '#7F1C3E',
  },
  categoryLabel: {
    color: '#00679A',
    marginBottom: 8,
    textAlign: 'center',
  },
  tapPrompt: {
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCardsText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default FlashcardPage;
