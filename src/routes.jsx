import React from "react";
import { Dimensions, Platform, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
                    Dashboard: "/",
                    Login: "/login"
                },
            },
        },
    },
};

// Navigation Objects
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
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
            <Tab.Screen
                name="Login"
                component={Login}
                options={{ tabBarLabel: "Login" }}
            />
        </Tab.Navigator>
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
