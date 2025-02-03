import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get("window");

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            totalItemCount: 0.0,
            totalAmount: 0.0,
            cartProducts: [{
                product: null, // References Product
                productName: "Georgie Petite Trim Insert Top",
                image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                size: "s", // Selected size (e.g., "M", "L", "XL")
                quantity: 1, // Number of items for this size
                price: 400 // Price per unit (store in case price changes later)
            }]
        }
    }

    render() {
        const {
            totalItemCount,
            totalAmount,
            cartProducts
        } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.subContainer}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.header}>Your Cart</Text>
                            <View style={{ backgroundColor: 'red' }}>
                                {cartProducts.map((item) => {
                                    return (<View style={{ display: 'flex', flexDirection: 'row' }}>
                                        {console.log("Item value is this",item)}
                                        <TouchableOpacity style={{ height: 400 }}>
                                            <Image source={{ uri: item.image }} style={styles.image} />
                                        </TouchableOpacity>
                                        <View>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View>
                                                    <Text>{item.productName}</Text>
                                                    <Text>size: {item.size}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => this.handleTrashItem(item)}>
                                                    <FontAwesome name="trash-o" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>)
                                })}
                            </View>
                        </View>
                        <View style={{ width: '50%' }}>
                            <View style={styles.payContainer}>
                                <View style={styles.row}>
                                    <Text>SubTotal {"("}{totalItemCount}{")"}</Text>
                                    <Text>₹{totalAmount}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.button}>
                                        <Text style={styles.buttonText}>Continue to CheckOut</Text>
                                    </TouchableOpacity>
                                    <Text>Shipping, taxes, and discount codes calculated at checkout.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
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
    subContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 32,
        lineHeight: 38
    },
    payContainer: {
        backgroundColor: "#808080",
        opacity: 10,
        padding: 25,
        width: '75%',
        marginLeft: 50,
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: "cover",
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

export default Cart;