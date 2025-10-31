import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';
import Modal from "react-native-modal";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { isMobile } from '../../utils/index.js';

const { width, height } = Dimensions.get('window');

const ProgressModal = ({ isVisible, onClose, onNotifyMe }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [titleAnim] = useState(new Animated.Value(0));
  const [contentAnim] = useState(new Animated.Value(0));
  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(100);
      scaleAnim.setValue(0.95);
      titleAnim.setValue(0);
      contentAnim.setValue(0);

      // Orchestrated entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 40,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Stagger content animations
        Animated.sequence([
          Animated.timing(titleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(contentAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Continuous shimmer effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isVisible]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const handleContinue = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleNotifyMe = () => {
    if (onNotifyMe) {
      onNotifyMe();
    }
    handleContinue();
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.85}
      backdropColor="#000000"
      backdropTransitionOutTiming={0}
      style={styles.modal}
      onBackdropPress={handleContinue}
    >
      <Animated.View
        style={[
          styles.modalContent,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          },
        ]}
      >
        <View style={styles.container}>
          {/* Elegant Header Section */}
          <View style={styles.headerSection}>
            {/* Decorative Lines */}
            <View style={styles.decorativeLinesContainer}>
              <View style={styles.decorativeLine} />
              <Animated.View
                style={[
                  styles.shimmerLine,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              />
            </View>

            {/* Brand Logo Area */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: titleAnim,
                  transform: [
                    {
                      translateY: titleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.brandName}>VENUSA</Text>
              <View style={styles.brandUnderline} />
            </Animated.View>

            {/* Main Title */}
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  opacity: titleAnim,
                  transform: [
                    {
                      translateY: titleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.mainTitle}>Curating Your</Text>
              <Text style={styles.accentTitle}>Exclusive Experience</Text>
            </Animated.View>
          </View>

          {/* Content Section */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View
              style={[
                styles.contentSection,
                {
                  opacity: contentAnim,
                  transform: [
                    {
                      translateY: contentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Subtitle */}
              <Text style={styles.subtitle}>
                We're meticulously crafting an exceptional fashion destination
              </Text>

              {/* Description */}
              <Text style={styles.description}>
                Our atelier is currently perfecting every detail to bring you an unparalleled shopping experience.
                While we polish the final touches, you're welcome to explore our preview collection.
              </Text>

              {/* Features Grid */}
              <View style={styles.featuresGrid}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconWrapper}>
                    <Feather name="gift" size={22} color="#800020" />
                  </View>
                  <Text style={styles.featureTitle}>Exclusive Collections</Text>
                  <Text style={styles.featureText}>Handpicked premium designs</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconWrapper}>
                    <Feather name="star" size={22} color="#800020" />
                  </View>
                  <Text style={styles.featureTitle}>VIP Access</Text>
                  <Text style={styles.featureText}>Early launch privileges</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconWrapper}>
                    <MaterialCommunityIcons name="hanger" size={22} color="#800020" />
                  </View>
                  <Text style={styles.featureTitle}>Curated Styles</Text>
                  <Text style={styles.featureText}>Timeless fashion pieces</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconWrapper}>
                    <Feather name="bell" size={22} color="#800020" />
                  </View>
                  <Text style={styles.featureTitle}>First to Know</Text>
                  <Text style={styles.featureText}>Launch notifications</Text>
                </View>
              </View>

              {/* CTA Section */}
              <View style={styles.ctaSection}>
                <Text style={styles.ctaTitle}>Be Part of Something Extraordinary</Text>
                <Text style={styles.ctaSubtext}>
                  Join our exclusive list and receive a special welcome offer when we launch
                </Text>

                {/* Notify Me Button */}
                <TouchableOpacity
                  onPress={handleNotifyMe}
                  activeOpacity={0.9}
                  style={styles.primaryButton}
                >
                  <LinearGradient
                    colors={['#800020', '#a00028']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="notifications-outline" size={20} color="#F8F3F0" style={styles.buttonIcon} />
                    <Text style={styles.primaryButtonText}>Notify Me at Launch</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Continue Button */}
                <TouchableOpacity
                  onPress={handleContinue}
                  activeOpacity={0.9}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Continue to Preview</Text>
                  <Feather name="arrow-right" size={18} color="#800020" style={styles.arrowIcon} />
                </TouchableOpacity>
              </View>

              {/* Footer Note */}
              <View style={styles.footerNote}>
                <View style={styles.footerDivider} />
                <Text style={styles.footerText}>
                  Currently in Beta • Some features are being perfected
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    width: isMobile() ? width * 0.92 : Math.min(550, width * 0.85),
    maxHeight: isMobile() ? height * 0.88 : height * 0.90,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 25,
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    paddingTop: isMobile() ? 35 : 45,
    paddingHorizontal: isMobile() ? 25 : 40,
    paddingBottom: isMobile() ? 20 : 30,
    backgroundColor: '#F8F3F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0DB',
  },
  decorativeLinesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#E5E0DB',
    overflow: 'hidden',
  },
  decorativeLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#800020',
  },
  shimmerLine: {
    position: 'absolute',
    top: 0,
    width: 100,
    height: 3,
    backgroundColor: '#fff',
    opacity: 0.6,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontFamily: 'LexendZetta',
    fontSize: isMobile() ? 20 : 24,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 4,
  },
  brandUnderline: {
    width: 60,
    height: 1,
    backgroundColor: '#800020',
    marginTop: 8,
  },
  titleContainer: {
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'Didot',
    fontSize: isMobile() ? 28 : 36,
    fontWeight: '300',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: 2,
  },
  accentTitle: {
    fontFamily: 'Didot',
    fontSize: isMobile() ? 28 : 36,
    fontWeight: '300',
    color: '#800020',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  contentSection: {
    paddingHorizontal: isMobile() ? 25 : 40,
    paddingTop: isMobile() ? 25 : 35,
  },
  subtitle: {
    fontFamily: 'Jura',
    fontSize: isMobile() ? 16 : 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  description: {
    fontFamily: 'Roboto',
    fontSize: isMobile() ? 14 : 15,
    fontWeight: '300',
    color: '#666666',
    textAlign: 'center',
    lineHeight: isMobile() ? 22 : 24,
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    width: isMobile() ? '48%' : '48%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E0DB',
    padding: isMobile() ? 18 : 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F3F0',
    borderWidth: 1,
    borderColor: '#800020',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontFamily: 'Jura',
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  featureText: {
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '300',
    color: '#888888',
    textAlign: 'center',
  },
  ctaSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  ctaTitle: {
    fontFamily: 'Jura',
    fontSize: isMobile() ? 18 : 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  ctaSubtext: {
    fontFamily: 'Roboto',
    fontSize: isMobile() ? 13 : 14,
    fontWeight: '300',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 15px rgba(128, 0, 32, 0.2)',
      },
      default: {
        shadowColor: '#800020',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      },
    }),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isMobile() ? 16 : 18,
    paddingHorizontal: 25,
  },
  buttonIcon: {
    marginRight: 10,
  },
  primaryButtonText: {
    fontFamily: 'Jura',
    fontSize: isMobile() ? 15 : 16,
    fontWeight: '600',
    color: '#F8F3F0',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isMobile() ? 16 : 18,
    paddingHorizontal: 25,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#800020',
    borderRadius: 0,
  },
  secondaryButtonText: {
    fontFamily: 'Jura',
    fontSize: isMobile() ? 15 : 16,
    fontWeight: '600',
    color: '#800020',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  footerNote: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerDivider: {
    width: 80,
    height: 1,
    backgroundColor: '#E5E0DB',
    marginBottom: 15,
  },
  footerText: {
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '300',
    color: '#999999',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default ProgressModal;
