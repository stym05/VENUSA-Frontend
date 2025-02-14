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

const DeliveryPolicy = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.subContainer}><Text style={styles.header}>Shipping & Delivery Policy</Text>
                    <View style={{ width: isMobile() ? "95%" : '60%' }}>
                        <Text style={styles.textHeader}>Last updated on Feb 14th 2025</Text>
                        <Text style={styles.text}>For International buyers, orders are shipped and delivered through registered 
                            international courier companies and/or International speed post only. For domestic buyers, orders are 
                            shipped through registered domestic courier companies and /or speed post only. Orders are shipped within 
                            0-7 days or as per the delivery date agreed at the time of order confirmation and delivering of the 
                            shipment subject to Courier Company / post office norms. VENUSA is not liable for any delay in delivery 
                            by the courier company / postal authorities and only guarantees to hand over the consignment to the 
                            courier company or postal authorities within 0-7 days rom the date of the order and payment or as per 
                            the delivery date agreed at the time of order confirmation. Delivery of all orders will be to the address
                            provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during 
                            registration. For any issues in utilizing our services you may contact our helpdesk on 7838356424 or 
                            venusa.tech@gmail.com</Text>
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

export default DeliveryPolicy;