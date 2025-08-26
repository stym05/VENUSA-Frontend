import 'react-native-gesture-handler';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

// App name should match your project
const appName = 'VENUSA';

// Check if we're running in a web environment
if (typeof window !== 'undefined' && Platform.OS === 'web') {
    // Web-specific registration
    AppRegistry.registerComponent(appName, () => App);
    AppRegistry.runApplication(appName, {
        initialProps: {},
        rootTag: document.getElementById('root') || document.getElementById('main')
    });
} else {
    // Mobile registration using registerRootComponent
    const { registerRootComponent } = require('expo');
    registerRootComponent(App);
}