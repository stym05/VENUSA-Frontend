
export const URL = {
    // Categories
    getAllCategories: "/api/categories",
    getDashboard: "/api/categories/dashboard",
    getSubCategorieById: "/api/categories/subcategory",
    getProductBySubCategory: "/api/categories/products/subcategory",
    getProductById: "/api/categories/products/productId",
    getProductBySKU: "/api/categories/products",

    // Subscriber
    CREATE_SUBSCRIBER: "/api/subscriber/create",

    // Auth
    GENRATE_OTP: "/api/auth/send-otp/",
    VALIDATE_OTP: "/api/auth/verify-otp/",
    SIGNUP: "/api/auth/signup",
    SEND_OTP_MOB_NUM: "/api/auth/send-otp-mobile/",

    // Cart
    GET_CART_ITEMS: "/api/transactions/cart",
    ADD_TO_CART: "/api/transactions/cart/add",
    UPDATE_CART_ITEM: "/api/transactions/cart",
    REMOVE_FROM_CART: "/api/transactions/cart",
    CLEAR_CART: "/api/transactions/cart",

    // Wishlist
    GET_WISHLIST: "/api/transactions/wishlist",
    ADD_TO_WISHLIST: "/api/transactions/wishlist/add",
    REMOVE_FROM_WISHLIST: "/api/transactions/wishlist",
    CLEAR_WISHLIST: "/api/transactions/wishlist",

    // Orders
    GET_ORDER_HISTORY: "/api/transactions/orders",
    GET_ORDER_DETAILS: "/api/transactions/orders",
    CREATE_ORDER: "/api/transactions/orders/create",
    UPDATE_ORDER_STATUS: "/api/transactions/orders",
    CANCEL_ORDER: "/api/transactions/orders",

    // Transactions
    GET_TRANSACTION_HISTORY: "/api/transactions/transactions",

    // Address
    GET_CUSTOMER_ADDRESS: "/api/addresses/customer",
    CREATE_ADDRESS: "/api/addresses",
    CREATE_PRE_ORDER: "/api/order/createPreOrder",
}