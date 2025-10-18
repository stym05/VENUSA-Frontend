import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Platform
} from 'react-native';
import Item from "./item";
import { isMobile } from "../../utils";
import Footer from "../../components/footer";
import { getProductBySubCategory, AddToWishList, removeFromWishList, getWishList } from "../../apis";
import { ProductGridSkeleton } from "../../components/SkeletonLoader/index";
import Store from "../../store";
import Toast from "react-native-toast-message";

class ItemSection extends React.Component {
    constructor(props) {
        super(props);

        // Get parameters from route or URL
        let subCategoryId = "";
        let productName = "";

        // Try to get from route params first
        if (this.props.route && this.props.route.params) {
            subCategoryId = this.props.route.params.subCategoryId;
            productName = this.props.route.params.productName;
        }

        // For web, also check URL parameters on refresh
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (!subCategoryId) {
                subCategoryId = urlParams.get('subCategoryId') || "";
            }
            if (!productName) {
                productName = urlParams.get('productName') || "";
            }
        }

        this.state = {
            loading: false,
            productName,
            subCategoryId,
            productarray: [],
            filteredProducts: [],
            selectedSortBy: 'featured',
            selectedSize: null,
            selectedColor: null,
            selectedMaterial: null,
            availableSizes: [],
            availableColors: [],
            availableMaterials: [],
            productCount: 0,
            currentPage: 1,
            itemsPerPage: 20,  // 4 columns × 5 rows
            openDropdown: null,  // Track which dropdown is open
            wishlistItems: [],  // Store wishlist product IDs
            wishlistLoading: false
        };
    }

    loadProducts = async () => {
        try {
            const { subCategoryId } = this.state;
            this.setState({ loading: true });
            const response = await getProductBySubCategory(subCategoryId);
            console.log("-----------------getProductBySubCategory-----------", response)

            // API returns array directly, not wrapped in {success, products}
            if (response && Array.isArray(response)) {
                // Extract unique sizes, colors, and materials
                const sizesSet = new Set();
                const colorsMap = new Map();
                const materialsSet = new Set();

                response.forEach(product => {
                    // Extract sizes
                    if (product.stocks) {
                        product.stocks.forEach(stock => {
                            sizesSet.add(stock.size);
                            if (stock.color) {
                                colorsMap.set(stock.color, stock.color);
                            }
                        });
                    }
                    // Extract materials
                    if (product.materials) {
                        product.materials.forEach(mat => {
                            materialsSet.add(mat.material);
                        });
                    }
                });

                const availableSizes = Array.from(sizesSet).sort((a, b) => a - b);
                const availableColors = Array.from(colorsMap.keys());
                const availableMaterials = Array.from(materialsSet).sort();

                this.setState({
                    productarray: response,
                    filteredProducts: response,
                    productCount: response.length,
                    availableSizes,
                    availableColors,
                    availableMaterials,
                    loading: false
                }, () => this.applyFilters());

                // Load wishlist
                await this.loadWishlist();
            } else if (response && response.error) {
                console.log("API Error:", response.error);
                this.setState({ loading: false });
            } else {
                this.setState({ loading: false });
            }
        } catch (err) {
            console.log("Error fetching products: ", err);
            this.setState({ loading: false });
        }
    };

    componentDidMount = async () => {
        await this.loadProducts();
    };

    componentDidUpdate(prevProps) {
        // Check if navigation params changed
        const prevParams = prevProps.route?.params || {};
        const currentParams = this.props.route?.params || {};

        const prevSubCategoryId = prevParams.subCategoryId || "";
        const prevProductName = prevParams.productName || "";
        const currentSubCategoryId = currentParams.subCategoryId || "";
        const currentProductName = currentParams.productName || "";

        // If subcategory changed, reload products
        if (prevSubCategoryId !== currentSubCategoryId || prevProductName !== currentProductName) {
            console.log("SubCategory params changed, reloading products...");
            this.setState(
                {
                    subCategoryId: currentSubCategoryId,
                    productName: currentProductName,
                    productarray: [],
                    filteredProducts: [],
                    selectedSortBy: 'featured',
                    selectedSize: null,
                    selectedColor: null,
                    selectedMaterial: null,
                    currentPage: 1
                },
                () => {
                    // Reload products after state is updated
                    this.loadProducts();
                }
            );
        }
    }

    loadWishlist = async () => {
        try {
            const userData = Store.getState().user.userData;
            const userId = userData?._id || userData?.userId;
            if (!userId) return;

            const response = await getWishList(userId);
            if (response && response.success && response.data) {
                const wishlistProductIds = response.data.map(item => item.product.productId);
                this.setState({ wishlistItems: wishlistProductIds });
            }
        } catch (err) {
            console.log("Error loading wishlist:", err);
        }
    };

    applyFilters = () => {
        const { productarray, selectedSortBy, selectedSize, selectedColor, selectedMaterial } = this.state;
        let filtered = [...productarray];

        // Filter by size
        if (selectedSize) {
            filtered = filtered.filter(product =>
                product.stocks && product.stocks.some(stock => stock.size === selectedSize)
            );
        }

        // Filter by color
        if (selectedColor) {
            filtered = filtered.filter(product =>
                product.stocks && product.stocks.some(stock => stock.color === selectedColor)
            );
        }

        // Filter by material
        if (selectedMaterial) {
            filtered = filtered.filter(product =>
                product.materials && product.materials.some(mat => mat.material === selectedMaterial)
            );
        }

        // Sort
        switch (selectedSortBy) {
            case 'price_low':
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price_high':
                filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'best_selling':
                filtered.sort((a, b) => b.totalSales - a.totalSales);
                break;
            default:
                // 'featured' - keep original order
                break;
        }

        this.setState({
            filteredProducts: filtered,
            productCount: filtered.length,
            currentPage: 1  // Reset to first page when filters change
        });
    };

    toggleDropdown = (dropdownName) => {
        this.setState(prevState => ({
            openDropdown: prevState.openDropdown === dropdownName ? null : dropdownName
        }));
    };

    handleToggleWishlist = async (productId, e) => {
        e.stopPropagation(); // Prevent navigation to product detail

        try {
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

            const { wishlistItems } = this.state;
            const isInWishlist = wishlistItems.includes(productId);

            if (isInWishlist) {
                // Remove from wishlist
                const payload = {
                    user: userId,
                    product: productId
                };
                const response = await removeFromWishList(payload);
                if (response && response.success) {
                    this.setState({
                        wishlistItems: wishlistItems.filter(id => id !== productId)
                    });
                    Toast.show({
                        text1: "Removed from wishlist",
                        type: "success",
                        visibilityTime: 2000
                    });
                }
            } else {
                // Add to wishlist
                const payload = {
                    user: userId,
                    product: productId
                };
                const response = await AddToWishList(payload);
                if (response && response.success) {
                    this.setState({
                        wishlistItems: [...wishlistItems, productId]
                    });
                    Toast.show({
                        text1: "Added to wishlist!",
                        type: "success",
                        visibilityTime: 2000
                    });
                }
            }
        } catch (err) {
            console.log("Error toggling wishlist:", err);
            Toast.show({
                text1: "Something went wrong",
                type: "error",
                visibilityTime: 3000
            });
        }
    };

    renderFilterDropdown = (label, stateKey, options, displayFn = (val) => val, valueFn = (val) => val) => {
        const selectedValue = this.state[stateKey];
        const isOpen = this.state.openDropdown === stateKey;

        return (
            <View style={styles.filterDropdown}>
                <View style={styles.dropdownWrapper}>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => this.toggleDropdown(stateKey)}
                    >
                        <Text style={[styles.dropdownText, selectedValue && styles.selectedText]}>
                            {selectedValue ? displayFn(selectedValue) : label}
                        </Text>
                        <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {isOpen && options && options.length > 0 && (
                        <View style={styles.dropdownMenu}>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    this.setState({ [stateKey]: null, openDropdown: null }, () => this.applyFilters());
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{label}</Text>
                            </TouchableOpacity>
                            {options.map((option, index) => {
                                const optionValue = valueFn(option);
                                const isSelected = selectedValue === optionValue;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            this.setState({ [stateKey]: optionValue, openDropdown: null }, () => this.applyFilters());
                                        }}
                                    >
                                        <Text style={[
                                            styles.dropdownItemText,
                                            isSelected && styles.selectedItemText
                                        ]}>
                                            {displayFn(option)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    renderProductCard = (product, index) => {
        const ProductCard = () => {
            // Extract product data from API response
            const productId = product.productId;
            const productName = product.productName;
            const productPrice = parseFloat(product.price);
            const productDiscount = parseFloat(product.discount);
            const productDiscountPerc = parseFloat(product.discountPerc);
            const productDescription = product.description;

            // Calculate discounted price
            let discountedPrice = productPrice;
            if (productDiscount > 0) {
                discountedPrice = productPrice - productDiscount;
            } else if (productDiscountPerc > 0) {
                discountedPrice = productPrice * (1 - productDiscountPerc / 100);
            }

            // Extract image URLs from images array
            const imageUrls = product.images && product.images.length > 0
                ? product.images.map(img => img.image)
                : ['https://via.placeholder.com/300x400?text=No+Image'];

            // State to manage the current image index
            const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

            // Effect to change the image every 3 seconds
            React.useEffect(() => {
                if (imageUrls.length > 1) {
                    const interval = setInterval(() => {
                        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
                    }, 3000);
                    return () => clearInterval(interval);
                }
            }, [imageUrls.length]);

            // Check if product has discount
            const hasDiscount = productDiscount > 0 || productDiscountPerc > 0;

            // Check if product is in wishlist
            const isInWishlist = this.state.wishlistItems.includes(productId);

            return (
                <TouchableOpacity
                    key={productId || index}
                    style={styles.productCard}
                    onPress={() => {
                        this.props.navigation.navigate('ItemDescription', {
                            productId: productId,
                            productName: productName
                        });
                    }}
                >
                    <View style={styles.productImageContainer}>
                        <Image
                            source={{ uri: imageUrls[currentImageIndex] }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                        {/* SALE badge at top-right */}
                        {hasDiscount && (
                            <View style={styles.saleBadge}>
                                <Text style={styles.saleBadgeText}>SALE</Text>
                            </View>
                        )}
                        {/* Wishlist heart at bottom-right */}
                        <TouchableOpacity
                            style={styles.wishlistButton}
                            onPress={(e) => this.handleToggleWishlist(productId, e)}
                        >
                            <Text style={styles.wishlistIcon}>
                                {isInWishlist ? '♥' : '♡'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>
                            {productName}
                        </Text>
                        <Text style={styles.productPrice}>
                            ₹{Math.round(discountedPrice).toLocaleString('en-IN')}.00
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        };

        return <ProductCard />;
    };

    render() {
        const { loading, filteredProducts, productCount, currentPage, itemsPerPage, productName, availableSizes, availableColors, availableMaterials } = this.state;

        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
        const totalPages = Math.ceil(productCount / itemsPerPage);

        // Sort By options
        const sortOptions = [
            { value: 'featured', label: 'Featured' },
            { value: 'price_low', label: 'Price: Low to High' },
            { value: 'price_high', label: 'Price: High to Low' },
            { value: 'newest', label: 'Newest' },
            { value: 'best_selling', label: 'Best Selling' }
        ];

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.contentContainer}>
                        {/* Main Product Content */}
                        <View style={styles.mainContent}>
                            {/* Header section */}
                            <View style={styles.categoryHeader}>
                                <View style={styles.breadcrumb}>
                                    <Text style={styles.categoryText}>
                                        <Text style={styles.breadcrumbText}>Category/</Text>{productName || 'Products'}
                                    </Text>
                                    <Text style={styles.productCount}>Products ({productCount})</Text>
                                </View>

                                {/* Filter options */}
                                <View style={styles.filtersContainer}>
                                    {this.renderFilterDropdown(
                                        'Sort By',
                                        'selectedSortBy',
                                        sortOptions,
                                        (opt) => typeof opt === 'object' ? opt.label : opt,
                                        (opt) => typeof opt === 'object' ? opt.value : opt
                                    )}
                                    {this.renderFilterDropdown(
                                        'Size',
                                        'selectedSize',
                                        availableSizes,
                                        (size) => `Size ${size}`
                                    )}
                                    {this.renderFilterDropdown(
                                        'Color',
                                        'selectedColor',
                                        availableColors,
                                        (color) => color
                                    )}
                                    {this.renderFilterDropdown(
                                        'Material',
                                        'selectedMaterial',
                                        availableMaterials,
                                        (material) => material
                                    )}
                                </View>
                            </View>

                            {/* Loading State or Product Grid */}
                            {loading ? (
                                <ProductGridSkeleton count={20} />
                            ) : (
                                <>
                                    {/* Product Grid */}
                                    <View style={styles.productGrid}>
                                        {paginatedProducts.length > 0 ? (
                                            paginatedProducts.map((product, index) =>
                                                this.renderProductCard(product, index)
                                            )
                                        ) : null}
                                    </View>

                                    {/* Empty State */}
                                    {paginatedProducts.length === 0 && !loading && (
                                        <View style={styles.emptyStateContainer}>
                                            <View style={styles.emptyStateIcon}>
                                                <Text style={styles.emptyIconText}>📦</Text>
                                            </View>
                                            <Text style={styles.emptyStateTitle}>No Products Found</Text>
                                            <Text style={styles.emptyStateSubtitle}>
                                                {this.state.selectedSize || this.state.selectedColor || this.state.selectedMaterial
                                                    ? "We couldn't find any products matching your selected filters."
                                                    : "This collection is currently empty. Check back soon for new arrivals!"}
                                            </Text>
                                            {(this.state.selectedSize || this.state.selectedColor || this.state.selectedMaterial) && (
                                                <TouchableOpacity
                                                    style={styles.clearFiltersButton}
                                                    onPress={() => {
                                                        this.setState({
                                                            selectedSize: null,
                                                            selectedColor: null,
                                                            selectedMaterial: null,
                                                            selectedSortBy: 'featured'
                                                        }, () => this.applyFilters());
                                                    }}
                                                >
                                                    <Text style={styles.clearFiltersText}>Clear All Filters</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}

                                    {/* Pagination - Only show if there are products and multiple pages */}
                                    {productCount > itemsPerPage && (
                                        <View style={styles.paginationContainer}>
                                            <TouchableOpacity
                                                style={[styles.paginationArrow, currentPage === 1 && styles.disabledArrow]}
                                                onPress={() => currentPage > 1 && this.setState({ currentPage: currentPage - 1 })}
                                                disabled={currentPage === 1}
                                            >
                                                <Text style={[styles.paginationArrowText, currentPage === 1 && styles.disabledText]}>←</Text>
                                            </TouchableOpacity>

                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const pageNumber = i + 1;
                                                return (
                                                    <TouchableOpacity
                                                        key={pageNumber}
                                                        style={[
                                                            styles.paginationButton,
                                                            currentPage === pageNumber && styles.activePaginationButton
                                                        ]}
                                                        onPress={() => this.setState({ currentPage: pageNumber })}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.paginationButtonText,
                                                                currentPage === pageNumber && styles.activePaginationText
                                                            ]}
                                                        >
                                                            {pageNumber}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}

                                            <TouchableOpacity
                                                style={[styles.paginationArrow, currentPage === totalPages && styles.disabledArrow]}
                                                onPress={() => currentPage < totalPages && this.setState({ currentPage: currentPage + 1 })}
                                                disabled={currentPage === totalPages}
                                            >
                                                <Text style={[styles.paginationArrowText, currentPage === totalPages && styles.disabledText]}>→</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
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
        backgroundColor: '#fff'
    },
    contentContainer: {
        flexDirection: 'row',
        paddingHorizontal: 50,
        paddingVertical: 30,
    },
    mainContent: {
        width: '100%',
    },
    categoryHeader: {
        marginBottom: 30,
        alignItems: 'center',
        position: 'relative',
        zIndex: 100,
    },
    breadcrumb: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 20,
    },
    categoryText: {
        fontSize: 22,
        fontWeight: '500',
    },
    breadcrumbText: {
        color: '#888',
        fontWeight: '400',
    },
    productCount: {
        fontSize: 14,
        color: '#888',
    },
    filtersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 9998,
    },
    filterDropdown: {
        marginRight: 15,
        marginBottom: 10,
        position: 'relative',
        zIndex: 9999,
    },
    dropdownWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
        zIndex: 9999,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 120,
    },
    dropdownText: {
        fontSize: 14,
        color: '#333',
    },
    selectedText: {
        fontWeight: '500',
        color: '#000',
    },
    chevron: {
        fontSize: 10,
        marginLeft: 8,
        color: '#666',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderTopWidth: 0,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        maxHeight: 200,
        overflow: 'scroll',
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#333',
    },
    selectedItemText: {
        fontWeight: '600',
        color: '#000',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
        minHeight: 400,
    },
    emptyStateIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyIconText: {
        fontSize: 48,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2C2C2C',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 450,
        marginBottom: 24,
    },
    clearFiltersButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#2C2C2C',
        borderRadius: 4,
        marginTop: 8,
    },
    clearFiltersText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -10,
        gap: 15,
        position: 'relative',
        zIndex: 1,
    },
    productCard: {
        width: isMobile() ? '48%' : '23%',  // 4 columns on desktop, 2 on mobile
        marginBottom: 25,
        backgroundColor: '#fff',
        overflow: 'visible',
        position: 'relative',
        zIndex: 1,
    },
    productImageContainer: {
        position: 'relative',
        width: '100%',
        height: isMobile() ? 280 : 320,  // Reduced height
        marginBottom: 8,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
    wishlistButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 32,
        height: 32,
        backgroundColor: 'white',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    wishlistIcon: {
        fontSize: 20,
        color: '#000',
    },
    saleBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    saleBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingVertical: 8,
    },
    productName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '400',
        color: '#000',
        marginRight: 10,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    paginationButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    activePaginationButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
    },
    paginationButtonText: {
        fontSize: 14,
        color: '#666',
    },
    activePaginationText: {
        color: '#000',
        fontWeight: '500',
    },
    paginationArrow: {
        padding: 10,
    },
    paginationArrowText: {
        fontSize: 16,
        color: '#666',
    },
    disabledArrow: {
        opacity: 0.3,
    },
    disabledText: {
        color: '#ccc',
    }
});

export default ItemSection;