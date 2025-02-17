import React, { useState } from "react";
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
import FontAwesome from "@expo/vector-icons/FontAwesome";
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

  // Dropdown items
  const renderDropdown = (category) => (
    <View style={styles.dropdown}>
      <TouchableOpacity onPress={() => navigation.navigate("ShopCategories", { category })}>
        <Text style={styles.dropdownItem}>T-Shirts</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ShopCategories", { category })}>
        <Text style={styles.dropdownItem}>Jeans</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ShopCategories", { category })}>
        <Text style={styles.dropdownItem}>Shoes</Text>
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
              {/* <TouchableOpacity>
                <MaterialCommunityIcons
                  name="reorder-horizontal"
                  size={24}
                  color="black"
                />
              </TouchableOpacity> */}
              <Image source={require("../../../assets/images/Venusa_logo.jpg")} style={{width: 50, height: 50}} />
            </View>
          )}

          {/* MEN Dropdown */}
          {!isMobile() && (
            <View style={styles.paddingContainer}>
              <Pressable
                onPress={() => setMenDropdownVisible(!menDropdownVisible)} // Click for Mobile
                onMouseEnter={() => setMenDropdownVisible(true)}  // Hover for Web
                onMouseLeave={() => setMenDropdownVisible(false)}
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
                onPress={() => setWomenDropdownVisible(!womenDropdownVisible)}
                onMouseEnter={() =>  setWomenDropdownVisible(true)}
                onMouseLeave={() => setWomenDropdownVisible(false)}
              >
                <Text style={styles.text}>Women</Text>
              </Pressable>
              {womenDropdownVisible && renderDropdown("women")}
            </View>
          )}

          {/* {!isMobile() && (
            <View style={styles.paddingContainer}>
              <TouchableOpacity>
                <Text style={styles.text}>Sale</Text>
              </TouchableOpacity>
            </View>
          )} */}
        </View>

        {!isMobile() && (
          <Text
            onPress={() => {
              navigation.navigate("App", { screen: "Dashboard" });
            }}
            style={{
              fontFamily: "Roboto",
              fontWeight: "600",
              fontSize: 24,
            }}
          >
            VENUSA
          </Text>
        )}

        <View style={styles.rightSubContainer}>
          <View style={styles.paddingContainer}>
            <TouchableOpacity>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
    top: 30,
    left: 0,
    zIndex: 9999,
    width: 250,
    backgroundColor: "white",
    padding: 10,
    // borderRadius: 8,
    // elevation: 5, // Shadow for Android
    // shadowColor: "#000", // Shadow for iOS
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
});

export default Header;
