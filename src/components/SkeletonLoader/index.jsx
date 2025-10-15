import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { isMobile } from '../../utils';

// Reusable Skeleton Box
const SkeletonBox = ({ width, height, style }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 0.4],
    });

    return (
        <Animated.View
            style={[
                styles.skeletonBox,
                { width, height, opacity },
                style,
            ]}
        />
    );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
    return (
        <View style={styles.productCard}>
            <SkeletonBox width="100%" height={isMobile() ? 280 : 320} style={{ marginBottom: 8 }} />
            <View style={styles.productInfo}>
                <SkeletonBox width="60%" height={14} style={{ marginBottom: 6 }} />
                <SkeletonBox width="30%" height={14} />
            </View>
        </View>
    );
};

// Product Grid Skeleton (for ItemSection)
export const ProductGridSkeleton = ({ count = 20 }) => {
    return (
        <View style={styles.productGrid}>
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </View>
    );
};

// Category Card Skeleton (for ShopCategories)
export const CategoryCardSkeleton = () => {
    return (
        <View style={styles.categoryCard}>
            <View style={styles.categoryCardBorder}>
                <SkeletonBox width={180} height={230} style={{ marginBottom: 0 }} />
                <View style={styles.categoryTextContainer}>
                    <SkeletonBox width={100} height={14} style={{ alignSelf: 'center' }} />
                </View>
            </View>
        </View>
    );
};

// Category Section Skeleton
export const CategorySectionSkeleton = () => {
    return (
        <View style={styles.categorySection}>
            {/* Section Title */}
            <View style={styles.sectionTitleContainer}>
                <SkeletonBox width={250} height={32} style={{ marginBottom: 8, alignSelf: 'center' }} />
                <SkeletonBox width={60} height={2} style={{ alignSelf: 'center', backgroundColor: '#D4D4D4' }} />
            </View>

            {/* Category Cards */}
            <View style={styles.categoryList}>
                {Array.from({ length: 4}).map((_, index) => (
                    <CategoryCardSkeleton key={index} />
                ))}
            </View>
        </View>
    );
};

// Dashboard Product Section Skeleton
export const DashboardProductSkeleton = () => {
    return (
        <View style={styles.dashboardSection}>
            {/* Category Title */}
            <SkeletonBox width={250} height={42} style={{ marginBottom: 25, alignSelf: 'center' }} />

            {/* Subcategory */}
            <View style={{ marginBottom: 50, paddingHorizontal: isMobile() ? 15 : 50 }}>
                <SkeletonBox width={200} height={32} style={{ marginBottom: 10 }} />
                <SkeletonBox width={150} height={20} style={{ marginBottom: 20 }} />

                {/* Horizontal Product Cards */}
                <View style={styles.horizontalScroll}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <View key={index} style={styles.dashboardProductCard}>
                            <SkeletonBox width="100%" height={isMobile() ? 300 : 350} style={{ marginBottom: 16 }} />
                            <SkeletonBox width="80%" height={18} style={{ marginBottom: 8 }} />
                            <SkeletonBox width="60%" height={16} style={{ marginBottom: 12 }} />
                            <SkeletonBox width="40%" height={22} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonBox: {
        backgroundColor: '#E8E8E8',
        borderRadius: 0,
    },
    productCard: {
        width: isMobile() ? '48%' : '23%',
        marginBottom: 25,
        backgroundColor: '#fff',
        overflow: 'visible',
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingVertical: 8,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -10,
        gap: 20,
    },
    categoryCard: {
        marginRight: 25,
        marginBottom: 20,
    },
    categoryCardBorder: {
        borderWidth: 1,
        borderColor: '#D4D4D4',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    categoryTextContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    categoryList: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 40,
    },
    categorySection: {
        marginTop: 60,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        paddingVertical: 50,
        paddingHorizontal: 40,
    },
    sectionTitleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dashboardSection: {
        width: '100%',
    },
    horizontalScroll: {
        flexDirection: 'row',
        gap: 20,
    },
    dashboardProductCard: {
        width: isMobile() ? 280 : 320,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 0,
        overflow: 'hidden',
    },
});

export default SkeletonBox;
