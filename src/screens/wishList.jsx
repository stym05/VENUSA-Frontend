import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { isMobile } from '../utils/index';
import Footer from '../components/footer/index';
import Store from "../store";
import { getWishList, removeFromWishList, addToCart } from "../apis";
import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

class WishList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            totalItemCount: 0,
            totalAmount: 0.0,
            cartProducts: [],
            isModalVisible: false,
            isAuthenticated: Store.getState().user.isAuthenticated
        };
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            const { isAuthenticated } = this.state;

            if (isAuthenticated) {
                await this.fetchWishlistData();
            } else {
                this.setState({ isAuthenticated: false, isModalVisible: true, loading: false });
            }
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            this.setState({ cartProducts: [], loading: false });
        }
    }

    fetchWishlistData = async () => {
        try {
            const userId = Store.getState().user.userData._id;
            const response = await getWishList(userId);

            if (response.status) {
                const products = response.wishlist?.products || [];
                this.setState({ cartProducts: products, loading: false });
            } else {
                this.setState({ cartProducts: [], loading: false });
            }
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            this.setState({ cartProducts: [], loading: false });
        }
    }

    handleTrashItem = async (item) => {
        try {
            const userId = Store.getState().user.userData._id;
            const data = {
                userId: userId,
                productId: item?.product?._id
            };

            const response = await removeFromWishList(data);
            if (response.status) {
                console.log("Item removed from wishlist successfully");
                await this.fetchWishlistData();
            } else {
                console.error("Failed to remove item from wishlist");
            }
        } catch (err) {
            console.error("Error removing item from wishlist:", err);
        }
    };

    handleAddToCart = async (item) => {
        try {
            const userId = Store.getState().user.userData._id;

            // Check if product has stock information
            const size = item?.product?.stock?.[0]?.size || "M";
            const color = item?.product?.colors?.[0] || "Default";

            const data = {
                userId: userId,
                productId: item?.product?._id,
                quantity: 1,
                size: size,
                color: color
            };

            const response = await addToCart(data);
            if (response.success) {
                console.log("Item added to cart successfully");
                // Optionally, remove from wishlist after adding to cart
                await this.handleTrashItem(item);
            } else {
                console.error("Failed to add item to cart");
            }
        } catch (err) {
            console.error("Error adding item to cart:", err);
        }
    };

    render() {
        const { totalItemCount, totalAmount, cartProducts, isModalVisible } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.subContainer}>
                        <Modal isVisible={isModalVisible}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Oops, you're not logged in</Text>
                                <Text style={styles.modalText}>Login to view your wishlist</Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        this.setState({ isModalVisible: false });
                                        this.props.navigation.replace("Login");
                                    }}
                                >
                                    <Text style={styles.buttonText}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        <View style={{ width: isMobile() ? "100%" : '100%' }}>
                            <Text style={styles.header}>Your Wishlist</Text>
                            {cartProducts.length === 0 && (
                                <Text style={styles.emptyText}>Your wishlist is empty</Text>
                            )}
                            <View style={styles.listContainer}>
                                {Array.isArray(cartProducts) && cartProducts.map((item) => (
                                    <View key={item._id} style={styles.itemRow}>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('ItemDescription', {
                                                productId: item?.product?.productId || item?.product?._id,
                                                productName: item?.product?.name
                                            })}
                                        >
                                            <Image source={{ uri: item?.product?.images[0] }} style={styles.image} />
                                        </TouchableOpacity>
                                        <View style={styles.itemDetails}>
                                            <View style={styles.itemHeader}>
                                                <View style={styles.itemInfo}>
                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate('ItemDescription', {
                                                            productId: item?.product?.productId || item?.product?._id,
                                                            productName: item?.product?.name
                                                        })}
                                                    >
                                                        <Text style={styles.text}>{item?.product?.name}</Text>
                                                    </TouchableOpacity>
                                                    <Text style={styles.text2}>Size: {item?.product?.stock?.[0]?.size || "N/A"}</Text>
                                                    <Text style={styles.text}>₹{item?.product?.price}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => this.handleTrashItem(item)}>
                                                    <FontAwesome name="trash-o" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.addToCartButton}
                                                onPress={() => this.handleAddToCart(item)}
                                            >
                                                <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
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
    subContainer: { flexDirection: isMobile() ? "column" : 'row', padding: 20 },
    header: { fontSize: 32, fontWeight: "500", padding: 20 },
    emptyText: { fontSize: 18, fontWeight: "300", padding: 20, color: "#808080" },
    listContainer: { padding: 20 },
    itemRow: { flexDirection: 'row', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", paddingBottom: 20 },
    itemDetails: { flex: 1, paddingLeft: 20 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    itemInfo: { flex: 1 },
    image: { width: isMobile() ? 100 : 150, height: isMobile() ? 100 : 150, resizeMode: "cover" },
    text: { fontSize: 18, fontWeight: '500', marginBottom: 5 },
    text2: { fontSize: 16, color: "#808080", marginBottom: 5 },
    button: { backgroundColor: '#1A1A1A', padding: 15, alignItems: 'center', marginTop: 20 },
    buttonText: { color: "#fff", fontWeight: "600" },
    addToCartButton: { backgroundColor: '#1A1A1A', padding: 12, alignItems: 'center', borderRadius: 5, marginTop: 10, width: isMobile() ? "100%" : "50%" },
    addToCartButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
    modalContainer: { padding: 25, backgroundColor: '#fff', alignItems: 'center', borderRadius: 10 },
    modalTitle: { fontSize: 24, fontWeight: '600' },
    modalText: { fontSize: 18, fontWeight: '300', marginTop: 20 },
});

export default WishList;
