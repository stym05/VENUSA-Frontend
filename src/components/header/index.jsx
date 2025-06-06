import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  Image,
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
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Used to handle hover states correctly
  const [isHoveringMenLink, setIsHoveringMenLink] = useState(false);
  const [isHoveringMenDropdown, setIsHoveringMenDropdown] = useState(false);
  const [isHoveringWomenLink, setIsHoveringWomenLink] = useState(false);
  const [isHoveringWomenDropdown, setIsHoveringWomenDropdown] = useState(false);
  const [isHoveringSaleLink, setIsHoveringSaleLink] = useState(false);
  const [isHoveringSaleDropdown, setIsHoveringSaleDropdown] = useState(false);

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
    if (isHoveringMenLink || isHoveringMenDropdown) {
      setMenDropdownVisible(true);
      setWomenDropdownVisible(false);
      setSaleDropdownVisible(false);
    } else {
      const timer = setTimeout(() => {
        setMenDropdownVisible(false);
      }, 50); // Small delay to prevent flickering
      return () => clearTimeout(timer);
    }
  }, [isHoveringMenLink, isHoveringMenDropdown]);

  // Effect to manage women dropdown visibility
  useEffect(() => {
    if (isHoveringWomenLink || isHoveringWomenDropdown) {
      setWomenDropdownVisible(true);
      setMenDropdownVisible(false);
      setSaleDropdownVisible(false);
    } else {
      const timer = setTimeout(() => {
        setWomenDropdownVisible(false);
      }, 50); // Small delay to prevent flickering
      return () => clearTimeout(timer);
    }
  }, [isHoveringWomenLink, isHoveringWomenDropdown]);

  // Effect to manage sale dropdown visibility
  useEffect(() => {
    if (isHoveringSaleLink || isHoveringSaleDropdown) {
      setSaleDropdownVisible(true);
      setMenDropdownVisible(false);
      setWomenDropdownVisible(false);
    } else {
      const timer = setTimeout(() => {
        setSaleDropdownVisible(false);
      }, 50); // Small delay to prevent flickering
      return () => clearTimeout(timer);
    }
  }, [isHoveringSaleLink, isHoveringSaleDropdown]);

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
  };

  // Dropdown items
  const renderDropdown = (category) => (
    <View
      style={[
        styles.dropdown,
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
    </View>
  );

  return (
    <View style={[styles.container, { height: menDropdownVisible || womenDropdownVisible || saleDropdownVisible || showSearchBar ? 200 : null }]}>
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
              {menDropdownVisible && renderDropdown("men")}
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
              {womenDropdownVisible && renderDropdown("women")}
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
              {saleDropdownVisible && renderDropdown("sale")}
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
              <TouchableOpacity onPress={() => navigation.navigate("App", { screen: "Login" })}>
                <AntDesign name="user" size={24} color="black" />
              </TouchableOpacity>
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
    top: 20,
    left: 0,
    zIndex: 9999,
    width: 250,
    backgroundColor: "#fff",
    padding: 10,
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
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  saleText: {
    color: "#b42124",
  },
});

export default Header;