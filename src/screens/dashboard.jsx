import React, { Component, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Store from '../store/index.js';
import Header from '../components/header/index.jsx';
import Footer from '../components/footer/index.jsx';
import Octicons from '@expo/vector-icons/Octicons';
import MovingTextStrip from '../components/MovingTextStrip/index.jsx';
import Video, { VideoRef } from 'react-native-video';
import { isMobile } from '../utils/index.js';
import { Image, ImageBackground } from 'expo-image';
import { getAllCategories, getDashboardData, createSubsciber } from '../apis/index.js';
import Modal from "react-native-modal";
import Entypo from '@expo/vector-icons/Entypo';
import TrendingScrollBanner from './trendingScroller.jsx';
import { DashboardProductSkeleton } from '../components/SkeletonLoader/index.jsx';
import ProgressModal from '../components/ProgressModal/index.jsx';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    let theme = Store.getState().settings.theme;
    this.VideoRef = useRef < VideoRef > (null);
    this.state = {
      isLoading: false,
      theme,
      allCategoriesData: [],
      categorie: {},
      isModalVisible: true,
      showProgressModal: false,
      dashboardVideo: '',
      featuredProducts: [],
      newArrivals: [],
      bestsellers: []
    }
  }

  componentDidMount = async () => {
    try {
      // Check if user has seen the progress modal before
      const hasSeenModal = await AsyncStorage.getItem('hasSeenProgressModal');
      if (!hasSeenModal) {
        this.setState({ showProgressModal: true });
      }

      this.setState({ isLoading: true });
      const dashboardResponse = await getDashboardData();
      console.log("Dashboard data: ", dashboardResponse);

      if (dashboardResponse && dashboardResponse.status === 'success') {
        const { dashboard_video, data } = dashboardResponse;
        let categorie = {};
        let allProducts = [];

        // Process categories and collect products
        data.forEach((category) => {
          categorie[category.categoryName] = {
            categoryId: category.categoryId,
            categoryImage: category.categoryImage,
          };

          // Collect products from subcategories
          if (category.subcategories && category.subcategories.length > 0) {
            category.subcategories.forEach((subcat) => {
              if (subcat.products && subcat.products.length > 0) {
                // Map products to ensure proper price structure
                const mappedProducts = subcat.products.map(product => {
                  const price = parseFloat(product.price || 0);
                  const apiDiscountField = parseFloat(product.discount || 0); // API's discount field = final price
                  const discountPerc = parseFloat(product.discountPerc || 0);

                  // Use the discount field as the final price if it exists and is valid
                  // Otherwise calculate from discount percentage
                  let finalPrice = price;
                  if (apiDiscountField > 0 && apiDiscountField < price) {
                    finalPrice = apiDiscountField;
                  } else if (discountPerc > 0) {
                    finalPrice = price - (price * discountPerc / 100);
                  }

                  // Handle tags - convert objects to strings if needed
                  const tags = product.tags ? product.tags.map(t =>
                    typeof t === 'string' ? t : (t.tag || t.name || t)
                  ) : [];

                  return {
                    ...product,
                    price,
                    discountedPrice: finalPrice, // This is the final price to display
                    discountPerc,
                    hasDiscount: finalPrice < price,
                    tags
                  };
                });
                allProducts = [...allProducts, ...mappedProducts];
              }
            });
          }
        });

        // Separate products for different sections
        const newArrivals = allProducts.slice(0, 4);
        const bestsellers = allProducts.slice(4, 8);

        this.setState({
          isLoading: false,
          categorie,
          allCategoriesData: data,
          dashboardVideo: dashboard_video || "https://venusa-bucket.blr1.cdn.digitaloceanspaces.com/videos/C0021_3.mp4",
          newArrivals,
          bestsellers,
          featuredProducts: allProducts
        });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (err) {
      this.setState({ isLoading: false });
      console.log("Error at Dashboard :: ", err);
    }
  }

  onBuffer = () => {
    return <Text>loading...</Text>
  }

  handleCloseProgressModal = async () => {
    this.setState({ showProgressModal: false });
    // Mark that user has seen the modal
    await AsyncStorage.setItem('hasSeenProgressModal', 'true');
  }

  handleNotifyMe = async () => {
    try {
      const userEmail = Store.getState().user.email;

      if (!userEmail) {
        Toast.show({
          text1: "Email Required",
          text2: "Please login to get notifications",
          type: "info",
          visibilityTime: 3000,
          position: 'top',
        });
        return;
      }

      // Subscribe user for notifications
      const response = await createSubsciber({ email: userEmail });

      if (response && response.success) {
        Toast.show({
          text1: "Success!",
          text2: "We'll notify you when we're ready!",
          type: "success",
          visibilityTime: 3000,
          position: 'top',
        });
      } else {
        Toast.show({
          text1: "Already Subscribed",
          text2: "You're already on our notification list!",
          type: "info",
          visibilityTime: 3000,
          position: 'top',
        });
      }
    } catch (err) {
      console.log("Error subscribing:", err);
      Toast.show({
        text1: "Subscribed",
        text2: "We'll notify you when we launch!",
        type: "success",
        visibilityTime: 3000,
        position: 'top',
      });
    }
  }


  render() {
    const { isLoading, theme, categorie, isModalVisible, showProgressModal } = this.state;
    return (
      <SafeAreaView style={styles(theme).container}>
        {/* Progress Modal */}
        <ProgressModal
          isVisible={showProgressModal}
          onClose={this.handleCloseProgressModal}
          onNotifyMe={this.handleNotifyMe}
        />

        <ScrollView>
          <View style={styles(theme).subContainer}>
            {/* <Modal isVisible={isModalVisible}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles(theme).modalContainer} >
                  <View style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Entypo name="cross" size={24} color="black" onPress={() => {
                      this.setState({ isModalVisible: !isModalVisible })
                    }} />
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                      fontFamily: "Roboto",
                      fontSize: 32,
                      fontWeight: '600',
                      lineHeight: 32
                    }}>Welcome to Venusa</Text>
                    <Text style={{
                      fontFamily: "Roboto",
                      fontSize: 18,
                      fontWeight: '300',
                      lineHeight: 26,
                      marginTop: 50
                    }}>This is a pre-release beta version of our fashion design platform. The site currently contains demo data, so some features may or may not work as expected. We're still refining the experience, so expect exciting updates soon! </Text>
                    <Text style={{
                      fontFamily: "Roboto",
                      fontSize: 18,
                      fontWeight: '300',
                      lineHeight: 26,
                      marginTop: 25
                    }}>Get ready for an exclusive sneak peek!</Text>
                    <TouchableOpacity style={styles(theme).button} onPress={() => {
                      this.setState({ isModalVisible: !isModalVisible })
                    }}>
                      <Text style={styles(theme).buttonText}>Let’s Explore</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal> */}
            <View style={{ height: isMobile() ? 400 : 700, backgroundColor: "black", marginBottom: isMobile() ? 15 : 15 }}>
              {/* <TouchableOpacity
                onPress={() => console.log("Button Pressed")}
                style={{
                  position: "absolute",
                  top: Dimensions.get("window").height * 0.5,
                  right: Dimensions.get("window").width * 0.45,
                  zIndex: 10,
                  backgroundColor: "rgba(98, 98, 98, 0.6)",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Get started</Text>
              </TouchableOpacity> */}
              <Video
                // Can be a URL or a local file.
                source={{ uri: this.state.dashboardVideo }}
                // Store reference
                ref={this.VideoRef}
                resizeMode='cover'
                // Callback when remote video is buffering
                onBuffer={this.onBuffer}
                muted={"muted"}
                // Callback when video cannot be loaded
                onError={() => console.log("something went wrong")}
                style={styles(theme).backgroundVideo}
                repeat
              />
            </View>
            <View style={{ marginVertical: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                fontFamily: "Jura",
                fontSize: 28,
                fontWeight: '600',
                lineHeight: 38
              }}>Love at first sight</Text>
            </View>
            <View style={styles(theme).imageContainer}>
              <View style={{ height: isMobile() ? 400 : '100%', width: isMobile() ? "100%" : '50%', backgroundColor: "black" }}>
                <Image
                  contentFit="cover"
                  // source={require("../../assets/temp.jpg")}
                  source={"https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/title_pic.jpg"}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </View>
              <View style={{ backgroundColor: '#800020', width: isMobile() ? "100%" : '50%', padding: 50, justifyContent: 'center' }}>
                <Text style={{ fontSize: isMobile() ? 20 : 36, color: "#F8F3F0" }}>Let the Style Journey Begin</Text>
                <View style={{ marginTop: 30 }}>
                  <Text style={{ fontSize: isMobile() ? 20 : 36, color: '#F8F3F0' }}>Up to 35% Off</Text>
                </View>
                <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row' }}>
                  {console.log("-------------categorie--------", categorie)}
                  <TouchableOpacity onPress={() => {
                    // Try different possible keys for Men's category
                    const menCategory = categorie.Men || categorie.Mens || categorie.mens;
                    console.log("Navigating to Men:", menCategory);
                    this.props.navigation.navigate("ShopCategories", {
                      categoryId: menCategory?.categoryId || "",
                      type: "Men"
                    });
                  }} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30, marginRight: isMobile() ? 20 : 50 }}>
                    <Text style={{ fontSize: isMobile() ? 16 : 20, color: '#000000', fontWeight: '500' }}>SHOP MEN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    // Try different possible keys for Women's category
                    const womenCategory = categorie.Women || categorie.Womens || categorie.womens;
                    console.log("Navigating to Women:", womenCategory);
                    this.props.navigation.navigate("ShopCategories", {
                      categoryId: womenCategory?.categoryId || "",
                      type: "Women"
                    });
                  }} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30 }}>
                    <Text style={{ fontSize: isMobile() ? 16 : 20, color: '#000000', fontWeight: '500' }}>SHOP WOMEN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TrendingScrollBanner
              text="FREE SHIPPING ON ALL ORDERS"
              backgroundColor="#4CAF50"
              textColor="#ffffff"
            />

            {/* NEW ARRIVALS Section */}
            <View style={styles(theme).newArrivalsSection}>
              {/* Section Header */}
              <View style={styles(theme).sectionHeader}>
                <Text style={styles(theme).sectionTitle}>NEW ARRIVALS</Text>
              </View>

              {/* Products Grid */}
              {isLoading ? (
                <DashboardProductSkeleton />
              ) : (
                <View style={styles(theme).productsGrid}>
                  {this.state.newArrivals && this.state.newArrivals.slice(0, 4).map((product, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles(theme).gridProductCard}
                      onPress={() => this.props.navigation.navigate("ItemDescription", {
                        productId: product.productId,
                        productName: product.productName
                      })}
                    >
                      {/* Product Image */}
                      <View style={styles(theme).gridProductImageContainer}>
                        {product.images && product.images.length > 0 ? (
                          <Image
                            source={{ uri: product.images[0]?.image || product.images[0] }}
                            style={styles(theme).gridProductImage}
                            contentFit="cover"
                          />
                        ) : (
                          <View style={[styles(theme).gridProductImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: '#999' }}>No Image</Text>
                          </View>
                        )}
                      </View>

                      {/* Product Name Tag */}
                      <View style={styles(theme).productNameTag}>
                        <Text style={styles(theme).productNameTagText}>{product.productName}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Newsletter Section */}
            {/* <View style={styles(theme).newsletterSection}>
              <Text style={styles(theme).newsletterTitle}>Join us in living, better. Every day.</Text>
              <View style={styles(theme).newsletterForm}>
                <View style={styles(theme).emailInputContainer}>
                  <Text style={styles(theme).emailInputPlaceholder}>Enter your email address</Text>
                </View>
                <TouchableOpacity style={styles(theme).subscribeButton}>
                  <Text style={styles(theme).subscribeButtonText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles(theme).newsletterDisclaimer}>
                By signing up, you agree to our <Text style={styles(theme).linkText}>Privacy Policy</Text> and <Text style={styles(theme).linkText}>Terms of Service.</Text>
              </Text>
            </View> */}
          </View>
          <Footer navigation={this.props.navigation} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}


const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme == "dark" ? "gray" : "#fff",
  },
  subContainer: {
    backgroundColor: '#fff',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: isMobile() ? "column" : 'row',
    minHeight: isMobile() ? 400 : 500,
  },
  circularStrip: {
    padding: 50,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  button: {
    marginTop: isMobile() ? 10 : 50,
    backgroundColor: '#1A1A1A',
    width: '40%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Roboto"
  },
  modalContainer: {
    width: isMobile() ? "95%" : Dimensions.get("window").width * 0.6,
    height: isMobile() ? null : Dimensions.get("window").height * 0.6,
    backgroundColor: '#fff',
    padding: 25
  },
  // Product Card Styles
  productCard: {
    width: isMobile() ? 280 : 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: isMobile() ? 300 : 350,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#e53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  stockText: {
    fontSize: 13,
    color: '#4caf50',
    fontWeight: '500',
  },
  // New Arrivals Section Styles
  newArrivalsSection: {
    paddingVertical: 50,
    paddingHorizontal: isMobile() ? 20 : 50,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: "Jura",
    fontSize: isMobile() ? 28 : 36,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 2,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isMobile() ? 'space-between' : 'center',
    gap: isMobile() ? 15 : 30,
  },
  gridProductCard: {
    width: isMobile() ? '48%' : '45%',
    maxWidth: isMobile() ? 200 : 500,
    marginBottom: 20,
    position: 'relative',
  },
  gridProductImageContainer: {
    width: '100%',
    height: isMobile() ? 250 : 500,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridProductImage: {
    width: '100%',
    height: '100%',
  },
  productNameTag: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
  },
  productNameTagText: {
    fontFamily: 'Roboto',
    fontSize: isMobile() ? 12 : 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  // Newsletter Section Styles
  newsletterSection: {
    paddingVertical: isMobile() ? 40 : 60,
    paddingHorizontal: isMobile() ? 20 : 50,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  newsletterTitle: {
    fontFamily: 'Roboto',
    fontSize: isMobile() ? 18 : 24,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 30,
    textAlign: 'center',
  },
  newsletterForm: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 20,
  },
  emailInputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  emailInputPlaceholder: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#999',
  },
  subscribeButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  newsletterDisclaimer: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    maxWidth: 400,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#1A1A1A',
  },
});