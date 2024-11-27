import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  
  const handleStartQuiz = () => {
    router.push({
      pathname: '/quiz/[category]',
      params: { category: id }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')}</Text>
      
      <Pressable 
        style={styles.button} 
        onPress={handleStartQuiz}
      >
        <Text style={styles.buttonText}>Start Quiz</Text>
      </Pressable>
      {/* Add your category content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#7F1C3E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
