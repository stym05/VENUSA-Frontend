import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from "@expo/vector-icons/Entypo";
import { isMobile } from "../../utils";


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

    handleNavigateToPolicyAndTerms = () => {
        console.log("handleNavigateToPolicyAndTerms pressed")
    }

    handleSubscribe = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }

    openFAQ = () => {
        this.props.navigation.navigate("FAQs")
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
                        <Text style={styles.underlinedText} onPress={this.handleNavigateToPolicyAndTerms}>Privacy Policy</Text>
                        {" "}and{" "}
                        <Text style={styles.underlinedText} onPress={this.handleNavigateToPolicyAndTerms}>Terms of Service.</Text>
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
                                    <Text style={styles.iconText}>abc@gmail.com</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather name="phone" size={16} color="black" />
                                    <Text style={styles.iconText}>+91-00000 00000</Text>
                                </View>
                                <View style={styles.row}>
                                    <EvilIcons name="location" size={16} color="black" />
                                    <Text style={styles.iconText}>sector 24, lane 1 delhi</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.minContainer}>
                            <Text style={styles.text2}>CUSTOMERS</Text>
                            <View style={styles.subTextContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.iconText}>Start a return</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText}>Return Policy</Text>
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
                                    <Text style={styles.iconText}>About Us</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText}>Terms & Conditions</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.iconText}>Privacy Policy</Text>
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
                <Text style={{marginTop: 50}}>2023 Venusa. All Rights Reserved.</Text>
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
        marginTop: 5
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