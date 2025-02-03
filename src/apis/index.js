import { get } from "./apiConfig"
import { URL } from "./urls"


export const getAllCategories = () => {
    try {
        const result = get(URL.getAllCategories);
        return result;
    } catch (err) {
        console.log("error in getAllCategories", err);
    }
}

export const getSubCategorieById = (id) => {
    try {
        const result = get(URL.getSubCategorieById+`/${id}`)
        return result;
    } catch (err) {
        console.log("error in getSubCategorieById", err);
    }
}

export const getProductBySubCategory = (id) => {
    try {
        const result = get(URL.getProductBySubCategory+`/${id}`)
        return result;
    } catch (err) {
        console.log("error in getProductBySubCategory", err);
    }
}