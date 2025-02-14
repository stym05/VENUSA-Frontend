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

const ReturnPolicy = (props) => {
    console.log("Props value is ", props);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.subContainer}>
                    <Text style={styles.header}>Cancellation & Refund Policy</Text>
                    <View style={{width: isMobile() ? "95%" : '60%'}}>
                        <Text style={styles.textHeader}>Last updated on Feb 14th 2025</Text>
                        <Text style={styles.text}>VENUSA believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:</Text>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Cancellations will be considered only if the request is made within 7 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>VENUSA does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 7 days of receipt of the products.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>In case of any Refunds approved by the VENUSA, it’ll take 6-8 days for the refund to be processed to the end customer.</Text>
                        </View>
                    </View>
                </View>
                <Footer navigation={props.navigation}/>
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

export default ReturnPolicy;