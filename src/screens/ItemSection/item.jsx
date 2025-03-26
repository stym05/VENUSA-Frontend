import React from "react";
import {
    View,
    ImageBackground,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AddToWishList, DOMAIN, getAllCategories, removeFromWishList } from "../../apis";
import Store from "../../store";
import Toast from "react-native-toast-message";


class Item extends React.Component {
    constructor(props) {
        super(props);
        let item = {}
        if (this.props.item) {
            item = this.props.item
        }
        this.state = {
            loading: false,
            isSelected: false,
            isSale: true,
            imageUrl: item.images[0],
            name: item.name || "name",
            price: item.price || 0.0,
            id: item._id
        }
        console.log(this.state.imageUrl)
    }

    handlePress = (prodId) => {
        console.log("product id = ", prodId);
        this.props.navigation.navigate("ItemDescription", {
            productId: prodId
        });
    }

    toggleSelected = async (prodId) => {
        const {
            isSelected
        } = this.state;
        const userId = Store.getState().user.userData._id;
        const payload = {
            userId,
            productId: prodId
        }
        console.log("hello world", payload);
        if (!isSelected) {
            const response = await AddToWishList(payload);
            if (response.status) {
                if (response.code == 100) {
                    Toast.show({
                        text1: "Product added to wishlist",
                        type: "success",
                        visibilityTime: 5000
                    })
                } else {
                    Toast.show({
                        text1: "Product already added to wishlist",
                        type: "success",
                        visibilityTime: 5000
                    })
                }
                
                this.setState({ isSelected: true })
            } else {
                Toast.show({
                    text1: "something went wrong please try again later",
                    type: "error",
                    visibilityTime: 5000
                })
            }
        } else {
            const response = await removeFromWishList(payload);
            if (response.status) {
                if (response.code == 100) {
                    Toast.show({
                        text1: "Product removed from wishlist",
                        type: "success",
                        visibilityTime: 5000
                    })
                } else {
                    Toast.show({
                        text1: "Product already removed from wishlist",
                        type: "success",
                        visibilityTime: 5000
                    })
                }
                this.setState({ isSelected: false })
            } else {
                Toast.show({
                    text1: "something went wrong please try again later",
                    type: "error",
                    visibilityTime: 5000
                })
            }
        }
    }

    render() {
        const {
            loading,
            isSelected,
            isSale,
            name,
            imageUrl,
            price,
            id
        } = this.state;
        return loading ? (
            <ActivityIndicator size={"small"} color={"#000"} />
        ) : (
            <View style={styles.container}>

                <ImageBackground
                    style={{
                        width: 350,
                        height: 350,
                        resizeMode: 'contain',
                    }}
                    source={{ uri: imageUrl }}
                >
                    {isSale && (
                        <View style={styles.saleContainer}>
                            <Text style={styles.saleText}>Sale</Text>
                        </View>
                    )}
                    <View style={styles.heart}>
                        {isSelected ? <AntDesign name="heart" size={24} color="red" onPress={() => this.toggleSelected(id)} /> : <AntDesign onPress={() => this.toggleSelected(id)} name="hearto" size={24} color="black" />}
                    </View>
                </ImageBackground>
                <TouchableOpacity style={styles.upperDetails} onPress={() => this.handlePress(id)}>
                    <Text style={styles.clothName}>{name}</Text>
                    <Text style={styles.priceText}>₹ {price}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Item;


const styles = StyleSheet.create({
    container: {
        width: 350,
        margin: 20
    },
    heart: {
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        margin: 15
    },
    saleContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start'
    },
    saleText: {
        backgroundColor: "#333333",
        color: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        textAlign: 'center'
    },
    clothName: {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 20
    },
    priceText: {
        fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24
    },
    upperDetails: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Adds a semi-transparent background to the button
        padding: 10,
        borderRadius: 5,
    },
})