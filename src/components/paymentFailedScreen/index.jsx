import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';


class PaymentFailedScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defaultError: "Please ensure that the billing address you provided is the same one where your debit/credit card is registered."
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <MaterialIcons name="error-outline" size={65} color="#C30000" />
                <Text style={styles.heading}>Sorry, Payment failed</Text>
                <View style={styles.mid}>
                    <Text style={styles.text1}>Unfortunately, your order Cannot Be Completed.</Text>
                    <Text style={styles.text1}>{this.state.defaultError}</Text>
                    <Text style={styles.text1}>Alternatively, please try a different payment method.</Text>
                </View>
                <View style={{width: 300}}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Pay Now</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.mid}>
                    <Text style={styles.text2}>Please Contact Us For Any Query</Text>
                    <Text style={styles.text2}>+91 - 887 766 4332</Text>
                    <Text style={styles.text2}>or</Text>
                    <Text style={styles.text2}>customercare@venusa.co.in</Text>
                </View> */}
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
        color: "#C30000"
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
})

export default PaymentFailedScreen;