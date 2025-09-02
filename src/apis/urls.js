
export const URL = {
    getAllCategories: "/api/categories",
    getSubCategorieById: "/api/categories/subcategory",
    getProductBySubCategory: "/api/categories/products/subcategory",
    getProductById: "/api/categories/products/productId",
    CREATE_SUBSCRIBER: "/apis/subscribe",
    GENRATE_OTP: "/apis/auth/send-otp/",
    VALIDATE_OTP: "/apis/auth/verify-otp/",
    GET_CART_ITEMS: "/api/transactions/cart/",
    GET_WISHLIST: "/api/transactions/wishlist",
    ADD_TO_WISHLIST: "/api/wishlist/add",
    REMOVE_FROM_WISHLIST: "/api/wishlist/remove",
    ADD_TO_CART: "/api/transactions/cart/add", // api/ transactions /
    GET_CUSTOMER_ADDRESS: "/api/addresses/customer",
    CREATE_ADDRESS: "/api/addresses",
    CREATE_ORDER: "/api/createOrder",
    CREATE_PRE_ORDER: "/api/order/createPreOrder",
    UPDATE_PROFILE: "/apis/auth/update-profile/",
    ORDER_HISTORY: "/api/transactions/order_history/",
}