import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet
} from 'react-native';

class WishList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false
        }
    }

    render(){
        return(
            <SafeAreaView>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    subContainer: [

    ]
})

export default WishList;