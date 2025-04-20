import React, { Component } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Header from '../components/header';
import Store from '../store';
import Checkbox from 'expo-checkbox';
import { isMobile } from '../utils';
import Footer from '../components/footer';
import { getOTP, validateOTP } from '../apis';
import Toast from 'react-native-toast-message';
import { AUTH, AUTH_TOKEN, USER_DATA } from '../store/actions/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  constructor(props) {
    super(props);

    let theme = Store.getState().settings.theme;

    this.state = {
      theme,
      mobileNumber: "",
      otp: "",
      isChecked: false,
      isLoading: false,
      showOTP: false,
      userId: ""
    }
  }

  handleTextChange = (value) => {
    this.setState({ mobileNumber: value });
  };

  handleOTPChange = (value) => {
    this.setState({ otp: value });
  }

  setChecked = (value) => {
    this.setState({ isChecked: value })
  }

  handleLogin = async () => {
    if (!this.state.showOTP) {
      // for OTP genration
      this.setState({ isLoading: true })
      const payload = {
        phone_number: this.state.mobileNumber
      }
      const response = await getOTP(payload)
      if (response.success) {
        this.setState({ isLoading: false, userId: response.userId, showOTP: true });
        Toast.show({
          type: "success",
          text1: "OTP Sent Successfully"
        })
      } else {
        Toast.show({
          type: "error",
          text1: "something went wrong"
        })
      }
      this.setState({ isLoading: false })
    } else {
      this.setState({ isLoading: true })
      const payload = {
        userId: this.state.userId,
        otp: this.state.otp
      }
      const response = await validateOTP(payload);
      if (response.success) {
        this.setState({ isLoading: false, showOTP: true });
        Toast.show({
          type: "success",
          text1: "hii, welcome to venusa"
        })
        const jwt = response.authToken;

        // Store JWT token in AsyncStorage
        await AsyncStorage.setItem("jwt", jwt);
        console.log("Users Data is ", response)
        // Dispatch actions to Redux
        Store.dispatch({ type: AUTH, payload: true });
        Store.dispatch({ type: USER_DATA, payload: response.customer });
        Store.dispatch({ type: AUTH_TOKEN, payload: jwt });
        this.props.navigation.replace(this.state.from ? this.state.from : "Dashboard")
      } else {
        Toast.show({
          type: "error",
          text1: "something went wrong"
        })
      }
    }
  }

  render() {
    const { theme, mobileNumber, otp, isChecked, isLoading } = this.state;
    return (
      <SafeAreaView style={styles(theme).container}>
        <ScrollView style={styles(theme).subContainer}>
          <View style={styles(theme).mainContainer}>
            <Text style={styles(theme).header}>MY ACCOUNT</Text>
            <View style={{ marginTop: 50 }}>
              <View style={styles(theme).inputContainer}>
                <Text style={styles(theme).text}>Login using Mobile Number*</Text>
                <TextInput
                  style={styles(theme).input}
                  placeholder="+91-00000 0000"
                  placeholderTextColor={"#808080"}
                  value={mobileNumber}
                  keyboardType="numeric"
                  onChangeText={(value) => {
                    const cleanedValue = value.replace(/[^0-9]/g, '');
                    if (cleanedValue.length <= 10) {
                      this.handleTextChange(cleanedValue);
                    }
                  }}
                />
              </View>
              {this.state.showOTP && <View style={styles(theme).inputContainer}>
                <Text style={styles(theme).text}>Enter OTP*</Text>
                <TextInput
                  style={styles(theme).input}
                  placeholder="Enter OTP"
                  placeholderTextColor={"#808080"}
                  value={otp}
                  onChangeText={this.handleOTPChange}
                />
              </View>}
            </View>
            <View style={[styles(theme).row, { marginHorizontal: isMobile() ? 25 : 0 }]}>
              <Checkbox
                value={isChecked}
                onValueChange={this.setChecked}
                color={isChecked ? '#4630EB' : undefined}
              />
              <Text style={[styles(theme).text, { marginHorizontal: 5 }]}>Agree to receive communications related to order and promotional offers.</Text>
            </View>
            <View style={styles(theme).buttonContainer}>
              <TouchableOpacity style={styles(theme).button} onPress={this.handleLogin}>
                {isLoading ? (<ActivityIndicator size={"small"} color={"#fff"} />) : (<Text style={styles(theme).buttonText}>{this.state.showOTP ? "LOGIN" : "Send OTP"}</Text>)}
              </TouchableOpacity>
            </View>
          </View>
          <Footer navigation={this.props.navigation} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}


const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme == "dark" ? "gray" : "#fff",
  },
  subContainer: {
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 100
  },
  header: {
    color: '#000',
    fontWeight: '400',
    fontSize: 40,
    fontFamily: "Didot"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: "Roboto",
    width: isMobile() ? 350 : 550,
    marginBottom: 20,
    marginTop: 10
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "400"
  },
  inputContainer: {
    marginTop: 20
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonContainer: {
    width: isMobile() ? 350 : 550,
  },
  button: {
    marginTop: 50,
    backgroundColor: '#1A1A1A',
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Roboto"
  },
});