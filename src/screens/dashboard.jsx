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
import { getAllCategories } from '../apis/index.js';
import Modal from "react-native-modal";
import Entypo from '@expo/vector-icons/Entypo';
import TrendingScrollBanner from './trendingScroller.jsx';

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
      isModalVisible: true
    }
  }

  componentDidMount = async () => {
    try {
      this.setState({ isLoading: true });
      const allCategoriesData = await getAllCategories();
      console.log("data we got is ", Store.getState().user);
      if (allCategoriesData && allCategoriesData.success) {
        const data = allCategoriesData.categories;
        let categorie = {};
        data.forEach((item) => {
          categorie[item.name] = {
            id: item._id,
            categoryImage: item.image,
          }
        })
        console.log("data we filtered", categorie);
        this.setState({ isLoading: false, categorie, allCategoriesData: data });
      }
    } catch (err) {
      this.setState({ isLoading: false });
      console.log("Error at ITEM :: ", err);
    }
    this.setState({ isLoading: false });
  }

  onBuffer = () => {
    return <Text>loading...</Text>
  }


  render() {
    const { isLoading, theme, categorie, isModalVisible } = this.state;
    return isLoading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={"large"} color={"black"} />
      </View>
    ) : (
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
                source={{ uri: " https://venusa-bucket.blr1.digitaloceanspaces.com/videos/C0021_3.mp4" }}
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
                  {console.log("-------------categorie--------", categorie['Mens'])}
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("ShopCategories", {
                    categorie: categorie["Mens"],
                    type: "Mens"
                  })} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30, marginRight: isMobile() ? 20 : 50 }}>
                    <Text style={{ fontSize: isMobile() ? 16 : 20, color: '#000000', fontWeight: '500' }}>SHOP MEN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.navigate("ShopCategories", {
                    categorie: categorie["Womens"],
                    type: "Womens"
                  })} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30 }}>
                    <Text style={{ fontSize: isMobile() ? 16 : 20, color: '#000000', fontWeight: '500' }}>SHOP WOMEN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ marginVertical: 25, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                fontFamily: "Jura",
                fontSize: 28,
                fontWeight: '600',
                lineHeight: 38
              }}>Bestsellers</Text>
            </View>
            <View style={styles(theme).imageContainer}>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <Image
                  contentFit="contain"
                  source={'https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/mens_pic_D.jpg'}
                  style={{
                    height: 600,
                  }}
                />
              </View>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <Image
                  contentFit="contain"
                  source={"https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/women_pic_P.jpg"}
                  style={{
                    height: 600,
                  }}
                />
              </View>
            </View>
            <View style={{ marginVertical: 25, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                fontFamily: "Jura",
                fontSize: 28,
                fontWeight: '600',
                lineHeight: 38
              }}>New Arrivals</Text>
            </View>
            <TrendingScrollBanner
              text="FREE SHIPPING ON ALL ORDERS"
              backgroundColor="#4CAF50"
              textColor="#ffffff"
            />
            <View style={[styles(theme).imageContainer, { marginVertical: 25 }]}>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <ImageBackground
                  contentFit="contain"
                  source={{ uri: 'https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/mens_pic_D.jpg' }}
                  style={{
                    height: 600,
                    justifyContent: 'flex-end', // Vertically center
                    alignItems: 'center', // Horizontally center
                  }}
                >
                  <TouchableOpacity style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 50
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: "#000" }}>SHOP THE COLLECTION</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <ImageBackground
                  contentFit="contain"
                  source={{ uri: 'https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/mens_pic_D.jpg' }}
                  style={{
                    height: 600,
                    justifyContent: 'flex-end', // Vertically center
                    alignItems: 'center', // Horizontally center
                  }}
                >
                  <TouchableOpacity style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 50
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: "#000" }}>SHOP THE COLLECTION</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
            <View style={[styles(theme).imageContainer, { marginVertical: 25 }]}>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <ImageBackground
                  contentFit="contain"
                  source={{ uri: 'https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/mens_pic_D.jpg' }}
                  style={{
                    height: 600,
                    justifyContent: 'flex-end', // Vertically center
                    alignItems: 'center', // Horizontally center
                  }}
                >
                  <TouchableOpacity style={{
                    backgroundColor: '#ddd',
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 50
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: "#000" }}>SHOP THE COLLECTION</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <ImageBackground
                  contentFit="contain"
                  source={{ uri: 'https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/mens_pic_D.jpg' }}
                  style={{
                    height: 600,
                    justifyContent: 'flex-end', // Vertically center
                    alignItems: 'center', // Horizontally center
                  }}
                >
                  <TouchableOpacity style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 50
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: "#000" }}>SHOP THE COLLECTION</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
            <View style={[styles(theme).imageContainer, { marginVertical: 25 }]}>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <ImageBackground
                  contentFit="contain"
                  source={{ uri: 'https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/mens_pic_D.jpg' }}
                  style={{
                    height: 600,
                    justifyContent: 'flex-end', // Vertically center
                    alignItems: 'center', // Horizontally center
                  }}
                >
                  <TouchableOpacity style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 50
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: "#000" }}>SHOP THE COLLECTION</Text>
                  </TouchableOpacity>
                </ImageBackground>

              </View>
              <View style={{ height: 600, width: isMobile() ? "100%" : '50%' }}>
                <ImageBackground
                  contentFit="contain"
                  source={{ uri: 'https://venusa-bucket.blr1.digitaloceanspaces.com/images/Dashboard/mens_pic_D.jpg' }}
                  style={{
                    height: 600,
                    justifyContent: 'flex-end', // Vertically center
                    alignItems: 'center', // Horizontally center
                  }}
                >
                  <TouchableOpacity style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 50
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: "#000" }}>SHOP THE COLLECTION</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
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
  }
});