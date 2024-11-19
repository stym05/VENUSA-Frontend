import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import Store from '../store/index.js';
import Header from '../components/header/index.jsx';

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
      <View style={styles(this.state.theme).container}>
        <Header />
        <Text>Dashboard khjgfd</Text>
      </View>
    )
  }
}


const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme == "dark" ? "gray": "#fff",
  }
});