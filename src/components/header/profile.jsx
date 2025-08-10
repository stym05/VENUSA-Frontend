import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { isMobile } from '../../utils/index.js';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [selectedMenu, setSelectedMenu] = useState('Profile');
    const [formData, setFormData] = useState({
        firstName: 'Venusa',
        lastName: '',
        email: '',
        dateOfBirth: '',
        gender: 'Female'
    });

    const menuItems = [
        { id: 'Profile', label: 'Profile', icon: 'user', route: 'Profile' },
        { id: 'OrderHistory', label: 'Order History', icon: 'filetext1', route: 'OrderHistory' },
        { id: 'ShoppingCart', label: 'Shopping Cart', icon: 'shoppingcart', route: 'Cart' },
        { id: 'Wishlist', label: 'Wishlist', icon: 'hearto', route: 'WishList' },
        { id: 'CardsAddress', label: 'Cards & Address', icon: 'creditcard', route: 'Address' },
        // { id: 'Setting', label: 'Setting', icon: 'setting', route: 'Settings' },
        { id: 'LogOut', label: 'Log-out', icon: 'logout', route: 'Login' }
    ];

    const handleMenuPress = (item) => {
        setSelectedMenu(item.id);
        if (item.id === 'LogOut') {
            navigation.navigate('App', { screen: 'Login' });
        } else if (item.id !== 'Profile') {
            navigation.navigate(item.route);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdate = () => {
        // Handle profile update logic here
        console.log('Updated profile data:', formData);
        // You can add API call here to update profile
    };

    const renderSidebar = () => (
        <View style={styles.sidebar}>
            {menuItems.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={[
                        styles.menuItem,
                        selectedMenu === item.id && styles.selectedMenuItem
                    ]}
                    onPress={() => handleMenuPress(item)}
                >
                    <AntDesign
                        name={item.icon}
                        size={16}
                        color={selectedMenu === item.id ? '#fff' : '#666'}
                        style={styles.menuIcon}
                    />
                    <Text style={[
                        styles.menuText,
                        selectedMenu === item.id && styles.selectedMenuText
                    ]}>
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderProfileForm = () => (
        <View style={styles.profileForm}>
            <Text style={styles.profileTitle}>Profile</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>First Name*</Text>
                <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                    placeholder="First Name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name*</Text>
                <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleInputChange('lastName', text)}
                    placeholder="Last Name"
                />
            </View>

            <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Email Address*</Text>
                    <TouchableOpacity>
                        <Text style={styles.changeText}>CHANGE</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="Email Address"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity>
                        <Text style={styles.changeText}>CHANGE</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    value={formData.dateOfBirth}
                    onChangeText={(text) => handleInputChange('dateOfBirth', text)}
                    placeholder="Date of Birth"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={styles.radioContainer}
                        onPress={() => handleInputChange('gender', 'Male')}
                    >
                        <View style={[
                            styles.radio,
                            formData.gender === 'Male' && styles.radioSelected
                        ]}>
                            {formData.gender === 'Male' && <View style={styles.radioDot} />}
                        </View>
                        <Text style={styles.radioText}>Male</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.radioContainer}
                        onPress={() => handleInputChange('gender', 'Female')}
                    >
                        <View style={[
                            styles.radio,
                            formData.gender === 'Female' && styles.radioSelected
                        ]}>
                            {formData.gender === 'Female' && <View style={styles.radioDot} />}
                        </View>
                        <Text style={styles.radioText}>Female</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {renderSidebar()}
                    {renderProfileForm()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flexDirection: isMobile() ? 'column' : 'row',
        minHeight: '100%',
        padding: isMobile() ? 10 : 20,
    },
    sidebar: {
        width: isMobile() ? '100%' : 280,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 0,
        marginRight: isMobile() ? 0 : 20,
        marginBottom: isMobile() ? 20 : 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedMenuItem: {
        backgroundColor: '#333',
    },
    menuIcon: {
        width: 20,
        marginRight: 12,
    },
    menuText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Jura',
    },
    selectedMenuText: {
        color: '#fff',
    },
    profileForm: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        fontFamily: 'Jura',
    },
    formGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'Jura',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    changeText: {
        fontSize: 12,
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Jura',
    },
    genderContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#ddd',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: '#333',
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333',
    },
    radioText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Jura',
    },
    updateButton: {
        backgroundColor: '#333',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 30,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Jura',
    },
});

export default ProfileScreen;