import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Linking
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from "@expo/vector-icons/Entypo";
import { isMobile, validateEmail } from "../../utils";
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { createSubsciber } from "../../apis";

class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            isLoading: false
        }
    }

    handleTextChange = (value) => {
        this.setState({ text: value });
    };


    openTermsAndConditions = () => {
        this.props.navigation.navigate("TermsAndConditions");
    }

    openPrivacyPolicy = () => {
        this.props.navigation.navigate("Policy");
    }

    copyToClipboard = async () => {
        await Clipboard.setStringAsync('7838356424');
        Toast.show({
            type: 'success',
            text1: 'Text Copied to Clipboard',
            visibilityTime: 5000
          });
    };

    handleSubscribe = async () => {
        this.setState({ isLoading: true })
        try {
        if(validateEmail(this.state.text)){
            const payload = {
                email: this.state.text
            }
            const response = await createSubsciber(payload);
            console.log("response is ", response);
            if(response.success) {
                console.log("erre")
                Toast.show({
                    type: 'success',
                    text1: 'Thank You for Join us',
                    visibilityTime: 5000
                });
            }else{
                console.log("err35652526e")
                Toast.show({
                    type: 'error',
                    text1: response.message,
                    visibilityTime: 5000
                });
            }
            this.setState({ text: "", isLoading: false })
        }else{
            Toast.show({
                type: 'error',
                text1: 'Please enter valid email',
                visibilityTime: 5000
              });
        }
        } catch (err) {
            console.log("err35652526e")
                Toast.show({
                    type: 'error',
                    text1: "something went wrong",
                    visibilityTime: 5000
                });
                this.setState({ text: "", isLoading: false })
        }
         
    }

    openFAQ = () => {
        this.props.navigation.navigate("FAQs")
    }

    openContactUs = () => {
        this.props.navigation.navigate("ContactUs")
    }

    openAboutUs = () => {
        this.props.navigation.navigate("AboutUs")
    }

    openReturnPolicy = () => {
        this.props.navigation.navigate("ReturnPolicy");
    }

    openDeliveryPolicy = () => {
        this.props.navigation.navigate("DeliveryPolicy");
    }

    handleMail = () => {
        if(Platform.OS == "web") {
            global.open("mailto:admin@venusa.co.in");
        }else{
            Linking.openURL("mailto:admin@venusa.co.in")
        }
    }

    render() {
        const { text, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.text1}>Join us in living, better. Every day.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    placeholderTextColor={"#808080"}
                    value={text}
                    onChangeText={this.handleTextChange}
                />
                <View style={styles.middleContainer}>
                    <Text style={styles.text2}>By signing up, you agree to our{" "}
                        <Text style={styles.underlinedText} onPress={this.openPrivacyPolicy}>Privacy Policy</Text>
                        {" "}and{" "}
                        <Text style={styles.underlinedText} onPress={this.openTermsAndConditions}>Terms of Service.</Text>
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={this.handleSubscribe}>
                        {isLoading ? (<ActivityIndicator size={"small"} color={"#fff"} />) : (<Text style={styles.buttonText}>Subscribe</Text>)}
                    </TouchableOpacity>
                </View>
                <View style={styles.lowerContainer}>
                    <View style={styles.subLowerContainer}>
                        <View style={styles.minContainer}>
                            <Text style={styles.text2}>CONTACT US</Text>
                            <View style={styles.subTextContainer}>
                                <View style={styles.row}>
                                    <Feather name="mail" size={16} color="black" />
                                    <Text style={styles.iconText} onPress={this.handleMail}>admin@venusa.co.in</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather name="phone" size={16} color="black" />
                                    <Text style={styles.iconText} onPress={this.copyToClipboard}>+91-7838356424</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText} onPress={this.openAboutUs}>About Us</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.minContainer}>
                            <Text style={styles.text2}>CUSTOMERS</Text>
                            <View style={styles.subTextContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.iconText} onPress={this.openDeliveryPolicy}>Shipping & Delivery Policy</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText} onPress={this.openReturnPolicy}>Return Policy</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text onPress={this.openFAQ} style={styles.iconText}>FAQ</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.minContainer}>
                            <Text style={styles.text2}>COMPANY</Text>
                            <View style={styles.subTextContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.iconText} onPress={this.openContactUs}>FeedBack or Complain</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText} onPress={this.openTermsAndConditions}>Terms & Conditions</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText} onPress={this.openPrivacyPolicy}>Privacy Policy</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.minContainer}>
                            <Text style={styles.text2}>ACCOUNT</Text>
                            <View style={styles.subTextContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.iconText}>Membership</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText}>Profile</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.text2}>Follow Us</Text>
                        <View style={styles.row}>
                            <View >
                                <Entypo name="instagram" size={24} color="black" />
                            </View>
                            <View style={{marginHorizontal: 10}}>
                                <FontAwesome5 name="whatsapp" size={24} color="black" />
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={{marginTop: 50}}>2025 Venusa. All Rights Reserved.</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F8F3F0",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
    },
    text1: {
        fontWeight: "400",
        fontFamily: "Roboto",
        lineHeight: 32,
        fontSize: 24
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontFamily: "Roboto",
        width: 350,
        marginBottom: 20,
        marginTop: 30
    },
    middleContainer: {
        width: 350,
        marginTop: 10
    },
    text2: {
        color: "gray",
        fontFamily: "Roboto",
        lineHeight: 20,
        fontSize: 16
    },
    underlinedText: {
        fontSize: 16,
        textDecorationLine: 'underline',
        cursor: 'pointer',
        fontFamily: "Roboto",
        color: '#000'
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
    lowerContainer: {
        width: isMobile() ? "100%" : "80%",
        marginTop: isMobile() ? 50 : 100,
        display: 'flex',
        flexDirection: isMobile() ? 'column' : 'row',
    },
    subLowerContainer: {
        width: isMobile() ? "100%" : "80%",
        display: 'flex',
        flexDirection: isMobile() ? 'column' : 'row',
    },
    minContainer: {
        width: isMobile() ? "100%" : "25%",
        marginTop: isMobile() ? 10 : 0
    },
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5,
        textAlign: 'center'
    },
    subTextContainer: {
        paddingVertical: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    iconText: {
        fontSize: 16,
        marginHorizontal: 5
    }
})

export default Footer;