import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const OrderHistory = () => {
    // Sample order data
    const orders = [
        { id: '#96459761', status: 'IN PROGRESS', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
        { id: '#71667167', status: 'COMPLETED', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
        { id: '#95214362', status: 'CANCELLED', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
        { id: '#71667167', status: 'COMPLETED', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
        { id: '#51746385', status: 'COMPLETED', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
        { id: '#51746385', status: 'CANCELLED', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
        { id: '#673971743', status: 'COMPLETED', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
        { id: '#673971743', status: 'COMPLETED', date: 'Mar 30, 2025', total: '₹1,400.00', products: 5 },
    ];

    const navigation = useNavigation();

    // Helper function to determine status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return '#2e7d32';
            case 'IN PROGRESS': return '#1976d2';
            case 'CANCELED': return '#d32f2f';
            default: return '#333';
        }
    };

    // Sidebar items
    const sidebarItems = [
        { icon: 'time-outline', text: 'Order History', active: true },
        { icon: 'cart-outline', text: 'Shopping Cart' },
        { icon: 'heart-outline', text: 'Wishlist' },
        { icon: 'card-outline', text: 'Cards & Address' },
    ];

    // Pagination items
    const paginationItems = [
        { number: '01', active: true },
        { number: '02', active: false },
        { number: '03', active: false },
        { number: '04', active: false },
        { number: '05', active: false },
        { number: '06', active: false },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#333" barStyle="light-content" />

            {/* Top Banner */}
            <View style={styles.topBanner}>
                <Text style={styles.bannerText}>
                    20% Offer for the First time user. Shop{' '}
                    <Text style={styles.bannerLink}>Women</Text> and{' '}
                    <Text style={styles.bannerLink}>Men</Text>
                </Text>
            </View>

            {/* Navigation Bar */}

            {/* Order History Header */}
            <View style={styles.orderHistoryHeader}>
                <Text style={styles.headerTitle}>ORDER HISTORY</Text>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.mainContent}>
                <View style={styles.contentContainer}>
                    {/* Sidebar */}
                    <View style={styles.sidebar}>
                        {sidebarItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.sidebarItem,
                                    item.active && styles.sidebarItemActive
                                ]}
                            >
                                <Ionicons
                                    name={item.icon}
                                    size={20}
                                    color={item.active ? "#fff" : "#333"}
                                />
                                <Text style={[
                                    styles.sidebarText,
                                    item.active && styles.sidebarTextActive
                                ]}>
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Order Panel */}
                    <View style={styles.orderPanel}>
                        <View style={styles.panelHeader}>
                            <Text style={styles.panelTitle}>All Orders</Text>

                            <View style={styles.searchFilters}>
                                <View style={styles.searchBox}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search"
                                        placeholderTextColor="#999"
                                    />
                                    <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
                                </View>

                                <TouchableOpacity style={styles.filterButton}>
                                    <Text style={styles.filterText}>Filters</Text>
                                    <Ionicons name="filter" size={16} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Orders Table */}
                        <View style={styles.ordersTable}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Order ID</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Date</Text>
                                <Text style={[styles.headerCell, { flex: 1.5 }]}>Total</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Action</Text>
                            </View>

                            {/* Table Rows */}
                            {orders.map((order, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.cell, { flex: 1 }]}>{order.id}</Text>
                                    <Text
                                        style={[
                                            styles.cell,
                                            { flex: 1, color: getStatusColor(order.status), fontWeight: '500' }
                                        ]}
                                    >
                                        {order.status}
                                    </Text>
                                    <Text style={[styles.cell, { flex: 1 }]}>{order.date}</Text>
                                    <Text style={[styles.cell, { flex: 1.5 }]}>
                                        {order.total} ({order.products} Products)
                                    </Text>
                                    <View style={[styles.cell, { flex: 1, alignItems: 'flex-end' }]}>
                                        <TouchableOpacity style={styles.viewDetailsButton}
                                            onPress={() => navigation.navigate('OrderDetails')}
                                        >
                                            <Text style={styles.viewDetailsText}>View Details</Text>
                                            <Ionicons name="arrow-forward" size={16} color="#333" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Pagination */}
                        <View style={styles.pagination}>
                            <TouchableOpacity style={styles.paginationArrow}>
                                <Ionicons name="chevron-back" size={18} color="#333" />
                            </TouchableOpacity>

                            {paginationItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.paginationNumber,
                                        item.active && styles.paginationNumberActive
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.paginationText,
                                            item.active && styles.paginationTextActive
                                        ]}
                                    >
                                        {item.number}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity style={styles.paginationArrow}>
                                <Ionicons name="chevron-forward" size={18} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>



            {/* Copyright */}
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBanner: {
        backgroundColor: '#333',
        padding: 8,
        alignItems: 'center',
    },
    bannerText: {
        color: '#fff',
        fontSize: 14,
    },
    bannerLink: {
        fontWeight: '600',
        color: '#fff',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    navLinks: {
        flexDirection: 'row',
        gap: 20,
    },
    navLink: {
        color: '#333',
        fontWeight: '500',
        fontSize: 15,
    },
    navIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    iconButton: {
        padding: 3,
    },
    orderHistoryHeader: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '500',
    },
    mainContent: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        padding: 15,
        gap: 15,
    },
    sidebar: {
        width: 265,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sidebarItemActive: {
        backgroundColor: '#222',
    },
    sidebarText: {
        color: '#333',
        fontSize: 14,
    },
    sidebarTextActive: {
        color: '#fff',
    },
    orderPanel: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
        padding: 15,
    },
    panelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    panelTitle: {
        fontSize: 20,
        fontWeight: '500',
    },
    searchFilters: {
        flexDirection: 'row',
        gap: 10,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    searchInput: {
        width: 150,
        paddingVertical: 8,
    },
    searchIcon: {
        marginLeft: 5,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
    },
    filterText: {
        color: '#333',
        fontSize: 14,
    },
    ordersTable: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: 12,
    },
    headerCell: {
        fontWeight: '500',
        fontSize: 14,
        marginRight: 6,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cell: {
        fontSize: 14,
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingRight: 110,
    },
    viewDetailsText: {
        color: '#333',
        fontSize: 14,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 20,
    },
    paginationArrow: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationNumber: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationNumberActive: {
        backgroundColor: '#c62828',
        borderColor: '#c62828',
    },
    paginationText: {
        fontSize: 14,
        color: '#333',
    },
    paginationTextActive: {
        color: '#fff',
    },
    footer: {
        backgroundColor: '#f5f5f5',
    },
    footerContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 30,
        justifyContent: 'space-between',
    },
    footerSection: {
        width: '45%',
        marginBottom: 20,
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    socialIcon: {
        marginRight: 10,
    },
    copyright: {
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        padding: 15,
        alignItems: 'center',
    },
    copyrightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    copyrightText: {
        fontSize: 14,
        color: '#555',
    },
});

export default OrderHistory;