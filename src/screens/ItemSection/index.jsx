import React, { useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Item from "./item";
import { isMobile } from "../../utils";
import Footer from "../../components/footer";
import { Picker } from '@react-native-picker/picker';
import { getProductBySubCategory } from "../../apis";

class ItemSection extends React.Component {
    constructor(props) {
        super(props);
        let productId = "";
        let productName = "";
        if (this.props.route && this.props.route.params) {
            productId = this.props.route.params.productId;
            productName = this.props.route.params.productName;
        }
        this.state = {
            loading: false,
            productName,
            productId,
            productarray: [],
            selectedSort: null,
            selectedColor: null,
            selectedSize: null,
            selectedType: null,
            productCount: 0,
            currentPage: 1,
            itemsPerPage: 9
        };
    }

    componentDidMount = async () => {
        try {
            const { productId } = this.state;
            this.setState({ loading: true });
            const response = await getProductBySubCategory(productId);
            if (response && response.success) {
                const { products } = response;
                this.setState({ productarray: products, productCount: products.length, loading: false });
            }
        } catch (err) {
            console.log("Error fetching products: ", err);
        }
        this.setState({ loading: false });
    };

    render() {
        const { loading, productarray, productCount, currentPage, itemsPerPage, productName } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = productarray.slice(startIndex, startIndex + itemsPerPage);

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.itemContainer}>
                        {/* Sidebar Filters */}
                        <View style={styles.filterSection}>
                            <Text style={styles.headerText}>Offers</Text>
                            <TouchableOpacity>
                                <Text style={styles.filterText}>Member Exclusive Prices</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.filterText}>Sweatshirts starting ₹799</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerText}>New In</Text>
                            <TouchableOpacity>
                                <Text style={styles.filterText}>Women's Clothing | New Arrivals</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Collection</Text>
                            <TouchableOpacity>
                                <Text style={styles.filterText}>Top</Text>
                                <Text style={styles.filterText}>Pants</Text>
                            </TouchableOpacity>

                        </View>

                        {/* Products Section */}
                        <View style={styles.itemList}>
                            <View style={{ marginHorizontal: 20 }}>
                                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                    <Text style={styles.text}><Text style={styles.text2}>Category/</Text>{productName}</Text>
                                    <Text style={styles.text2}>Products ({productCount})</Text>
                                </View>

                                {/* Sorting and Filters */}
                                <View style={[styles.row, styles.filters]}>
                                    {['Sort By', 'Size'].map((label, index) => {
                                        if (label === 'Sort By') {
                                            return (
                                                <Picker
                                                    key={index}
                                                    selectedValue={this.state[`selected${label.replace(' ', '')}`]}
                                                    onValueChange={(value) => this.setState({ [`selected${label.replace(' ', '')}`]: value })}
                                                    style={styles.picker}
                                                >
                                                    <Picker.Item label="Sort By" value="sortBy" />
                                                    <Picker.Item label="Pricing Lowest to Highest" value="priceLowToHigh" />
                                                    <Picker.Item label="Pricing Highest to Lowest" value="priceHighToLow" />
                                                </Picker>
                                            );
                                        } else if (label === 'Size') {
                                            return (
                                                <Picker
                                                    key={index}
                                                    selectedValue={this.state[`selected${label}`]}
                                                    onValueChange={(value) => this.setState({ [`selected${label}`]: value })}
                                                    style={styles.picker}
                                                >
                                                    <Picker.Item label="Select Size" value="size" />
                                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                                                        <Picker.Item key={size} label={size} value={size.toLowerCase()} />
                                                    ))}
                                                </Picker>
                                            );
                                        } else {
                                            return (
                                                <Picker
                                                    key={index}
                                                    selectedValue={this.state[`selected${label.replace(' ', '')}`]}
                                                    onValueChange={(value) => this.setState({ [`selected${label.replace(' ', '')}`]: value })}
                                                    style={styles.picker}
                                                >
                                                    <Picker.Item label={label} value={label.toLowerCase()} />
                                                    <Picker.Item label="Option 1" value="option1" />
                                                    <Picker.Item label="Option 2" value="option2" />
                                                </Picker>
                                            );
                                        }
                                    })}
                                </View>
                            </View>

                            {/* Product Grid */}
                            <FlatList
                                data={paginatedProducts}
                                renderItem={({ item }) => <Item item={item} navigation={this.props.navigation} />}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={isMobile() ? 2 : 3}
                            />

                            {/* Pagination */}
                            <View style={styles.paginationContainer}>
                                {[...Array(Math.ceil(productCount / itemsPerPage)).keys()].map((num) => (
                                    <TouchableOpacity key={num} onPress={() => this.setState({ currentPage: num + 1 })}>
                                        <Text style={[styles.pageNumber, currentPage === num + 1 && styles.activePage]}>{num + 1}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                    <Footer navigation={this.props.navigation} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    itemContainer: { flexDirection: 'row', width: '100%', justifyContent: 'center', padding: 20, marginTop: 25 },
    filterSection: { width: isMobile() ? '100%' : '20%', padding: 10 },
    itemList: { width: isMobile() ? '100%' : '75%' },
    text: { fontSize: 24, fontWeight: '400' },
    text2: { fontSize: 24, fontWeight: '400', color: '#808080' },
    row: { flexDirection: 'row' },
    filters: { marginVertical: 15, justifyContent: 'space-between' },
    picker: { height: 50, width: 120 },
    headerText: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
    filterText: { fontSize: 14, color: '#666', marginBottom: 3 },
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 },
    pageNumber: { marginHorizontal: 5, fontSize: 16, color: '#888' },
    activePage: { fontWeight: 'bold', color: '#000' }
});

export default ItemSection;
