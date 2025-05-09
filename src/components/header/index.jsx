import React, { useState, useEffect } from "react";
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
import { BlurView } from "expo-blur";
import OfferStrip from "../offerStrip/index.jsx";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { isMobile } from "../../utils/index.js";

const Header = (props) => {
  const navigation = useNavigation();
  const [menDropdownVisible, setMenDropdownVisible] = useState(false);
  const [womenDropdownVisible, setWomenDropdownVisible] = useState(false);
  const [isHoveringMenLink, setIsHoveringMenLink] = useState(false);
  const [isHoveringMenDropdown, setIsHoveringMenDropdown] = useState(false);
  const [isHoveringWomenLink, setIsHoveringWomenLink] = useState(false);
  const [isHoveringWomenDropdown, setIsHoveringWomenDropdown] = useState(false);

  const [menDropdownAnim] = useState(new Animated.Value(0));
  const [womenDropdownAnim] = useState(new Animated.Value(0));
  const mobile = isMobile();

  useEffect(() => {
    if (isHoveringMenLink || isHoveringMenDropdown) {
      setMenDropdownVisible(true);
      setWomenDropdownVisible(false);
    } else {
      const timer = setTimeout(() => setMenDropdownVisible(false), 50);
      return () => clearTimeout(timer);
    }
  }, [isHoveringMenLink, isHoveringMenDropdown]);

  useEffect(() => {
    if (isHoveringWomenLink || isHoveringWomenDropdown) {
      setWomenDropdownVisible(true);
      setMenDropdownVisible(false);
    } else {
      const timer = setTimeout(() => setWomenDropdownVisible(false), 50);
      return () => clearTimeout(timer);
    }
  }, [isHoveringWomenLink, isHoveringWomenDropdown]);

  useEffect(() => {
    Animated.timing(menDropdownAnim, {
      toValue: menDropdownVisible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [menDropdownVisible]);

  useEffect(() => {
    Animated.timing(womenDropdownAnim, {
      toValue: womenDropdownVisible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [womenDropdownVisible]);

  const renderDropdown = (category, animationValue) => {
    const items = category === "men"
      ? ["Shirts", "T-Shirts", "Oversized Tees", "Pants"]
      : ["Tops", "Dresses", "Pants", "Oversized Tees", "Blazer Tops"];
  
    return (
      <Animated.View
        style={[
          styles.dropdown,
          {
            opacity: animationValue,
            transform: [
              {
                translateY: animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          },
        ]}
        {...(Platform.OS === "web" && {
          onMouseEnter: () =>
            category === "men"
              ? setIsHoveringMenDropdown(true)
              : setIsHoveringWomenDropdown(true),
          onMouseLeave: () =>
            category === "men"
              ? setIsHoveringMenDropdown(false)
              : setIsHoveringWomenDropdown(false),
        })}
      >
        <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill} />
        {items.map((label, index) => (
          <HoverableDropdownItem
            key={index}
            label={label}
            onPress={() =>
              navigation.navigate("ShopCategories", { category })
            }
          />
        ))}
      </Animated.View>
    );
  };  

  return (
    <View style={styles.container}>
      <OfferStrip />
      <View style={styles.subContainer}>
        <View style={styles.leftSubContainer}>
          {mobile && (
            <View style={styles.paddingContainer}>
              <Image
                source={require("../../../assets/images/Venusa_logo1.jpg")}
                style={{ width: 50, height: 50 }}
              />
            </View>
          )}

          {!mobile && (
            <View style={styles.paddingContainer}>
              <Pressable
                onPress={() => {
                  setMenDropdownVisible(!menDropdownVisible);
                  setWomenDropdownVisible(false);
                }}
                {...(Platform.OS === "web" && {
                  onMouseEnter: () => setIsHoveringMenLink(true),
                  onMouseLeave: () => setIsHoveringMenLink(false),
                })}
              >
                <Text style={styles.text}>Men</Text>
              </Pressable>
              {renderDropdown("men", menDropdownAnim)}
            </View>
          )}

          {!mobile && (
            <View style={styles.paddingContainer}>
              <Pressable
                onPress={() => {
                  setWomenDropdownVisible(!womenDropdownVisible);
                  setMenDropdownVisible(false);
                }}
                {...(Platform.OS === "web" && {
                  onMouseEnter: () => setIsHoveringWomenLink(true),
                  onMouseLeave: () => setIsHoveringWomenLink(false),
                })}
              >
                <Text style={styles.text}>Women</Text>
              </Pressable>
              {renderDropdown("women", womenDropdownAnim)}
            </View>
          )}
        </View>

        {!mobile && (
          <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
            <Text
              onPress={() => navigation.navigate("App", { screen: "Dashboard" })}
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

        <View style={styles.rightSubContainer}>
          <View style={[styles.paddingContainer, { width: "15%" }]}>
            <TouchableOpacity onPress={() => navigation.navigate("WishList")}>
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={[styles.paddingContainer, { width: "15%" }]}>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <Feather name="shopping-bag" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {!mobile && (
            <View style={[styles.paddingContainer, { width: "15%" }]}>
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

const HoverableDropdownItem = ({ label, onPress }) => {
  const [hovered, setHovered] = useState(false);
  const scale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.spring(scale, {
      toValue: hovered ? 1.05 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [hovered]);

  return (
    <Animated.View
      style={[
        styles.dropdownItemWrapper,
        { transform: [{ scale }] },
      ]}
      {...(Platform.OS === "web" && {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      })}
    >
      <TouchableOpacity onPress={onPress}>
        <Text
          style={[
            styles.dropdownItem,
            hovered && styles.dropdownItemHovered,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    zIndex: 10,
  },
  subContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  leftSubContainer: {
    width: "33%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  rightSubContainer: {
    width: "33%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  paddingContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  text: {
    fontWeight: "bold",
    fontFamily: "Jura",
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 5,
    width: 160,
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
    zIndex: 120,
  },
  menDropdown: {},
  womenDropdown: {},
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  dropdownItemWrapper: {
    marginVertical: 2,
  },
  
  dropdownItem: {
    fontSize: 16,
    fontFamily: "jura",
    textAlign: "left",
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: "#000",
    transition: "all 0.3s ease-in-out",
    marginInlineStart: 8,
  },
  
  dropdownItemHovered: {
    textDecorationLine: "underline",
    
    textAlign: "left",
    fontWeight: "semibold",
  }
  
});

export default Header;
