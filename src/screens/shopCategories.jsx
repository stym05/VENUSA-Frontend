import React, { Component } from 'react'
import {
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-web';
import Footer from '../components/footer';
import { getSubCategorieById } from '../apis';

class ShopCategories extends Component {
    constructor(props) {
        super(props);
        let categorie = "Mens"
        if(this.props.route && this.props.route.params){
            categorie = this.props.route.params.categorie || "Mens"
            console.log("categorie selected is =", categorie)
        }
        this.state = {
            isloading: false,
            categorie,
            subCategories: []
        }
    }

    componentDidMount = async () => {
        try {
            const {
                categorie
            } = this.state;
            this.setState({ isloading: true })
            const response = await getSubCategorieById(categorie.id);
            if(response && response.success) {
                const { subCategories } = response;
                this.setState({ subCategories, isloading: false })
            }
        } catch (err) {
            console.log("error in shopCategories is = ", err)
        }
        this.setState({isloading:  false})
    }

    handleScroll = (event) => {
        const activeIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.45));
        this.setState({ activeIndex });
    };

    navigateToProducts = (id, name) => {
        console.log("hello world")
        this.props.navigation.navigate("ItemSection", {
            productId: id,
            productName: name
        })
    }

    render() {
        const {
            subCategories,
            categorie,
            isloading
        } = this.state
        return isloading ? (<View style={{flex: 1}}>
            <ActivityIndicator size={"large"} color={"#000"} />
        </View>) : (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.subContainer}>
                        <Image
                            source={{ uri: categorie.categoryImage }}
                            style={{
                                width: Dimensions.get("window").width * 0.8,
                                height: Dimensions.get("window").height * 0.8,
                                marginTop: 10
                            }}
                        />
                        <View style={styles.shoppingContainer} >
                            <Text style={styles.heading}>Shop by Categories</Text>
                            <View style={{ marginTop: 25 }}>
                                <FlatList
                                    data={subCategories}
                                    horizontal
                                    pagingEnabled
                                    onScroll={this.handleScroll}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => this.navigateToProducts(item._id, item.name)} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.img}
                                            />
                                            <Text style={styles.text}>{item.name}</Text>
                                        </TouchableOpacity>)}
                                />
                            </View>
                        </View>
                        <View style={styles.shoppingContainer} >
                            <Text style={styles.heading}>New Arivals</Text>
                            <View style={{ marginTop: 25 }}>
                                <FlatList
                                    data={subCategories}
                                    horizontal
                                    pagingEnabled
                                    onScroll={this.handleScroll}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => this.navigateToProducts(item._id)} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.img}
                                            />
                                            <Text style={styles.text}>{item.name}</Text>
                                        </TouchableOpacity>)}
                                />
                            </View>
                        </View>
                    </View>
                    <Footer navigation={this.props.navigation} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50
    },
    heading: {
        fontFamily: "Didot",
        fontWeight: "400",
        fontSize: 32,
        lineHeight: 40
    },
    shoppingContainer: {
        width: Dimensions.get("window").width * 0.8,
        marginTop: 25
    },
    img: {
        width: 250,
        height: 350,
        marginTop: 10
    },
    text: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 20
    }
})

export default ShopCategories;