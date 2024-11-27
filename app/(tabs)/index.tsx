import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import Icon from "@expo/vector-icons/Ionicons";

interface QuizResult {
  category: string;
  score: number;
  totalQuestions: number;
  date: string;
}

interface UserProfile {
  name: string;
  email?: string;
}

const DashboardApp = () => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    loadQuizResults();
  }, []);

  const loadQuizResults = async () => {
    try {
      const resultsString = await AsyncStorage.getItem('quizResults');
      if (resultsString) {
        const results = JSON.parse(resultsString);
        setQuizResults(results);
      }
    } catch (error) {
      console.error('Error loading quiz results:', error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <ProfileSection onBack={() => setActiveSection("Home")} />;
      case "Settings":
        return <SettingsSection onBack={() => setActiveSection("Home")} />;
      default:
        return <HomeSection />;
    }
  };

  const HomeSection = () => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>BSMS Physiology Quiz</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setActiveSection("Profile")}
          >
            <Icon name="person" size={24} color="#fff" />
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setActiveSection("Settings")}
          >
            <Icon name="settings" size={24} color="#fff" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.resultsContainer}>
        <View style={styles.contentContainer}>
          <Link href="/quiz/general" style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </Link>
        </View>

        <Text style={styles.resultsTitle}>Your Quiz Results</Text>
        {quizResults.length === 0 ? (
          <Text style={styles.noResults}>No quiz results yet. Take a quiz to see your results here!</Text>
        ) : (
          quizResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={styles.category}>{result.category}</Text>
              <Text style={styles.score}>
                Score: {result.score} / {result.totalQuestions}
              </Text>
              <Text style={styles.date}>
                {new Date(result.date).toLocaleDateString()}
              </Text>
              <Text style={styles.percentage}>
                {Math.round((result.score / result.totalQuestions) * 100)}% Correct
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const ProfileSection = ({ onBack }: { onBack: () => void }) => {
    const user: UserProfile = {
      name: "John Doe",
      email: "john@example.com"
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {renderBackButton(onBack)}
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.contentContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/120" }}
            style={styles.profilePicture}
          />
          <Text style={styles.contentText}>Name: {user.name}</Text>
          <Text style={styles.contentText}>Email: {user.email}</Text>
          <TouchableOpacity style={styles.button1}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SettingsSection = ({ onBack }: { onBack: () => void }) => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderBackButton(onBack)}
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon name="settings" size={80} color="#3498db" />
        <Text style={styles.contentText}>Notifications: On</Text>
        <Text style={styles.contentText}>Theme: Light</Text>
      </View>
    </View>
  );

  const renderBackButton = (onBack: () => void) => (
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color="#fff" />
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {renderSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: "#7F1C3E",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00679A",
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  button1: {
    backgroundColor: "#00679A",
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  startButton: {
    backgroundColor: '#00679A',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#7F1C3E',
    marginTop: 20,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  score: {
    fontSize: 16,
    color: '#7F1C3E',
    marginBottom: 4,
    fontWeight: '500',
  },
  date: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  percentage: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '500',
  },
});

export default DashboardApp;