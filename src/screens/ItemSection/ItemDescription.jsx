import React from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
} from "react-native";
import Footer from "../../components/footer";
import { addToCart, createPreOrder, DOMAIN, getProductById } from "../../apis";
import Store from "../../store";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

class ItemDescription extends React.Component {
    constructor(props) {
        super(props);
        let productId = "";
        if (this.props && this.props.route) {
            productId = this.props.route.params.productId;
        }
        this.state = {
            productId,
            images: [],
            activeIndex: 0,
            colors: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A1"],
            isLoading: false,
            name: "",
            price: 0,
            description: "",
            size: "S",
            color: "",
            sizeAvailable: []
        };
    }

    componentDidMount = async () => {
        try {
            this.setState({ isloading: true });
            const { productId } = this.state;
            console.log("Product id we get is = ", productId);
            const response = await getProductById(productId);
            console.log(response)
            if (response && response.success) {
                console.log("images", response)
                let size = response.product.stock.filter((item) => {
                    return item.quantity > 0
                })
                console.log("images", size)
                const imgs = response.product.images;
                console.log("images", imgs)
                const images = imgs.map((item) => {
                    return item?.includes("http") ? item : DOMAIN + item;
                })
                console.log("images", images)
                this.setState({
                    images,
                    colors: response.product.colors,
                    name: response.product.name,
                    price: response.product.price,
                    description: response.product.description,
                    sizeAvailable: size
                })
            }
            this.setState({ isloading: false })
        } catch (err) {
            console.log("ItemDescription error is ", err);
        }
    }

    handleScroll = (event) => {
        const activeIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.45));
        this.setState({ activeIndex });
    };

    handleAddToCart = async () => {
        try {
            const { productId, size, color } = this.state;
            const userId = Store.getState().user.userData._id
            const payload = {
                userId: userId,
                productId,
                size,
                color
            }
            const response = await addToCart(payload);
            if (response.success) {
                Toast.show({
                    text1: "Product added to cart",
                    type: "success",
                    visibilityTime: 5000
                })
            } else {
                Toast.show({
                    text1: "something went wrong. please try again later",
                    type: "error",
                    visibilityTime: 5000
                })
            }
        } catch (err) {
            console.log("Error to adding cart is ", err);
            Toast.show({
                text1: "something went wrong. please try again later",
                type: "error",
                visibilityTime: 5000
            })
        }
    }

    render() {
        const {
            isLoading,
            sizeAvailable
        } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.itemDescriptionContainer}>
                        <View style={{ height: 400, width: "45%", borderWidth: 1, marginRight: 20 }}>
                            {/* Swappable Images */}
                            <FlatList
                                data={this.state.images}
                                horizontal
                                pagingEnabled
                                onScroll={this.handleScroll}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ height: 400 }}>
                                        <Image source={{ uri: item }} style={{
                                            width: width * 0.45,
                                            height: "100%",
                                            resizeMode: "cover",
                                        }} />
                                    </View>
                                )}
                            />
                            {/* Dots Indicator */}
                            <View style={styles.overlayDotContainer}>
                                {this.state.images.map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.dot,
                                            this.state.activeIndex === index && styles.activeDot,
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={{ marginLeft: 50 }}>
                            <View style={styles.paddedItem}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: '400',
                                    lineHeight: 20,
                                    color: '#808080'
                                }}>{this.props.route.params.ItemDescription}</Text>
                            </View>
                            <View style={styles.paddedItem}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#000'
                                }}>{this.state.name}</Text>
                            </View>
                            {/* <View style={styles.paddedItem}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#000'
                                }}>{"₹"}{this.state.price}</Text>
                            </View> */}
                            <View style={styles.paddedItem}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#000'
                                }}>{"*****"}</Text>
                            </View>
                            <View style={styles.paddedItem}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: '400',
                                    lineHeight: 20,
                                    color: '#808080'
                                }}>{this.state.description}</Text>
                            </View>
                            <View style={[styles.paddedItem]}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#000',
                                    marginBottom: 10
                                }}>Colors</Text>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    {this.state.colors.map((color, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.colorButton, { backgroundColor: color }]}
                                            onPress={() => onPress && onPress(color)}
                                        />
                                    ))}
                                </View>
                            </View>
                            <View style={[styles.paddedItem]}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 14,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#333333',
                                    marginBottom: 10
                                }}>Select Size</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', fontWeight: 400, fontSize: 14, }}>
                                    {sizeAvailable.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.colorButton, { backgroundColor: "#ddd", justifyContent: 'center', alignItems: 'center' }]}
                                            onPress={() => console.log(`Selected size: ${item.size}`)}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                textAlign: 'center',
                                                color: "#333",
                                            }}>{item.size}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "Roboto", textDecorationLine: "underline" }}>Size Guide</Text>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.button} onPress={this.handleAddToCart}>
                                    {isLoading ? (<ActivityIndicator size={"small"} color={"#fff"} />) : (<Text style={styles.buttonText}>Pre Order</Text>)}
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
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    dotContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    overlayDotContainer: {
        position: "absolute",
        bottom: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#ddd",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "#333",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
    },
    itemDescriptionContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 50
    },
    paddedItem: {
        paddingVertical: 10,
        width: width * 0.30
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
        borderWidth: 2,
        borderColor: "#fff",
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
});

export default ItemDescription;
