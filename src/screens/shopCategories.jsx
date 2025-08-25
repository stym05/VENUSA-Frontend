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
import { DOMAIN, getSubCategorieById } from '../apis';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

class ShopCategories extends Component {
    constructor(props) {
        super(props);
        let categoryId = "";
        let categoryImage = "";
        console.log(this.props.route)
        if (this.props.route && this.props.route.params) {
            categoryId = this.props.route.params.categorie.categoryId
            categoryImage = this.props.route.params.categorie.categoryImage
        }
        console.log("categoryId is ", this.props.route.params)
        this.state = {
            isloading: false,
            categoryId,
            categoryImage,
            subCategory: [],
            screenData: Dimensions.get('window')
        }
    }

    componentDidMount = async () => {
        try {
            const {
                categoryId
            } = this.state;
            this.setState({ isloading: true })
            const response = await getSubCategorieById(categoryId);
            if (response && response.success) {
                const { subCategory } = response;
                this.setState({ subCategory, isloading: false })
            }
        } catch (err) {
            console.log("error in shopCategories is = ", err)
        }
        this.setState({ isloading: false })

        // Listen for orientation changes
        this.dimensionsSubscription = Dimensions.addEventListener('change', this.handleOrientationChange);
    }

    componentWillUnmount() {
        if (this.dimensionsSubscription) {
            this.dimensionsSubscription?.remove();
        }
    }

    handleOrientationChange = ({ window }) => {
        this.setState({ screenData: window });
    }

    handleScroll = (event) => {
        const { screenData } = this.state;
        const itemWidth = this.getItemWidth();
        const activeIndex = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
        this.setState({ activeIndex });
    };

    getItemWidth = () => {
        const { screenData } = this.state;
        const isTablet = screenData.width >= 768;
        const isLandscape = screenData.width > screenData.height;

        if (isTablet) {
            return isLandscape ? screenData.width * 0.25 : screenData.width * 0.4;
        }
        return screenData.width * 0.45;
    }

    getImageDimensions = () => {
        const { screenData } = this.state;
        const isTablet = screenData.width >= 768;
        const isSmallScreen = screenData.width < 360;

        if (isTablet) {
            return { width: 220, height: 280 };
        } else if (isSmallScreen) {
            return { width: 140, height: 180 };
        }
        return { width: 180, height: 230 };
    }

    getHeaderFontSize = () => {
        const { screenData } = this.state;
        const isTablet = screenData.width >= 768;
        const isSmallScreen = screenData.width < 360;

        if (isTablet) {
            return 38;
        } else if (isSmallScreen) {
            return 26;
        }
        return 32;
    }

    navigateToProducts = (id, name) => {
        this.props.navigation.navigate("ItemSection", {
            subCategoryId: id,
            productName: name
        })
    }

    renderCategoryItem = ({ item }) => {
        const imageDimensions = this.getImageDimensions();
        const itemWidth = this.getItemWidth();

        return (
            <TouchableOpacity
                onPress={() => this.navigateToProducts(item.subCategoryId, item.name)}
                style={[styles.categoryItem, { width: itemWidth }]}
            >
                <Image
                    source={{ uri: item.image }}
                    style={[styles.img, imageDimensions]}
                    resizeMode="cover"
                />
                <Text style={styles.text} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    renderHeaderButtons = () => {
        const { screenData } = this.state;
        const isSmallScreen = screenData.width < 360;
        const fontSize = isSmallScreen ? 12 : 16;
        const padding = isSmallScreen ? 8 : 15;

        const buttons = [
            { text: "All collections", action: () => console.log("All collections clicked") },
            { text: "New Arrivals", action: () => console.log("New Arrivals clicked") },
            { text: "Trending", action: () => console.log("Trending clicked") },
            { text: "Best Sellers", action: () => console.log("Best Sellers clicked") },
            { text: "Sale", action: () => console.log("Sale clicked"), color: '#b42124' }
        ];

        return (
            <View style={styles.headerContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.headerScrollContent}
                >
                    {buttons.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={button.action}
                            style={[styles.headerButton, { paddingHorizontal: padding }]}
                        >
                            <Text style={[
                                styles.headerText,
                                { fontSize, color: button.color || '#000' }
                            ]}>
                                {button.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    renderSection = (title, data) => {
        const { screenData } = this.state;
        const headerFontSize = this.getHeaderFontSize();

        return (
            <View style={[styles.shoppingContainer, { width: screenData.width * 0.9 }]}>
                <Text style={[styles.heading, { fontSize: headerFontSize }]}>{title}</Text>
                <View style={styles.flatListContainer}>
                    <FlatList
                        data={data}
                        horizontal
                        pagingEnabled={false}
                        onScroll={this.handleScroll}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => `${title}-${index}`}
                        renderItem={this.renderCategoryItem}
                        contentContainerStyle={styles.flatListContent}
                    />
                </View>
            </View>
        );
    }

    render() {
        const {
            subCategory,
            categorie,
            isloading,
            screenData
        } = this.state;

        if (isloading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            );
        }

        const backgroundImageStyle = {
            width: screenData.width,
            height: Math.min(screenData.height * 4.0, 600), // Cap the height
            marginTop: 10
        };

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.subContainer}>
                        {console.log(categorie, "------------------categorie")}

                        {this.renderHeaderButtons()}

                        <Image
                            // source={this.props.route.params.type === "Mens" ?
                            //     require('./Mens BG.png') :
                            //     require('./Womens BG.png')
                            // }
                            source={{ uri: this.state.categoryImage }}
                            style={backgroundImageStyle}
                            resizeMode="cover"
                        />

                        {this.renderSection("Shop by Categories", subCategory)}
                        {this.renderSection("New Arrivals", subCategory)}
                        {this.renderSection("Trending", subCategory)}
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
        backgroundColor: "#fff"
    },
    scrollContent: {
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50
    },
    heading: {
        fontFamily: "Didot",
        fontWeight: "400",
        lineHeight: 40,
        textAlign: 'center'
    },
    shoppingContainer: {
        marginTop: 25,
        paddingHorizontal: 10
    },
    flatListContainer: {
        marginTop: 25
    },
    flatListContent: {
        paddingHorizontal: 10
    },
    categoryItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        paddingHorizontal: 5
    },
    img: {
        marginTop: 10,
        borderRadius: 8
    },
    text: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 5
    },
    headerContainer: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 10
    },
    headerScrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '100%'
    },
    headerButton: {
        paddingVertical: 10,
        marginHorizontal: 2
    },
    headerText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        lineHeight: 20,
        textAlign: 'center'
    }
});

export default ShopCategories;