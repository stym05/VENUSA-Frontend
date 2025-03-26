import React, { Component } from "react";
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
import Store from "../store";
import { getCartItem } from "../apis";
import Modal from "react-native-modal";
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get("window");

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            totalItemCount: 0,
            totalAmount: 0,
            isAuthenticated: Store.getState().user.isAuthenticated || false,
            cartProducts: [],
            isModalVisible: false
        };
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            const { isAuthenticated } = this.state;
            if (isAuthenticated) {
                const userId = Store.getState().user.userData._id;
                const response = await getCartItem(userId);
                if (response.success) {
                    console.log("cart data is ", response.cart);
                    this.setState({ cartProducts: response?.cart?.products, loading: false });
                } else {
                    this.setState({ cartProducts: [], loading: false });
                }
            } else {
                this.setState({ isAuthenticated: false, isModalVisible: true, loading: false });
            }
        } catch (err) {
            console.error("Error fetching cart items", err);
            this.setState({ loading: false });
        }
    }

    toggleModal = () => {
        this.setState((prevState) => ({ isModalVisible: !prevState.isModalVisible }));
    };

    handleTrashItem = (item) => {
        // Implement logic to remove item from cart
    };

    render() {
        const { totalItemCount, totalAmount, cartProducts, isModalVisible } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.subContainer}>
                        <Modal isVisible={isModalVisible}>
                            <View style={styles.modalWrapper}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalHeader}>
                                        <Entypo name="cross" size={24} color="black" onPress={this.toggleModal} />
                                    </View>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>Oops, you're not logged in</Text>
                                        <Text style={styles.modalSubtitle}>Login to access your cart items</Text>
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            this.toggleModal();
                                            this.props.navigation.replace("Login");
                                        }}>
                                            <Text style={styles.buttonText}>Login</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <View style={{ width: isMobile() ? "80%" : '50%' }}>
                            <Text style={styles.header}>Your Cart</Text>
                            {cartProducts.length === 0 && (
                                <Text style={styles.emptyCartText}>0 Products</Text>
                            )}
                            <View style={styles.cartItemsContainer}>
                                {cartProducts.map((item, index) => (
                                    <View key={index} style={styles.cartItem}>
                                        <TouchableOpacity>
                                            <Image source={{ uri: item.product.images[0] }} style={styles.image} />
                                        </TouchableOpacity>
                                        <View style={styles.cartItemDetails}>
                                            <View style={styles.cartItemHeader}>
                                                <View style={styles.cartItemInfo}>
                                                    <Text style={styles.text}>{item.product.name}</Text>
                                                    <Text style={styles.text2}>Size: {item.size}</Text>
                                                    <Text style={styles.text2}>Color: {item.color}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => this.handleTrashItem(item)}>
                                                    <FontAwesome name="trash-o" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.text}>₹{item.product.price}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={{ width: isMobile() ? "100%" : '50%' }}>
                            <View style={styles.payContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.text}>SubTotal ({totalItemCount})</Text>
                                    <Text style={styles.text}>₹{totalAmount}</Text>
                                </View>
                                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('CheckoutScreen')}>
                                    <Text style={styles.buttonText}>Continue to Checkout</Text>
                                </TouchableOpacity>
                                <Text style={styles.checkoutNote}>Shipping, taxes, and discount codes calculated at checkout.</Text>
                            </View>
                        </View>
                    </View>
                    <Footer navigation={this.props.navigation} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    subContainer: { flexDirection: isMobile() ? "column" : 'row', width: '100%', paddingHorizontal: isMobile() ? 5 : 50, marginBottom: 50 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    header: { fontSize: 32, fontWeight: "500", padding: 20 },
    emptyCartText: { fontSize: 18, fontWeight: "100", padding: 20 },
    cartItemsContainer: { padding: 20 },
    cartItem: { flexDirection: 'row', marginBottom: 25 },
    cartItemDetails: { flex: 1, marginVertical: 20 },
    cartItemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    cartItemInfo: { marginLeft: 20 },
    image: { width: isMobile() ? 100 : 250, height: isMobile() ? 100 : 250, resizeMode: "cover" },
    text: { fontSize: 18, fontWeight: '500' },
    text2: { fontSize: 16, fontWeight: '200', color: "#808080" },
    button: { marginTop: 50, backgroundColor: '#1A1A1A', padding: 15, alignItems: 'center' },
    buttonText: { color: "#fff", fontWeight: "600" },
    modalWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: isMobile() ? "95%" : width * 0.6, padding: 25, backgroundColor: '#fff' },
    modalHeader: { alignItems: 'flex-end' },
    modalContent: { alignItems: 'center' },
    modalTitle: { fontSize: 32, fontWeight: '600' },
    modalSubtitle: { fontSize: 18, fontWeight: '300', marginTop: 50 },
    checkoutNote: { textAlign: 'center' }
});

export default Cart;
