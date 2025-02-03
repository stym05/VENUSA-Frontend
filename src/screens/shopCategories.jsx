import React, { Component } from 'react'
import {
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { ScrollView } from 'react-native-web';
import Footer from '../components/footer';

class ShopCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: false,
            subCategories: [{
                "_id": "67a048d987fabfe5cc14fc8f",
                "name": "T-shirt",
                "image": "https://media.canva.com/v2/mockup-template-rasterize/color0:171618/image0:s3%3A%2F%2Ftemplate.canva.com%2FEAFxZJHbX_A%2F1%2F0%2F933w--inuARME-hI.png/mockuptemplateid:FAqieNuus/size:L?csig=AAAAAAAAAAAAAAAAAAAAAFJ5vLkZbevw1sfH60mEhwwv52zBx9k_Lc1-xhEraQ1K&exp=1738624553&osig=AAAAAAAAAAAAAAAAAAAAAO8ogS6Y05Nzyi4suAYk1zlM0tHucEw3pgvO_t8xnE07&seoslug=black-and-orange-typography-never-give-up-stay-strong-t-shirt&signer=marketplace-rpc",
                "category": "67a04793ed440b07dd9a079f",
                "products": [],
                "createdAt": "2025-02-03T04:40:57.232Z",
                "updatedAt": "2025-02-03T04:40:57.232Z",
                "__v": 0
            }, {
                "_id": "67a048d987fabfe5cc14fc8f",
                "name": "T-shirt",
                "image": "https://media.canva.com/v2/mockup-template-rasterize/color0:171618/image0:s3%3A%2F%2Ftemplate.canva.com%2FEAFxZJHbX_A%2F1%2F0%2F933w--inuARME-hI.png/mockuptemplateid:FAqieNuus/size:L?csig=AAAAAAAAAAAAAAAAAAAAAFJ5vLkZbevw1sfH60mEhwwv52zBx9k_Lc1-xhEraQ1K&exp=1738624553&osig=AAAAAAAAAAAAAAAAAAAAAO8ogS6Y05Nzyi4suAYk1zlM0tHucEw3pgvO_t8xnE07&seoslug=black-and-orange-typography-never-give-up-stay-strong-t-shirt&signer=marketplace-rpc",
                "category": "67a04793ed440b07dd9a079f",
                "products": [],
                "createdAt": "2025-02-03T04:40:57.232Z",
                "updatedAt": "2025-02-03T04:40:57.232Z",
                "__v": 0
            }, {
                "_id": "67a048d987fabfe5cc14fc8f",
                "name": "T-shirt",
                "image": "https://media.canva.com/v2/mockup-template-rasterize/color0:171618/image0:s3%3A%2F%2Ftemplate.canva.com%2FEAFxZJHbX_A%2F1%2F0%2F933w--inuARME-hI.png/mockuptemplateid:FAqieNuus/size:L?csig=AAAAAAAAAAAAAAAAAAAAAFJ5vLkZbevw1sfH60mEhwwv52zBx9k_Lc1-xhEraQ1K&exp=1738624553&osig=AAAAAAAAAAAAAAAAAAAAAO8ogS6Y05Nzyi4suAYk1zlM0tHucEw3pgvO_t8xnE07&seoslug=black-and-orange-typography-never-give-up-stay-strong-t-shirt&signer=marketplace-rpc",
                "category": "67a04793ed440b07dd9a079f",
                "products": [],
                "createdAt": "2025-02-03T04:40:57.232Z",
                "updatedAt": "2025-02-03T04:40:57.232Z",
                "__v": 0
            }, {
                "_id": "67a048d987fabfe5cc14fc8f",
                "name": "T-shirt",
                "image": "https://media.canva.com/v2/mockup-template-rasterize/color0:171618/image0:s3%3A%2F%2Ftemplate.canva.com%2FEAFxZJHbX_A%2F1%2F0%2F933w--inuARME-hI.png/mockuptemplateid:FAqieNuus/size:L?csig=AAAAAAAAAAAAAAAAAAAAAFJ5vLkZbevw1sfH60mEhwwv52zBx9k_Lc1-xhEraQ1K&exp=1738624553&osig=AAAAAAAAAAAAAAAAAAAAAO8ogS6Y05Nzyi4suAYk1zlM0tHucEw3pgvO_t8xnE07&seoslug=black-and-orange-typography-never-give-up-stay-strong-t-shirt&signer=marketplace-rpc",
                "category": "67a04793ed440b07dd9a079f",
                "products": [],
                "createdAt": "2025-02-03T04:40:57.232Z",
                "updatedAt": "2025-02-03T04:40:57.232Z",
                "__v": 0
            }, {
                "_id": "67a048d987fabfe5cc14fc8f",
                "name": "T-shirt",
                "image": "https://media.canva.com/v2/mockup-template-rasterize/color0:171618/image0:s3%3A%2F%2Ftemplate.canva.com%2FEAFxZJHbX_A%2F1%2F0%2F933w--inuARME-hI.png/mockuptemplateid:FAqieNuus/size:L?csig=AAAAAAAAAAAAAAAAAAAAAFJ5vLkZbevw1sfH60mEhwwv52zBx9k_Lc1-xhEraQ1K&exp=1738624553&osig=AAAAAAAAAAAAAAAAAAAAAO8ogS6Y05Nzyi4suAYk1zlM0tHucEw3pgvO_t8xnE07&seoslug=black-and-orange-typography-never-give-up-stay-strong-t-shirt&signer=marketplace-rpc",
                "category": "67a04793ed440b07dd9a079f",
                "products": [],
                "createdAt": "2025-02-03T04:40:57.232Z",
                "updatedAt": "2025-02-03T04:40:57.232Z",
                "__v": 0
            }, {
                "_id": "67a048d987fabfe5cc14fc8f",
                "name": "T-shirt",
                "image": "https://media.canva.com/v2/mockup-template-rasterize/color0:171618/image0:s3%3A%2F%2Ftemplate.canva.com%2FEAFxZJHbX_A%2F1%2F0%2F933w--inuARME-hI.png/mockuptemplateid:FAqieNuus/size:L?csig=AAAAAAAAAAAAAAAAAAAAAFJ5vLkZbevw1sfH60mEhwwv52zBx9k_Lc1-xhEraQ1K&exp=1738624553&osig=AAAAAAAAAAAAAAAAAAAAAO8ogS6Y05Nzyi4suAYk1zlM0tHucEw3pgvO_t8xnE07&seoslug=black-and-orange-typography-never-give-up-stay-strong-t-shirt&signer=marketplace-rpc",
                "category": "67a04793ed440b07dd9a079f",
                "products": [],
                "createdAt": "2025-02-03T04:40:57.232Z",
                "updatedAt": "2025-02-03T04:40:57.232Z",
                "__v": 0
            }, {
                "_id": "67a048d987fabfe5cc14fc8f",
                "name": "T-shirt",
                "image": "https://media.canva.com/v2/mockup-template-rasterize/color0:171618/image0:s3%3A%2F%2Ftemplate.canva.com%2FEAFxZJHbX_A%2F1%2F0%2F933w--inuARME-hI.png/mockuptemplateid:FAqieNuus/size:L?csig=AAAAAAAAAAAAAAAAAAAAAFJ5vLkZbevw1sfH60mEhwwv52zBx9k_Lc1-xhEraQ1K&exp=1738624553&osig=AAAAAAAAAAAAAAAAAAAAAO8ogS6Y05Nzyi4suAYk1zlM0tHucEw3pgvO_t8xnE07&seoslug=black-and-orange-typography-never-give-up-stay-strong-t-shirt&signer=marketplace-rpc",
                "category": "67a04793ed440b07dd9a079f",
                "products": [],
                "createdAt": "2025-02-03T04:40:57.232Z",
                "updatedAt": "2025-02-03T04:40:57.232Z",
                "__v": 0
            }]
        }
    }

    componentDidMount = async () => {

    }

    handleScroll = (event) => {
        const activeIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.45));
        this.setState({ activeIndex });
    };

    navigateToProducts = () => {
        console.log("hello world")
        this.props.navigation.navigate("ItemSection", {
            categorie: "women"
        })
    }

    render() {
        const {
            subCategories
        } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.subContainer}>
                        <Image
                            source={{ uri: "https://thelenslounge.com/wp-content/uploads/2023/03/how-to-stand-for-a-photo-female-5.jpg" }}
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