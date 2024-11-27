import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import Icon from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  email?: string;
}

const DashboardApp = () => {
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    // Clear AsyncStorage
    AsyncStorage.clear();
  }, []);

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
        <Text style={styles.headerTitle}>BSMS Physiology</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setActiveSection("Profile")}
          >
            <Icon name="person" size={24} color="#fff" />
            <Text style={styles.buttonText}>Profile</Text>
            <View style={styles.buttonContainer}>
        </View>
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
      
      <View style={styles.contentContainer}>
        <Image
          source={require('../../assets/images/physiologyLogo.png')}
          style={styles.dashboardImage}
        />
        <View style={styles.buttonContainer}>
          <Link href="/Topics" style={styles.navigationButton}>
            <Text style={styles.buttonText}>Topics</Text>
          </Link>
        </View>
      </View>
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
            <Link href="/screens/EditProfileScreen" style={styles.navigationButton}>
          </Link>
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
        <Image
          source={require('../../assets/images/icon1.svg')}
          style={styles.dashboardImage}
        />
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
    backgroundColor: '#7F1C3E',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: "#00679A",
    //padding: 5,
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
  contentText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#fff",
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
  dashboardImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  navigationButton: {
    backgroundColor: '#00679A',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 200,
  },
});

export default DashboardApp;