import { StyleSheet, Text, View } from 'react-native';
import Store from './src/store';
import { Provider } from 'react-redux';
import Routes from './src/routes';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Toast from 'react-native-toast-message';


export default function App() {

  const [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
    'Didot': require('./assets/fonts/GFSDidot-Regular.ttf'),
    "Jura": require("./assets/fonts/Jura-Regular.ttf"),
    "LexendZetta": require("./assets/fonts/LexendZetta-Regular.ttf")
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <Provider store={Store}>
      <Routes />
      <Toast />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
