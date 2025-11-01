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
            wishlistLoading: false,
            expandedDescription: true,
            expandedMaterial: false,
            expandedCareGuide: false
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

                // Get price and discounted price from API
                const price = parseFloat(response.price || 0);
                const apiDiscountField = parseFloat(response.discount || 0); // API's discount field = final price
                const discountPerc = parseFloat(response.discountPerc || 0);
                console.log("------------price------------", price);
                console.log("------------discount field (final price)------------", apiDiscountField);
                console.log("------------discount percentage------------", discountPerc);

                // Use the discount field as final price if it exists and is valid
                // Otherwise calculate from discount percentage, or fallback to original price
                let discountedPrice = price;
                if (apiDiscountField > 0 && apiDiscountField < price) {
                    discountedPrice = apiDiscountField;
                } else if (discountPerc > 0) {
                    discountedPrice = price - (price * discountPerc / 100);
                }

                // Extract materials and features
                // Handle both array of strings and array of objects
                const materials = response.materials ? response.materials.map(m =>
                    typeof m === 'string' ? m : (m.material || m)
                ) : [];
                const keyFeatures = response.keyFeatures ? response.keyFeatures.map(f =>
                    typeof f === 'string' ? f : (f.feature || f)
                ) : [];

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

            // Check if user is logged in
            const userData = Store.getState().user.userData;
            const userId = userData?._id || userData?.userId;

            if (!userId) {
                Toast.show({
                    text1: "Please login to add items to cart",
                    type: "error",
                    visibilityTime: 3000
                });
                // Optionally navigate to login
                // this.props.navigation.navigate('Login');
                return;
            }

            const payload = {
                user_id: userId,
                product_id: productId,
                quantity: 1,
                size: selectedSize,
                color: selectedColor
            };

            console.log("Adding to cart with payload:", payload);
            const response = await addToCart(payload);
            console.log("Add to cart response:", response);

            if (response && response.success) {
                Toast.show({
                    text1: "Added to cart successfully!",
                    type: "success",
                    visibilityTime: 3000
                });
            } else {
                Toast.show({
                    text1: response?.message || "Failed to add to cart",
                    type: "error",
                    visibilityTime: 3000
                });
            }
        } catch (err) {
            console.log("Error adding to cart:", err);
            Toast.show({
                text1: "Something went wrong. Please try again.",
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

    toggleSection = (section) => {
        this.setState({ [section]: !this.state[section] });
    }

    render() {
        const {
            isLoading,
            images,
            activeImageIndex,
            productName,
            price,
            discount,
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
            wishlistLoading,
            expandedDescription,
            expandedMaterial,
            expandedCareGuide
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

                            {/* Collapsible Description */}
                            <View style={styles.collapsibleSection}>
                                <TouchableOpacity
                                    style={styles.collapsibleHeader}
                                    onPress={() => this.toggleSection('expandedDescription')}
                                >
                                    <Text style={styles.collapsibleTitle}>Description</Text>
                                    <Text style={styles.collapseIcon}>{expandedDescription ? '▼' : '▶'}</Text>
                                </TouchableOpacity>
                                {expandedDescription && (
                                    <View style={styles.collapsibleContent}>
                                        <Text style={styles.description}>{description}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Collapsible Material */}
                            <View style={styles.collapsibleSection}>
                                <TouchableOpacity
                                    style={styles.collapsibleHeader}
                                    onPress={() => this.toggleSection('expandedMaterial')}
                                >
                                    <Text style={styles.collapsibleTitle}>Material</Text>
                                    <Text style={styles.collapseIcon}>{expandedMaterial ? '▼' : '▶'}</Text>
                                </TouchableOpacity>
                                {expandedMaterial && materials.length > 0 && (
                                    <View style={styles.collapsibleContent}>
                                        <Text style={styles.materialsText}>{materials.join(', ')}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Collapsible Care Guide */}
                            <View style={styles.collapsibleSection}>
                                <TouchableOpacity
                                    style={styles.collapsibleHeader}
                                    onPress={() => this.toggleSection('expandedCareGuide')}
                                >
                                    <Text style={styles.collapsibleTitle}>Care Guide</Text>
                                    <Text style={styles.collapseIcon}>{expandedCareGuide ? '▼' : '▶'}</Text>
                                </TouchableOpacity>
                                {expandedCareGuide && (
                                    <View style={styles.collapsibleContent}>
                                        <Text style={styles.description}>
                                            • Machine wash cold with like colors{'\n'}
                                            • Do not bleach{'\n'}
                                            • Tumble dry low{'\n'}
                                            • Cool iron if needed
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Key Features */}
                            {/* {keyFeatures.length > 0 && (
                                <View style={styles.featuresContainer}>
                                    <Text style={styles.sectionTitle}>Key Features</Text>
                                    {keyFeatures.map((feature, index) => (
                                        <Text key={index} style={styles.featureItem}>• {feature}</Text>
                                    ))}
                                </View>
                            )} */}

                            {/* Delivery Availability */}
                            <View style={styles.deliverySection}>
                                <View style={styles.deliveryInputContainer}>
                                    <Text style={styles.deliveryPlaceholder}>Delivery Availability</Text>
                                </View>
                                <TouchableOpacity style={styles.checkButton}>
                                    <Text style={styles.checkButtonText}>Check</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <View style={styles.selectionContainer}>
                                    <Text style={styles.selectionTitle}>
                                        Select Color {selectedColor && <Text style={styles.selectedColorDot}>●</Text>}
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
                                                onPress={() => {
                                                    // Toggle color selection - unselect if same color clicked
                                                    this.setState({
                                                        selectedColor: selectedColor === color ? null : color
                                                    });
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                {selectedColor === color && (
                                                    <View style={styles.colorCheckmark}>
                                                        <Text style={styles.checkmarkText}>✓</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
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
                                                onPress={() => {
                                                    // Toggle size selection - unselect if same size clicked
                                                    this.setState({
                                                        selectedSize: selectedSize === size ? null : size
                                                    });
                                                }}
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
                                    activeOpacity={(!selectedSize || !selectedColor) ? 1 : 0.7}
                                >
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Additional Info */}
                            <View style={styles.additionalInfo}>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoIcon}>🚚</Text>
                                    <Text style={styles.infoText}>Reduced rate express shipping on orders over ₹5000</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoIcon}>↩️</Text>
                                    <Text style={styles.infoText}>Return within 15 days of purchase. Duties & taxes are non-refundable</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoIcon}>✓</Text>
                                    <Text style={styles.infoText}>100% authentic products</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Pair up with - Full Width Section */}
                    <View style={styles.pairUpSection}>
                        <Text style={styles.pairUpTitle}>Pair up with</Text>
                        <View style={styles.pairUpGrid}>
                            {/* Product 1 */}
                            <View style={styles.pairUpItem}>
                                <View style={styles.pairUpImageContainer}>
                                    <View style={styles.pairUpPlaceholderImage}>
                                        <Text style={styles.placeholderText}>Product Image</Text>
                                    </View>
                                    <TouchableOpacity style={styles.pairUpWishlist}>
                                        <Text style={styles.pairUpWishlistIcon}>♡</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.pairUpProductName}>Annalise Formal Pant</Text>
                                <Text style={styles.pairUpPrice}>₹3,400.00</Text>
                            </View>

                            {/* Product 2 */}
                            <View style={styles.pairUpItem}>
                                <View style={styles.pairUpImageContainer}>
                                    <View style={styles.pairUpPlaceholderImage}>
                                        <Text style={styles.placeholderText}>Product Image</Text>
                                    </View>
                                    <TouchableOpacity style={styles.pairUpWishlist}>
                                        <Text style={styles.pairUpWishlistIcon}>♡</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.pairUpProductName}>Annalise Black Skirt</Text>
                                <Text style={styles.pairUpPrice}>₹1,400.00</Text>
                            </View>

                            {/* Product 3 */}
                            <View style={styles.pairUpItem}>
                                <View style={styles.pairUpImageContainer}>
                                    <View style={styles.pairUpPlaceholderImage}>
                                        <Text style={styles.placeholderText}>Product Image</Text>
                                    </View>
                                    <TouchableOpacity style={styles.pairUpWishlist}>
                                        <Text style={styles.pairUpWishlistIcon}>♡</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.pairUpProductName}>White wrap blouse</Text>
                                <Text style={styles.pairUpPrice}>₹1,200.00</Text>
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
    collapsibleSection: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 0,
    },
    collapsibleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    collapsibleTitle: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '500',
        color: '#2C2C2C',
    },
    collapseIcon: {
        fontSize: 12,
        color: '#666',
    },
    collapsibleContent: {
        paddingBottom: 14,
    },
    deliverySection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 18,
        marginBottom: 18,
    },
    deliveryInputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
    },
    deliveryPlaceholder: {
        fontFamily: 'Roboto',
        fontSize: 13,
        color: '#999',
    },
    checkButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#2C2C2C',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    checkButtonText: {
        fontFamily: 'Roboto',
        fontSize: 13,
        fontWeight: '500',
        color: '#2C2C2C',
        textTransform: 'uppercase',
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
    selectedColorDot: {
        fontWeight: '600',
        color: '#2C2C2C',
        fontSize: 16,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColorButton: {
        borderColor: '#2C2C2C',
        borderWidth: 3,
    },
    colorCheckmark: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 19,
    },
    checkmarkText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
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
    pairUpSection: {
        paddingHorizontal: 50,
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        width: '100%',
    },
    pairUpTitle: {
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: '500',
        color: '#2C2C2C',
        marginBottom: 24,
        textAlign: 'left',
    },
    pairUpGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        width: '100%',
    },
    pairUpItem: {
        flex: 1,
        maxWidth: 300,
    },
    pairUpImageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 0.75,
        marginBottom: 10,
    },
    pairUpPlaceholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 12,
        color: '#999',
    },
    pairUpWishlist: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pairUpWishlistIcon: {
        fontSize: 16,
        color: '#2C2C2C',
    },
    pairUpProductName: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '400',
        color: '#2C2C2C',
        marginBottom: 4,
    },
    pairUpPrice: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '600',
        color: '#2C2C2C',
    },
});

export default ItemDescription;
