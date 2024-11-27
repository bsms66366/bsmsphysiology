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
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from "@expo/vector-icons/Ionicons";
import { Link } from 'expo-router';
import axios from "axios";

interface UserProfile {
  name: string;
  email?: string;
}

interface Category {
  id: number;
  name: string;
}

const DashboardApp = ({ navigation }: { navigation: any }) => {
  const [activeSection, setActiveSection] = useState("Home");
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://placements.bsms.ac.uk/api/categories");
        console.log('Categories response:', response.data);
        setCategories(response.data);
        setFilteredCategories(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <ProfileSection onBack={() => setActiveSection("Home")} />;
      case "Settings":
        return <SettingsSection />;
      default:
        return <HomeSection />;
    }
  };

  const renderBackButton = (onBack: () => void) => (
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-back" size={30} color="#ffffff" />
      <Text style={styles.backButtonText}>Back to Home</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory?.id === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory?.id === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const HomeSection: React.FC = () => (
    <View style={styles.mainContainer}>
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

      <FlatList
        ListHeaderComponent={() => (
          <>
            <View style={styles.imageButtonContainer}>
              <Image
                source={require("@/assets/images/PinkLogo.png")}
                style={styles.image}
              />
            </View>
            
            {loadingCategories ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <View>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => {
                    setLoadingCategories(true);
                    setError(null);
                    fetchCategories();
                  }}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#666"
                />
              </View>
            )}
          </>
        )}
        ListFooterComponent={() => (
          selectedCategory && (
            <View style={styles.startButtonContainer}>
              <Link
                href={{
                  pathname: "/screens/QuizQuestions",
                  params: { categoryId: selectedCategory.id }
                }}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>
                  Start Quiz - {selectedCategory.name}
                </Text>
              </Link>
            </View>
          )
        )}
        data={loadingCategories || error ? [] : filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
      />
    </View>
  );

  const ProfileSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
    mainContainer: {
      flex: 1,
      backgroundColor: "#7F1C3E",
    },
    flatList: {
      flex: 1,
    },
    flatListContent: {
      paddingHorizontal: 15,
      paddingBottom: 40,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    headerContainer: {
      backgroundColor: "#00679A",
      padding: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      marginBottom: 10,
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
      backgroundColor: "#7F1C3E",
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
    image: {
    width: 200, // Adjust the size of the image as needed
    height: 200,
    marginTop: 20, // Add some space above the image
  },
  imageButtonContainer: {
    alignItems: 'center', // Center the image and button horizontally
    marginVertical: 15,
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
    retryButton: {
      backgroundColor: "#00679A",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    retryButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      paddingHorizontal: 10,
      marginHorizontal: 5,
      marginBottom: 15,
      marginTop: 10,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: '#333',
      fontSize: 16,
    },
    categoryItem: {
      flex: 1,
      margin: 5,
      padding: 15,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 60,
    },
    selectedCategoryItem: {
      backgroundColor: '#007AFF',
    },
    categoryText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
    },
    selectedCategoryText: {
      color: '#fff',
    },
    startButtonContainer: {
      paddingHorizontal: 5,
      paddingTop: 15,
      paddingBottom: 30,
    },
    startButton: {
      backgroundColor: '#00679A',
      padding: 15,
      borderRadius: 10,
    },
    startButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return <View style={styles.mainContainer}>{renderSection()}</View>;
};

export default DashboardApp;