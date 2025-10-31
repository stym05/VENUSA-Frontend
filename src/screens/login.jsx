import React, { Component } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
  Platform
} from 'react-native';
import Header from '../components/header';
import Store from '../store';
import Checkbox from 'expo-checkbox';
import { isMobile } from '../utils';
import Footer from '../components/footer';
import { getOTP, validateOTP, signupUser, sendOTPForMobile, loginUser } from '../apis';
import Toast from 'react-native-toast-message';
import { AUTH, AUTH_TOKEN, USER_DATA } from '../store/actions/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  constructor(props) {
    super(props);

    let theme = Store.getState().settings.theme;

    this.state = {
      theme,
      isSignIn: true,
      loginMethod: 'password', // 'password' or 'otp'
      formData: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: '',
        rememberMe: false,
        subscribeUpdates: false,
        agreeTerms: false
      },
      isLoading: false,
      showOTPModal: false,
      signupOTP: '',
      loginOTP: '',
      otpSent: false
    }

    // Animation values
    this.fadeAnim = new Animated.Value(0);
    this.slideAnim = new Animated.Value(50);
    this.scaleAnim = new Animated.Value(0.95);
    this.formContentAnim = new Animated.Value(0);
    this.modalScaleAnim = new Animated.Value(0.9);
    this.modalFadeAnim = new Animated.Value(0);
    this.shimmerAnim = new Animated.Value(0);
  }

  componentDidMount() {
    // Entrance animation sequence
    Animated.parallel([
      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(this.slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(this.scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animate form content after card appears
      Animated.timing(this.formContentAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });

    // Continuous shimmer animation for top border
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.shimmerAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(this.shimmerAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  componentDidUpdate(prevProps, prevState) {
    // Animate when switching tabs
    if (prevState.isSignIn !== this.state.isSignIn) {
      this.formContentAnim.setValue(0);
      Animated.timing(this.formContentAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }

    // Animate modal entrance/exit
    if (prevState.showOTPModal !== this.state.showOTPModal) {
      if (this.state.showOTPModal) {
        this.modalScaleAnim.setValue(0.9);
        this.modalFadeAnim.setValue(0);
        Animated.parallel([
          Animated.spring(this.modalScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(this.modalFadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }

  handleInputChange = (name, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleSignupOTPChange = (value) => {
    this.setState({ signupOTP: value });
  };

  handleLoginOTPChange = (value) => {
    this.setState({ loginOTP: value });
  };

  toggleLoginMethod = () => {
    this.setState(prevState => ({
      loginMethod: prevState.loginMethod === 'password' ? 'otp' : 'password',
      loginOTP: '',
      otpSent: false
    }));
  };

  handleSendLoginOTP = async () => {
    const { formData } = this.state;

    if (!formData.email) {
      Toast.show({
        type: "error",
        text1: "Please enter your phone number"
      });
      return;
    }

    this.setState({ isLoading: true });

    try {
      const otpPayload = {
        phoneNumber: formData.email
      };

      const response = await sendOTPForMobile(otpPayload);
      this.setState({ isLoading: false });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent to your mobile number"
        });
        this.setState({ otpSent: true });
      } else {
        Toast.show({
          type: "error",
          text1: response.message || "Failed to send OTP"
        });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      Toast.show({
        type: "error",
        text1: "Failed to send OTP. Please try again."
      });
      console.log("Send OTP error:", error);
    }
  };

  handleLoginWithOTP = async () => {
    const { formData, loginOTP } = this.state;

    if (!loginOTP) {
      Toast.show({
        type: "error",
        text1: "Please enter OTP"
      });
      return;
    }

    this.setState({ isLoading: true });

    try {
      // Verify OTP
      const verifyPayload = {
        phoneNumber: formData.email,
        otp: loginOTP
      };

      const response = await validateOTP(verifyPayload);
      this.setState({ isLoading: false });

      if (response.success && response.data) {
        // Check if user has completed signup (has password)
        if (response.data.is_new_user) {
          Toast.show({
            type: "info",
            text1: "Please complete signup first"
          });
          this.setState({
            isSignIn: false,
            formData: {
              ...this.state.formData,
              phone: formData.email
            }
          });
          return;
        }

        Toast.show({
          type: "success",
          text1: "OTP verified! Please set up your account."
        });

        // Switch to signup with phone pre-filled
        this.setState({
          isSignIn: false,
          formData: {
            ...this.state.formData,
            phone: formData.email
          }
        });
      } else {
        Toast.show({
          type: "error",
          text1: response.message || "Invalid OTP"
        });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      Toast.show({
        type: "error",
        text1: "Login failed. Please try again."
      });
      console.log("Login with OTP error:", error);
    }
  };

  handleSignIn = async () => {
    const { formData } = this.state;

    // Validate fields
    if (!formData.email || !formData.password) {
      Toast.show({
        type: "error",
        text1: "Please enter phone number and password"
      });
      return;
    }

    this.setState({ isLoading: true });

    try {
      // Backend expects phoneNumber for login
      const loginPayload = {
        phoneNumber: formData.email, // Can be email or phone
        password: formData.password
      };

      const response = await loginUser(loginPayload);
      this.setState({ isLoading: false });

      if (response.success && response.data) {
        // Store user data in Redux
        Store.dispatch({
          type: USER_DATA,
          payload: response.data.user
        });

        // Store auth token
        Store.dispatch({
          type: AUTH_TOKEN,
          payload: response.data.access
        });

        // Set authenticated status
        Store.dispatch({
          type: AUTH,
          payload: true
        });

        // Store in AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.access);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

        Toast.show({
          type: "success",
          text1: "Login successful!"
        });

        // Navigate to home
        setTimeout(() => {
          this.props.navigation.navigate('Dashboard');
        }, 500);
      } else {
        Toast.show({
          type: "error",
          text1: response.message || response.errors?.error?.[0] || "Invalid credentials"
        });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      Toast.show({
        type: "error",
        text1: "Login failed. Please try again."
      });
      console.log("Login error:", error);
    }
  }

  handleCreateAccount = async () => {
    const { formData } = this.state;

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.password) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields"
      });
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match"
      });
      return;
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      Toast.show({
        type: "error",
        text1: "Please agree to Terms & Privacy"
      });
      return;
    }

    // Send OTP to mobile number and show modal
    this.setState({ isLoading: true });

    try {
      const otpPayload = {
        phoneNumber: formData.phone
      };

      const response = await sendOTPForMobile(otpPayload);
      this.setState({ isLoading: false });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent to your mobile number"
        });
        this.setState({ showOTPModal: true });
      } else {
        Toast.show({
          type: "error",
          text1: response.message || "Failed to send OTP"
        });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      Toast.show({
        type: "error",
        text1: "Failed to send OTP. Please try again."
      });
      console.log("Send OTP error:", error);
    }
  };

  handleVerifyAndSignup = async () => {
    const { formData, signupOTP } = this.state;

    if (!signupOTP) {
      Toast.show({
        type: "error",
        text1: "Please enter OTP"
      });
      return;
    }

    this.setState({ isLoading: true });

    try {
      // Verify OTP
      const verifyPayload = {
        phoneNumber: formData.phone,
        otp: signupOTP
      };

      const otpResponse = await validateOTP(verifyPayload);

      if (!otpResponse.success) {
        this.setState({ isLoading: false });
        Toast.show({
          type: "error",
          text1: otpResponse.message || "Invalid OTP"
        });
        return;
      }

      // OTP verified, now create account
      const signupPayload = {
        phoneNumber: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      };

      const signupResponse = await signupUser(signupPayload);
      this.setState({ isLoading: false, showOTPModal: false });

      if (signupResponse.success && signupResponse.data) {
        // Store user data in Redux
        Store.dispatch({
          type: USER_DATA,
          payload: signupResponse.data.user
        });

        // Store auth token
        Store.dispatch({
          type: AUTH_TOKEN,
          payload: signupResponse.data.access
        });

        // Set authenticated status
        Store.dispatch({
          type: AUTH,
          payload: true
        });

        // Store in AsyncStorage
        await AsyncStorage.setItem('authToken', signupResponse.data.access);
        await AsyncStorage.setItem('userData', JSON.stringify(signupResponse.data.user));

        Toast.show({
          type: "success",
          text1: "Account created successfully!"
        });

        // Navigate to home
        setTimeout(() => {
          this.props.navigation.navigate('Dashboard');
        }, 500);
      } else {
        Toast.show({
          type: "error",
          text1: signupResponse.message || "Failed to create account"
        });
      }
    } catch (error) {
      this.setState({ isLoading: false, showOTPModal: false });
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again."
      });
      console.log("Signup error:", error);
    }
  };

  handleForgotPassword = () => {
    console.log('Forgot Password');
    Toast.show({
      type: "info",
      text1: "Password reset functionality coming soon"
    })
  }

  handleContactSupport = () => {
    console.log('Contact Support');
    Toast.show({
      type: "info",
      text1: "Please contact support at support@venusa.com"
    })
  }

  render() {
    const { theme, formData, isSignIn, isLoading, loginMethod, otpSent, loginOTP, showOTPModal, signupOTP } = this.state;

    const shimmerTranslate = this.shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-300, 300],
    });

    return (
      <SafeAreaView style={styles(theme).container}>
        <ScrollView style={styles(theme).subContainer}>
          <View style={styles(theme).mainContainer}>
            {/* Account Form Card */}
            <Animated.View
              style={[
                styles(theme).formCard,
                {
                  opacity: this.fadeAnim,
                  transform: [
                    { translateY: this.slideAnim },
                    { scale: this.scaleAnim },
                  ],
                },
              ]}
            >
              {/* Shimmer effect on top border */}
              <Animated.View
                style={[
                  styles(theme).shimmerEffect,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              />
              {/* Tab Buttons */}
              <View style={styles(theme).tabContainer}>
                <TouchableOpacity
                  onPress={() => this.setState({ isSignIn: true })}
                  style={[
                    styles(theme).tabButton,
                    isSignIn && styles(theme).tabButtonActive
                  ]}
                >
                  <Text style={[
                    styles(theme).tabText,
                    isSignIn && styles(theme).tabTextActive
                  ]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ isSignIn: false })}
                  style={[
                    styles(theme).tabButton,
                    !isSignIn && styles(theme).tabButtonActive
                  ]}
                >
                  <Text style={[
                    styles(theme).tabText,
                    !isSignIn && styles(theme).tabTextActive
                  ]}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Form Content */}
              <Animated.View
                style={{
                  opacity: this.formContentAnim,
                  transform: [
                    {
                      translateY: this.formContentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
              >
              {isSignIn ? (
                <View>
                  {/* Login Method Toggle */}
                  <View style={styles(theme).loginMethodToggle}>
                    <TouchableOpacity
                      onPress={() => this.setState({ loginMethod: 'password', otpSent: false, loginOTP: '' })}
                      style={[
                        styles(theme).methodButton,
                        loginMethod === 'password' && styles(theme).methodButtonActive
                      ]}
                    >
                      <Text style={[
                        styles(theme).methodText,
                        loginMethod === 'password' && styles(theme).methodTextActive
                      ]}>Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ loginMethod: 'otp', formData: { ...formData, password: '' } })}
                      style={[
                        styles(theme).methodButton,
                        loginMethod === 'otp' && styles(theme).methodButtonActive
                      ]}
                    >
                      <Text style={[
                        styles(theme).methodText,
                        loginMethod === 'otp' && styles(theme).methodTextActive
                      ]}>OTP</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Phone Number Input */}
                  <View style={styles(theme).inputContainer}>
                    <Text style={styles(theme).label}>Phone Number</Text>
                    <TextInput
                      style={styles(theme).input}
                      placeholder="Enter your phone number"
                      placeholderTextColor="#9CA3AF"
                      value={formData.email}
                      onChangeText={(value) => {
                        const cleanedValue = value.replace(/[^0-9]/g, '');
                        if (cleanedValue.length <= 12) {
                          this.handleInputChange('email', cleanedValue);
                        }
                      }}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      maxLength={12}
                    />
                  </View>

                  {loginMethod === 'password' ? (
                    <>
                      {/* Password Input */}
                      <View style={styles(theme).inputContainer}>
                        <Text style={styles(theme).label}>Password</Text>
                        <TextInput
                          style={styles(theme).input}
                          placeholder="••••••••"
                          placeholderTextColor="#9CA3AF"
                          value={formData.password}
                          onChangeText={(value) => this.handleInputChange('password', value)}
                          secureTextEntry
                        />
                      </View>

                      {/* Remember Me and Forgot Password */}
                      <View style={styles(theme).rememberContainer}>
                        <View style={styles(theme).checkboxContainer}>
                          <Checkbox
                            value={formData.rememberMe}
                            onValueChange={(value) => this.handleInputChange('rememberMe', value)}
                            color={formData.rememberMe ? '#1A1A1A' : undefined}
                            style={styles(theme).checkbox}
                          />
                          <Text style={styles(theme).checkboxLabel}>Remember me</Text>
                        </View>
                        <TouchableOpacity onPress={this.handleForgotPassword}>
                          <Text style={styles(theme).forgotText}>Forgot?</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Sign In Button */}
                      <TouchableOpacity
                        style={styles(theme).submitButton}
                        onPress={this.handleSignIn}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles(theme).submitButtonText}>Sign In</Text>
                        )}
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* OTP Input */}
                      {otpSent && (
                        <View style={styles(theme).inputContainer}>
                          <Text style={styles(theme).label}>OTP</Text>
                          <TextInput
                            style={styles(theme).input}
                            placeholder="Enter OTP"
                            placeholderTextColor="#9CA3AF"
                            value={loginOTP}
                            onChangeText={this.handleLoginOTPChange}
                            keyboardType="numeric"
                            maxLength={6}
                          />
                        </View>
                      )}

                      {/* OTP Buttons */}
                      {!otpSent ? (
                        <TouchableOpacity
                          style={styles(theme).submitButton}
                          onPress={this.handleSendLoginOTP}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text style={styles(theme).submitButtonText}>Send OTP</Text>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <View>
                          <TouchableOpacity
                            style={styles(theme).submitButton}
                            onPress={this.handleLoginWithOTP}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Text style={styles(theme).submitButtonText}>Verify OTP</Text>
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles(theme).resendButton}
                            onPress={this.handleSendLoginOTP}
                            disabled={isLoading}
                          >
                            <Text style={styles(theme).resendText}>Resend OTP</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}

                  {/* Footer Links */}
                  <View style={styles(theme).footerLinks}>
                    <Text style={styles(theme).footerText}>Problems? </Text>
                    <TouchableOpacity onPress={this.handleForgotPassword}>
                      <Text style={styles(theme).linkText}>Reset password</Text>
                    </TouchableOpacity>
                    <Text style={styles(theme).footerText}> · </Text>
                    <TouchableOpacity onPress={this.handleContactSupport}>
                      <Text style={styles(theme).linkText}>Contact support</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  {/* First Name and Last Name Grid */}
                  <View style={styles(theme).gridContainer}>
                    <View style={[styles(theme).inputContainer, styles(theme).halfWidth]}>
                      <Text style={styles(theme).label}>First name</Text>
                      <TextInput
                        style={styles(theme).input}
                        placeholder="Riya"
                        placeholderTextColor="#9CA3AF"
                        value={formData.firstName}
                        onChangeText={(value) => this.handleInputChange('firstName', value)}
                      />
                    </View>
                    <View style={[styles(theme).inputContainer, styles(theme).halfWidth]}>
                      <Text style={styles(theme).label}>Last name</Text>
                      <TextInput
                        style={styles(theme).input}
                        placeholder="Sharma"
                        placeholderTextColor="#9CA3AF"
                        value={formData.lastName}
                        onChangeText={(value) => this.handleInputChange('lastName', value)}
                      />
                    </View>
                  </View>

                  {/* Phone Input */}
                  <View style={styles(theme).inputContainer}>
                    <Text style={styles(theme).label}>Phone</Text>
                    <TextInput
                      style={styles(theme).input}
                      placeholder="+91 98XX-XXXXXX"
                      placeholderTextColor="#9CA3AF"
                      value={formData.phone}
                      onChangeText={(value) => {
                        const cleanedValue = value.replace(/[^0-9]/g, '');
                        if (cleanedValue.length <= 12) {
                          this.handleInputChange('phone', cleanedValue);
                        }
                      }}
                      keyboardType="phone-pad"
                      maxLength={12}
                    />
                  </View>

                  {/* Email Input */}
                  <View style={styles(theme).inputContainer}>
                    <Text style={styles(theme).label}>Email</Text>
                    <TextInput
                      style={styles(theme).input}
                      placeholder="you@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={formData.email}
                      onChangeText={(value) => this.handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Date of Birth and Gender Grid */}
                  <View style={styles(theme).gridContainer}>
                    <View style={[styles(theme).inputContainer, styles(theme).halfWidth]}>
                      <Text style={styles(theme).label}>Date of Birth</Text>
                      <TextInput
                        style={styles(theme).input}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#9CA3AF"
                        value={formData.dateOfBirth}
                        onChangeText={(value) => {
                          // Format as DD/MM/YYYY
                          let cleaned = value.replace(/[^0-9]/g, '');
                          if (cleaned.length >= 2) {
                            cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
                          }
                          if (cleaned.length >= 5) {
                            cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5);
                          }
                          if (cleaned.length <= 10) {
                            this.handleInputChange('dateOfBirth', cleaned);
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>
                    <View style={[styles(theme).inputContainer, styles(theme).halfWidth]}>
                      <Text style={styles(theme).label}>Gender</Text>
                      <View style={styles(theme).genderContainer}>
                        <TouchableOpacity
                          style={[
                            styles(theme).genderButton,
                            formData.gender === 'Male' && styles(theme).genderButtonActive
                          ]}
                          onPress={() => this.handleInputChange('gender', 'Male')}
                        >
                          <Text style={[
                            styles(theme).genderText,
                            formData.gender === 'Male' && styles(theme).genderTextActive
                          ]}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles(theme).genderButton,
                            formData.gender === 'Female' && styles(theme).genderButtonActive
                          ]}
                          onPress={() => this.handleInputChange('gender', 'Female')}
                        >
                          <Text style={[
                            styles(theme).genderText,
                            formData.gender === 'Female' && styles(theme).genderTextActive
                          ]}>Female</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles(theme).genderButton,
                            formData.gender === 'Other' && styles(theme).genderButtonActive
                          ]}
                          onPress={() => this.handleInputChange('gender', 'Other')}
                        >
                          <Text style={[
                            styles(theme).genderText,
                            formData.gender === 'Other' && styles(theme).genderTextActive
                          ]}>Other</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Password Grid */}
                  <View style={styles(theme).gridContainer}>
                    <View style={[styles(theme).inputContainer, styles(theme).halfWidth]}>
                      <Text style={styles(theme).label}>Password</Text>
                      <TextInput
                        style={styles(theme).input}
                        placeholder="Min 8 characters"
                        placeholderTextColor="#9CA3AF"
                        value={formData.password}
                        onChangeText={(value) => this.handleInputChange('password', value)}
                        secureTextEntry
                      />
                    </View>
                    <View style={[styles(theme).inputContainer, styles(theme).halfWidth]}>
                      <Text style={styles(theme).label}>Confirm password</Text>
                      <TextInput
                        style={styles(theme).input}
                        placeholder="Re-enter password"
                        placeholderTextColor="#9CA3AF"
                        value={formData.confirmPassword}
                        onChangeText={(value) => this.handleInputChange('confirmPassword', value)}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  {/* Checkboxes */}
                  <View style={styles(theme).checkboxGroup}>
                    <View style={styles(theme).checkboxRow}>
                      <Checkbox
                        value={formData.subscribeUpdates}
                        onValueChange={(value) => this.handleInputChange('subscribeUpdates', value)}
                        color={formData.subscribeUpdates ? '#1A1A1A' : undefined}
                        style={styles(theme).checkbox}
                      />
                      <Text style={styles(theme).checkboxLabel}>
                        Subscribe to product updates (optional)
                      </Text>
                    </View>
                    <View style={styles(theme).checkboxRow}>
                      <Checkbox
                        value={formData.agreeTerms}
                        onValueChange={(value) => this.handleInputChange('agreeTerms', value)}
                        color={formData.agreeTerms ? '#1A1A1A' : undefined}
                        style={styles(theme).checkbox}
                      />
                      <Text style={styles(theme).checkboxLabel}>
                        I agree to the <Text style={styles(theme).linkText}>Terms</Text> & <Text style={styles(theme).linkText}>Privacy</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Create Account Button */}
                  <TouchableOpacity
                    style={styles(theme).submitButton}
                    onPress={this.handleCreateAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles(theme).submitButtonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>

                  {/* Footer Links */}
                  <View style={styles(theme).footerLinks}>
                    <Text style={styles(theme).footerText}>Problems? </Text>
                    <TouchableOpacity onPress={this.handleForgotPassword}>
                      <Text style={styles(theme).linkText}>Reset password</Text>
                    </TouchableOpacity>
                    <Text style={styles(theme).footerText}> · </Text>
                    <TouchableOpacity onPress={this.handleContactSupport}>
                      <Text style={styles(theme).linkText}>Contact support</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              </Animated.View>
            </Animated.View>
          </View>

          {/* OTP Verification Modal */}
          <Modal
            visible={showOTPModal}
            transparent={true}
            animationType="none"
            onRequestClose={() => this.setState({ showOTPModal: false })}
          >
            <View style={styles(theme).modalOverlay}>
              <Animated.View
                style={[
                  styles(theme).modalContent,
                  {
                    opacity: this.modalFadeAnim,
                    transform: [{ scale: this.modalScaleAnim }],
                  },
                ]}
              >
                <Text style={styles(theme).modalTitle}>Verify Mobile Number</Text>
                <Text style={styles(theme).modalSubtitle}>
                  Enter the OTP sent to {formData.phone}
                </Text>

                <View style={styles(theme).otpInputContainer}>
                  <TextInput
                    style={styles(theme).otpInput}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#9CA3AF"
                    value={signupOTP}
                    onChangeText={this.handleSignupOTPChange}
                    keyboardType="numeric"
                    maxLength={6}
                    autoFocus
                  />
                </View>

                <View style={styles(theme).modalButtons}>
                  <TouchableOpacity
                    style={styles(theme).modalButtonCancel}
                    onPress={() => this.setState({ showOTPModal: false, signupOTP: '' })}
                  >
                    <Text style={styles(theme).modalButtonCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles(theme).modalButtonVerify}
                    onPress={this.handleVerifyAndSignup}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles(theme).modalButtonVerifyText}>Verify & Create Account</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles(theme).resendButtonModal}
                  onPress={this.handleCreateAccount}
                >
                  <Text style={styles(theme).resendTextModal}>Resend OTP</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Modal>

          <Footer navigation={this.props.navigation} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}


