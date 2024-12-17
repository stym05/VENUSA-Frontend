import React from "react";
import {
    View,
    Text,
    SafeAreaView
} from 'react-native';
import Header from "../../components/header";

class ItemSection extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
        }
    }

    render(){
        return(
            <SafeAreaView>
                <Header props={this.props} />
                <Text>Hellow</Text>
            </SafeAreaView>
        )
    }
}

export default ItemSection;