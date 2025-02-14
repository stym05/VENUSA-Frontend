import React from "react";
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import Footer from "../components/footer";
import Entypo from '@expo/vector-icons/Entypo';
import { isMobile } from "../utils";

const AboutUs = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.subContainer}><Text style={styles.header}>About us</Text>
                    <View style={{ width: isMobile() ? "95%" : '60%' }}>
                        <Text style={styles.textHeader}>Last updated on Feb 14th 2025</Text>
                        <Text style={styles.text}>You may contact us using the information below:</Text>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black" />
                            <Text style={styles.text}>Merchant Legal entity name: VENUSA</Text>
                        </View>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black" />
                            <Text style={styles.text}>Registered Address: C-608B, JVTS GARDEN, CHATTARPUR, NEW DELHI South West Delhi DELHI 110074</Text>
                        </View>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black" />
                            <Text style={styles.text}>Operational Address: C-608B, JVTS GARDEN, CHATTARPUR, NEW DELHI South West Delhi DELHI 110074</Text>
                        </View>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black" />
                            <Text style={styles.text}>Telephone No: 7838356424</Text>
                        </View>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black" />
                            <Text style={styles.text}>E-Mail ID: admin@venusa.co.in</Text>
                        </View>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black" />
                            <Text style={styles.text}>Techinal issue E-Mail ID: venusa.tech@gmail.com</Text>
                        </View>
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
        fontSize: 40,
        fontWeight: "400",
        lineHeight: 48,
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    textHeader: {
        fontFamily: "Roboto",
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 48,
        color: "#333333"
    },
    text: {
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "200",
        lineHeight: 28,
        color: "#333333"
    }
})

export default AboutUs;