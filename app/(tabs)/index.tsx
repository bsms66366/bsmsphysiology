import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link, usePathname } from 'expo-router';
import Icon from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFontSize } from '../../context/FontSizeContext';

import PhysiologyLogo from '../../assets/images/physiologyLogo.svg';

interface UserProfile {
  name: string;
  email?: string;
}

const DashboardApp = () => {
  const [activeSection, setActiveSection] = useState("Home");
  const [user, setUser] = useState<UserProfile>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const { fontSize } = useFontSize();

  const loadUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUser(parsedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setIsLoading(false);
    }
  };

  // Load profile data when component mounts and when pathname changes
  useEffect(() => {
    loadUserProfile();
  }, [pathname]);

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
        <Text style={[styles.headerTitle, { fontSize, marginTop: 10 }]}>BSMS Physiology</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setActiveSection("Profile")}
          >
            <Icon name="person" size={24} color="#fff" />
            <Text style={[styles.buttonText, { fontSize: Math.max(fontSize - 2, 12) }]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setActiveSection("Settings")}
          >
            <Icon name="settings" size={24} color="#fff" />
            <Text style={[styles.buttonText, { fontSize: Math.max(fontSize - 2, 12) }]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <PhysiologyLogo 
          width={300} 
          height={300} 
          style={styles.dashboardImage}
        />
        <View style={styles.buttonContainer}>
          <Link href="/Topics" style={styles.navigationButton}>
            <Text style={[styles.buttonText, { fontSize }]}>Topics</Text>
          </Link>
          <Link href="/screens/FlashcardPage" style={[styles.navigationButton, { marginTop: 10 }]}>  
            <Text style={[styles.buttonText, { fontSize }]}>Flash Cards</Text>
          </Link>
        </View>
      </View>
    </View>
  );

  const ProfileSection = ({ onBack }: { onBack: () => void }) => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderBackButton(onBack)}
        <Text style={[styles.headerTitle, { fontSize }]}>Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/images/profile.png')}
          style={styles.profilePicture}
        />
        {isLoading ? (
          <Text style={[styles.contentText, { fontSize }]}>Loading...</Text>
        ) : (
          <>
            <Text style={[styles.contentText, { fontSize }]}>Name: {user.name || 'Not set'}</Text>
            <Text style={[styles.contentText, { fontSize }]}>Email: {user.email || 'Not set'}</Text>
          </>
        )}
        <TouchableOpacity style={styles.button1}>
          <Link href="/screens/EditProfileScreen" style={styles.navigationButton}>
            <Text style={[styles.buttonText, { fontSize }]}>Edit Profile</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );

  const SettingsSection = ({ onBack }: { onBack: () => void }) => {
    const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();
    
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {renderBackButton(onBack)}
          <Text style={[styles.headerTitle, { fontSize }]}>Settings</Text>
        </View>
        <View style={styles.settingsContainer}>
          <Text style={[styles.settingTitle, { fontSize }]}>Text Size</Text>
          <Text style={[styles.settingDescription, { fontSize: Math.max(fontSize - 2, 12) }]}>
            Adjust the text size for better readability
          </Text>
          
          <View style={styles.fontSizeControls}>
            <TouchableOpacity 
              style={styles.fontSizeButton} 
              onPress={decreaseFontSize}
            >
              <Text style={styles.fontSizeButtonText}>A-</Text>
            </TouchableOpacity>
            
            <View style={styles.fontSizeDisplay}>
              <Text style={[styles.fontSizeText, { fontSize }]}>{fontSize}px</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.fontSizeButton} 
              onPress={increaseFontSize}
            >
              <Text style={styles.fontSizeButtonText}>A+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetFontSize}
          >
            <Text style={[styles.resetButtonText, { fontSize: Math.max(fontSize - 2, 12) }]}>
              Reset to Default
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBackButton = (onBack: () => void) => (
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color="#fff" />
      <Text style={[styles.backButtonText, { fontSize: Math.max(fontSize - 2, 12) }]}>Back</Text>
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
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
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
  profileContainer: {
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
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginVertical: 15,
  },
  navigationButton: {
    backgroundColor: '#00679A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end', 
    marginTop: 10,
  },
  settingsContainer: {
    padding: 20,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingDescription: {
    color: '#ccc',
    marginBottom: 20,
  },
  fontSizeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fontSizeButton: {
    backgroundColor: '#00679A',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  fontSizeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fontSizeDisplay: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  fontSizeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DashboardApp;