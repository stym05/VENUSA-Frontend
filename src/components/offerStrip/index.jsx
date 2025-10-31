import react, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
    View,
    Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllCategories } from '../../apis/index.js';

const OfferStrip = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const allCategoriesData = await getAllCategories();

                if (allCategoriesData && allCategoriesData.success) {
                    const data = allCategoriesData.categories;
                    let categoriesObj = {};

                    data.forEach((item) => {
                        categoriesObj[item.name] = {
                            id: item._id,
                            categoryId: item.categoryId,
                            categoryImage: item.image,
                            category: item.name,
                        }
                    });

                    setCategories(categoriesObj);
                }
            } catch (err) {
                console.log("Error fetching categories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const navigateToCategory = (categoryType) => {
        // Try different possible keys for the category
        let category;
        let type;

        if (categoryType === "men") {
            category = categories.Men || categories.Mens || categories.mens;
            type = "Men";
        } else if (categoryType === "women") {
            category = categories.Women || categories.Womens || categories.womens;
            type = "Women";
        } else if (categoryType === "sale") {
            category = categories.Sale || categories.sale;
            type = "Sale";
        }

        console.log("Navigating to:", type, category);
        console.log("Available categories:", Object.keys(categories));

        // Navigate with categoryId and type, matching Dashboard and Header navigation
        navigation.navigate("ShopCategories", {
            categoryId: category?.categoryId || "",
            type: type
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.boldText}>20% Offer{" "}</Text>
            <Text style={styles.text}>for the first time user. Shop{" "}
                <Text style={styles.boldText} onPress={() => navigateToCategory("women")}>Women{" "}</Text>
                and{" "}
                <Text style={styles.boldText} onPress={() => navigateToCategory("men")}>Men</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        color: "white",
    },
    boldText: {
        color: 'white',
        fontWeight: 'bold'
    }
})

export default OfferStrip;