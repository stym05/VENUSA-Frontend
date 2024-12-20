import React from "react";
import { Dimensions, Platform, SafeAreaView, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import Login from "./screens/login";
import Dashboard from "./screens/dashboard";
import { isMobile } from "./utils";
import ItemSection from "./screens/ItemSection";
import Header from "./components/header";
import ItemDescription from "./screens/ItemSection/ItemDescription";

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
                    Login: "/login",
                    ItemSection: '/itemSections'
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
                options={{
                    tabBarLabel: "Dashboard", tabBarStyle: {
                        display: isMobile() ? undefined : 'none', // Hides the bottom tab navigation
                    },
                }}
            />
            <Tab.Screen
                name="Login"
                component={Login}
                options={{
                    tabBarLabel: "Login", tabBarStyle: {
                        display: isMobile() ? undefined : 'none', // Hides the bottom tab navigation
                    },
                }}
            />
        </Tab.Navigator>
    );
};

// Main Stack Navigator
const Routes = () => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <Header props={this.props} />
            <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
                <Stack.Navigator initialRouteName="App">
                    <Stack.Screen
                        name="App"
                        component={App}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ItemSection"
                        component={ItemSection}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ItemDescription"
                        component={ItemDescription}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
};

export default Routes;
