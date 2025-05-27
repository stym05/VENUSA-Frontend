import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

const TrendingScrollBanner = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;

    // Text content that will scroll
    const scrollText = "TRENDING COLLECTION • TRENDING COLLECTION • ";

    // Calculate the width needed for the text
    const textWidth = scrollText.length * 12; // Approximate character width

    useEffect(() => {
        const startScrolling = () => {
            scrollX.setValue(0);
            Animated.loop(
                Animated.timing(scrollX, {
                    toValue: -textWidth / 2, // Move by half the text width to create seamless loop
                    duration: 8000, // Adjust speed here (lower = faster)
                    useNativeDriver: false, // Set to false for continuous scrolling
                }),
                { iterations: -1 } // Infinite loop
            ).start();
        };

        startScrolling();
    }, [scrollX, textWidth]);

    return (
        <View style={styles.container}>
            <View style={styles.scrollContainer}>
                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            transform: [{ translateX: scrollX }],
                        },
                    ]}
                >
                    {/* Render multiple copies of the text for seamless scrolling */}
                    {[...Array(4)].map((_, index) => (
                        <View key={index} style={styles.textRow}>
                            <Text style={styles.text}>TRENDING COLLECTION</Text>
                            <View style={styles.dot} />
                            <Text style={styles.text}>TRENDING COLLECTION</Text>
                            <View style={styles.dot} />
                        </View>
                    ))}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = {
    container: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 20,
        overflow: 'hidden',
    },
    scrollContainer: {
        overflow: 'hidden',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 2,
        marginHorizontal: 20,
        fontFamily: 'System', // You can replace with your preferred font
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff4444',
        marginHorizontal: 20,
    },
};

export default TrendingScrollBanner;