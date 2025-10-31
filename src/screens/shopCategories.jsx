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
    ActivityIndicator,
    Platform
} from 'react-native';
import { ScrollView } from 'react-native-web';
import Footer from '../components/footer';
import { DOMAIN, getSubCategorieById, getAllCategories } from '../apis';
import { CategorySectionSkeleton } from '../components/SkeletonLoader/index';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

class ShopCategories extends Component {
    constructor(props) {
        super(props);

        // Get parameters from route or URL
        let categoryId = "";
        let type = "";

        // Try to get from route params first
        if (this.props.route && this.props.route.params) {
            categoryId = this.props.route.params.categoryId || "";
            type = this.props.route.params.type || "";
        }

        // For web, also check URL parameters on refresh
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (!categoryId) {
                categoryId = urlParams.get('categoryId') || "";
            }
            if (!type) {
                type = urlParams.get('type') || "";
            }
        }

        console.log("ShopCategories params:", { categoryId, type });
        this.state = {
            isloading: false,
            categoryId,
            type,
            subCategory: [],
            categoryImage: null,
            screenData: Dimensions.get('window')
        }
    }

    loadCategoryData = async () => {
        try {
            let {
                categoryId,
                type
            } = this.state;

            this.setState({ isloading: true });

            // Fetch all categories to get category details including image
            const categoriesResponse = await getAllCategories();
            console.log("All categories response:", categoriesResponse);

            if (categoriesResponse && categoriesResponse.success && categoriesResponse.categories) {
                // If categoryId is empty but we have type, find the ID
                if (!categoryId && type) {
                    console.log("categoryId empty, fetching categories based on type:", type);
                    // Try to find category by name (case-insensitive match)
                    const category = categoriesResponse.categories.find(cat =>
                        cat.name.toLowerCase() === type.toLowerCase() ||
                        cat.name === type ||
                        cat.name === type + "s" ||
                        cat.name.toLowerCase() === type.toLowerCase() + "s"
                    );
                    if (category) {
                        categoryId = category.categoryId;
                        this.setState({
                            categoryId,
                            categoryImage: category.image,
                            type: category.name // Update type to match actual category name
                        });
                        console.log("Found categoryId for type", type, ":", categoryId);
                    } else {
                        console.log("No category found for type:", type);
                        console.log("Available categories:", categoriesResponse.categories.map(c => c.name));
                    }
                } else {
                    // We have categoryId, find the category to get its image
                    const category = categoriesResponse.categories.find(cat => cat.categoryId === categoryId);
                    if (category) {
                        this.setState({
                            categoryImage: category.image,
                            type: category.name // Update type to match actual category name
                        });
                        console.log("Found category image:", category.image);
                    }
                }
            }

            if (categoryId) {
                const response = await getSubCategorieById(categoryId);
                console.log("SubCategory response:", response);
                if (response && response.success) {
                    const { subCategory } = response;
                    this.setState({ subCategory, isloading: false });
                } else {
                    this.setState({ isloading: false });
                }
            } else {
                console.log("No categoryId available");
                this.setState({ isloading: false });
            }
        } catch (err) {
            console.log("error in shopCategories is = ", err);
            this.setState({ isloading: false });
        }
    }

    componentDidMount = async () => {
        await this.loadCategoryData();
        // Listen for orientation changes
        this.dimensionsSubscription = Dimensions.addEventListener('change', this.handleOrientationChange);
    }

    componentDidUpdate(prevProps) {
        // Check if navigation params changed
        const prevParams = prevProps.route?.params || {};
        const currentParams = this.props.route?.params || {};

        const prevCategoryId = prevParams.categoryId || "";
        const prevType = prevParams.type || "";
        const currentCategoryId = currentParams.categoryId || "";
        const currentType = currentParams.type || "";

        // If category changed, reload data
        if (prevCategoryId !== currentCategoryId || prevType !== currentType) {
            console.log("Category params changed, reloading data...");
            this.setState(
                {
                    categoryId: currentCategoryId,
                    type: currentType,
                    subCategory: [],
                    categoryImage: null
                },
                () => {
                    // Reload data after state is updated
                    this.loadCategoryData();
                }
            );
        }
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

        if (isTablet) {
            return 160;
        }
        return 140;
    }

    getImageDimensions = () => {
        const { screenData } = this.state;
        const isTablet = screenData.width >= 768;
        const isSmallScreen = screenData.width < 360;

        if (isTablet) {
            return { width: 160, height: 200 };
        } else if (isSmallScreen) {
            return { width: 120, height: 150 };
        }
        return { width: 140, height: 175 };
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
                activeOpacity={0.8}
            >
                <View style={styles.categoryCardContainer}>
                    <View style={[styles.imageContainer, imageDimensions]}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.img}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }


    renderSection = (title, data) => {
        return (
            <View style={styles.shoppingContainer}>
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.heading}>{title}</Text>
                    <View style={styles.sectionUnderline} />
                </View>
                <View style={styles.flatListContainer}>
                    {data && data.length > 0 ? (
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
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <View style={styles.emptyImageContainer}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/300x400/f0f0f0/666666?text=Coming+Soon' }}
                                    style={styles.emptyImage}
                                    resizeMode="cover"
                                    blurRadius={8}
                                />
                            </View>
                            <Text style={styles.emptyStateTitle}>Upcoming Collection</Text>
                            <Text style={styles.emptyStateSubtitle}>
                                Exciting new styles are on their way! Stay tuned for our latest collection.
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    render() {
        const {
            subCategory,
            type,
            isloading,
            screenData,
            categoryImage
        } = this.state;

        const backgroundImageStyle = {
            width: screenData.width,
            height: Math.min(screenData.height * 0.5, 400),
        };

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.subContainer}>
                        {categoryImage && (
                            <View style={styles.bannerContainer}>
                                <Image
                                    source={{ uri: categoryImage }}
                                    style={backgroundImageStyle}
                                    resizeMode="cover"
                                />
                                <View style={styles.bannerOverlay}>
                                    <Text style={styles.bannerTitle}>
                                        {(type === "Men" || type === "Mens") ? "Men's" : (type === "Women" || type === "Womens") ? "Women's" : type}
                                    </Text>
                                    <Text style={styles.bannerSubtitle}>
                                        Collection
                                    </Text>
                                </View>
                            </View>
                        )}

                        {isloading ? (
                            <>
                                <CategorySectionSkeleton />
                                <CategorySectionSkeleton />
                            </>
                        ) : (
                            <>
                                {this.renderSection("Shop by Category", subCategory)}
                                {this.renderSection("New Arrivals", subCategory)}
                            </>
                        )}
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
        backgroundColor: "#FFFFFF"
    },
    scrollContent: {
        flexGrow: 1,
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80
    },
    // Banner Styles
    bannerContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 0,
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    bannerTitle: {
        fontFamily: "Didot",
        fontSize: 48,
        fontWeight: "300",
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 4,
    },
    bannerSubtitle: {
        fontFamily: "Didot",
        fontSize: 48,
        fontWeight: "300",
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 4,
    },
    // Section Header Styles
    sectionHeaderContainer: {
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    heading: {
        fontFamily: "Didot",
        fontWeight: "300",
        fontSize: 28,
        lineHeight: 36,
        textAlign: 'left',
        color: '#2C2C2C',
        letterSpacing: 1,
    },
    sectionUnderline: {
        width: 40,
        height: 1,
        backgroundColor: '#2C2C2C',
        marginTop: 8,
    },
    shoppingContainer: {
        marginTop: 0,
        paddingHorizontal: 50,
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingBottom: 40,
        width: '100%',
    },
    flatListContainer: {
        marginTop: 20
    },
    flatListContent: {
        paddingHorizontal: 0,
        gap: 20,
    },
    // Category Card Styles
    categoryItem: {
        marginRight: 20,
        marginBottom: 10,
    },
    categoryCardContainer: {
        backgroundColor: '#F8F8F8',
        overflow: 'hidden',
    },
    imageContainer: {
        overflow: 'hidden',
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '90%',
        height: '90%',
    },
    categoryName: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        letterSpacing: 0.5,
        backgroundColor: '#F8F8F8',
    },
    emptyStateContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyImageContainer: {
        width: 300,
        height: 400,
        marginBottom: 30,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    emptyImage: {
        width: '100%',
        height: '100%',
    },
    emptyStateTitle: {
        fontFamily: "Didot",
        fontSize: 28,
        fontWeight: "600",
        color: '#333',
        marginBottom: 12,
        textAlign: 'left',
    },
    emptyStateSubtitle: {
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "400",
        color: '#666',
        textAlign: 'left',
        maxWidth: 400,
        lineHeight: 24,
    }
});

export default ShopCategories;