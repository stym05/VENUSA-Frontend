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
        // Determine which category to use based on categoryType
        // Try both lowercase and capitalized versions to match API response
        const categoryKeyLower = categoryType === "men" ? "mens" : categoryType === "women" ? "womens" : "sale";
        const categoryKeyCapital = categoryType === "men" ? "Mens" : categoryType === "women" ? "Womens" : "Sale";
        const type = categoryType === "men" ? "Mens" : categoryType === "women" ? "Womens" : "Sale";

        // Try to find the category with either lowercase or capitalized name
        const category = categories[categoryKeyCapital] || categories[categoryKeyLower];

        console.log("Navigating to:", categoryKeyCapital, category);
        console.log("Available categories:", Object.keys(categories));

        // Navigate with categoryId and type, matching Dashboard navigation
        navigation.navigate("ShopCategories", {
            categoryId: category?.id || "",
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