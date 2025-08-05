import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  Image,
  Animated,
} from "react-native";
import OfferStrip from "../offerStrip/index.jsx";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { isMobile } from "../../utils/index.js";
import { useNavigation } from '@react-navigation/native';
import Store from "../../store/index.js";
import { getAllCategories } from '../../apis/index.js';

const Header = (props) => {
  const navigation = useNavigation();

  // State for Men & Women dropdown visibility
  const [menDropdownVisible, setMenDropdownVisible] = useState(false);
  const [womenDropdownVisible, setWomenDropdownVisible] = useState(false);
  const [saleDropdownVisible, setSaleDropdownVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Animated values for smooth transitions
  const menDropdownAnimation = useRef(new Animated.Value(0)).current;
  const womenDropdownAnimation = useRef(new Animated.Value(0)).current;
  const saleDropdownAnimation = useRef(new Animated.Value(0)).current;
  const profileDropdownAnimation = useRef(new Animated.Value(0)).current;

  // Used to handle hover states correctly
  const [isHoveringMenLink, setIsHoveringMenLink] = useState(false);
  const [isHoveringMenDropdown, setIsHoveringMenDropdown] = useState(false);
  const [isHoveringWomenLink, setIsHoveringWomenLink] = useState(false);
  const [isHoveringWomenDropdown, setIsHoveringWomenDropdown] = useState(false);
  const [isHoveringSaleLink, setIsHoveringSaleLink] = useState(false);
  const [isHoveringSaleDropdown, setIsHoveringSaleDropdown] = useState(false);
  const [isHoveringProfileLink, setIsHoveringProfileLink] = useState(false);
  const [isHoveringProfileDropdown, setIsHoveringProfileDropdown] = useState(false);

  // Animation configuration
  const animationConfig = {
    duration: 200,
    useNativeDriver: false,
  };

  // Animate dropdown show/hide
  const animateDropdown = (animatedValue, show) => {
    Animated.timing(animatedValue, {
      toValue: show ? 1 : 0,
      ...animationConfig,
    }).start();
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const allCategoriesData = await getAllCategories();

        if (allCategoriesData && allCategoriesData.success) {
          const data = allCategoriesData.categories;
          let categoriesObj = {};

          data.forEach((item) => {
            categoriesObj[item.name] = {
              id: item._id,
              categoryImage: item.image,
              category: item.name,
            }
          });

          setCategories(categoriesObj);
        }
      } catch (err) {
        console.log("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Effect to manage men dropdown visibility
  useEffect(() => {
    const shouldShow = isHoveringMenLink || isHoveringMenDropdown;
    
    if (shouldShow && !menDropdownVisible) {
      setMenDropdownVisible(true);
      setWomenDropdownVisible(false);
      setSaleDropdownVisible(false);
      setProfileDropdownVisible(false);
      
      // Hide other dropdowns immediately
      animateDropdown(womenDropdownAnimation, false);
      animateDropdown(saleDropdownAnimation, false);
      animateDropdown(profileDropdownAnimation, false);
      
      // Show men dropdown
      animateDropdown(menDropdownAnimation, true);
    } else if (!shouldShow && menDropdownVisible) {
      const timer = setTimeout(() => {
        animateDropdown(menDropdownAnimation, false);
        setTimeout(() => setMenDropdownVisible(false), animationConfig.duration);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isHoveringMenLink, isHoveringMenDropdown, menDropdownVisible]);

  // Effect to manage women dropdown visibility
  useEffect(() => {
    const shouldShow = isHoveringWomenLink || isHoveringWomenDropdown;
    
    if (shouldShow && !womenDropdownVisible) {
      setWomenDropdownVisible(true);
      setMenDropdownVisible(false);
      setSaleDropdownVisible(false);
      setProfileDropdownVisible(false);
      
      // Hide other dropdowns immediately
      animateDropdown(menDropdownAnimation, false);
      animateDropdown(saleDropdownAnimation, false);
      animateDropdown(profileDropdownAnimation, false);
      
      // Show women dropdown
      animateDropdown(womenDropdownAnimation, true);
    } else if (!shouldShow && womenDropdownVisible) {
      const timer = setTimeout(() => {
        animateDropdown(womenDropdownAnimation, false);
        setTimeout(() => setWomenDropdownVisible(false), animationConfig.duration);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isHoveringWomenLink, isHoveringWomenDropdown, womenDropdownVisible]);

  // Effect to manage sale dropdown visibility
  useEffect(() => {
    const shouldShow = isHoveringSaleLink || isHoveringSaleDropdown;
    
    if (shouldShow && !saleDropdownVisible) {
      setSaleDropdownVisible(true);
      setMenDropdownVisible(false);
      setWomenDropdownVisible(false);
      setProfileDropdownVisible(false);
      
      // Hide other dropdowns immediately
      animateDropdown(menDropdownAnimation, false);
      animateDropdown(womenDropdownAnimation, false);
      animateDropdown(profileDropdownAnimation, false);
      
      // Show sale dropdown
      animateDropdown(saleDropdownAnimation, true);
    } else if (!shouldShow && saleDropdownVisible) {
      const timer = setTimeout(() => {
        animateDropdown(saleDropdownAnimation, false);
        setTimeout(() => setSaleDropdownVisible(false), animationConfig.duration);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isHoveringSaleLink, isHoveringSaleDropdown, saleDropdownVisible]);

  // Effect to manage profile dropdown visibility
  useEffect(() => {
    const shouldShow = isHoveringProfileLink || isHoveringProfileDropdown;
    
    if (shouldShow && !profileDropdownVisible) {
      setProfileDropdownVisible(true);
      setMenDropdownVisible(false);
      setWomenDropdownVisible(false);
      setSaleDropdownVisible(false);
      
      // Hide other dropdowns immediately
      animateDropdown(menDropdownAnimation, false);
      animateDropdown(womenDropdownAnimation, false);
      animateDropdown(saleDropdownAnimation, false);
      
      // Show profile dropdown
      animateDropdown(profileDropdownAnimation, true);
    } else if (!shouldShow && profileDropdownVisible) {
      const timer = setTimeout(() => {
        animateDropdown(profileDropdownAnimation, false);
        setTimeout(() => setProfileDropdownVisible(false), animationConfig.duration);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isHoveringProfileLink, isHoveringProfileDropdown, profileDropdownVisible]);

  // Handle navigation to shop categories
  const navigateToCategory = (categoryType) => {
    // Determine which category to use based on categoryType
    const categoryKey = categoryType === "men" ? "mens" : categoryType === "women" ? "womens" : "sale";
    const category = categories[categoryKey];

    console.log("Navigating to:", categoryKey, category);

    if (category || categoryType === "sale") {
      // Force navigation with key to ensure screen refreshes
      navigation.navigate("ShopCategories", {
        categorie: category || { category: "sale" },
        key: Date.now() // Add a unique key to force refresh
      });
    } else {
      // Fallback if category not loaded yet
      navigation.navigate("ShopCategories", {
        category: categoryKey,
        key: Date.now() // Add a unique key to force refresh
      });
    }

    // Close dropdowns
    setMenDropdownVisible(false);
    setWomenDropdownVisible(false);
    setSaleDropdownVisible(false);
    setProfileDropdownVisible(false);
  };

  // Handle profile navigation
  const navigateToProfile = (section) => {
    // Close dropdown first
    setProfileDropdownVisible(false);

    // Navigate based on section
    switch (section) {
      case 'profile':
        navigation.navigate("ProfileScreen");
        break;
      case 'orders':
        navigation.navigate("OrderHistory");
        break;
      case 'cart':
        navigation.navigate("Cart");
        break;
      case 'wishlist':
        navigation.navigate("WishList");
        break;
      case 'address':
        navigation.navigate("Address");
        break;
      case 'settings':
        navigation.navigate("Settings");
        break;
      case 'logout':
        // Handle logout logic here
        navigation.navigate("App", { screen: "Login" });
        break;
      default:
        navigation.navigate("App", { screen: "Login" });
    }
  };

  // Dropdown items with animation
  const renderDropdown = (category, animatedValue) => {
    const animatedStyle = {
      opacity: animatedValue,
      transform: [
        {
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0],
          }),
        },
        {
          scaleY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    };

    return (
      <Animated.View
        style={[
          styles.dropdown,
          animatedStyle,
          category === "men" ? styles.menDropdown :
            category === "women" ? styles.womenDropdown :
              styles.saleDropdown
        ]}
        onMouseEnter={() => {
          if (category === "men") setIsHoveringMenDropdown(true);
          else if (category === "women") setIsHoveringWomenDropdown(true);
          else setIsHoveringSaleDropdown(true);
        }}
        onMouseLeave={() => {
          if (category === "men") setIsHoveringMenDropdown(false);
          else if (category === "women") setIsHoveringWomenDropdown(false);
          else setIsHoveringSaleDropdown(false);
        }}
      >
        <TouchableOpacity onPress={() => navigateToCategory(category)}>
          <Text style={styles.dropdownItem}>
            {category === "men" ? "T-Shirts" :
              category === "women" ? "Tops" :
                "Men's Sale"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToCategory(category)}>
          <Text style={styles.dropdownItem}>
            {category === "men" ? "Pants" :
              category === "women" ? "Dresses" :
                "Women's Sale"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Profile dropdown with animation
  const renderProfileDropdown = () => {
    const animatedStyle = {
      opacity: profileDropdownAnimation,
      transform: [
        {
          translateY: profileDropdownAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0],
          }),
        },
        {
          scaleY: profileDropdownAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    };

    return (
      <Animated.View
        style={[styles.profileDropdown, animatedStyle]}
        onMouseEnter={() => setIsHoveringProfileDropdown(true)}
        onMouseLeave={() => setIsHoveringProfileDropdown(false)}
      >
        <TouchableOpacity style={styles.profileDropdownItem} onPress={() => navigateToProfile('profile')}>
          <AntDesign name="user" size={16} color="#333" style={styles.profileIcon} />
          <Text style={styles.profileDropdownText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileDropdownItem} onPress={() => navigateToProfile('orders')}>
          <AntDesign name="filetext1" size={16} color="#333" style={styles.profileIcon} />
          <Text style={styles.profileDropdownText}>Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileDropdownItem} onPress={() => navigateToProfile('logout')}>
          <AntDesign name="logout" size={16} color="#333" style={styles.profileIcon} />
          <Text style={styles.profileDropdownText}>Log-out</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <OfferStrip />
      <View style={styles.subContainer}>
        <View style={styles.leftSubContainer}>
          {isMobile() && (
            <View style={styles.paddingContainer}>
              <Image source={require("../../../assets/images/Venusa_logo1.jpg")} style={{ width: 50, height: 50, alignSelf: 'flex-start' }} />
            </View>
          )}

          {/* MEN Dropdown */}
          {!isMobile() && (
            <View style={styles.paddingContainer}>
              <Pressable
                onPress={() => navigateToCategory("men")}
                onMouseEnter={() => setIsHoveringMenLink(true)}
                onMouseLeave={() => setIsHoveringMenLink(false)}
              >
                <Text style={styles.text}>Men</Text>
              </Pressable>
              {menDropdownVisible && renderDropdown("men", menDropdownAnimation)}
            </View>
          )}

          {/* WOMEN Dropdown */}
          {!isMobile() && (
            <View style={styles.paddingContainer}>
              <Pressable
                onPress={() => navigateToCategory("women")}
                onMouseEnter={() => setIsHoveringWomenLink(true)}
                onMouseLeave={() => setIsHoveringWomenLink(false)}
              >
                <Text style={styles.text}>Women</Text>
              </Pressable>
              {womenDropdownVisible && renderDropdown("women", womenDropdownAnimation)}
            </View>
          )}

          {/* SALE Dropdown */}
          {!isMobile() && (
            <View style={styles.paddingContainer}>
              <Pressable
                onPress={() => navigateToCategory("sale")}
                onMouseEnter={() => setIsHoveringSaleLink(true)}
                onMouseLeave={() => setIsHoveringSaleLink(false)}
              >
                <Text style={[styles.text, styles.saleText]}>Sale</Text>
              </Pressable>
              {saleDropdownVisible && renderDropdown("sale", saleDropdownAnimation)}
            </View>
          )}

        </View>

        {!isMobile() && (
          <View style={{ width: "33%", justifyContent: 'center', alignItems: 'center' }}>
            <Text
              onPress={() => {
                navigation.navigate("App", { screen: "Dashboard" });
              }}
              style={{
                fontFamily: "LexendZetta",
                fontWeight: "500",
                fontSize: 24,
              }}
            >
              VENUSA
            </Text>
          </View>
        )}

        <View style={[styles.rightSubContainer, {
          width: isMobile() ? "100%" : "33%",
          paddingRight: isMobile() ? 120 : 0
        }]}>
          <View style={[styles.paddingContainer, { width: isMobile() ? "auto" : "15%", marginRight: isMobile() ? 30 : 10 }]}>
            <TouchableOpacity onPress={() => navigation.navigate("WishList")}>
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={[styles.paddingContainer, { width: isMobile() ? "auto" : "15%" }]}>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <Feather name="shopping-bag" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {!isMobile() && (
            <View style={[styles.paddingContainer, { width: '15%' }]}>
              <Pressable
                onMouseEnter={() => setIsHoveringProfileLink(true)}
                onMouseLeave={() => setIsHoveringProfileLink(false)}
                onPress={() => navigation.navigate("App", { screen: "Login" })}
              >
                <AntDesign name="user" size={24} color="black" />
              </Pressable>
              {profileDropdownVisible && renderProfileDropdown()}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    position: "relative",
    zIndex: 1000,
  },
  subContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    justifyContent: isMobile() ? "flex-start" : "center",
    alignItems: "center",
    padding: 15,
  },
  leftSubContainer: {
    width: "33%",
    display: "flex",
    flexDirection: "row",
    justifyContent: isMobile() ? "flex-start" : "flex-start",
    alignItems: isMobile() ? "flex-start" : "flex-start",
  },
  rightSubContainer: {
    width: "33%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  paddingContainer: {
    width: isMobile() ? "30%" : "20%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
  },
  text: {
    fontWeight: "bold",
    fontFamily: "Jura",
    fontSize: 16
  },
  dropdown: {
    position: "absolute",
    top: 30,
    left: 0,
    zIndex: 999999,
    width: 250,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 999,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // Ensure dropdown appears above other content
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 999999,
      },
    }),
  },
  menDropdown: {
    // Add any specific styles for men dropdown if needed
  },
  womenDropdown: {
    // Add any specific styles for women dropdown if needed
  },
  saleDropdown: {
    // Add any specific styles for sale dropdown if needed
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "Jura",
    borderRadius: 4,
    marginVertical: 2,
  },
  saleText: {
    color: "#b42124",
  },
  profileDropdown: {
    position: "absolute",
    top: 35,
    right: 0,
    zIndex: 999999,
    width: 180,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 999,
    // Ensure dropdown appears above other content
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 999999,
      },
    }),
  },
  profileDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileIcon: {
    width: 20,
    marginRight: 12,
  },
  profileDropdownText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Jura",
  },
});

export default Header;