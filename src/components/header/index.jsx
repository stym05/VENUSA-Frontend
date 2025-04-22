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

const Header = (props) => {
  const navigation = useNavigation();

  // State for Men & Women dropdown visibility
  const [menDropdownVisible, setMenDropdownVisible] = useState(false);
  const [womenDropdownVisible, setWomenDropdownVisible] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Used to handle hover states correctly
  const [isHoveringMenLink, setIsHoveringMenLink] = useState(false);
  const [isHoveringMenDropdown, setIsHoveringMenDropdown] = useState(false);
  const [isHoveringWomenLink, setIsHoveringWomenLink] = useState(false);
  const [isHoveringWomenDropdown, setIsHoveringWomenDropdown] = useState(false);

  // Effect to manage men dropdown visibility
  useEffect(() => {
    if (isHoveringMenLink || isHoveringMenDropdown) {
      setMenDropdownVisible(true);
      setWomenDropdownVisible(false);
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
    } else {
      const timer = setTimeout(() => {
        setWomenDropdownVisible(false);
      }, 50); // Small delay to prevent flickering
      return () => clearTimeout(timer);
    }
  }, [isHoveringWomenLink, isHoveringWomenDropdown]);

  // Dropdown items
  const renderDropdown = (category) => (
    <View
      style={[styles.dropdown, category === "men" ? styles.menDropdown : styles.womenDropdown]}
      onMouseEnter={() => category === "men" ? setIsHoveringMenDropdown(true) : setIsHoveringWomenDropdown(true)}
      onMouseLeave={() => category === "men" ? setIsHoveringMenDropdown(false) : setIsHoveringWomenDropdown(false)}
    >
      <TouchableOpacity onPress={() => navigation.navigate("ShopCategories", { category })}>
        <Text style={styles.dropdownItem}>{category === "men" ? "T-Shirts" : "Tops"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ShopCategories", { category })}>
        <Text style={styles.dropdownItem}>{category === "men" ? "Pants" : "Dresses"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ShopCategories", { category })}>
        <Text style={styles.dropdownItem}>{category === "men" ? "Jogger" : "bottom"}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { height: menDropdownVisible || womenDropdownVisible || showSearchBar ? 250 : null }]}>
      <OfferStrip />
      <View style={styles.subContainer}>
        <View style={styles.leftSubContainer}>
          {isMobile() && (
            <View style={styles.paddingContainer}>
              <Image source={require("../../../assets/images/Venusa_logo1.jpg")} style={{ width: 50, height: 50 }} />
            </View>
          )}

          {/* MEN Dropdown */}
          {!isMobile() && (
            <View style={styles.paddingContainer}>
              <Pressable
                onPress={() => {
                  setMenDropdownVisible(!menDropdownVisible);
                  setWomenDropdownVisible(false);
                }}
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
                onPress={() => {
                  setWomenDropdownVisible(!womenDropdownVisible);
                  setMenDropdownVisible(false);
                }}
                onMouseEnter={() => setIsHoveringWomenLink(true)}
                onMouseLeave={() => setIsHoveringWomenLink(false)}
              >
                <Text style={styles.text}>Women</Text>
              </Pressable>
              {womenDropdownVisible && renderDropdown("women")}
            </View>
          )}
        </View>

        {!isMobile() && (
          <Text
            onPress={() => {
              navigation.navigate("App", { screen: "Dashboard" });
            }}
            style={{
              fontFamily: "lexend Zetta",
              fontWeight: "500",
              fontSize: 24,
            }}
          >
            VENUSA
          </Text>
        )}

        <View style={styles.rightSubContainer}>
          <View style={styles.paddingContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("WishList")}>
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.paddingContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <Feather name="shopping-bag" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {!isMobile() && (
            <View style={styles.paddingContainer}>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  leftSubContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: isMobile() ? "flex-start" : "center",
    alignItems: isMobile() ? "flex-start" : "center",
  },
  rightSubContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: isMobile() ? "flex-end" : "center",
    alignItems: isMobile() ? "flex-end" : "center",
  },
  paddingContainer: {
    width: isMobile() ? "30%" : "10%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
  },
  text: {
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 20,
    left: 0,
    zIndex: 9999,
    width: 250,
    backgroundColor: "white",
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  menDropdown: {
    // Add any specific styles for men dropdown if needed
  },
  womenDropdown: {
    // Add any specific styles for women dropdown if needed
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
});

export default Header;