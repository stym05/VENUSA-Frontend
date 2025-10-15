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
import { getOTP, validateOTP, signupUser, sendOTPForMobile } from '../apis';
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
      formData: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        confirmPassword: '',
        rememberMe: false,
        subscribeUpdates: false,
        agreeTerms: false
      },
      isLoading: false,
      showSignupOTP: false,
      signupOTP: ''
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

  handleSignIn = async () => {
    const { formData } = this.state;

    // Implement your sign in logic here with email and password
    console.log('Sign In:', { email: formData.email, password: formData.password, rememberMe: formData.rememberMe });

    this.setState({ isLoading: true })

    // TODO: Replace with actual authentication API call
    // Example:
    // const response = await loginAPI({ email: formData.email, password: formData.password });
    // if (response.success) { ... }

    Toast.show({
      type: "info",
      text1: "Sign in functionality to be implemented"
    })

    this.setState({ isLoading: false })
  }

  handleCreateAccount = async () => {
    const { formData, showSignupOTP, signupOTP } = this.state;

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

    // Step 1: Send OTP to mobile number
    if (!showSignupOTP) {
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
          this.setState({ showSignupOTP: true });
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
      return;
    }

    // Step 2: Verify OTP and complete signup
    if (showSignupOTP) {
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
          password: formData.password
        };

        console.log('Signup Payload:', signupPayload);

        const signupResponse = await signupUser(signupPayload);
        this.setState({ isLoading: false });

        if (signupResponse.success) {
          Toast.show({
            type: "success",
            text1: "Account created successfully!"
          });

          // Reset form and switch to sign in tab
          this.setState({
            isSignIn: true,
            showSignupOTP: false,
            signupOTP: '',
            formData: {
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              phone: '',
              confirmPassword: '',
              rememberMe: false,
              subscribeUpdates: false,
              agreeTerms: false
            }
          });
        } else {
          Toast.show({
            type: "error",
            text1: signupResponse.message || "Failed to create account"
          });
        }
      } catch (error) {
        this.setState({ isLoading: false });
        Toast.show({
          type: "error",
          text1: "Something went wrong. Please try again."
        });
        console.log("Signup error:", error);
      }
    }
  }

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
    const { theme, formData, isSignIn, isLoading, showSignupOTP, signupOTP } = this.state;
    return (
      <SafeAreaView style={styles(theme).container}>
        <ScrollView style={styles(theme).subContainer}>
          <View style={styles(theme).mainContainer}>
            {/* Account Form Card */}
            <View style={styles(theme).formCard}>
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
              {isSignIn ? (
                <View>
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
                        if (cleanedValue.length <= 10) {
                          this.handleInputChange('phone', cleanedValue);
                        }
                      }}
                      keyboardType="phone-pad"
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

                  {/* OTP Input (shown after OTP is sent) */}
                  {showSignupOTP && (
                    <View style={styles(theme).inputContainer}>
                      <Text style={styles(theme).label}>OTP</Text>
                      <TextInput
                        style={styles(theme).input}
                        placeholder="Enter OTP"
                        placeholderTextColor="#9CA3AF"
                        value={signupOTP}
                        onChangeText={this.handleSignupOTPChange}
                        keyboardType="numeric"
                      />
                    </View>
                  )}

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
                      <Text style={styles(theme).submitButtonText}>
                        {showSignupOTP ? "Verify & Create Account" : "Send OTP"}
                      </Text>
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
    marginVertical: 100,
    paddingHorizontal: isMobile() ? 20 : 0
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 32,
    width: '100%',
    maxWidth: isMobile() ? 400 : 896,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32
  },
  tabButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: 'transparent'
  },
  tabButtonActive: {
    backgroundColor: '#1A1A1A'
  },
  tabText: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280'
  },
  tabTextActive: {
    color: '#fff'
  },
  inputContainer: {
    marginBottom: 24
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  input: {
    height: 48,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Roboto",
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff'
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
    width: 16,
    height: 16,
    borderRadius: 4
  },
  checkboxLabel: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: '#374151',
    marginLeft: 8
  },
  forgotText: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400'
  },
  submitButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 6,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: '500'
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
    flexWrap: 'wrap'
  },
  footerText: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: '#6B7280'
  },
  linkText: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline'
  }
});