const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3F0',
  },
  subContainer: {
    backgroundColor: '#F8F3F0',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: isMobile() ? 60 : 100,
    paddingHorizontal: isMobile() ? 20 : 40
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E5E0DB',
    borderTopWidth: 3,
    borderTopColor: '#800020',
    padding: isMobile() ? 28 : 48,
    width: '100%',
    maxWidth: isMobile() ? 400 : 920,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 100,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0DB',
  },
  tabButton: {
    paddingHorizontal: isMobile() ? 20 : 32,
    paddingVertical: 14,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    transition: 'all 0.3s ease',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  tabButtonActive: {
    borderBottomColor: '#800020',
    backgroundColor: 'transparent'
  },
  tabText: {
    fontFamily: "Jura",
    fontSize: isMobile() ? 15 : 17,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: '#800020'
  },
  loginMethodToggle: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 28,
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#E5E0DB',
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 0,
    backgroundColor: '#FAFAFA',
    borderRightWidth: 1,
    borderRightColor: '#E5E0DB',
    transition: 'all 0.3s ease',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  methodButtonActive: {
    backgroundColor: '#800020',
    borderRightColor: '#800020',
  },
  methodText: {
    fontFamily: "Jura",
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.5,
  },
  methodTextActive: {
    color: '#F8F3F0',
  },
  inputContainer: {
    marginBottom: 24
  },
  label: {
    fontFamily: "Jura",
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    height: 52,
    borderColor: '#E5E0DB',
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontFamily: "Roboto",
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    transition: 'all 0.3s ease',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        cursor: 'text',
      },
    }),
  },
  gridContainer: {
    flexDirection: isMobile() ? 'column' : 'row',
    gap: 24,
    marginBottom: 0
  },
  halfWidth: {
    flex: isMobile() ? 0 : 1,
    marginBottom: isMobile() ? 0 : 24
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#800020',
  },
  checkboxLabel: {
    fontFamily: "Roboto",
    fontSize: 13,
    color: '#666666',
    marginLeft: 10,
    fontWeight: '400',
  },
  forgotText: {
    fontFamily: "Jura",
    fontSize: 13,
    color: '#800020',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#800020',
    borderRadius: 0,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#800020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    transition: 'all 0.3s ease',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  submitButtonText: {
    color: '#F8F3F0',
    fontFamily: "Jura",
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: -12,
    marginBottom: 24,
  },
  resendText: {
    fontFamily: "Jura",
    fontSize: 13,
    color: '#800020',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  checkboxGroup: {
    gap: 12,
    marginBottom: 24
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E0DB',
  },
  footerText: {
    fontFamily: "Roboto",
    fontSize: 13,
    color: '#888888',
    fontWeight: '300',
  },
  linkText: {
    fontFamily: "Jura",
    fontSize: 13,
    color: '#800020',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 40,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#E5E0DB',
    borderTopWidth: 3,
    borderTopColor: '#800020',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  modalTitle: {
    fontFamily: "Jura",
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '300',
  },
  otpInputContainer: {
    marginBottom: 28,
  },
  otpInput: {
    height: 60,
    borderColor: '#E5E0DB',
    borderWidth: 2,
    borderRadius: 0,
    paddingHorizontal: 16,
    fontFamily: "Jura",
    fontSize: 28,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    letterSpacing: 10,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: '#800020',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalButtonCancelText: {
    fontFamily: "Jura",
    fontSize: 14,
    fontWeight: '600',
    color: '#800020',
    letterSpacing: 0.5,
  },
  modalButtonVerify: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 0,
    backgroundColor: '#800020',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#800020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonVerifyText: {
    fontFamily: "Jura",
    fontSize: 14,
    fontWeight: '700',
    color: '#F8F3F0',
    letterSpacing: 1,
  },
  resendButtonModal: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendTextModal: {
    fontFamily: "Jura",
    fontSize: 13,
    color: '#800020',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  // Gender button styles
  genderContainer: {
    flexDirection: 'row',
    gap: 0,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#E5E0DB',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 0,
    borderWidth: 0,
    borderRightWidth: 1,
    borderRightColor: '#E5E0DB',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  genderButtonActive: {
    backgroundColor: '#800020',
    borderRightColor: '#800020',
  },
  genderText: {
    fontFamily: "Jura",
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.5,
  },
  genderTextActive: {
    color: '#F8F3F0',
  },
});
