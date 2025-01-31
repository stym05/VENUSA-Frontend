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

const { width } = Dimensions.get("window");

class ItemDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [
                "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                "https://images.unsplash.com/photo-1535930749574-1399327ce78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            ],
            activeIndex: 0,
            colors: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A1"],
            isLoading: false
        };
    }

    handleScroll = (event) => {
        const activeIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.45));
        this.setState({ activeIndex });
    };

    render() {
        const {
            isLoading
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
                                        <Image source={{ uri: item }} style={styles.image} />
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
                                }}>{"Women /Category / Blouses & Tops"}</Text>
                            </View>
                            <View style={styles.paddedItem}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#000'
                                }}>{"Georgie Petite Trim Insert Top  "}</Text>
                            </View>
                            <View style={styles.paddedItem}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#000'
                                }}>{"₹1,400.00"}</Text>
                            </View>
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
                                }}>{"This feminine top is an elevated style that pairs back with denim or tailored pants for easy week to weekend wear."}</Text>
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
                                    fontSize: 20,
                                    fontWeight: '400',
                                    lineHeight: 24,
                                    color: '#000',
                                    marginBottom: 10
                                }}>Sizes</Text>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    {["S", "M", "L", "XL", "XXL"].map((size, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.colorButton, { backgroundColor: "#ddd", justifyContent: 'center', alignItems: 'center' }]}
                                            onPress={() => console.log(`Selected size: ${size}`)}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                textAlign: 'center',
                                                color: "#333",
                                            }}>{size}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.button} onPress={this.handleSubscribe}>
                                    {isLoading ? (<ActivityIndicator size={"small"} color={"#fff"} />) : (<Text style={styles.buttonText}>Add to cart</Text>)}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Footer navigation={this.props.navigation}/>
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
    image: {
        width: width * 0.45,
        height: "100%",
        resizeMode: "cover",
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
