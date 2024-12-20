import React from "react";
import {
    View,
    Text,
    SafeAreaView
} from 'react-native';


class ItemDescription extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false
        }
    }

    render() {
        return (
            <SafeAreaView>
                <Text>ItemDescription</Text>
            </SafeAreaView>
        )
    }
}

export default ItemDescription;