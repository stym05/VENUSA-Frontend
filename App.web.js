import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// Create a web-specific component wrapper
const WebApp = () => {
    return <App />;
};

// Register for web
AppRegistry.registerComponent('VENUSA', () => WebApp);
// Auto-start the app
if (typeof window !== 'undefined') {
    AppRegistry.runApplication('VENUSA', {
        initialProps: {},
        rootTag: document.getElementById('root') || document.getElementById('main')
    });
}

export default WebApp;