import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, StatusBar, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { useFontSize } from '@/context/FontSizeContext';

interface Flashcard {
  question: string;
  answer: string;
  image?: string;
  urlCode?: string;
  category_id: string;
}

const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const isImageUrl = (url: string) => {
  if (!url) return false;
  // Check if it's not a video URL
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('panopto')) {
    return false;
  }
  // Check if it's an image URL
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null || url.includes('/storage/');
};

const FlashcardPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const { fontSize } = useFontSize();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('https://placements.bsms.ac.uk/api/physquiz');
        console.log('Raw API Response:', response.data);
        
        const flashcardsData = response.data
          .filter(item => {
            console.log('Checking item:', {
              category_id: item.category_id,
              urlCode: item.urlCode,
              isYouTube: item.urlCode ? isYouTubeUrl(item.urlCode) : false
            });
            return String(item.category_id) === '55';
          })
          .map(item => ({
            question: item.question,
            answer: item.answer,
            image: item.image,
            urlCode: item.urlCode,
            category_id: item.category_id
          }));
          
        console.log('Filtered Flashcards:', flashcardsData);
        setFlashcards(flashcardsData);
        setCurrentIndex(0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  useEffect(() => {
    if (flashcards.length > 0 && currentIndex >= flashcards.length) {
      setCurrentIndex(0);
    }
  }, [flashcards, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
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
      
      {flashcards.length > 0 ? (
        <>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowAnswer(!showAnswer)}
              activeOpacity={0.9}
            >
              {flashcards[currentIndex] && (
                <>
                  {flashcards[currentIndex].urlCode && isImageUrl(flashcards[currentIndex].urlCode) && (
                    <Image
                      source={{ uri: flashcards[currentIndex].urlCode }}
                      style={styles.image}
                      resizeMode="contain"
                      onError={(error) => console.log('Image loading error:', error.nativeEvent)}
                      onLoad={() => console.log('Image loaded successfully:', flashcards[currentIndex].urlCode)}
                    />
                  )}
                  <Text style={[styles.text, { fontSize }]}>
                    {flashcards[currentIndex] ? 
                      (showAnswer ? flashcards[currentIndex].answer : flashcards[currentIndex].question)
                      : 'Loading...'}
                  </Text>
                  {!showAnswer && (
                    <Text style={[styles.tapPrompt, { fontSize: fontSize - 4 }]}>
                      Tap to see answer
                    </Text>
                  )}
                </>
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
          <Text style={[styles.noCardsText, { fontSize }]}>No flash cards available</Text>
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
    backgroundColor: '#404040',
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
