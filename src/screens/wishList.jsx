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
import { getWishList } from "../apis";
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
                const userId = Store.getState().user.userData._id;
                const response = await getWishList(userId);
                
                if (response.status) {
                    const products = response.wishlist?.products || [];
                    this.setState({ cartProducts: products, loading: false });
                } else {
                    this.setState({ cartProducts: [], loading: false });
                }
            } else {
                this.setState({ isAuthenticated: false, isModalVisible: true, loading: false });
            }
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            this.setState({ cartProducts: [], loading: false });
        }
    }

    handleTrashItem = (item) => {
        
        console.log("Remove item from wishlist:", item);
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
                        <View style={{ width: isMobile() ? "80%" : '50%' }}>
                            <Text style={styles.header}>Your Wishlist</Text>
                            <View style={styles.listContainer}>
                                {Array.isArray(cartProducts) && cartProducts.map((item) => (
                                    <View key={item._id} style={styles.itemRow}>
                                        <TouchableOpacity>
                                            <Image source={{ uri: item?.product?.images[0] }} style={styles.image} />
                                        </TouchableOpacity>
                                        <View style={styles.itemDetails}>
                                            <View style={styles.itemHeader}>
                                                <Text style={styles.text}>{item?.product?.name}</Text>
                                                <TouchableOpacity onPress={() => this.handleTrashItem(item)}>
                                                    <FontAwesome name="trash-o" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.text2}>Size: {item?.product?.stock?.[0]?.size || "N/A"}</Text>
                                            <Text style={styles.text}>₹{item?.product?.price}</Text>
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
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>Continue to Checkout</Text>
                                </TouchableOpacity>
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
    listContainer: { padding: 20 },
    itemRow: { flexDirection: 'row', marginBottom: 25 },
    itemDetails: { flex: 1, justifyContent: 'space-between', paddingLeft: 20 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    image: { width: 100, height: 100, resizeMode: "cover" },
    text: { fontSize: 18, fontWeight: '500' },
    text2: { fontSize: 16, color: "#808080" },
    payContainer: { padding: 25, backgroundColor: "#f5f5f5", marginTop: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { backgroundColor: '#1A1A1A', padding: 15, alignItems: 'center', marginTop: 20 },
    buttonText: { color: "#fff", fontWeight: "600" },
    modalContainer: { padding: 25, backgroundColor: '#fff', alignItems: 'center' },
    modalTitle: { fontSize: 24, fontWeight: '600' },
    modalText: { fontSize: 18, fontWeight: '300', marginTop: 20 },
});

export default WishList;
