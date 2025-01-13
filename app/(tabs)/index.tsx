import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Pressable } from 'react-native';
import { Link, usePathname } from 'expo-router';
import Icon from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFontSize } from '../../context/FontSizeContext';
import { useFontStyle } from '../../context/FontStyleContext';
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
          width={350} 
          height={350} 
          style={styles.dashboardImage}
        />
        <View style={styles.buttonContainer}>
        <Text style={[styles.headerTitle, { fontSize, marginTop: 1 }]}>Learn Physiology with BSMS</Text>
        </View>
      </View>
    </View>
  );

  const ProfileSection = ({ onBack }: { onBack: () => void }) => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
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
        <TouchableOpacity style={[styles.button1, { marginTop: 10 }]} onPress={onBack}>
          <Text style={[styles.buttonText, { fontSize }]}>Return</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const SettingsSection = ({ onBack }: { onBack: () => void }) => {
    const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();
    const { fontStyle, setFontStyle, availableFontStyles } = useFontStyle();

    // Create an array of font style options for the picker
    const fontStyleOptions = Object.entries(availableFontStyles)
      .filter(([key]) => key !== 'default')
      .map(([key, value]) => ({ 
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim(), 
        value 
      }));

    const [modalVisible, setModalVisible] = useState(false);

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { fontSize }]}>Settings</Text>
        </View>
        
        <View style={styles.settingsContainer}>
          {/* Font Size Controls */}
          <Text style={[styles.settingTitle, { fontSize }]}>Font Size</Text>
          <Text style={styles.settingDescription}>Adjust the text size for better readability</Text>
          
          <View style={styles.fontSizeControls}>
            <TouchableOpacity 
              style={styles.fontSizeButton} 
              onPress={decreaseFontSize}
            >
              <Text style={styles.fontSizeButtonText}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.fontSizeDisplay}>
              <Text style={[styles.fontSizeText, { fontSize }]}>{fontSize}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.fontSizeButton} 
              onPress={increaseFontSize}
            >
              <Text style={styles.fontSizeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetFontSize}
          >
            <Text style={styles.resetButtonText}>Reset Font Size</Text>
          </TouchableOpacity>

          {/* Font Style Selection */}
          <View style={styles.fontStyleSection}>
            <Text style={[styles.settingTitle, { fontSize }]}>Font Style</Text>
            <Text style={styles.settingDescription}>Choose your preferred font</Text>
            
            <TouchableOpacity 
              style={styles.pickerContainer} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.picker}>{fontStyle}</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <ScrollView>
                  {fontStyleOptions.map((option) => (
                    <Pressable 
                      key={option.value} 
                      style={styles.modalOption} 
                      onPress={() => {
                        setFontStyle(option.value);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalOptionText}>{option.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </Modal>
          </View>

          <TouchableOpacity style={[styles.button1, { marginTop: 20 }]} onPress={onBack}>
            <Text style={[styles.buttonText, { fontSize }]}>Return</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {renderSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#404040',
  },
  headerContainer: {
    backgroundColor: "#00679A",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
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
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: 'center',
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
    marginVertical: 30,
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
  fontStyleSection: {
    marginTop: 30,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    padding: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 16,
  },
});

export default DashboardApp;