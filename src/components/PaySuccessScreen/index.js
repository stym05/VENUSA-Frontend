import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet
} from 'react-native';


const PaySuccessScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <FontAwesome name="check-circle-o" size={24} color="black" />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PaySuccessScreen;