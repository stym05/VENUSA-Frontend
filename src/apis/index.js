import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "./urls";
import Store from "../store";

// export const DOMAIN = "https://webservices.venusa.co.in/";

export const DOMAIN = "http://localhost:8000";



const setAuthorizationHeader = async () => {
    const jwt = Store.getState().user.authToken;
    return {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
    };
};

export const getUserAddress = async (id) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.GET_CUSTOMER_ADDRESS + "/" + id, {
            method: "GET",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getAllCategories", err);
        return err;
    }
}


export const createAddress = async () => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.CREATE_ADDRESS, {
            method: "POST",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getAllCategories", err);
        return err;
    }
}


export const createOrder = async () => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.createOrder, {
            method: "POST",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getAllCategories", err);
        return err;
    }
}

export const getAllCategories = async () => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.getAllCategories, {
            method: "GET",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getAllCategories", err);
        return err;
    }
};

export const getSubCategorieById = async (id) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.getSubCategorieById + `/${id}`, {
            method: "GET",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getSubCategorieById", err);
        return err;
    }
};

export const getProductBySubCategory = async (id) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.getProductBySubCategory + `/${id}`, {
            method: "GET",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getProductBySubCategory", err);
        return err;
    }
};

export const getProductById = async (id) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.getProductById + `/${id}`, {
            method: "GET",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getProductById", err);
        return err;
    }
};

export const createSubsciber = async (data) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.CREATE_SUBSCRIBER, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (err) {
        console.log("error in createSubsciber", err);
        return err;
    }
};


export const createPreOrder = async (data) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.CREATE_PRE_ORDER, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (err) {
        console.log("error in createSubsciber", err);
        return err;
    }
}

export const getOTP = async (data) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.GENRATE_OTP, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (err) {
        console.log("error in getOTP", err);
        return err;
    }
};

export const validateOTP = async (data) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.VALIDATE_OTP, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (err) {
        console.log("error in validateOTP", err);
        return err;
    }
};


export const getCartItem = async (userId) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.GET_CART_ITEMS + `/${userId}`, {
            method: "GET",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getProductById", err);
        return err;
    }
}

export const getWishList = async (userId) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.GET_WISHLIST + `/${userId}`, {
            method: "GET",
            headers,
        });
        return await response.json();
    } catch (err) {
        console.log("error in getProductById", err);
        return err;
    }
}

export const AddToWishList = async (data) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.ADD_TO_WISHLIST, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (err) {
        console.log("error in addToWishlist", err);
        return err;
    }
};

export const removeFromWishList = async (data) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.REMOVE_FROM_WISHLIST, {
            method: "DELETE",
            headers,
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (err) {
        console.log("error in removeFromWishList", err);
        return err;
    }
}

export const addToCart = async (data) => {
    try {
        const headers = await setAuthorizationHeader();
        const response = await fetch(DOMAIN + URL.ADD_TO_CART, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (err) {
        console.log("error in addToCart", err);
        return err;
    }
}