import react from "react";
import { StyleSheet } from "react-native";
import {
    View,
    Text
} from 'react-native';

const OfferStrip = () => {

    const navigateToScreen = () => {
        console.log("navigation to perticular screen");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.boldText}>20% Offer{" "}</Text>
            <Text style={styles.text}>for the first time user. Shop{" "}
                <Text style={styles.boldText} onPress={navigateToScreen}>Women{" "}</Text>
                 and{" "}
                <Text style={styles.boldText} onPress={navigateToScreen}>Men</Text>
            </Text>
        </View>
    ) 
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        color: "white",
    },
    boldText: {
        color: 'white',
        fontWeight: 'bold'
    }
})

export default OfferStrip;