import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Button,
  StatusBar,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from "@expo/vector-icons/Ionicons";
import { Link } from 'expo-router';
import axios from "axios";

interface UserProfile {
  name: string;
  email?: string; // Make email optional
}

const DashboardApp = () => {
  const [activeSection, setActiveSection] = useState("Home");
    {/* Hide the status bar globally */}
    <StatusBar hidden={true} />

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <ProfileSection onBack={() => setActiveSection("Home")} />;
      case "Settings":
        return <SettingsSection />;
      // Add other cases here
      default:
        return <HomeSection />;
    }
  };
/* const handleBack = () => {
  navigation.goBack();
  }; */
  const renderBackButton = (onBack: () => void) => (
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-back" size={30} color="#ffffff" />
      <Text style={styles.backButtonText}>Back to Home</Text>
    </TouchableOpacity>
  );

  

  const HomeSection = () => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome BSMS Physiology!</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => setActiveSection("Profile")}
            style={styles.button}
          >
            <Icon name="person" size={30} color="white" />
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveSection("Settings")}
            style={styles.button}
          >
            <Icon name="settings" size={30} color="white" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const ProfileSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    //const navigation = useNavigation();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("https://placements.bsms.ac.uk/api/User/");
          const { name, email } = response.data;
          setUser({ name, email });
        } catch (err) {
          setError("Failed to load user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, []);

    if (loading) {
      return (
        <View style={styles.container}>
          {renderBackButton(onBack)}
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          {renderBackButton(onBack)}
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {renderBackButton(onBack)}
          <Text style={styles.headerTitle}>Profile Section</Text>
        </View>
        <View style={styles.contentContainer}>
          <Image
            source={{
              uri: "https://via.placeholder.com/120", // Placeholder for profile picture
            }}
            style={styles.profilePicture}
          />
          <Text style={styles.contentText}>Username: {user?.name || "N/A"}</Text>
          {user?.email && (
            <Text style={styles.contentText}>Email: {user.email}</Text>
          )}
          <Link href="/screens/EditProfileScreen" style={styles.button1}>
        <Text style={styles.buttonText}>Edit Profile</Text>
        </Link>
          {/* <Button title="Edit Profile" onPress={() => navigation.navigate("screens/EditProfileScreen")}
      /> */}
        </View>
      </View>
    );
  };

  const SettingsSection = () => (
    <View style={styles.container}>
     
      <View style={styles.headerContainer}>
        {renderBackButton(() => setActiveSection("Home"))}
        <Text style={styles.headerTitle}>Settings Section</Text>
      </View>
      <View style={styles.contentContainer}>
      <Icon name="settings" size={80} color="#3498db" />
        <Text style={styles.contentText}>Notifications: On</Text>
        <Text style={styles.contentText}>Theme: Light</Text>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#404040",
    },
    headerContainer: {
      backgroundColor: "#00679A",
      padding: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 5,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
      marginBottom: 20,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#404040",
      padding: 10,
      borderRadius: 5,
    },
    button1: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#00679A",
      padding: 10,
      borderRadius: 5,
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
    },
    contentText: {
      fontSize: 16,
      marginBottom: 10,
      color: "#FFFFFF",
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
    },
    backButtonText: {
      color: "#ffffff",
      fontSize: 16,
      marginLeft: 10,
    },
    errorText: {
      color: "red",
      fontSize: 16,
      marginTop: 20,
      textAlign: "center",
    },
  });

  return <View style={styles.container}>{renderSection()}</View>;
};

export default DashboardApp; 