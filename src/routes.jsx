import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from "react-native";
import Login from "./screens/login";
import Dashboard from "./screens/dashboard";

const prefix = Linking.createURL('/'); // This uses your Expo project scheme

const Stack = createStackNavigator();

const linking = {
    prefixes: [
        prefix, 
        "http://localhost:8081", // For local testing
    ],
    config: {
        screens: {
            Dashboard: 'dashboard' // Ensure it matches the screen name
        }
    }
};

const Routes = () => {
    return (
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
            <Stack.Navigator initialRouteName="Dashboard">
                <Stack.Screen 
                    name="Dashboard" 
                    component={Dashboard} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;
