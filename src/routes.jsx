import React from "react";
import { Dimensions, Platform, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import Login from "./screens/login";
import Dashboard from "./screens/dashboard";

// Get screen dimensions for responsiveness
const dimensions = Dimensions.get("window");

// Linking Configuration
const prefix = Linking.createURL("/");
const linking = {
    prefixes: [
        prefix,
        "http://localhost:8081", // For local testing
    ],
    config: {
        screens: {
            App: {
                screens: {
                    Dashboard: "dashboard",
                },
            },
        },
    },
};

// Navigation Objects
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ tabBarLabel: "Dashboard" }}
            />
        </Tab.Navigator>
    );
};

// Drawer Navigator
const App = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <Text style={{ padding: 16 }}>Custom Drawer Content (Optional)</Text>
            )} // Replace with custom drawer content as needed
            screenOptions={{
                // drawerType: dimensions.width >= 1200 ? "permanent" : "front",
                // drawerPosition: "left",
                headerShown: Platform.OS == "web" ? false : true,
                // drawerStyle: {
                //     backgroundColor: "#fff",
                //     width: dimensions.width >= 1200 ? "15%" : "75%",
                // },
            }}
            openByDefault={false}
            initialRouteName="Home"
        >
            <Drawer.Screen name="Home" component={BottomTabNavigator} />
        </Drawer.Navigator>
    );
};

// Main Stack Navigator
const Routes = () => {
    return (
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
            <Stack.Navigator initialRouteName="App">
                <Stack.Screen
                    name="App"
                    component={App}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;
