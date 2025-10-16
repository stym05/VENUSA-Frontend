import React from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Platform
} from "react-native";
import Footer from "../../components/footer";
import { addToCart, getProductById, AddToWishList, removeFromWishList, getWishList } from "../../apis";
import Store from "../../store";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

class ItemDescription extends React.Component {
    constructor(props) {
        super(props);

        let productId = "";
        let productName = "";

        // Try to get from route params first
        if (this.props.route && this.props.route.params) {
            productId = this.props.route.params.productId || "";
            productName = this.props.route.params.productName || "";
        }

        // For web, also check URL parameters on refresh
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (!productId) {
                productId = urlParams.get('productId') || "";
            }
            if (!productName) {
                productName = urlParams.get('productName') || "";
            }
        }

        this.state = {
            productId,
            productName,
            images: [],
            activeImageIndex: 0,
            isLoading: false,
            productData: null,
            price: 0,
            discountedPrice: 0,
            description: "",
            availableSizes: [],
            availableColors: [],
            selectedSize: null,
            selectedColor: null,
            materials: [],
            keyFeatures: [],
            stocks: [],
            isInWishlist: false,
            wishlistLoading: false
        };
    }

    componentDidMount = async () => {
        try {
            this.setState({ isLoading: true });
            const { productId } = this.state;
            console.log("Fetching product with ID:", productId);

            const response = await getProductById(productId);
            console.log("Product response:", response);

            if (response) {
                // Extract images
                const images = response.images && response.images.length > 0
                    ? response.images.map(img => img.image)
                    : [];

                // Extract unique sizes and colors from stocks
                const sizesSet = new Set();
                const colorsMap = new Map();

                if (response.stocks && response.stocks.length > 0) {
                    response.stocks.forEach(stock => {
                        if (stock.quantity > 0) {
                            sizesSet.add(stock.size);
                            if (stock.color) {
                                colorsMap.set(stock.color, stock.color);
                            }
                        }
                    });
                }

                const availableSizes = Array.from(sizesSet).sort((a, b) => a - b);
                const availableColors = Array.from(colorsMap.keys());

                // Calculate discounted price
                const price = parseFloat(response.price || 0);
                const discount = parseFloat(response.discount || 0);
                const discountPerc = parseFloat(response.discountPerc || 0);

                let discountedPrice = price;
                if (discount > 0) {
                    discountedPrice = price - discount;
                } else if (discountPerc > 0) {
                    discountedPrice = price * (1 - discountPerc / 100);
                }

                // Extract materials and features
                const materials = response.materials ? response.materials.map(m => m.material) : [];
                const keyFeatures = response.keyFeatures ? response.keyFeatures.map(f => f.feature) : [];

                this.setState({
                    productData: response,
                    images,
                    productName: response.productName || this.state.productName,
                    price,
                    discountedPrice,
                    description: response.description || "",
                    availableSizes,
                    availableColors,
                    materials,
                    keyFeatures,
                    stocks: response.stocks || [],
                    isLoading: false
                });

                // Check if product is in wishlist
                await this.checkWishlistStatus();
            } else {
                this.setState({ isLoading: false });
            }
        } catch (err) {
            console.log("ItemDescription error:", err);
            this.setState({ isLoading: false });
        }
    }

    checkWishlistStatus = async () => {
        try {
            const userData = Store.getState().user.userData;
            const userId = userData?._id || userData?.userId;
            if (!userId) return;

            const response = await getWishList(userId);
            if (response && response.success && response.data) {
                const isInWishlist = response.data.some(item => item.product.productId === this.state.productId);
                this.setState({ isInWishlist });
            }
        } catch (err) {
            console.log("Error checking wishlist:", err);
        }
    }

    handleImageSelect = (index) => {
        this.setState({ activeImageIndex: index });
    }

    handleAddToCart = async () => {
        try {
            const { productId, selectedSize, selectedColor } = this.state;

            // Validate that size and color are selected
            if (!selectedSize) {
                Toast.show({
                    text1: "Please select a size",
                    type: "error",
                    visibilityTime: 3000
                });
                return;
            }

            if (!selectedColor) {
                Toast.show({
                    text1: "Please select a color",
                    type: "error",
                    visibilityTime: 3000
                });
                return;
            }

            const userData = Store.getState().user.userData;
            const userId = userData?._id || userData?.userId;
            const payload = {
                userId,
                productId,
                size: selectedSize,
                color: selectedColor
            };

            const response = await addToCart(payload);
            if (response.success) {
                Toast.show({
                    text1: "Added to cart successfully!",
                    type: "success",
                    visibilityTime: 3000
                });
            } else {
                Toast.show({
                    text1: "Failed to add to cart",
                    type: "error",
                    visibilityTime: 3000
                });
            }
        } catch (err) {
            console.log("Error adding to cart:", err);
            Toast.show({
                text1: "Something went wrong",
                type: "error",
                visibilityTime: 3000
            });
        }
    }

    handleToggleWishlist = async () => {
        try {
            const { productId, selectedSize, selectedColor, isInWishlist } = this.state;
            const userData = Store.getState().user.userData;
            const userId = userData?._id || userData?.userId;

            if (!userId) {
                Toast.show({
                    text1: "Please login to add to wishlist",
                    type: "error",
                    visibilityTime: 3000
                });
                return;
            }

            this.setState({ wishlistLoading: true });

            if (isInWishlist) {
                // Remove from wishlist
                const payload = {
                    user: userId,
                    product: productId
                };
                const response = await removeFromWishList(payload);
                if (response && response.success) {
                    this.setState({ isInWishlist: false, wishlistLoading: false });
                    Toast.show({
                        text1: "Removed from wishlist",
                        type: "success",
                        visibilityTime: 2000
                    });
                } else {
                    this.setState({ wishlistLoading: false });
                    Toast.show({
                        text1: "Failed to remove from wishlist",
                        type: "error",
                        visibilityTime: 3000
                    });
                }
            } else {
                // Add to wishlist
                const payload = {
                    user: userId,
                    product: productId,
                    size: selectedSize || null,
                    color: selectedColor || null
                };
                const response = await AddToWishList(payload);
                if (response && response.success) {
                    this.setState({ isInWishlist: true, wishlistLoading: false });
                    Toast.show({
                        text1: "Added to wishlist!",
                        type: "success",
                        visibilityTime: 2000
                    });
                } else {
                    this.setState({ wishlistLoading: false });
                    Toast.show({
                        text1: "Failed to add to wishlist",
                        type: "error",
                        visibilityTime: 3000
                    });
                }
            }
        } catch (err) {
            console.log("Error toggling wishlist:", err);
            this.setState({ wishlistLoading: false });
            Toast.show({
                text1: "Something went wrong",
                type: "error",
                visibilityTime: 3000
            });
        }
    }

    render() {
        const {
            isLoading,
            images,
            activeImageIndex,
            productName,
            price,
            discountedPrice,
            description,
            availableSizes,
            availableColors,
            selectedSize,
            selectedColor,
            materials,
            keyFeatures,
            productData,
            isInWishlist,
            wishlistLoading
        } = this.state;

        const hasDiscount = price > discountedPrice;

        if (isLoading) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2C2C2C" />
                    </View>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.productContainer}>
                        {/* Left Side - Image Gallery */}
                        <View style={styles.imageSection}>
                            {/* Main Image */}
                            <View style={styles.mainImageContainer}>
                                {images.length > 0 ? (
                                    <Image
                                        source={{ uri: images[activeImageIndex] }}
                                        style={styles.mainImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.noImageContainer}>
                                        <Text style={styles.noImageText}>No Image</Text>
                                    </View>
                                )}
                            </View>

                            {/* Image Thumbnails */}
                            {images.length > 1 && (
                                <View style={styles.thumbnailContainer}>
                                    {images.map((image, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => this.handleImageSelect(index)}
                                            style={[
                                                styles.thumbnail,
                                                activeImageIndex === index && styles.activeThumbnail
                                            ]}
                                        >
                                            <Image
                                                source={{ uri: image }}
                                                style={styles.thumbnailImage}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Right Side - Product Details */}
                        <View style={styles.detailsSection}>
                            {/* Product Name */}
                            <Text style={styles.productName}>{productName}</Text>

                            {/* Price */}
                            <View style={styles.priceContainer}>
                                <Text style={styles.currentPrice}>
                                    ₹{Math.round(discountedPrice).toLocaleString('en-IN')}
                                </Text>
                                {hasDiscount && (
                                    <>
                                        <Text style={styles.originalPrice}>
                                            ₹{Math.round(price).toLocaleString('en-IN')}
                                        </Text>
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>
                                                {Math.round(((price - discountedPrice) / price) * 100)}% OFF
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>

                            {/* Rating placeholder */}
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>★★★★★</Text>
                                <Text style={styles.reviewCount}>(Reviews coming soon)</Text>
                            </View>

                            {/* Description */}
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.sectionTitle}>Description</Text>
                                <Text style={styles.description}>{description}</Text>
                            </View>

                            {/* Materials */}
                            {materials.length > 0 && (
                                <View style={styles.materialsContainer}>
                                    <Text style={styles.sectionTitle}>Materials</Text>
                                    <Text style={styles.materialsText}>{materials.join(', ')}</Text>
                                </View>
                            )}

                            {/* Key Features */}
                            {keyFeatures.length > 0 && (
                                <View style={styles.featuresContainer}>
                                    <Text style={styles.sectionTitle}>Key Features</Text>
                                    {keyFeatures.map((feature, index) => (
                                        <Text key={index} style={styles.featureItem}>• {feature}</Text>
                                    ))}
                                </View>
                            )}

                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <View style={styles.selectionContainer}>
                                    <Text style={styles.selectionTitle}>
                                        Color {selectedColor && <Text style={styles.selectedValue}>({selectedColor})</Text>}
                                    </Text>
                                    <View style={styles.colorOptions}>
                                        {availableColors.map((color, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.colorButton,
                                                    { backgroundColor: color },
                                                    selectedColor === color && styles.selectedColorButton
                                                ]}
                                                onPress={() => this.setState({ selectedColor: color })}
                                            />
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Size Selection */}
                            {availableSizes.length > 0 && (
                                <View style={styles.selectionContainer}>
                                    <View style={styles.sizeTitleRow}>
                                        <Text style={styles.selectionTitle}>
                                            Size {selectedSize && <Text style={styles.selectedValue}>({selectedSize})</Text>}
                                        </Text>
                                        <TouchableOpacity>
                                            <Text style={styles.sizeGuideLink}>Size Guide</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.sizeOptions}>
                                        {availableSizes.map((size, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.sizeButton,
                                                    selectedSize === size && styles.selectedSizeButton
                                                ]}
                                                onPress={() => this.setState({ selectedSize: size })}
                                            >
                                                <Text style={[
                                                    styles.sizeButtonText,
                                                    selectedSize === size && styles.selectedSizeText
                                                ]}>
                                                    {size}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Action Buttons */}
                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.wishlistButtonLarge}
                                    onPress={this.handleToggleWishlist}
                                    disabled={wishlistLoading}
                                >
                                    <Text style={styles.wishlistIconLarge}>
                                        {isInWishlist ? '♥' : '♡'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.addToCartButton, (!selectedSize || !selectedColor) && styles.disabledButton]}
                                    onPress={this.handleAddToCart}
                                    disabled={!selectedSize || !selectedColor}
                                >
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Additional Info */}
                            <View style={styles.additionalInfo}>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoIcon}>🚚</Text>
                                    <Text style={styles.infoText}>Free shipping on orders above ₹999</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoIcon}>↩️</Text>
                                    <Text style={styles.infoText}>Easy 30-day returns</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoIcon}>✓</Text>
                                    <Text style={styles.infoText}>100% authentic products</Text>
                                </View>
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
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
    },
    productContainer: {
        flexDirection: 'row',
        paddingHorizontal: 50,
        paddingVertical: 30,
        gap: 40,
    },
    // Image Section
    imageSection: {
        flex: 1,
        maxWidth: '50%',
    },
    mainImageContainer: {
        width: '100%',
        height: 480,
        backgroundColor: '#F8F8F8',
        marginBottom: 16,
        overflow: 'hidden',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    noImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        fontSize: 16,
        color: '#999',
    },
    thumbnailContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    thumbnail: {
        width: 70,
        height: 88,
        backgroundColor: '#F8F8F8',
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    activeThumbnail: {
        borderColor: '#2C2C2C',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    // Details Section
    detailsSection: {
        flex: 1,
        maxWidth: '50%',
    },
    productName: {
        fontFamily: 'Roboto',
        fontSize: 26,
        fontWeight: '400',
        color: '#2C2C2C',
        marginBottom: 12,
        lineHeight: 32,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    currentPrice: {
        fontFamily: 'Roboto',
        fontSize: 24,
        fontWeight: '600',
        color: '#2C2C2C',
    },
    originalPrice: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '400',
        color: '#999',
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: '#E74C3C',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 6,
    },
    ratingText: {
        fontSize: 14,
        color: '#FFB800',
    },
    reviewCount: {
        fontSize: 13,
        color: '#666',
    },
    descriptionContainer: {
        marginBottom: 18,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionTitle: {
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: '600',
        color: '#2C2C2C',
        marginBottom: 6,
    },
    description: {
        fontFamily: 'Roboto',
        fontSize: 14,
        lineHeight: 22,
        color: '#666',
    },
    materialsContainer: {
        marginBottom: 16,
    },
    materialsText: {
        fontFamily: 'Roboto',
        fontSize: 13,
        color: '#666',
    },
    featuresContainer: {
        marginBottom: 18,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    featureItem: {
        fontFamily: 'Roboto',
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
    selectionContainer: {
        marginBottom: 18,
    },
    selectionTitle: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '500',
        color: '#2C2C2C',
        marginBottom: 10,
    },
    selectedValue: {
        fontWeight: '400',
        color: '#666',
    },
    sizeTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sizeGuideLink: {
        fontFamily: 'Roboto',
        fontSize: 13,
        color: '#2C2C2C',
        textDecorationLine: 'underline',
    },
    colorOptions: {
        flexDirection: 'row',
        gap: 10,
    },
    colorButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    selectedColorButton: {
        borderColor: '#2C2C2C',
        borderWidth: 3,
    },
    sizeOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    sizeButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        backgroundColor: '#FFFFFF',
        minWidth: 55,
        alignItems: 'center',
    },
    selectedSizeButton: {
        backgroundColor: '#2C2C2C',
        borderColor: '#2C2C2C',
    },
    sizeButtonText: {
        fontFamily: 'Roboto',
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
    selectedSizeText: {
        color: '#FFFFFF',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        marginBottom: 24,
    },
    wishlistButtonLarge: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#2C2C2C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
    },
    wishlistIconLarge: {
        fontSize: 22,
        color: '#2C2C2C',
    },
    addToCartButton: {
        backgroundColor: '#2C2C2C',
        paddingVertical: 14,
        alignItems: 'center',
        flex: 1,
    },
    disabledButton: {
        backgroundColor: '#999',
        opacity: 0.6,
    },
    addToCartText: {
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    additionalInfo: {
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    infoIcon: {
        fontSize: 18,
    },
    infoText: {
        fontFamily: 'Roboto',
        fontSize: 13,
        color: '#666',
    },
});

export default ItemDescription;
