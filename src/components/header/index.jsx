import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import OfferStrip from "../offerStrip/index.jsx";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { isMobile } from "../../utils/index.js";
import { useNavigation } from '@react-navigation/native';

const Header = (props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigation = useNavigation();

  const handleMouseEnter = (menu) => {
    if (Platform.OS === "web") {
      setDropdownVisible(true);
      setActiveDropdown(menu);
    }
  };

  const handleMouseLeave = () => {
    if (Platform.OS === "web") {
      setDropdownVisible(false);
      setActiveDropdown(null);
    }
  };

  const renderDropdown = (menu) => {
      return (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownItem}>Option 1</Text>
          <Text style={styles.dropdownItem}>Option 2</Text>
          <Text style={styles.dropdownItem}>Option 3</Text>
        </View>
      );
  };

  const handleProfileNavigation = () => {
    navigation.navigate("App", {
      screen: "Login",
      params: {},
    });
  };

  const handleWishListNavigation = () => {
    navigation.navigate("WishList");
  };
  const handleCartNavigation = () => {
    navigation.navigate("Cart");
  };
  return (
    <View style={styles.container}>
      <OfferStrip />
      <View style={styles.subContainer}>
        <View style={styles.leftSubContainer}>
          {isMobile() && (
            <View style={styles.paddingContainer}>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="reorder-horizontal"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}
          {!isMobile() && (
            <View
              style={styles.paddingContainer}
              onMouseEnter={() => handleMouseEnter("Women")}
              onMouseLeave={handleMouseLeave}
            >
              <TouchableOpacity>
                <Text style={styles.text}>Women</Text>
              </TouchableOpacity>
              {/* <Modal
                isVisible={dropdownVisible}
                onBackdropPress={handleMouseLeave}
                style={styles.modal}
              >
                <View style={styles.dropdown}>
                  <Text style={styles.dropdownItem}>Option 1</Text>
                  <Text style={styles.dropdownItem}>Option 2</Text>
                  <Text style={styles.dropdownItem}>Option 3</Text>
                </View>
              </Modal> */}
            </View>
          )}
          {!isMobile() && (
            <View
              style={styles.paddingContainer}
              onMouseEnter={() => handleMouseEnter("Men")}
              onMouseLeave={handleMouseLeave}
            >
              <TouchableOpacity>
                <Text style={styles.text}>Men</Text>
              </TouchableOpacity>
            </View>
          )}
          {!isMobile() && (
            <View style={styles.paddingContainer}>
              <TouchableOpacity>
                <Text style={styles.text}>Sale</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.rightSubContainer}>
          <View style={styles.paddingContainer}>
            <TouchableOpacity>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.paddingContainer}>
            <TouchableOpacity onPress={handleWishListNavigation}>
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.paddingContainer}>
            <TouchableOpacity onPress={handleCartNavigation}>
              <Feather name="shopping-bag" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {!isMobile() && (
            <View style={styles.paddingContainer}>
              <TouchableOpacity onPress={handleProfileNavigation}>
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
  },
  text: {
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 400
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
  }
});

export default Header;
