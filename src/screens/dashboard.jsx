import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Store from '../store/index.js';
import Header from '../components/header/index.jsx';
import Footer from '../components/footer/index.jsx';

export default class Dashboard extends Component {

  constructor(props){
    super(props);

    let theme = Store.getState().settings.theme;

    this.state = {
      theme
    }
  }

  render() {
    return (
      <SafeAreaView style={styles(this.state.theme).container}>
        <Header />
        <ScrollView>
          <View style={styles(this.state.theme).subContainer}>

          </View>
          <Footer />
        </ScrollView>
      </SafeAreaView>
    )
  }
}


const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme == "dark" ? "gray": "#fff",
  },
  subContainer: {
    height: 800,
    backgroundColor: '#d0d0d0'
  }
});