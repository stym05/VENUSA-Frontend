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
        console.log("props in ItemDescription", props);
        if (this.props && this.props.route) {
            productId = this.props.route.params.productId;
        }
        this.state = {
            productId,
            images: [],
            mainImage: "",
            isLoading: false,
            name: "",
            price: 0,
            description: "",
            selectedSize: "",
            selectedColor: "",
            availableColors: [],
            availableSizes: [],
            tags: [],
            materials: [],
            keyFeatures: [],
            stocks: [],
            SKU: "",
            discount: 0,
            discountPerc: 0,
            rating: 4.5 // Default rating
        };
    }

    componentDidMount = async () => {
        try {
            this.setState({ isLoading: true });
            const { productId } = this.state;
            console.log("Product id we get is = ", productId);
            const response = await getProductById(productId);
            console.log(response)
            if (response) {
                console.log("Product data", response);
                
                // Handle images
                const imgs = response.images || [];
                const images = imgs.map((item) => {
                    const imageUrl = item.image || item.url || item;
                    return imageUrl?.includes("http") ? imageUrl : DOMAIN + imageUrl;
                });
                
                // Extract unique colors and sizes from stocks
                const uniqueColors = [...new Set(response.stocks?.map(stock => stock.color) || [])];
                const uniqueSizes = [...new Set(response.stocks?.map(stock => stock.size) || [])];
                
                this.setState({
                    images,
                    mainImage: images[0] || "",
                    name: response.productName || response.name || "",
                    price: parseFloat(response.price) || 0,
                    description: response.description || "",
                    availableColors: uniqueColors,
                    availableSizes: uniqueSizes.sort((a, b) => {
                        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
                        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
                    }),
                    tags: response.tags || [],
                    materials: response.materials || [],
                    keyFeatures: response.keyFeatures || [],
                    stocks: response.stocks || [],
                    SKU: response.SKU || "",
                    discount: parseFloat(response.discount) || 0,
                    discountPerc: parseFloat(response.discountPerc) || 0
                });
            }
            this.setState({ isLoading: false });
        } catch (err) {
            console.log("ItemDescription error is ", err);
            this.setState({ isLoading: false });
        }
    }

    handleImagePress = (image) => {
        this.setState({ mainImage: image });
    }

    handleAddToCart = async () => {
        try {
            this.setState({ isLoading: true });
            const { productId, selectedSize, selectedColor } = this.state;
            const userId = Store.getState().user.userData._id
            const payload = {
                userId: userId,
                productId,
                size: selectedSize,
                color: selectedColor
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
        } finally {
            this.setState({ isLoading: false });
        }
    }

    handleSizeSelect = (size) => {
        this.setState({ selectedSize: size });
    }

    handleColorSelect = (color) => {
        this.setState({ selectedColor: color });
    }

    renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} style={[styles.star, { color: i <= rating ? '#FFD700' : '#ddd' }]}>
                    ★
                </Text>
            );
        }
        return stars;
    }

    renderPrice = () => {
        const { price, discount, discountPerc } = this.state;
        
        if (discount > 0 || discountPerc > 0) {
            const discountedPrice = discountPerc > 0 
                ? price - (price * discountPerc / 100)
                : price - discount;
            
            return (
                <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>
                        £{discountedPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.originalPrice}>
                        £{price.toFixed(2)}
                    </Text>
                </View>
            );
        }
        
        return (
            <Text style={styles.currentPrice}>
                ₹ {price.toFixed(2)}
            </Text>
        );
    }

    getAvailableStock = (size, color) => {
        const { stocks } = this.state;
        const stock = stocks.find(s => s.size === size && s.color === color);
        return stock ? stock.quantity : 0;
    }

    render() {
        const {
            images,
            mainImage,
            isLoading,
            name,
            description,
            selectedSize,
            selectedColor,
            availableColors,
            availableSizes,
            rating,
            SKU
        } = this.state;
        
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.productContainer}>
                        {/* Left side - Images */}
                        <View style={styles.imageSection}>
                            {/* Main Image */}
                            <View style={styles.mainImageContainer}>
                                <Image 
                                    source={{ uri: mainImage || images[0] }} 
                                    style={styles.mainImage}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity style={styles.heartIcon}>
                                    <Text style={styles.heartText}>♡</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Thumbnail Grid */}
                            <View style={styles.thumbnailGrid}>
                                {images.slice(0, 4).map((image, index) => (
                                    <TouchableOpacity 
                                        key={index}
                                        style={[
                                            styles.thumbnail,
                                            mainImage === image && styles.activeThumbnail
                                        ]}
                                        onPress={() => this.handleImagePress(image)}
                                    >
                                        <Image 
                                            source={{ uri: image }} 
                                            style={styles.thumbnailImage}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Right side - Product Details */}
                        <View style={styles.detailsSection}>
                            {/* Breadcrumb */}
                            <Text style={styles.breadcrumb}>
                                Women Clothing / Blouses & Tops
                            </Text>
                            
                            {/* Product Name */}
                            <Text style={styles.productName}>{name}</Text>
                            
                            {/* Price */}
                            {this.renderPrice()}
                            
                            {/* Rating */}
                            <View style={styles.ratingContainer}>
                                <View style={styles.starsContainer}>
                                    {this.renderStars(Math.floor(rating))}
                                </View>
                            </View>
                            
                            {/* Description */}
                            <Text style={styles.description}>{description}</Text>
                            
                            {/* Color Selection */}
                            <View style={styles.selectionContainer}>
                                <Text style={styles.selectionLabel}>Color</Text>
                                <View style={styles.colorOptions}>
                                    {availableColors.map((color, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.colorOption,
                                                { backgroundColor: color },
                                                selectedColor === color && styles.selectedColorOption
                                            ]}
                                            onPress={() => this.handleColorSelect(color)}
                                        />
                                    ))}
                                </View>
                            </View>
                            
                            {/* Size Selection */}
                            <View style={styles.selectionContainer}>
                                <Text style={styles.selectionLabel}>Select Size</Text>
                                <View style={styles.sizeOptions}>
                                    {availableSizes.map((size, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.sizeOption,
                                                selectedSize === size && styles.selectedSizeOption
                                            ]}
                                            onPress={() => this.handleSizeSelect(size)}
                                        >
                                            <Text style={[
                                                styles.sizeText,
                                                selectedSize === size && styles.selectedSizeText
                                            ]}>
                                                {size}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity>
                                    <Text style={styles.sizeGuide}>Size Guide</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Add to Cart Button */}
                            <TouchableOpacity 
                                style={styles.addToCartButton} 
                                onPress={this.handleAddToCart}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.addToCartText}>Add to cart</Text>
                                )}
                            </TouchableOpacity>
                            
                            {/* Additional Info */}
                            <View style={styles.additionalInfo}>
                                <TouchableOpacity style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>Delivery Availability</Text>
                                    <Text style={styles.checkText}>Check</Text>
                                </TouchableOpacity>
                                
                                <View style={styles.infoItem}>
                                    <Text style={styles.shippingIcon}>🚚</Text>
                                    <View>
                                        <Text style={styles.shippingTitle}>Shipping Discount</Text>
                                        <Text style={styles.shippingText}>
                                            Reduced rate express shipping on orders over £5000.
                                        </Text>
                                    </View>
                                </View>
                                
                                <View style={styles.infoItem}>
                                    <Text style={styles.returnIcon}>↩️</Text>
                                    <View>
                                        <Text style={styles.returnTitle}>Easy Returns</Text>
                                        <Text style={styles.returnText}>
                                            Return within 14 days of purchase. Duties & taxes are
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Expandable Sections */}
                            <View style={styles.expandableSections}>
                                <TouchableOpacity style={styles.expandableItem}>
                                    <Text style={styles.expandableTitle}>Description</Text>
                                    <Text style={styles.expandableArrow}>⌄</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.expandableItem}>
                                    <Text style={styles.expandableTitle}>Material</Text>
                                    <Text style={styles.expandableArrow}>⌄</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.expandableItem}>
                                    <Text style={styles.expandableTitle}>Care Guide</Text>
                                    <Text style={styles.expandableArrow}>⌄</Text>
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
    productContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 40,
    },
    imageSection: {
        flex: 1,
        maxWidth: width * 0.45,
    },
    mainImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    mainImage: {
        width: '100%',
        height: 400,
        borderRadius: 8,
    },
    heartIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartText: {
        fontSize: 18,
        color: '#333',
    },
    thumbnailGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    thumbnail: {
        width: (width * 0.45 - 30) / 2,
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeThumbnail: {
        borderColor: '#333',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    detailsSection: {
        flex: 1,
        paddingLeft: 20,
    },
    breadcrumb: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
        fontFamily: 'Roboto',
    },
    productName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        fontFamily: 'Roboto',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    currentPrice: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'Roboto',
    },
    originalPrice: {
        fontSize: 18,
        color: '#888',
        textDecorationLine: 'line-through',
        fontFamily: 'Roboto',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 16,
        marginRight: 2,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
        fontFamily: 'Roboto',
    },
    selectionContainer: {
        marginBottom: 20,
    },
    selectionLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 10,
        fontFamily: 'Roboto',
    },
    colorOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    selectedColorOption: {
        borderColor: '#333',
        borderWidth: 3,
    },
    sizeOptions: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    sizeOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    selectedSizeOption: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    sizeText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    selectedSizeText: {
        color: '#fff',
    },
    sizeGuide: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'underline',
        fontFamily: 'Roboto',
    },
    addToCartButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 30,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Roboto',
    },
    additionalInfo: {
        marginBottom: 30,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 12,
    },
    infoLabel: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        fontFamily: 'Roboto',
    },
    checkText: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'underline',
        fontFamily: 'Roboto',
    },
    shippingIcon: {
        fontSize: 20,
        width: 30,
    },
    returnIcon: {
        fontSize: 20,
        width: 30,
    },
    shippingTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        fontFamily: 'Roboto',
    },
    shippingText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Roboto',
    },
    returnTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        fontFamily: 'Roboto',
    },
    returnText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Roboto',
    },
    expandableSections: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    expandableItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    expandableTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Roboto',
    },
    expandableArrow: {
        fontSize: 16,
        color: '#666',
    },
});

export default ItemDescription;