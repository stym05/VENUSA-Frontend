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

const TermsAndConditions = (props) => {
    console.log("Props value is ", props);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.subContainer}>
                    <Text style={styles.header}>Terms & Conditions</Text>
                    <View style={{width: isMobile() ? "95%" : '60%'}}>
                        <Text style={styles.textHeader}>Last updated on Feb 14th 2025</Text>
                        <Text style={styles.text}>For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean VENUSA, whose registered/operational office is C-608B, JVTS GARDEN, CHATTARPUR, NEW DELHI South West Delhi DELHI 110074 . "you", “your”, "user", “visitor” shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.</Text>
                        <Text style={styles.textHeader}>Your use of the website and/or purchase from us are governed by following Terms and Conditions:</Text>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>The content of the pages of this website is subject to change without notice</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>You may not create a link to our website from another website or document without VENUSA’s prior written consent.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</Text>
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

export default TermsAndConditions;