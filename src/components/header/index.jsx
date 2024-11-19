import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import OfferStrip from '../offerStrip/index.jsx';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            head: 41
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <OfferStrip />
                <View style={styles.subContainer}>
                    <View style={styles.leftSubContainer}>
                        <View style={styles.paddingContainer}>
                            <TouchableOpacity>
                                <Text style={styles.text}>Women</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.paddingContainer}>
                            <TouchableOpacity>
                                <Text style={styles.text}>Men</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.paddingContainer}>
                            <TouchableOpacity>
                                <Text style={styles.text}>Sale</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rightSubContainer}>
                        <View style={styles.paddingContainer}>
                            <TouchableOpacity>
                                <FontAwesome name="search" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.paddingContainer}>
                            <TouchableOpacity>
                                <AntDesign name="hearto" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.paddingContainer}>
                            <TouchableOpacity>
                                <Feather name="shopping-bag" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.paddingContainer}>
                            <TouchableOpacity>
                                <AntDesign name="user" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomColor: '#808080',
        borderBottomWidth: 1 
    },
    subContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    leftSubContainer: {
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightSubContainer: {
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paddingContainer: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    text: {
        fontWeight: 'bold'
    }
})

export default Header;