// src/screens/EditProfileScreen.tsx
import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFontSize } from '../../context/FontSizeContext';

interface UserData {
  name: string;
  email: string;
}

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { fontSize } = useFontSize();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData) as UserData;
        setName(parsed.name || "");
        setEmail(parsed.email || "");
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveProfile = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }

      if (email.trim() && !validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      const userData: UserData = {
        name: name.trim(),
        email: email.trim(),
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      Alert.alert('Success', 'Profile saved successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleEmailChange = (text: string) => {
    setError("");
    setEmail(text);
  };

  return (
    <View style={styles.container}>  
      <StatusBar hidden={true} />
      <View style={styles.headerContainer}>
        <Text style={[styles.whiteText, { fontSize: fontSize + 4 }]}>Edit Profile</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.label, { fontSize }]}>Name</Text>
        <TextInput 
          style={[styles.input, { fontSize }]} 
          value={name} 
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          maxLength={50}
        />

        <Text style={[styles.label, { fontSize }]}>Email</Text>
        <TextInput 
          style={[styles.input, { fontSize }]} 
          value={email} 
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={100}
        />
        {error ? <Text style={[styles.errorText, { fontSize: Math.max(fontSize - 2, 12) }]}>{error}</Text> : null}

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={[styles.saveButtonText, { fontSize }]}>Save Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={[styles.cancelButtonText, { fontSize }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7F1C3E",
  },
  formContainer: {
    padding: 20,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#00679A",
    alignItems: "center",
  },
  whiteText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#00679A',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
