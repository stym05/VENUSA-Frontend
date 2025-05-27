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
    ActivityIndicator
} from 'react-native';
import Item from "./item";
import { isMobile } from "../../utils";
import Footer from "../../components/footer";
import { getProductBySubCategory } from "../../apis";

class ItemSection extends React.Component {
    constructor(props) {
        super(props);
        let productId = "";
        let productName = "";
        if (this.props.route && this.props.route.params) {
            productId = this.props.route.params.productId;
            productName = this.props.route.params.productName;
        }
        this.state = {
            loading: false,
            productName,
            productId,
            productarray: [],
            selectedSortBy: null,
            selectedSize: null,
            selectedColor: null,
            selectedProductType: null,
            productCount: 0,
            currentPage: 1,
            itemsPerPage: 9
        };
    }

    componentDidMount = async () => {
        try {
            const { productId } = this.state;
            this.setState({ loading: true });
            const response = await getProductBySubCategory(productId);
            console.log("-----------------getProductBySubCategory-----------", response)
            if (response && response.success) {
                const { products } = response;
                this.setState({
                    productarray: products,
                    productCount: products.length,
                    loading: false
                });
            } else {
                this.setState({ loading: false });
            }
        } catch (err) {
            console.log("Error fetching products: ", err);
            this.setState({ loading: false });
        }
    };

    renderFilterDropdown = (label, options) => {
        const stateKey = `selected${label.replace(/\s+/g, '')}`;

        return (
            <View style={styles.filterDropdown}>
                <Text style={styles.filterLabel}>{label}</Text>
                <View style={styles.dropdownWrapper}>
                    <TouchableOpacity style={styles.dropdownButton}>
                        <Text style={styles.dropdownText}>
                            {this.state[stateKey] || label}
                        </Text>
                        <Text style={styles.chevron}>▼</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    renderSidebarItem = (title, items) => (
        <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeader}>{title}</Text>
            {items.map((item, index) => (
                <TouchableOpacity key={index} style={styles.sidebarItem}>
                    <Text style={styles.sidebarItemText}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    renderProductCard = (product, index) => {
        const ProductCard = () => {
            // Adjust these property names based on your actual API response structure
            const productId = product.id || product._id || product.productId;
            const productName = product.name || product.title || product.productName;
            const productPrice = product.price || product.cost || product.amount;
            const productImages = product.images || [product.image || product.imageUrl || product.thumbnail || 'https://via.placeholder.com/200x250'];

            // State to manage the current image index
            const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

            // Effect to change the image every 3 seconds
            React.useEffect(() => {
                const interval = setInterval(() => {
                    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
                }, 3000); // Change image every 3 seconds

                return () => clearInterval(interval); // Cleanup on unmount
            }, [productImages.length]);

            return (
                <View key={productId || index} style={styles.productCard}>
                    <View style={styles.productImageContainer}>
                        <Image
                            source={{ uri: productImages[currentImageIndex] }} // Display the current image
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity style={styles.wishlistButton}>
                            <Text style={styles.wishlistIcon}>♡</Text>
                        </TouchableOpacity>
                        {index % 3 === 0 && (
                            <View style={styles.saleBadge}>
                                <Text style={styles.saleBadgeText}>Sale</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{productName}</Text>
                        <Text style={styles.productPrice}>
                            {typeof productPrice === 'number' ? `₹${productPrice.toFixed(2)}` : productPrice}
                        </Text>
                    </View>
                </View>
            );
        };

        return <ProductCard />;
    };

    render() {
        const { loading, productarray, productCount, currentPage, itemsPerPage, productName } = this.state;

        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = productarray.slice(startIndex, startIndex + itemsPerPage);
        const totalPages = Math.ceil(productCount / itemsPerPage);

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.contentContainer}>
                        {/* Left Sidebar */}
                        <View style={styles.sidebar}>
                            {this.renderSidebarItem('Offers', [
                                'Member Exclusive Prices',
                                'Sweatshirts starting ₹799'
                            ])}

                            {this.renderSidebarItem('New In', [
                                'Women\'s Clothing | New Arrivals'
                            ])}

                            {this.renderSidebarItem('Collection', [
                                'Tops',
                                'Pants',
                                'Dresses & Jumpsuits',
                                'Outerwear & Jackets',
                                'Pullovers',
                                'Shorts & Skirts'
                            ])}
                        </View>

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
                                    {this.renderFilterDropdown('Sort By')}
                                    {this.renderFilterDropdown('Color')}
                                    {this.renderFilterDropdown('Size')}
                                    {this.renderFilterDropdown('Product Type')}

                                    <TouchableOpacity style={styles.filtersButton}>
                                        <Text style={styles.filtersButtonText}>Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Loading State */}
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#000" />
                                    <Text style={styles.loadingText}>Loading products...</Text>
                                </View>
                            ) : (
                                <>
                                    {/* Product Grid */}
                                    <View style={styles.productGrid}>
                                        {paginatedProducts.length > 0 ? (
                                            paginatedProducts.map((product, index) =>
                                                this.renderProductCard(product, index)
                                            )
                                        ) : (
                                            <View style={styles.noProductsContainer}>
                                                <Text style={styles.noProductsText}>No products found</Text>
                                            </View>
                                        )}
                                    </View>

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
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    sidebar: {
        width: isMobile() ? 0 : '20%',
        display: isMobile() ? 'none' : 'flex',
        paddingRight: 30,
    },
    sidebarSection: {
        marginBottom: 25,
    },
    sidebarHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    sidebarItem: {
        marginBottom: 8,
    },
    sidebarItemText: {
        fontSize: 14,
        color: '#666',
    },
    mainContent: {
        width: isMobile() ? '100%' : '80%',
    },
    categoryHeader: {
        marginBottom: 30,
    },
    breadcrumb: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
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
        flexWrap: 'wrap',
    },
    filterDropdown: {
        marginRight: 15,
        marginBottom: 10,
    },
    filterLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    dropdownWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 100,
    },
    dropdownText: {
        fontSize: 14,
    },
    chevron: {
        fontSize: 10,
        marginLeft: 5,
    },
    filtersButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        marginLeft: 'auto',
    },
    filtersButtonText: {
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    noProductsText: {
        fontSize: 16,
        color: '#666',
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -10,
    },
    productCard: {
        width: isMobile() ? '50%' : '33.333%',
        padding: 10,
        marginBottom: 20,
    },
    productImageContainer: {
        position: 'relative',
        aspectRatio: 0.8,
        marginBottom: 10,
    },
    productImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
    wishlistButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    wishlistIcon: {
        fontSize: 18,
    },
    saleBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    saleBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    productInfo: {
        marginTop: 5,
    },
    productName: {
        fontSize: 14,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '500',
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