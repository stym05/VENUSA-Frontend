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

const Policy = (props) => {
    console.log("Props value is ", props);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.subContainer}>
                    <Text style={styles.header}>Privacy Policy</Text>
                    <View style={{width: isMobile() ? "95%" : '60%'}}>
                        <Text style={styles.textHeader}>Last updated on Feb 14th 2025</Text>
                        <Text style={styles.text}>This privacy policy sets out how VENUSA uses and protects any information that you give VENUSA when you visit their website and/or agree to purchase from them.</Text>
                        <Text style={styles.text}>VENUSA is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.</Text>
                        <Text style={styles.text}>VENUSA may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.</Text>
                        <Text style={styles.textHeader}>We may collect the following information:</Text>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Name</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Contact information including email address</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Demographic information such as postcode, preferences and interests, if required</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Other information relevant to customer surveys and/or offers</Text>
                        </View>
                        <Text style={styles.textHeader}>What we do with the information we gather</Text>
                        <Text style={styles.text} >We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</Text>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>Internal record keeping.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>We may use the information to improve our products and services.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</Text>
                        </View> 
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</Text>
                        </View>
                        
                        <Text style={styles.text} >We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</Text>
                        <Text style={styles.textHeader}>How we use cookies</Text>
                        
                        <Text style={styles.text} >A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.</Text>
                        <View style={{marginTop: 15}} />
                        <Text style={styles.text} >We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.</Text>
                        <View style={{marginTop: 15}} />
                        <Text style={styles.text} >Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</Text>
                        <View style={{marginTop: 15}} />
                        <Text style={styles.text} >You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.</Text>
                        <View style={{marginTop: 15}} />

                        <Text style={styles.textHeader}>Controlling your personal information</Text>
                        <Text style={styles.text}>You may choose to restrict the collection or use of your personal information in the following ways:</Text>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</Text>
                        </View>
                        <View style={styles.row}>
                            <Entypo name="dot-single" size={24} color="black"  />
                            <Text style={styles.text}>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at</Text>
                        </View>
                        <View style={{marginTop: 15}} />
                        <Text style={styles.text} >We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</Text>
                        <View style={{marginTop: 15}} />
                        <Text style={styles.text} >If you believe that any information we are holding on you is incorrect or incomplete, please write to C-608B, JVTS GARDEN, CHATTARPUR, NEW DELHI South West Delhi DELHI 110074 . or contact us at or as soon as possible. We will promptly correct any information found to be incorrect.</Text>
                        <View style={{marginTop: 15}} />
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
        color: "#333333",
        marginTop: 25
    },
    text: {
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "200",
        lineHeight: 28,
        color: "#333333"
    }
})

export default Policy;