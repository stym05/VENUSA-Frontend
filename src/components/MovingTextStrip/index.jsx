import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MovingTextStrip = () => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      animationValue.setValue(0); // Reset animation to the starting position
      Animated.loop(
        Animated.timing(animationValue, {
          toValue: -width, // Move by the width of one text segment
          duration: 5000, // Adjust speed (5 seconds for one cycle)
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [animationValue]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateX: animationValue }],
          },
        ]}
      >
        {/* Repeated Text for Seamless Flow */}
        <Text style={styles.text}>🚀 Non-stop text scrolling seamlessly!</Text>
        <Text style={styles.text}>🚀 Non-stop text scrolling seamlessly!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50, // Height of the marquee strip
    overflow: 'hidden', // Ensure text stays within bounds
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
  },
  animatedContainer: {
    flexDirection: 'row', // Arrange texts side-by-side
    width: width * 2, // Double the width for seamless looping
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    width, // Match screen width for perfect alignment
    textAlign: 'center',
  },
});


export default MovingTextStrip;

