import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet
} from 'react-native';


class PaySuccessScreen extends React.Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FontAwesome name="check-circle-o" size={65} color="#00966D" />
                <Text style={styles.heading}>Payment Successful</Text>
                <View style={styles.mid}>
                    <Text style={styles.text1}>Thank you for choosing Modimal, Your order will be generated based on your delivery request. </Text>
                    <Text style={styles.text1}>the Receipt has been sent to your email.</Text>
                </View>
                <View style={styles.mid}>
                    <Text style={styles.text2}>Please Contact Us For Any Query</Text>
                    <Text style={styles.text2}>+91 - 887 766 4332</Text>
                    <Text style={styles.text2}>or</Text>
                    <Text style={styles.text2}>customercare@venusa.co.in</Text>
                </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 40,
        lineHeight: 56,
        textAlign: 'center',
        color: "#00966D"
    },
    mid: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    text1: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: "#333333"
    },
    text2: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 18,
        lineHeight: 32.4,
        textAlign: 'center',
        color: "#404040"
    }
})

export default PaySuccessScreen;