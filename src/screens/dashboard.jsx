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
import { getAllCategories, getDashboardData } from '../apis/index.js';
import Modal from "react-native-modal";
import Entypo from '@expo/vector-icons/Entypo';
import TrendingScrollBanner from './trendingScroller.jsx';
import { DashboardProductSkeleton } from '../components/SkeletonLoader/index.jsx';

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
      dashboardVideo: '',
      featuredProducts: [],
      newArrivals: [],
      bestsellers: []
    }
  }

  componentDidMount = async () => {
    try {
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
                allProducts = [...allProducts, ...subcat.products];
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


  render() {
    const { isLoading, theme, categorie, isModalVisible } = this.state;
    return (
      <SafeAreaView style={styles(theme).container}>
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
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("ShopCategories", {
                    categoryId: categorie.Mens?.categoryId || "",
                    type: "Mens"
                  })} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30, marginRight: isMobile() ? 20 : 50 }}>
                    <Text style={{ fontSize: isMobile() ? 16 : 20, color: '#000000', fontWeight: '500' }}>SHOP MEN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.navigate("ShopCategories", {
                    categoryId: categorie.Womens?.categoryId || "",
                    type: "Womens"
                  })} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30 }}>
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

            {/* Render Dashboard Data or Skeleton */}
            {isLoading ? (
              <>
                <DashboardProductSkeleton />
                <DashboardProductSkeleton />
              </>
            ) : (
              this.state.allCategoriesData && this.state.allCategoriesData.length > 0 &&
              this.state.allCategoriesData.map((category, categoryIndex) => (
                <View key={categoryIndex}>
                  {/* Category Header */}
                  <View style={{ marginVertical: 25, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                      fontFamily: "Jura",
                      fontSize: 32,
                      fontWeight: '700',
                      lineHeight: 42,
                      color: '#1A1A1A'
                    }}>{category.categoryName}</Text>
                  </View>

                  {/* Subcategories and Products */}
                  {category.subcategories && category.subcategories.map((subcategory, subIndex) => (
                    <View key={subIndex} style={{ marginBottom: 50 }}>
                      {/* Subcategory Header */}
                      <View style={{ marginVertical: 20, paddingHorizontal: isMobile() ? 15 : 50 }}>
                        <Text style={{
                          fontFamily: "Jura",
                          fontSize: 24,
                          fontWeight: '600',
                          lineHeight: 32,
                          color: '#333'
                        }}>{subcategory.subCategoryName}</Text>
                        <Text style={{
                          fontFamily: "Roboto",
                          fontSize: 16,
                          fontWeight: '400',
                          color: '#666',
                          marginTop: 5
                        }}>Collection: {subcategory.collectionName}</Text>
                      </View>

                      {/* Products Grid */}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: isMobile() ? 15 : 50 }}
                      >
                        {subcategory.products && subcategory.products.map((product, productIndex) => (
                          <TouchableOpacity
                            key={productIndex}
                            style={styles(theme).productCard}
                            onPress={() => this.props.navigation.navigate("ProductDetail", {
                              productId: product.productId
                            })}
                          >
                            {/* Product Image */}
                            <View style={styles(theme).productImageContainer}>
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  source={{ uri: product.images[0].image }}
                                  style={styles(theme).productImage}
                                  contentFit="cover"
                                />
                              ) : (
                                <View style={[styles(theme).productImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                                  <Text style={{ color: '#999' }}>No Image</Text>
                                </View>
                              )}

                              {/* Discount Badge */}
                              {parseFloat(product.discountPerc) > 0 && (
                                <View style={styles(theme).discountBadge}>
                                  <Text style={styles(theme).discountText}>
                                    -{product.discountPerc}%
                                  </Text>
                                </View>
                              )}
                            </View>

                            {/* Product Info */}
                            <View style={styles(theme).productInfo}>
                              <Text
                                style={styles(theme).productName}
                                numberOfLines={2}
                              >
                                {product.productName}
                              </Text>

                              <Text
                                style={styles(theme).productDescription}
                                numberOfLines={2}
                              >
                                {product.description}
                              </Text>

                              {/* Price Section */}
                              <View style={styles(theme).priceContainer}>
                                <Text style={styles(theme).currentPrice}>
                                  ₹{parseFloat(product.discountedPrice).toFixed(2)}
                                </Text>
                                {parseFloat(product.discount) > 0 && (
                                  <Text style={styles(theme).originalPrice}>
                                    ₹{parseFloat(product.price).toFixed(2)}
                                  </Text>
                                )}
                              </View>

                              {/* Tags */}
                              {product.tags && product.tags.length > 0 && (
                                <View style={styles(theme).tagsContainer}>
                                  {product.tags.slice(0, 2).map((tag, tagIndex) => (
                                    <View key={tagIndex} style={styles(theme).tag}>
                                      <Text style={styles(theme).tagText}>{tag}</Text>
                                    </View>
                                  ))}
                                </View>
                              )}

                              {/* Stock Info */}
                              {product.totalStock > 0 ? (
                                <Text style={styles(theme).stockText}>
                                  In Stock ({product.totalStock} available)
                                </Text>
                              ) : (
                                <Text style={[styles(theme).stockText, { color: '#d32f2f' }]}>
                                  Out of Stock
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ))}
                </View>
              ))
            )}
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
});