// import React from "react";
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Platform,
    Linking
} from 'react-native';
import Footer from "../components/footer";
import Entypo from '@expo/vector-icons/Entypo';
import { isMobile } from "../utils";
import * as Clipboard from 'expo-clipboard';
import React, { useState, useRef } from "react";
import { Animated, Easing } from "react-native";



const TermsAndConditions = (props) => {
    const [showDefinitions, setShowDefinitions] = useState(false);
    const defAnim = useRef(new Animated.Value(0)).current;
    const [showCompanyInfo, setShowCompanyInfo] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [showEligibility, setShowEligibility] = useState(false);
    const eligibilityAnim = useRef(new Animated.Value(0)).current;
    const [showAvailability, setShowAvailability] = useState(false);
    const availabilityAnim = useRef(new Animated.Value(0)).current;
    const [showPricing, setShowPricing] = useState(false);
    const pricingAnim = useRef(new Animated.Value(0)).current;
    const [showOrderPolicy, setShowOrderPolicy] = useState(false);
    const orderAnim = useRef(new Animated.Value(0)).current;


    const toggleOrderPolicy = () => {
        const toValue = showOrderPolicy ? 0 : 1;
        setShowOrderPolicy(!showOrderPolicy);
        Animated.timing(orderAnim, {
            toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const orderHeight = orderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 450], // Adjust as needed for actual content
    });


    const togglePricing = () => {
        const toValue = showPricing ? 0 : 1;
        setShowPricing(!showPricing);
        Animated.timing(pricingAnim, {
            toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };


    const pricingHeight = pricingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400], // Adjust based on actual content
    });


    const toggleAvailability = () => {
        const toValue = showAvailability ? 0 : 1;
        setShowAvailability(!showAvailability);
        Animated.timing(availabilityAnim, {
            toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const availabilityHeight = availabilityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300], // Adjust as needed
    });


    const toggleEligibility = () => {
        const toValue = showEligibility ? 0 : 1;
        setShowEligibility(!showEligibility);
        Animated.timing(eligibilityAnim, {
            toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const eligibilityHeight = eligibilityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 230], // Adjust based on actual height
    });



    const toggleCompanyInfo = () => {
        const finalValue = showCompanyInfo ? 0 : 1;
        setShowCompanyInfo(!showCompanyInfo);

        Animated.timing(animatedHeight, {
            toValue: finalValue,
            duration: 300,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease)
        }).start();
    };

    const toggleDefinitions = () => {
        const toValue = showDefinitions ? 0 : 1;
        setShowDefinitions(!showDefinitions);
        Animated.timing(defAnim, {
            toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const defHeight = defAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 150], // Adjust based on actual content height
    });

    const contentHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180], // adjust based on your content
    });


    console.log("Props value is ", props);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.subContainer}>
                    <Text style={styles.header}>Terms & Conditions</Text>
                    <View style={{ width: isMobile() ? "95%" : '60%' }}>
                        <Text style={styles.textHeader}>Last updated on May 5th 2025</Text>
                        <Text style={styles.text}>Welcome to VENUSA! Please read the following terms and conditions carefully before using our
                            website or purchasing our products. These terms apply to all users, customers, and visitors. By
                            accessing or using our services, you agree to be legally bound by these Terms and Conditions.
                        </Text>

                        <Text
                            style={[styles.textHeader, { flexDirection: 'row' }]}
                            onPress={toggleDefinitions}
                        >
                            {showDefinitions ? '▼ ' : '▶ '}DEFINITIONS:
                        </Text>

                        <Animated.View style={{ height: defHeight, overflow: 'hidden', width: "100%" }}>
                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>
                                    "Company", "We", "Us", or "Our" refers to VENUSA, the operator of this website and provider of all related services.
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>
                                    "Customer", "You", or "User" refers to the individual or entity accessing or using our services.
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>
                                    "Website" refers to <Text style={{ color: 'blue', textDecorationLine: 'underline' }} onPress={() => {
                                        if (Platform.OS === "web") {
                                            global.location.href = "https://venusa.co.in";
                                        } else {
                                            Linking.openURL("https://venusa.co.in");
                                        }
                                    }}>venusa.co.in</Text>.
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>
                                    "Products" refer to all clothing and apparel sold by VENUSA.
                                </Text>
                            </View>
                        </Animated.View>


                        <Text
                            style={[styles.textHeader, { flexDirection: 'row' }]}
                            onPress={toggleCompanyInfo}
                        >
                            {showCompanyInfo ? '▼ ' : '▶ '}COMPANY INFORMATION
                        </Text>


                        {showCompanyInfo && (
                            <Animated.View style={{ height: contentHeight, overflow: 'hidden' }}>
                                <View style={styles.row}>
                                    <Entypo name="dot-single" size={24} color="black" />
                                    <Text style={styles.text}>Legal Entity Name: VENUSA</Text>
                                </View>
                                <View style={styles.row}>
                                    <Entypo name="dot-single" size={24} color="black" />
                                    <Text style={styles.text}>
                                        Head Office Address: Tower F5 -404 Supertech Eco Village, Greater Noida, 201306
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Entypo name="dot-single" size={24} color="black" />
                                    <Text style={styles.text}>
                                        Customer Service Email: <Text style={{ color: "blue", textDecorationLine: 'underline' }} onPress={() => Linking.openURL("mailto:infi@venusa.co.in")}>info@venusa.co.in</Text>
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Entypo name="dot-single" size={24} color="black" />
                                    <Text style={styles.text}>
                                        Customer Helpline: <Text onPress={async () => await Clipboard.setStringAsync("7892050422")}>+91-7892050422</Text>
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Entypo name="dot-single" size={24} color="black" />
                                    <Text style={styles.text}>Business Hours: Mon-Fri (10:00-18:00 IST).</Text>
                                </View>
                            </Animated.View>

                        )}


                        <Text
                            style={styles.textHeader}
                            onPress={toggleEligibility}
                        >
                            {showEligibility ? '▼ ' : '▶ '}Eligibility
                        </Text>


                        <Animated.View style={{ height: eligibilityHeight, overflow: 'hidden', width: "100%" }}>
                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>
                                    By accessing or using the services provided by VENUSA, you affirm that you are either:
                                </Text>
                            </View>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● At least 18 years of age, or</Text>
                                <Text style={styles.text}>
                                    ● Using the website under the supervision of a parent or legal guardian who agrees to be bound by these Terms and Conditions.
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>You also confirm that:</Text>
                            </View>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● All information you provide during account creation, checkout, or any interaction with us is true, accurate, current, and complete.</Text>
                                <Text style={styles.text}>● You will not impersonate any individual or entity, or provide false identity information.</Text>
                            </View>
                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>
                                    VENUSA reserves the right to suspend or terminate access to our services if any information provided is found to be false, misleading, or in violation of our Terms.
                                </Text>
                            </View>
                        </Animated.View>

                        <Text
                            style={styles.textHeader}
                            onPress={toggleAvailability}
                        >
                            {showAvailability ? '▼ ' : '▶ '}4. Product Availability and Accuracy
                        </Text>

                        <Animated.View style={{ height: availabilityHeight, overflow: 'hidden', width: "100%" }}>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● Product availability is not guaranteed and may change without prior notice, especially in the case of limited stock or high demand.</Text>
                                <Text style={styles.text}>● Despite our efforts, we do not warrant that all information on our website is entirely accurate, complete, reliable, or free from typographical errors.</Text>
                                <Text style={styles.text}>● There may be occasional inaccuracies related to product color, size, pricing, or stock status due to system or human error.</Text>
                            </View>

                            <Text style={[styles.textHeader, { marginTop: 12 }]}>Our Rights</Text>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● Correct any errors, inaccuracies, or omissions at any time, whether before or after an order is placed.</Text>
                                <Text style={styles.text}>● Change or update product information or cancel orders if any detail is found to be incorrect, even after order confirmation.</Text>
                                <Text style={styles.text}>● Refuse or cancel orders affected by obvious pricing or availability mistakes.</Text>
                            </View>

                            <View style={styles.row}>
                                <Entypo name="dot-single" size={24} color="black" />
                                <Text style={styles.text}>
                                    We appreciate your understanding and are committed to transparency and customer satisfaction.
                                </Text>
                            </View>
                        </Animated.View>

                        <Text
                            style={styles.textHeader}
                            onPress={togglePricing}
                        >
                            {showPricing ? '▼ ' : '▶ '}5. Pricing and Payments
                        </Text>


                        <Animated.View style={{ height: pricingHeight, overflow: 'hidden', width: "100%" }}>
                            <Text style={[styles.text, { marginLeft: 28, marginBottom: 5, fontWeight: '600' }]}>Pricing</Text>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● All prices on the VENUSA website are listed in Indian Rupees (INR).</Text>
                                <Text style={styles.text}>● Prices are inclusive of applicable Goods and Services Tax (GST) unless stated otherwise.</Text>
                                <Text style={styles.text}>● Prices may change without prior notice; however, the price at the time of purchase will be honored for that transaction.</Text>
                            </View>

                            <Text style={[styles.text, { marginLeft: 28, marginVertical: 10, fontWeight: '600' }]}>Payment Methods</Text>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● Credit/Debit Cards (Visa, Mastercard, RuPay, etc.)</Text>
                                <Text style={styles.text}>● UPI (Unified Payments Interface)</Text>
                                <Text style={styles.text}>● Net Banking</Text>
                                <Text style={styles.text}>● Mobile Wallets (PhonePe, Paytm, Google Pay, etc.)</Text>
                                <Text style={styles.text}>● Other methods available and visible at checkout</Text>
                            </View>

                            <Text style={[styles.text, { marginLeft: 28, marginVertical: 10, fontWeight: '600' }]}>Payment Terms</Text>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● Orders will be processed only after successful payment authorization.</Text>
                                <Text style={styles.text}>● We do not offer cash on delivery (COD) unless explicitly stated during checkout.</Text>
                                <Text style={styles.text}>● VENUSA uses secure third-party payment gateways to ensure the safety of your financial information. We do not store your card or banking details.</Text>
                                <Text style={styles.text}>● If a payment fails or is flagged by our payment partner for review, your order may be delayed or canceled.</Text>
                            </View>
                        </Animated.View>

                        <Text style={styles.textHeader} onPress={toggleOrderPolicy}>
                            {showOrderPolicy ? '▼ ' : '▶ '}6. Order Confirmation & Cancellation
                        </Text>


                        <Animated.View style={{ height: orderHeight, overflow: 'hidden', width: "100%" }}>
                            <Text style={[styles.text, { marginLeft: 28, marginBottom: 5, fontWeight: '600' }]}>Order Confirmation</Text>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● Your order number</Text>
                                <Text style={styles.text}>● A summary of items purchased</Text>
                                <Text style={styles.text}>● Shipping and billing details</Text>
                                <Text style={styles.text}>● Estimated delivery timeline</Text>
                                <Text style={styles.text}>This confirmation does not guarantee acceptance of your order. Final acceptance is subject to stock availability and payment verification.</Text>
                            </View>

                            <Text style={[styles.text, { marginLeft: 28, marginVertical: 10, fontWeight: '600' }]}>Right to Cancel by VENUSA</Text>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● The item is out of stock or discontinued</Text>
                                <Text style={styles.text}>● There is a pricing or description error on the website</Text>
                                <Text style={styles.text}>● The order is flagged for suspected fraud or abuse</Text>
                                <Text style={styles.text}>● The shipping address is not serviceable or violates our policies</Text>
                                <Text style={styles.text}>In such cases, customers will be notified promptly, and any amounts paid will be issued as store credit or refunded.</Text>
                            </View>

                            <Text style={[styles.text, { marginLeft: 28, marginVertical: 10, fontWeight: '600' }]}>Customer-Initiated Cancellations</Text>
                            <View style={{ paddingLeft: 28 }}>
                                <Text style={styles.text}>● Customers may request to cancel an order within 2 hours of placing it by contacting info@venusa.co.in</Text>
                                <Text style={styles.text}>● After 2 hours, the order may already be processed or shipped.</Text>
                                <Text style={styles.text}>● Once shipped, follow the Return Policy (Section 8) if eligible.</Text>
                            </View>
                        </Animated.View>


                    </View>
                </View>
                <Footer navigation={props.navigation} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 50
    },
    header: {
        fontFamily: "Roboto",
        fontSize: 30,
        fontWeight: "400",
        lineHeight: 48,
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    textHeader: {
        fontFamily: "Jura",
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 48,
        color: "#333333"
    },
    text: {
        fontFamily: "Jura",
        fontSize: 16,
        fontWeight: "200",
        lineHeight: 28,
        color: "#333333"
    }
})

export default TermsAndConditions;