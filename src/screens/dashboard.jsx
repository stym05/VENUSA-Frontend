import React, { Component, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import Store from '../store/index.js';
import Header from '../components/header/index.jsx';
import Footer from '../components/footer/index.jsx';
import Octicons from '@expo/vector-icons/Octicons';
import MovingTextStrip from '../components/MovingTextStrip/index.jsx';
import Video, { VideoRef } from 'react-native-video';
import { isMobile } from '../utils/index.js';
import { Image } from 'expo-image';

export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    let theme = Store.getState().settings.theme;
    this.VideoRef = useRef < VideoRef > (null);
    this.state = {
      theme
    }
  }

  onBuffer = () => {
    return <Text>loading...</Text>
  }


  render() {
    const { theme } = this.state;
    return (
      <SafeAreaView style={styles(theme).container}>
        <ScrollView>
          <View style={styles(theme).subContainer}>
            <View style={{ height: isMobile() ? 400 : 800, backgroundColor: "#fff", marginBottom: 50 }}>
              <Video
                // Can be a URL or a local file.
                source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }}
                // Store reference  
                ref={this.VideoRef}
                // Callback when remote video is buffering                                      
                onBuffer={this.onBuffer}
                muted={"muted"}
                // Callback when video cannot be loaded              
                onError={() => console.log("something went wrong")}
                style={styles(theme).backgroundVideo}
              />
            </View>
            <View style={styles(theme).imageContainer}>
              <View style={{ height: '100%', width: '50%' }}>
                <Image
                  contentFit="fill"
                  source={require("../../assets/images/prod1/1.jpg")}
                  style={{
                    height: "100%",
                  }}
                />
              </View>
              <View style={{ backgroundColor: '#B42124', width: '50%', padding: 50, justifyContent: 'center' }}>
                <Text style={{ fontSize: 50, color: "#F8F3F0" }}>End Of Monsoon Sales</Text>
                <View style={{ marginTop: 30 }}>
                  <Text style={{ fontSize: 50, color: '#F8F3F0' }}>Up to 35% Off</Text>
                </View>
                <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("ItemSection")} style={{ backgroundColor: '#F8F3F0', paddingVertical: 20, paddingHorizontal: 30, marginRight: 50 }}>
                    <Text style={{ fontSize: 24, color: '#000000', fontWeight: '500' }}>SHOP MEN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.navigate("FAQs")} style={{ backgroundColor: '#F8F3F0', paddingVertical: 20, paddingHorizontal: 30 }}>
                    <Text style={{ fontSize: 24, color: '#000000', fontWeight: '500' }}>SHOP WOMEN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles(theme).imageContainer}>
              <View style={{ height: '100%', width: '50%' }}>
                <Image
                  contentFit="fill"
                  source={require("../../assets/images/prod1/1.jpg")}
                  style={{
                    height: "100%",
                  }}
                />
              </View>
              <View style={{ height: '100%', width: '50%' }}>
                <Image
                  contentFit="fill"
                  source={require("../../assets/images/prod1/1.jpg")}
                  style={{
                    height: "100%",
                  }}
                />
              </View>
            </View>
          </View>
          <Footer navigation={this.props.navigation}/>
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
    minHeight: 800,
    marginBottom: 50
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
});