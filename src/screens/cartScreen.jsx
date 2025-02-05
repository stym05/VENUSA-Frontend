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
import { isMobile } from '../utils/index';
import Footer from '../components/footer/index';

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
            },{
                product: null, // References Product
                productName: "Georgie Petite Trim Insert Top",
                image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                size: "s", // Selected size (e.g., "M", "L", "XL")
                quantity: 1, // Number of items for this size
                price: 400 // Price per unit (store in case price changes later)
            },{
                product: null, // References Product
                productName: "Georgie Petite Trim Insert Top",
                image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                size: "s", // Selected size (e.g., "M", "L", "XL")
                quantity: 1, // Number of items for this size
                price: 400 // Price per unit (store in case price changes later)
            },{
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
                        <View style={{ width: isMobile() ? "80%" :  '50%' }}>
                            <Text style={styles.header}>Your Cart</Text>
                            <View style={{ padding: 20 }}>
                                {cartProducts.map((item) => {
                                    return (<View style={{ display: 'flex', flexDirection: 'row', marginBottom: 25}}>
                                        <TouchableOpacity>
                                            <Image source={{ uri: item.image }} style={styles.image} />
                                        </TouchableOpacity>
                                        <View style={{width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginVertical: 20}}>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                                <View style={{marginLeft: 20}}>
                                                    <Text style={styles.text}>{item.productName}</Text>
                                                    <Text style={styles.text2}>size: {item.size}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => this.handleTrashItem(item)}>
                                                    <FontAwesome name="trash-o" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                                <View style={{marginLeft: 20}}>
                                                    <Text style={styles.text}>₹{"35000.00"}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>)
                                })}
                            </View>
                        </View>
                        <View style={{ width: isMobile() ? "100%" : '50%' }}>
                            <View style={styles.payContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.text}>SubTotal {"("}{totalItemCount}{")"}</Text>
                                    <Text style={styles.text}>₹{totalAmount}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <TouchableOpacity style={styles.button}>
                                        <Text style={styles.buttonText}>Continue to CheckOut</Text>
                                    </TouchableOpacity>
                                    <Text style={{textAlign: 'center'}}>Shipping, taxes, and discount codes calculated at checkout.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Footer />
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
        flexDirection: isMobile() ? "column" : 'row',
        width: '100%',
        paddingHorizontal: isMobile() ? 5 : 50,
        marginBottom: 50
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
        lineHeight: 38,
        padding: 20
    },
    payContainer: {
        backgroundColor: "#808080",
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        opacity: 10,
        padding: 25,
        width: '75%',
        marginLeft: 50,
        height: isMobile() ? null : 250,
        marginTop: 50
    },
    image: {
        width: isMobile() ? 100 : 250,
        height: isMobile() ? 100 :250,
        resizeMode: "cover",
    },
    text: {
        fontFamily: "Roboto",
        fontWeight: '500',
        fontSize: 18
    },
    text2: {
        fontFamily: "Roboto",
        fontWeight: '200',
        color: "#808080",
        fontSize: 16
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