import React, { useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ScrollView,
    StyleSheet,
} from 'react-native';
import Item from "./item";
import { isMobile } from "../../utils";
import Footer from "../../components/footer";
import { Picker } from '@react-native-picker/picker';

class ItemSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            array: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            selectedLanguage: null,
            productCount: 0
        }
    }
    pickerRef = React.createRef();


    open() {
        this.pickerRef.current.focus();
    }

    close() {
        this.pickerRef.current.blur();
    }

    render() {
        const {
            loading,
            array,
            selectedLanguage,
            productCount
        } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.itemContainer}>
                        <View style={styles.filterSection}>
                            <View style={styles.offerText}>
                                <Text style={styles.text2}>Offers</Text>
                                <Text style={styles.OfferText2}>Member Exclusive Prices</Text>
                                <Text style={styles.OfferText2}>Sweatshirts starting ₹799</Text>
                            </View>
                            <View style={styles.offerText}>
                                <Text style={styles.text2}>New In</Text>
                                <Text style={styles.OfferText2}>View All</Text>
                                <Text style={styles.OfferText2}>Women's Clothing | New Arrivals</Text>
                            </View>
                            <View style={styles.offerText}>
                                <Text style={styles.text2}>Collection</Text>
                                <Text style={styles.OfferText2}>Top</Text>
                                <Text style={styles.OfferText2}>Bras</Text>
                                <Text style={styles.OfferText2}>Pants</Text>
                            </View>
                            <View style={styles.offerText}>
                                <Text style={styles.text2}>Featured</Text>
                                <Text style={styles.OfferText2}>Shop All</Text>
                                <Text style={styles.OfferText2}>New In</Text>
                            </View>
                        </View>
                        <View style={styles.itemList}>
                            <View style={{marginHorizontal: 20}}>
                                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                    <Text style={styles.text}><Text style={styles.text2}>Category/</Text>Tops</Text>
                                    <Text style={styles.text2}>Products {"("}{productCount}{")"}</Text>
                                </View>
                                <View style={[styles.row,{marginVertical: 25}]}>
                                    <Picker
                                        selectedValue={selectedLanguage}
                                        onValueChange={(itemValue) =>
                                            this.setState({ selectedLanguage: itemValue })
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Sort By" value="sort by" />
                                        <Picker.Item label="JavaScript" value="js" />
                                    </Picker>
                                    <Picker
                                        selectedValue={selectedLanguage}
                                        onValueChange={(itemValue) =>
                                            this.setState({ selectedLanguage: itemValue })
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Color" value="color" />
                                        <Picker.Item label="JavaScript" value="js" />
                                    </Picker>
                                    <Picker
                                        selectedValue={selectedLanguage}
                                        onValueChange={(itemValue) =>
                                            this.setState({ selectedLanguage: itemValue })
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Size" value="Size" />
                                        <Picker.Item label="JavaScript" value="js" />
                                    </Picker>
                                    <Picker
                                        selectedValue={selectedLanguage}
                                        onValueChange={(itemValue) =>
                                            this.setState({ selectedLanguage: itemValue })
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Product Type" value="product type" />
                                        <Picker.Item label="JavaScript" value="js" />
                                    </Picker>
                                </View>

                            </View>
                            <FlatList
                                data={array}
                                renderItem={({ item }) => <Item item={item} navigation={this.props.navigation} />}
                                keyExtractor={(item) => item.toString()}
                                numColumns={!isMobile() ? 3 : 2} // 3 columns for web, 2 for other platforms
                            />
                        </View>
                    </View>
                    <Footer navigation={this.props.navigation}/>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        padding: 20,
        marginTop: 25
    },
    filterSection: {
        width: isMobile() ? null : '15%',
    },
    itemList: {
        width: isMobile() ? null : '80%',
    },
    text: {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 24,
        lineHeight: 28
    },
    picker: {
        height: 50,
        width: 150,
        borderWidth: 0,
        fontSize: 16,
        lineHeight: 28,
        fontWeight: '400',
        fontFamily: 'Roboto',
        marginRight: 50
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    text2: {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 24,
        lineHeight: 28,
        color: '#808080'
    },
    offerText: {
        marginBottom: 20,
    },
    OfferText2: {
        fontFamily: 'Roboto',
        fontWeight: '200',
        fontSize: 14,
        lineHeight: 16,
    }
})

export default ItemSection;