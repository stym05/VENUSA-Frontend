import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { getOrderDetails } from '../apis/index.js';
import Store from '../store';

const OrderDetails = () => {
    const route = useRoute();
    const { orderId } = route.params || {};
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const userData = Store.getState().user.userData;
            const userId = userData?._id;

            if (!userId || !orderId) {
                setError('Missing user or order information');
                setLoading(false);
                return;
            }

            const response = await getOrderDetails(userId, orderId);

            if (response.success) {
                setOrderData(response.order);
            } else {
                setError(response.message || 'Failed to load order details');
            }
        } catch (err) {
            console.error("Error fetching order details:", err);
            setError('An error occurred while loading order details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>ORDER DETAILS</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#c00" />
                    <Text style={styles.loadingText}>Loading order details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !orderData) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>ORDER DETAILS</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#c00" />
                    <Text style={styles.errorText}>{error || 'Order not found'}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>ORDER HISTORY</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.mainContent}>
                    {/* Side Menu */}
                    <View style={styles.sideMenu}>
                        <TouchableOpacity style={styles.sideMenuItemActive}>
                            <Ionicons name="document-text-outline" size={20} color="#fff" />
                            <Text style={styles.sideMenuTextActive}>Order History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sideMenuItem}>
                            <Ionicons name="cart-outline" size={20} color="#333" />
                            <Text style={styles.sideMenuText}>Shopping Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sideMenuItem}>
                            <Ionicons name="heart-outline" size={20} color="#333" />
                            <Text style={styles.sideMenuText}>Wishlist</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sideMenuItem}>
                            <Ionicons name="card-outline" size={20} color="#333" />
                            <Text style={styles.sideMenuText}>Cards & Address</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Order Details */}
                    <View style={styles.orderDetails}>
                        {/* Back button and rating */}
                        <View style={styles.actionBar}>
                            <TouchableOpacity style={styles.backButton}>
                                <Ionicons name="arrow-back" size={18} color="#333" />
                                <Text style={styles.backButtonText}>All Orders</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ratingButton}>
                                <Text style={styles.ratingText}>Leave a Rating</Text>
                                <Ionicons name="add" size={16} color="#c00" />
                            </TouchableOpacity>
                        </View>

                        {/* Order Card */}
                        <View style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <View>
                                    <Text style={styles.orderNumber}>#{orderData.orderId || orderData._id}</Text>
                                    <Text style={styles.orderInfo}>
                                        {orderData.items?.length || 0} Products • Order Placed in {formatDate(orderData.createdAt)}
                                    </Text>
                                </View>
                                <Text style={styles.orderPrice}>₹{orderData.totalAmount?.toFixed(2) || '0.00'}</Text>
                            </View>

                            {/* Order Status */}
                            <View style={styles.orderStatus}>
                                <View style={styles.statusLine}>
                                    <View style={[styles.statusCircle, styles.completedCircle]}></View>
                                    <View style={[styles.statusBar, styles.completedBar]}></View>
                                    <View style={[styles.statusCircle, styles.activeCircle]}></View>
                                    <View style={[styles.statusBar, styles.pendingBar]}></View>
                                    <View style={[styles.statusCircle, styles.pendingCircle]}></View>
                                    <View style={[styles.statusBar, styles.pendingBar]}></View>
                                    <View style={[styles.statusCircle, styles.pendingCircle]}></View>
                                </View>

                                <View style={styles.statusLabels}>
                                    <View style={styles.statusItem}>
                                        <Ionicons name="document-text-outline" size={24} color="#333" />
                                        <Text style={styles.statusText}>Order Placed</Text>
                                    </View>
                                    <View style={styles.statusItem}>
                                        <FontAwesome5 name="box" size={20} color="#333" />
                                        <Text style={styles.statusText}>Packaging</Text>
                                    </View>
                                    <View style={styles.statusItem}>
                                        <MaterialIcons name="delivery-dining" size={24} color="#ccc" />
                                        <Text style={[styles.statusText, styles.pendingText]}>On The Road</Text>
                                    </View>
                                    <View style={styles.statusItem}>
                                        <FontAwesome5 name="handshake" size={20} color="#ccc" />
                                        <Text style={[styles.statusText, styles.pendingText]}>Delivered</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Order Activity */}
                            <View style={styles.activitySection}>
                                <Text style={styles.sectionTitle}>Order Activity</Text>

                                <View style={styles.activityItem}>
                                    <View style={[styles.activityIcon, { backgroundColor: '#ffdddd' }]}>
                                        <Ionicons name="checkmark" size={20} color="#dd5555" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>Your order has been delivered. Thank you for shopping at Venus!</Text>
                                        <Text style={styles.activityTime}>23 Jan, 2021 at 7:32 PM</Text>
                                    </View>
                                </View>

                                <View style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name="person" size={20} color="#777" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>Our delivery man (Johnny) Has picked-up your order for delivery.</Text>
                                        <Text style={styles.activityTime}>23 Jan, 2021 at 2:00 PM</Text>
                                    </View>
                                </View>

                                <View style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name="location" size={20} color="#777" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>Your order has reached at last mile hub.</Text>
                                        <Text style={styles.activityTime}>22 Jan, 2021 at 8:00 AM</Text>
                                    </View>
                                </View>

                                <View style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name="navigate" size={20} color="#777" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>Your order on the way to (last mile) hub.</Text>
                                        <Text style={styles.activityTime}>21, 2021 at 5:32 AM</Text>
                                    </View>
                                </View>

                                <View style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name="checkmark-circle" size={20} color="#777" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>Your order is successfully verified.</Text>
                                        <Text style={styles.activityTime}>20 Jan, 2021 at 7:32 PM</Text>
                                    </View>
                                </View>

                                <View style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name="document-text" size={20} color="#777" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>Your order has been confirmed.</Text>
                                        <Text style={styles.activityTime}>19 Jan, 2021 at 2:01 PM</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Product Section */}
                            <View style={styles.productSection}>
                                <Text style={styles.sectionTitle}>Product ({orderData.items?.length || 0})</Text>

                                <View style={styles.productTableHeader}>
                                    <Text style={styles.productHeaderText}>PRODUCTS</Text>
                                    <Text style={styles.priceHeaderText}>PRICE</Text>
                                    <Text style={styles.quantityHeaderText}>QUANTITY</Text>
                                    <Text style={styles.subtotalHeaderText}>SUB-TOTAL</Text>
                                </View>

                                {orderData.items?.map((item, index) => {
                                    const product = item.product || item;
                                    const price = product.price || 0;
                                    const quantity = item.quantity || 1;
                                    const subtotal = price * quantity;

                                    return (
                                        <View key={index} style={styles.productItem}>
                                            <View style={styles.productDetails}>
                                                <Image
                                                    source={{ uri: product.images?.[0] || 'https://via.placeholder.com/60x80/e8f4ff/333' }}
                                                    style={styles.productImage}
                                                />
                                                <View style={styles.productInfo}>
                                                    <Text style={styles.brandText}>{product.category || 'Product'}</Text>
                                                    <Text style={styles.productTitle}>{product.name || 'Unknown Product'}</Text>
                                                    {item.size && <Text style={styles.productMeta}>Size: {item.size}</Text>}
                                                    {item.color && <Text style={styles.productMeta}>Color: {item.color}</Text>}
                                                </View>
                                            </View>
                                            <Text style={styles.productPrice}>₹{price.toFixed(2)}</Text>
                                            <Text style={styles.productQuantity}>x{quantity}</Text>
                                            <Text style={styles.productSubtotal}>₹{subtotal.toFixed(2)}</Text>
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Address Section */}
                            <View style={styles.addressSection}>
                                <View style={styles.addressColumn}>
                                    <Text style={styles.addressTitle}>Billing Address</Text>
                                    {orderData.billingAddress ? (
                                        <>
                                            <Text style={styles.addressName}>{orderData.billingAddress.name || 'N/A'}</Text>
                                            <Text style={styles.addressText}>{orderData.billingAddress.street || ''}</Text>
                                            <Text style={styles.addressText}>{orderData.billingAddress.city || ''}</Text>
                                            <Text style={styles.addressText}>
                                                {orderData.billingAddress.state || ''} - {orderData.billingAddress.pincode || ''}
                                            </Text>
                                            {orderData.billingAddress.phone && (
                                                <Text style={styles.addressText}>Phone: {orderData.billingAddress.phone}</Text>
                                            )}
                                            {orderData.billingAddress.email && (
                                                <Text style={styles.addressText}>Email: {orderData.billingAddress.email}</Text>
                                            )}
                                        </>
                                    ) : (
                                        <Text style={styles.addressText}>No billing address provided</Text>
                                    )}
                                </View>

                                <View style={styles.addressColumn}>
                                    <Text style={styles.addressTitle}>Shipping Address</Text>
                                    {orderData.shippingAddress ? (
                                        <>
                                            <Text style={styles.addressName}>{orderData.shippingAddress.name || 'N/A'}</Text>
                                            <Text style={styles.addressText}>{orderData.shippingAddress.street || ''}</Text>
                                            <Text style={styles.addressText}>{orderData.shippingAddress.city || ''}</Text>
                                            <Text style={styles.addressText}>
                                                {orderData.shippingAddress.state || ''} - {orderData.shippingAddress.pincode || ''}
                                            </Text>
                                            {orderData.shippingAddress.phone && (
                                                <Text style={styles.addressText}>Phone: {orderData.shippingAddress.phone}</Text>
                                            )}
                                            {orderData.shippingAddress.email && (
                                                <Text style={styles.addressText}>Email: {orderData.shippingAddress.email}</Text>
                                            )}
                                        </>
                                    ) : (
                                        <Text style={styles.addressText}>No shipping address provided</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    navBar: {
        flexDirection: 'row',
    },
    navItem: {
        marginRight: 20,
        fontSize: 16,
        fontWeight: '500',
    },
    headerIcons: {
        flexDirection: 'row',
        width: 120,
        justifyContent: 'space-between',
    },
    titleContainer: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    mainContent: {
        flexDirection: 'row',
        padding: 15,
    },
    sideMenu: {
        width: 190,
        marginRight: 15,
    },
    sideMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 8,
    },
    sideMenuItemActive: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 8,
    },
    sideMenuText: {
        marginLeft: 8,
        fontSize: 14,
    },
    sideMenuTextActive: {
        marginLeft: 8,
        fontSize: 14,
        color: '#fff',
    },
    orderDetails: {
        flex: 1,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        marginLeft: 5,
        fontSize: 16,
    },
    ratingButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: '#c00',
        marginRight: 5,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderInfo: {
        fontSize: 12,
        color: '#777',
        marginTop: 4,
    },
    orderPrice: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderStatus: {
        marginVertical: 20,
    },
    statusLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    statusCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
    },
    completedCircle: {
        backgroundColor: '#c00',
        borderColor: '#c00',
    },
    activeCircle: {
        backgroundColor: '#c00',
        borderColor: '#c00',
    },
    pendingCircle: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
    },
    statusBar: {
        flex: 1,
        height: 3,
    },
    completedBar: {
        backgroundColor: '#c00',
    },
    pendingBar: {
        backgroundColor: '#ccc',
    },
    statusLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statusItem: {
        alignItems: 'center',
        width: '22%',
    },
    statusText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
    pendingText: {
        color: '#aaa',
    },
    activitySection: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
    },
    activityTime: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    productSection: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    productTableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    productHeaderText: {
        flex: 2,
        fontSize: 12,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    priceHeaderText: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    quantityHeaderText: {
        flex: 0.7,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtotalHeaderText: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    productDetails: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 80,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
    },
    productInfo: {
        flex: 1,
    },
    brandText: {
        fontSize: 12,
        color: '#3498db',
    },
    productTitle: {
        fontSize: 14,
    },
    productPrice: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
    },
    productQuantity: {
        flex: 0.7,
        fontSize: 14,
        textAlign: 'center',
    },
    productSubtotal: {
        flex: 1,
        fontSize: 14,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    addressSection: {
        flexDirection: 'row',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addressColumn: {
        flex: 1,
        paddingHorizontal: 10,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addressName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    addressText: {
        fontSize: 13,
        color: '#555',
        marginBottom: 3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#777',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: '#c00',
        textAlign: 'center',
    },
    productMeta: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
});

export default OrderDetails;