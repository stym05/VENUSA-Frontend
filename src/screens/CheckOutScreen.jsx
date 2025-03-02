import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform,
    Dimensions,
} from 'react-native';
import { CheckBox } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;

const CheckoutScreen = () => {
    const [email, setEmail] = useState('');
    const [emailNews, setEmailNews] = useState(false);
    const [country, setCountry] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [saveInfo, setSaveInfo] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [useShippingAddress, setUseShippingAddress] = useState(true);
    const [promoCode, setPromoCode] = useState('');
    const [quantity1, setQuantity1] = useState(1);
    const [quantity2, setQuantity2] = useState(1);

    const cartItems = [
        {
            id: 1,
            name: 'Georgie Petite Trim Insert Top',
            size: 'S',
            price: 3200.00,
            image: require('../../assets/images/prod1/1.jpg'), // Replace with your actual image path
            quantity: quantity1,
        },
        {
            id: 2,
            name: 'Petite Insert Top',
            size: 'S',
            price: 1200.00,
            image: require('../../assets/images/prod1/1.jpg'), // Replace with your actual image path
            quantity: quantity2,
        },
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 800.00;
    const estimatedTax = 1200.00;
    const shipping = 'Free';
    const total = subtotal - discount + estimatedTax;

    const incrementQuantity = (id) => {
        if (id === 1) {
            setQuantity1(quantity1 + 1);
        } else {
            setQuantity2(quantity2 + 1);
        }
    };

    const decrementQuantity = (id) => {
        if (id === 1 && quantity1 > 1) {
            setQuantity1(quantity1 - 1);
        } else if (id === 2 && quantity2 > 1) {
            setQuantity2(quantity2 - 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>20% Offer for the First time user. Shop Women and Men</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.checkoutContainer}>
                    <View style={styles.leftColumn}>
                        <View style={styles.section}>
                            <View style={[styles.navigation]}>
                                <Text style={styles.navLink}>Cart</Text>
                                <Text style={styles.navSeparator}>/</Text>
                                <Text style={[styles.navLink, styles.activeNavLink]}>Shipping Address</Text>
                                <Text style={styles.navSeparator}>/</Text>
                                <Text style={styles.navLink}>Payment</Text>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.contactHeader}>
                                <Text style={[styles.sectionTitle]}>Contact</Text>
                                <View style={styles.loginPrompt}>
                                    <Text>Have An Account?</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.loginLink}>Log In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <CheckBox
                                title="Email Me With News And Offers"
                                checked={emailNews}
                                onPress={() => setEmailNews(!emailNews)}
                                containerStyle={styles.checkbox}
                                textStyle={styles.checkboxText}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Shipping Address</Text>
                            <View style={styles.inputWithIcon}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Country/Region"
                                    value={country}
                                    onChangeText={setCountry}
                                />
                                <Text style={styles.inputIcon}>×</Text>
                            </View>

                            <View style={styles.nameInputsContainer}>
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="First Name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Company(Optional)"
                                value={company}
                                onChangeText={setCompany}
                            />

                            <View style={styles.inputWithIcon}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Address"
                                    value={address}
                                    onChangeText={setAddress}
                                />
                                <Text style={styles.inputIcon}>🔍</Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Apartment,Suite,Etc.(Optional)"
                                value={apartment}
                                onChangeText={setApartment}
                            />

                            <View style={styles.nameInputsContainer}>
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="Postal Code"
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                />
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="City"
                                    value={city}
                                    onChangeText={setCity}
                                />
                            </View>

                            <View style={styles.inputWithIcon}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                                <Text style={styles.inputIcon}>📱</Text>
                            </View>

                            <CheckBox
                                title="Save This Information For Next Time"
                                checked={saveInfo}
                                onPress={() => setSaveInfo(!saveInfo)}
                                containerStyle={styles.checkbox}
                                textStyle={styles.checkboxText}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Payment</Text>

                            <View style={styles.paymentContainer}>
                                <View style={styles.paymentOption}>
                                    <CheckBox
                                        checked={paymentMethod === 'creditCard'}
                                        onPress={() => setPaymentMethod('creditCard')}
                                        containerStyle={styles.radioContainer}
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                    />
                                    <Text style={styles.paymentText}>Credit Card</Text>
                                    <View style={styles.paymentIcons}>
                                        <Image source={require('../../assets/images/prod1/visa.jpg')} style={styles.paymentIcon} />
                                        <Image source={require('../../assets/images/prod1/master.jpg')} style={styles.paymentIcon} />
                                        <Image source={require('../../assets/images/prod1/paypal.jpg')} style={styles.paymentIcon} />
                                    </View>
                                </View>

                                {paymentMethod === 'creditCard' && (
                                    <View style={styles.creditCardInputs}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Card Number"
                                            value={cardNumber}
                                            onChangeText={setCardNumber}
                                            keyboardType="number-pad"
                                        />

                                        <View style={styles.nameInputsContainer}>
                                            <TextInput
                                                style={[styles.input, styles.halfInput]}
                                                placeholder="Expiry Date (MM/YY)"
                                                value={expiryDate}
                                                onChangeText={setExpiryDate}
                                            />
                                            <TextInput
                                                style={[styles.input, styles.halfInput]}
                                                placeholder="Security Code"
                                                value={securityCode}
                                                onChangeText={setSecurityCode}
                                                keyboardType="number-pad"
                                            />
                                        </View>

                                        <TextInput
                                            style={styles.input}
                                            placeholder="Name On Card"
                                            value={nameOnCard}
                                            onChangeText={setNameOnCard}
                                        />

                                        <CheckBox
                                            title="Use shipping address as billing address"
                                            checked={useShippingAddress}
                                            onPress={() => setUseShippingAddress(!useShippingAddress)}
                                            containerStyle={styles.checkbox}
                                            textStyle={styles.checkboxText}
                                        />
                                    </View>
                                )}

                                <View style={styles.paymentOption}>
                                    <CheckBox
                                        checked={paymentMethod === 'phonePe'}
                                        onPress={() => setPaymentMethod('phonePe')}
                                        containerStyle={styles.radioContainer}
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                    />
                                    <Text style={styles.paymentText}>PhonePe Payment Gateway (UPI, Cards & NetBanking)</Text>
                                </View>

                                <View style={styles.paymentOption}>
                                    <CheckBox
                                        checked={paymentMethod === 'cod'}
                                        onPress={() => setPaymentMethod('cod')}
                                        containerStyle={styles.radioContainer}
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                    />
                                    <Text style={styles.paymentText}>Cash On Delivery (COD)</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.rightColumn}>
                        <View style={styles.cartContainer}>
                            <View style={styles.successMessage}>
                                <Text style={styles.successText}>Congratulations! Your order qualifies for our free shipping.</Text>
                            </View>

                            <Text style={styles.cartTitle}>Cart</Text>
                            <Text style={styles.cartTotal}>₹{total.toFixed(2)}</Text>

                            {cartItems.map((item) => (
                                <View key={item.id} style={styles.cartItem}>
                                    <View style={styles.productImageContainer}>
                                        <Image source={item.image} style={styles.productImage} />
                                    </View>

                                    <View style={styles.productDetails}>
                                        <View style={styles.productInfoContainer}>
                                            <View>
                                                <Text style={styles.productName}>{item.name}</Text>
                                                <Text style={styles.productSize}>Size: {item.size}</Text>
                                            </View>
                                            <TouchableOpacity>
                                                <Text style={styles.removeIcon}>🗑️</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.productPriceContainer}>
                                            <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
                                            <View style={styles.quantityControls}>
                                                <TouchableOpacity
                                                    style={styles.quantityButton}
                                                    onPress={() => incrementQuantity(item.id)}
                                                >
                                                    <Text style={styles.quantityButtonText}>+</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.quantityText}>{item.id === 1 ? quantity1 : quantity2}</Text>
                                                <TouchableOpacity
                                                    style={styles.quantityButton}
                                                    onPress={() => decrementQuantity(item.id)}
                                                >
                                                    <Text style={styles.quantityButtonText}>−</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            <View style={styles.promoContainer}>
                                <TextInput
                                    style={styles.promoInput}
                                    placeholder="Gift or Promo Code"
                                    value={promoCode}
                                    onChangeText={setPromoCode}
                                />
                                <TouchableOpacity style={styles.applyButton}>
                                    <Text style={styles.applyButtonText}>APPLY</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.summaryContainer}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Subtotal</Text>
                                    <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Welcome Offer - 15% Off</Text>
                                    <Text style={styles.summaryDiscount}>-₹{discount.toFixed(2)}</Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Estimated Tax</Text>
                                    <Text style={styles.summaryValue}>₹{estimatedTax.toFixed(2)}</Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Shipping</Text>
                                    <Text style={styles.summaryValue}>{shipping}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.placeOrderButton}>
                                <Text style={styles.placeOrderButtonText}>Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#333',
        padding: 10,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
    },
    checkoutContainer: {
        flexDirection: windowWidth > 768 ? 'row' : 'column',
        padding: 15,
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: 100,
    },
    navLink: {
        fontSize: 16,
        color: '#777',
    },
    activeNavLink: {
        fontWeight: 'bold',
        color: '#000',
    },
    navSeparator: {
        marginHorizontal: 10,
        color: '#777',
    },
    leftColumn: {
        flex: windowWidth > 768 ? 3 : 1,
        marginRight: windowWidth > 768 ? 20 : 0,
    },
    rightColumn: {
        flex: windowWidth > 768 ? 2 : 1,
        marginTop: windowWidth > 768 ? 0 : 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    loginPrompt: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
    },
    loginLink: {
        marginLeft: 5,
        color: '#007bff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    nameInputsContainer: {
        flexDirection: windowWidth > 480 ? 'row' : 'column',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: windowWidth > 480 ? '48%' : '100%',
    },
    inputWithIcon: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        fontSize: 16,
    },
    checkbox: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
        marginLeft: 0,
    },
    checkboxText: {
        fontWeight: 'normal',
        marginLeft: 5,
    },
    paymentContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 20,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    radioContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    paymentText: {
        fontSize: 16,
        flex: 1,
    },
    paymentIcons: {
        flexDirection: 'row',
    },
    paymentIcon: {
        width: 30,
        height: 20,
        marginLeft: 5,
    },
    creditCardInputs: {
        marginLeft: 30,
        marginBottom: 15,
    },
    cartContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
    },
    successMessage: {
        backgroundColor: '#f8f5f0',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
    },
    successText: {
        fontSize: 14,
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cartTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        position: 'absolute',
        right: 15,
        top: 65,
    },
    cartItem: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 15,
    },
    productImageContainer: {
        width: 80,
        height: 80,
        marginRight: 15,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    productSize: {
        fontSize: 14,
        color: '#777',
    },
    removeIcon: {
        fontSize: 20,
    },
    productPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    quantityButton: {
        padding: 5,
        width: 30,
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 16,
    },
    quantityText: {
        width: 30,
        textAlign: 'center',
    },
    promoContainer: {
        flexDirection: 'row',
        marginVertical: 15,
    },
    promoInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        fontSize: 16,
    },
    applyButton: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        marginLeft: -1,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryContainer: {
        marginTop: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    summaryDiscount: {
        fontSize: 14,
        fontWeight: '500',
        color: 'green',
    },
    placeOrderButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    placeOrderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default CheckoutScreen;