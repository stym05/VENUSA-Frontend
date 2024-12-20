import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ScrollView
} from 'react-native';
import Item from "./item";
import { isMobile } from "../../utils";
import Footer from "../../components/footer";

class ItemSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            array: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }

    render() {
        const {
            loading,
            array
        } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                <FlatList
                    data={array}
                    renderItem={({ item }) => <Item item={item} navigation={this.props.navigation} />}
                    keyExtractor={(item) => item.toString()}
                    numColumns={!isMobile() ? 3 : 2} // 3 columns for web, 2 for other platforms
                />
                <Footer />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default ItemSection;