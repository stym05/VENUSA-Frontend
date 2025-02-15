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
import { Image } from 'expo-image';
import { getAllCategories } from '../apis/index.js';
import Modal from "react-native-modal";
import Entypo from '@expo/vector-icons/Entypo';

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
      console.log("data we got is ", allCategoriesData);
      if (allCategoriesData && allCategoriesData.success) {
        const data = allCategoriesData.categories;
        let categorie = {};
        data.forEach((item) => {
          categorie[item.name] = {
            id: item._id,
            categoryImage: item.categoryImage,
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
            <Modal isVisible={isModalVisible}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles(theme).modalContainer} >
                  <View style={{ display: 'flex', flexDirection: isMobile() ? "column" : 'row' }}>
                    <View style={{ height: isMobile() ? 400 : Dimensions.get("window").height * 0.6, width: isMobile() ? "100%" : '50%' }}>
                      {isMobile() && <View style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Entypo name="cross" size={24} color="black" onPress={()=> {
                          this.setState({isModalVisible: !isModalVisible})
                        }}/>
                      </View>}
                      <Image
                        contentFit="fill"
                        source={require("../../assets/gifs/loading.gif")}
                        style={{
                          height: "100%",
                        }}
                      />
                    </View>
                    <View style={{ width: isMobile() ? "100%" : "50%" }}>
                      {!isMobile() && <View style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Entypo name="cross" size={24} color="black" onPress={()=> {
                          this.setState({isModalVisible: !isModalVisible})
                        }}/>
                      </View>}
                      <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Text style={{
                          fontFamily: "Roboto",
                          fontSize: 32,
                          fontWeight: '600',
                          lineHeight: 42
                        }}>Under Maintenance</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <View style={{ height: isMobile() ? 400 : 800, backgroundColor: "#fff", marginBottom: isMobile() ? 15 : 50 }}>
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
                source={{ uri: "http://localhost:8000/uploads/video.mp4" }}
                // Store reference  
                ref={this.VideoRef}
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
                fontFamily: "Roboto",
                fontSize: 28,
                fontWeight: '600',
                lineHeight: 38
              }}>Love at first sight</Text>
            </View>
            <View style={styles(theme).imageContainer}>
              <View style={{ height: isMobile() ? 400 : '100%', width: isMobile() ? "100%" : '50%' }}>
                <Image
                  contentFit="fill"
                  source={require("../../assets/images/one.jpg")}
                  style={{
                    height: "100%",
                  }}
                />
              </View>
              <View style={{ backgroundColor: '#B42124', width: isMobile() ? "100%" : '50%', padding: 50, justifyContent: 'center' }}>
                <Text style={{ fontSize: isMobile() ? 25 : 50, color: "#F8F3F0" }}>End Of Monsoon Sales</Text>
                <View style={{ marginTop: 30 }}>
                  <Text style={{ fontSize: isMobile() ? 25 : 50, color: '#F8F3F0' }}>Up to 35% Off</Text>
                </View>
                <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("ShopCategories", {
                    categorie: categorie["men"]
                  })} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30, marginRight: isMobile() ? 20 : 50 }}>
                    <Text style={{ fontSize: isMobile() ? 18 : 24, color: '#000000', fontWeight: '500' }}>SHOP MEN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.navigate("ShopCategories", {
                    categorie: categorie["women"]
                  })} style={{ backgroundColor: '#F8F3F0', paddingVertical: isMobile() ? 10 : 20, paddingHorizontal: isMobile() ? 15 : 30 }}>
                    <Text style={{ fontSize: isMobile() ? 18 : 24, color: '#000000', fontWeight: '500' }}>SHOP WOMEN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ marginVertical: 25, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                fontFamily: "Roboto",
                fontSize: 28,
                fontWeight: '600',
                lineHeight: 38
              }}>Bestsellers</Text>
            </View>
            <View style={styles(theme).imageContainer}>
              <View style={{ height: '100%', width: isMobile() ? "100%" : '50%' }}>
                <Image
                  contentFit="fill"
                  source={require("../../assets/images/two.jpg")}
                  style={{
                    height: "100%",
                  }}
                />
              </View>
              {!isMobile() && <View style={{ height: '100%', width: isMobile() ? "100%" : '50%' }}>
                <Image
                  contentFit="fill"
                  source={require("../../assets/images/prod1/1.jpg")}
                  style={{
                    height: "100%",
                  }}
                />
              </View>}
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
    minHeight: isMobile() ? 400 : 800,
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
  modalContainer: {
    width: isMobile() ? "95%" :  Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").height * 0.6,
    backgroundColor: '#fff'
  }
});